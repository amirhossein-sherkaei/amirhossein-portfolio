/**
 * Shorakaei Visual Intelligence
 * Free-tier, scheduled article visual generation for shorakaei.ir.
 *
 * Flow:
 *   1. Fetch article HTML
 *   2. LLM (llama-3.1-8b-instruct) reads content -> returns a one-sentence
 *      concrete visual scene (Persian-aware, no text in image)
 *   3. Flux generates the image from that scene
 *   4. KV stores the manifest + image bytes
 */

interface Env {
  AI: { run(model: string, input: Record<string, unknown>): Promise<any> };
  VISUAL_ASSETS: KVNamespace;
  SITE_ORIGIN: string;
  ADMIN_SECRET: string;
  IMAGE_MODEL?: string;
  CONCEPT_MODEL?: string;
  MAX_INLINE_IMAGES?: string;
  ENABLE_LLM_CONCEPT?: string;
}

interface ArticleSnapshot {
  url: string;
  slug: string;
  title: string;
  description: string;
  headings: Array<{ text: string; index: number }>;
  excerpt: string;
  contentSample: string;
  fingerprint: string;
}

interface VisualAsset {
  kind: "cover" | "inline";
  key: string;
  alt: string;
  heading?: string;
  headingIndex?: number;
  caption?: string;
}

interface ArticleManifest {
  version: 1;
  slug: string;
  canonicalUrl: string;
  title: string;
  description: string;
  fingerprint: string;
  generatedAt: string;
  images: VisualAsset[];
  concept?: string;
}

const DEFAULT_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const DEFAULT_CONCEPT_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const MANIFEST_PREFIX = "manifests/articles/";
const INDEX_KEY = "manifests/index.json";
const STATE_PREFIX = "system/";
const BRAND = "Shorakaei Visual Intelligence";
const MAX_SITEMAP_FILES = 12;
const MAX_PAGE_CHARS = 180_000;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    try {
      if (url.pathname === "/health" && request.method === "GET") {
        return json(
          {
            ok: true,
            service: BRAND,
            imageModel: env.IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
            conceptModel: env.CONCEPT_MODEL || DEFAULT_CONCEPT_MODEL,
            llmConceptEnabled: isLlmEnabled(env),
            mode: "free-tier-kv-guarded",
          },
          200,
          cors
        );
      }

      if (url.pathname === "/manifest" && request.method === "GET") {
        const slug = safeSlug(url.searchParams.get("slug") || "");
        if (!slug) return json({ error: "Missing or invalid slug" }, 400, cors);
        const manifest = await getManifest(env, slug);
        if (!manifest) return json({ error: "Manifest not found yet", slug }, 404, cors);
        return json(withAssetUrls(manifest, url.origin), 200, { ...cors, "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" });
      }

      if (url.pathname === "/index" && request.method === "GET") {
        const index = await getIndex(env);
        const entries = index.map((item) => ({
          slug: item.slug,
          title: item.title,
          cover: `${url.origin}/assets?key=${encodeURIComponent(item.coverKey)}&v=${Date.now()}`,
          alt: item.alt,
          canonicalUrl: item.canonicalUrl,
          generatedAt: item.generatedAt,
        }));
        return json({ version: 1, items: entries }, 200, { ...cors, "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" });
      }

      if (url.pathname === "/assets" && request.method === "GET") {
        const key = url.searchParams.get("key") || "";
        if (!isAllowedAssetKey(key)) return json({ error: "Invalid asset key" }, 400, cors);

        const buffer = await env.VISUAL_ASSETS.get(key, "arrayBuffer");
        if (!buffer) return new Response("Not found", { status: 404, headers: cors });

        const headers = new Headers(cors);
        headers.set("Content-Type", "image/jpeg");
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        headers.set("X-Content-Type-Options", "nosniff");
        return new Response(buffer, { status: 200, headers });
      }

      if (url.pathname === "/admin/status" && request.method === "GET") {
        if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401, cors);
        const status = await env.VISUAL_ASSETS.get(`${STATE_PREFIX}last-job.json`, "json");
        return json(status || { state: "idle", message: "No job has run yet." }, 200, cors);
      }

      if (url.pathname === "/admin/run" && request.method === "POST") {
        if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401, cors);
        const body = await request.json().catch(() => ({})) as { limit?: number; force?: boolean; slugs?: string[] };
        const limit = clampInt(body.limit ?? 1, 1, 3);
        const force = body.force === true;
        const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s) => typeof s === "string").map((s) => safeSlug(s)).filter(Boolean) : [];
        const job = {
          state: "queued",
          startedAt: new Date().toISOString(),
          limit,
          force,
          slugs,
          message: "The background sweep has been queued.",
        };
        await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify(job));
        ctx.waitUntil(runSweep(env, limit, force, "manual", slugs));
        return json({ ok: true, ...job, statusUrl: `${url.origin}/admin/status` }, 202, cors);
      }

      return json({ error: "Not found" }, 404, cors);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected worker error";
      return json({ error: message }, 500, cors);
    }
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    // Free tier: process only 1 article per cron to stay within AI quota
    ctx.waitUntil(runSweep(env, 1, false, "cron"));
  },
};

// ═══════════════════════════════════════════════════════════
// HELPERS: config
// ═══════════════════════════════════════════════════════════

function isLlmEnabled(env: Env): boolean {
  if (env.ENABLE_LLM_CONCEPT === "false") return false;
  return true;
}

function corsHeaders(request: Request, env: Env): HeadersInit {
  const requestedOrigin = request.headers.get("Origin") || "";
  const configured = normalizeOrigin(env.SITE_ORIGIN || "https://shorakaei.ir");
  const origin = requestedOrigin && isSameSiteOrigin(requestedOrigin, configured) ? requestedOrigin : configured;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-SVI-Admin",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  const resultHeaders = new Headers(headers);
  resultHeaders.set("Content-Type", "application/json; charset=utf-8");
  resultHeaders.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { status, headers: resultHeaders });
}

function normalizeOrigin(value: string): string {
  try { return new URL(value).origin; } catch { return "https://shorakaei.ir"; }
}

function isSameSiteOrigin(candidate: string, configured: string): boolean {
  try {
    const a = new URL(candidate);
    const b = new URL(configured);
    return (a.protocol === "https:" || a.protocol === "http:") && a.hostname.toLowerCase().replace(/^www\./, "") === b.hostname.toLowerCase().replace(/^www\./, "");
  } catch { return false; }
}

function isAdmin(request: Request, env: Env): boolean {
  const secret = env.ADMIN_SECRET || "";
  if (secret.length < 24) return false;
  const authorization = request.headers.get("Authorization") || "";
  const header = request.headers.get("X-SVI-Admin") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : header;
  return constantTimeEqual(supplied, secret);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function clampInt(value: unknown, min: number, max: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.floor(n))) : min;
}

function safeSlug(value: string): string {
  const slug = value.trim();
  if (!slug || slug.length > 180 || slug.includes("..") || /[\\\s?#]/.test(slug)) return "";
  return slug.replace(/^\/+|\/+$/g, "");
}

function isAllowedAssetKey(key: string): boolean {
  return key.startsWith("images/") && key.length < 500 && !key.includes("..") && !key.includes("\\");
}

function manifestKey(slug: string): string { return `${MANIFEST_PREFIX}${slug}.json`; }

// ── FIXED: Added Cache-Buster to image URL ──
function withAssetUrls(manifest: ArticleManifest, origin: string) {
  const cacheBuster = new Date(manifest.generatedAt).getTime();
  return {
    ...manifest,
    images: manifest.images.map((image) => ({
      ...image,
      src: `${origin}/assets?key=${encodeURIComponent(image.key)}&v=${cacheBuster}`,
    })),
  };
}

type IndexEntry = { slug: string; title: string; coverKey: string; alt: string; canonicalUrl: string; generatedAt: string };

async function getIndex(env: Env): Promise<IndexEntry[]> {
  const value = await env.VISUAL_ASSETS.get(INDEX_KEY, "json") as { items?: IndexEntry[] } | null;
  return value && Array.isArray(value.items) ? value.items : [];
}

async function saveManifest(env: Env, manifest: ArticleManifest): Promise<void> {
  await env.VISUAL_ASSETS.put(manifestKey(manifest.slug), JSON.stringify(manifest));
  const current = await getIndex(env);
  const cover = manifest.images.find((image) => image.kind === "cover");
  if (!cover) return;
  const entry: IndexEntry = {
    slug: manifest.slug,
    title: manifest.title,
    coverKey: cover.key,
    alt: cover.alt,
    canonicalUrl: manifest.canonicalUrl,
    generatedAt: manifest.generatedAt,
  };
  const items = [...current.filter((item) => item.slug !== manifest.slug), entry].sort((a, b) => a.title.localeCompare(b.title));
  await env.VISUAL_ASSETS.put(INDEX_KEY, JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), items }));
}

async function getManifest(env: Env, slug: string): Promise<ArticleManifest | null> {
  const value = await env.VISUAL_ASSETS.get(manifestKey(slug), "json");
  return value ? (value as ArticleManifest) : null;
}

// ═══════════════════════════════════════════════════════════
// SITEMAP DISCOVERY
// ═══════════════════════════════════════════════════════════

async function getSitemapArticleUrls(siteOrigin: string): Promise<string[]> {
  const origin = normalizeOrigin(siteOrigin);
  const visited = new Set<string>();
  const articleUrls = new Set<string>();
  const queue = [`${origin}/sitemap.xml`];

  for (let round = 0; queue.length && round < MAX_SITEMAP_FILES; round++) {
    const sitemapUrl = queue.shift()!;
    if (visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);
    let response: Response;
    try { response = await fetch(sitemapUrl, { headers: { "User-Agent": "ShorakaeiVisualIntelligence/1.0" } }); }
    catch { continue; }
    if (!response.ok) continue;
    const xml = (await response.text()).slice(0, 2_000_000);
    const locations = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => decodeXml(m[1].trim()));
    for (const location of locations) {
      let parsed: URL;
      try { parsed = new URL(location); } catch { continue; }
      if (!isAllowedSiteUrl(parsed, origin)) continue;
      if (/\.xml(?:\.gz)?$/i.test(parsed.pathname) && /sitemap/i.test(parsed.pathname)) {
        if (!visited.has(parsed.href) && queue.length < MAX_SITEMAP_FILES) queue.push(parsed.href);
      } else if (isBlogArticlePath(parsed.pathname)) {
        parsed.search = "";
        parsed.hash = "";
        articleUrls.add(parsed.href);
      }
    }
  }

  return [...articleUrls].sort((a, b) => a.localeCompare(b));
}

function isAllowedSiteUrl(url: URL, configuredOrigin: string): boolean {
  const configured = new URL(configuredOrigin);
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  const hostA = url.hostname.toLowerCase().replace(/^www\./, "");
  const hostB = configured.hostname.toLowerCase().replace(/^www\./, "");
  return hostA === hostB;
}

function isBlogArticlePath(pathname: string): boolean {
  const clean = pathname.replace(/\/+$/, "");
  if (!clean.startsWith("/blog/") || clean === "/blog") return false;
  if (/^\/blog\/(category|categories|tag|tags|page|author|feed)(\/|$)/i.test(clean)) return false;
  if (/\.(xml|json|jpg|jpeg|png|webp|svg|pdf)$/i.test(clean)) return false;
  return clean.split("/").filter(Boolean).length >= 2;
}

function decodeXml(value: string): string {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function slugFromUrl(urlString: string): string {
  const url = new URL(urlString);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

// ═══════════════════════════════════════════════════════════
// ARTICLE EXTRACTION
// ═══════════════════════════════════════════════════════════

async function extractArticle(url: string): Promise<ArticleSnapshot | null> {
  const response = await fetch(url, { headers: { "User-Agent": "ShorakaeiVisualIntelligence/1.0", "Accept": "text/html" } });
  if (!response.ok) return null;
  const html = (await response.text()).slice(0, MAX_PAGE_CHARS);
  if (!/<html[\s>]/i.test(html)) return null;

  const articleHtml = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    || html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
    || html;
  const title = extractMeta(html, "property", "og:title") || extractTagText(html, "h1") || extractTagText(html, "title");
  const description = extractMeta(html, "name", "description") || extractMeta(html, "property", "og:description");
  if (!title) return null;

  const cleanContent = articleHtml
    .replace(/<(script|style|noscript|svg|nav|footer|header|aside)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const headingMatches = [...cleanContent.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
  const headings = headingMatches
    .map((match, index) => ({ text: cleanText(match[1]).slice(0, 180), index }))
    .filter((heading) => heading.text.length > 3);
  const paragraphs = [...cleanContent.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => cleanText(match[1]))
    .filter((text) => text.length > 45)
    .slice(0, 60);

  // Rich content sample: 600-1200 chars from the first 5 paragraphs
  const contentSample = paragraphs.slice(0, 5).join(" ").slice(0, 1200);
  const excerpt = paragraphs.slice(0, 4).join(" ").slice(0, 1800) || cleanText(cleanContent).slice(0, 1800);
  const contentSignature = paragraphs.join(" ").slice(0, 14_000);
  const slug = slugFromUrl(url);
  const fingerprintSource = [url, title, description, headings.map((h) => h.text).join("|"), contentSignature].join("\n");
  const fingerprint = await sha256(fingerprintSource);

  return {
    url,
    slug,
    title: title.slice(0, 180),
    description: (description || excerpt).slice(0, 500),
    headings,
    excerpt,
    contentSample,
    fingerprint,
  };
}

function extractMeta(html: string, attr: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regexA = new RegExp(`<meta\\b(?=[^>]*\\b${attr}=["']${escaped}["'])(?=[^>]*\\bcontent=["']([^"']*)["'])[^>]*>`, "i");
  const regexB = new RegExp(`<meta\\b(?=[^>]*\\bcontent=["']([^"']*)["'])(?=[^>]*\\b${attr}=["']${escaped}["'])[^>]*>`, "i");
  const match = html.match(regexA) || html.match(regexB);
  return match ? cleanText(match[1]) : "";
}

function extractTagText(html: string, tag: string): string {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? cleanText(match[1]) : "";
}

function cleanText(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, " ").replace(/<!--[\s\S]*?-->/g, " "))
    .replace(/[\u200b\u200c\u200d]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCodePoint(Math.min(0x10ffff, Number(code))))
    .replace(/&#x([\da-f]+);/gi, (_m, code) => String.fromCodePoint(Math.min(0x10ffff, parseInt(code, 16))));
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

// ═══════════════════════════════════════════════════════════
// INLINE HEADINGS SELECTION
// ═══════════════════════════════════════════════════════════

function chooseInlineHeadings(headings: ArticleSnapshot["headings"], maxInline: number): Array<{ text: string; index: number }> {
  if (headings.length < 2 || maxInline < 1) return [];
  const desired = headings.length >= 5 ? Math.min(2, maxInline) : 1;
  const chosen: Array<{ text: string; index: number }> = [];
  for (let n = 1; n <= desired; n++) {
    const target = Math.round((n * (headings.length - 1)) / (desired + 1));
    const item = headings[target];
    if (item && !chosen.some((candidate) => candidate.index === item.index)) chosen.push(item);
  }
  return chosen;
}

// ═══════════════════════════════════════════════════════════
// LLM CONCEPT GENERATION
// ═══════════════════════════════════════════════════════════

async function generateConceptWithLLM(
  env: Env,
  article: ArticleSnapshot,
  section?: string
): Promise<string> {
  const model = env.CONCEPT_MODEL || DEFAULT_CONCEPT_MODEL;

  const sectionHint = section ? `\nThis image belongs to the section titled: "${section}".` : "";
  const headingsHint = article.headings.slice(0, 6).map((h) => `- ${h.text}`).join("\n");

  const systemPrompt = [
    "You are an art director for a Persian tech publication about web design, AI, UX and SEO.",
    "You produce ONE single concrete visual scene that could be a magazine cover image for the given article.",
    "Rules:",
    "- Reply with ONE English sentence, max 40 words, describing a concrete scene (objects, materials, lighting, composition).",
    "- Never mention text, letters, typography, screenshots, code, logos, charts, or UI labels.",
    "- Prefer physical 3D metaphors (real objects, rooms, tools, natural elements, light) over abstract concepts.",
    "- The scene must be specific to THIS article's content, not a generic 'SEO' or 'AI' symbol.",
    "- Art direction: premium minimal 3D editorial, soft studio light, deep teal and burgundy accents, warm ivory background, generous negative space, distinct silhouette.",
    "- Do not return quotes, markdown, or explanations. Only the scene sentence.",
  ].join("\n");

  const userPrompt = [
    `Article title: ${article.title}`,
    `Article description: ${article.description}`,
    `Article headings:\n${headingsHint}`,
    `Article excerpt: ${article.contentSample}`,
    sectionHint,
    "Now write the single visual scene sentence.",
  ].filter(Boolean).join("\n\n");

  try {
    const result = await env.AI.run(model, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 120,
      temperature: 0.6,
    });

    const raw =
      (typeof result?.response === "string" && result.response) ||
      (typeof result?.choices?.[0]?.message?.content === "string" && result.choices[0].message.content) ||
      "";

    const cleaned = sanitizeConcept(raw);
    if (cleaned) return cleaned;
  } catch (error) {
    console.warn("LLM concept failed, falling back to regex heuristic:", error);
  }

  return visualConcept(article, section);
}

function sanitizeConcept(raw: string): string {
  let text = raw
    .replace(/^["'`\s]+|["'`\s]+$/g, "")
    .replace(/^scene:\s*/i, "")
    .replace(/^visual concept:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  text = text.replace(/\b(text|letters?|typography|screenshots?|code|logos?|charts?|UI labels?|numbers?)\b/gi, "");
  text = text.replace(/\s+/g, " ").trim();

  if (text.length > 260) text = text.slice(0, 260).trim();
  return text;
}

// ═══════════════════════════════════════════════════════════
// PROMPT BUILDING (final flux prompt)
// ═══════════════════════════════════════════════════════════

function buildFinalPrompt(
  article: ArticleSnapshot,
  kind: "cover" | "inline",
  concept: string,
  section?: string
): string {
  const title = truncatePromptText(article.title, 140);
  const ratioGuide =
    kind === "cover"
      ? "wide editorial landscape composition, readable at 16:10 crop, strong central silhouette with breathing room"
      : "supporting editorial illustration, balanced 4:3 crop, focused on the specific section topic";

  return [
    "Create a premium, highly art-directed editorial concept illustration for a Persian technology publication.",
    `Article topic: ${title}.`,
    section ? `Section: ${section}.` : "",
    `Visual scene: ${concept}`,
    "Art direction: sophisticated minimal 3D editorial illustration, physically plausible materials, refined soft studio lighting, subtle transparent glass and controlled optical highlights, deep teal #0d7377 and muted burgundy #8b3a4a accents used sparingly, warm ivory background, elegant composition, generous negative space, distinct silhouette, crisp details, high production value, natural contact shadows.",
    `Composition: ${ratioGuide}.`,
    "Do not render text, letters, typography, watermarks, logos, fake screenshots, UI labels, chart numbers or random symbols.",
  ].filter(Boolean).join(" ").slice(0, 2000);
}

// ═══════════════════════════════════════════════════════════
// FALLBACK: regex concept (used only if LLM fails)
// ═══════════════════════════════════════════════════════════

function visualConcept(article: ArticleSnapshot, heading?: string): string {
  const topic = `${article.title} ${article.description} ${heading || ""} ${article.headings.map((item) => item.text).join(" ")}`;
  const rules: Array<{ pattern: RegExp; concept: string }> = [
    { pattern: /سئو|seo|گوگل|جستجو|رتبه|ترافیک ارگانیک/i, concept: "a refined discoverability concept: layered search pathways, a focal point emerging from a field of information, and subtle ascending geometric forms; no readable search box or text" },
    { pattern: /تجربه.?کاربر|رابط.?کاربر|ui\/?ux|ux|طراحی سایت|طراحی وب|wireframe|interface/i, concept: "a precise composition of floating modular interface surfaces, spatial hierarchy, rounded cards, carefully aligned grids and subtle depth, all interface surfaces blank and without readable UI text" },
    { pattern: /هوش مصنوعی|\bai\b|machine learning|یادگیری ماشین|مدل زبانی|شبکه عصبی|llm/i, concept: "a luminous central intelligence core connected to a small number of fine neural pathways and translucent nodes, elegant and technical rather than science-fiction clutter" },
    { pattern: /سرعت|عملکرد|performance|core web vitals|بهینه.?سازی|بارگذاری/i, concept: "a visual metaphor for speed and performance using streamlined layered forms, a clean light trail, balanced motion cues and restrained precision" },
    { pattern: /تبدیل|فروش|conversion|cro|بازاریابی|تبلیغ|مشتری|قیف/i, concept: "a sophisticated conversion journey metaphor with a few elegant translucent stages guiding a small focal object toward a clear destination; no labels, numbers or literal text" },
    { pattern: /کد|برنامه.?نویسی|توسعه|next\.js|javascript|typescript|css|html|api|امنیت/i, concept: "a clean technical composition of interconnected translucent layers, precise structural blocks and abstract code-like line patterns that contain no readable characters" },
    { pattern: /ویدیو|موشن|استوری.?برد|تصویر|گرافیک|خلاقیت|ادیت/i, concept: "a cinematic creative workspace metaphor with a few carefully composed frame-like planes, controlled directional lighting and a clear focal object, without any literal timeline labels" },
    { pattern: /مقایسه|فرق|تفاوت|مزایا|معایب|vs\b|versus/i, concept: "a balanced side-by-side conceptual composition of two distinct materials or forms, contrasted by light and geometry without symbols, labels or text" },
    { pattern: /آموزش|راهنما|مرحله|گام به گام|چطور|چگونه|نحوه/i, concept: "a visual process metaphor using three or four ordered physical forms connected by a fine continuous path, no numbered steps and no text" },
  ];
  return rules.find((rule) => rule.pattern.test(topic))?.concept
    || "a memorable abstract metaphor for the article built around one central object, a small number of supporting geometric elements and a strong visual hierarchy";
}

function truncatePromptText(value: string, max = 150): string {
  return value.replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

// ═══════════════════════════════════════════════════════════
// IMAGE GENERATION
// ═══════════════════════════════════════════════════════════

async function generateImage(env: Env, prompt: string): Promise<Uint8Array> {
  const model = env.IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
  const result = await env.AI.run(model, { prompt, steps: 4 });
  const base64 = typeof result?.image === "string" ? result.image : "";
  if (!base64) throw new Error(`Image model ${model} returned no image data.`);
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  if (bytes.length < 1000) throw new Error("Generated image payload was unexpectedly small.");
  return bytes;
}

function seedFromText(value: string): number {
  let seed = 2166136261;
  for (let i = 0; i < value.length; i++) seed = Math.imul(seed ^ value.charCodeAt(i), 16777619);
  return seed >>> 0;
}

// ═══════════════════════════════════════════════════════════
// PER-ARTICLE PROCESSING
// ═══════════════════════════════════════════════════════════

async function processArticle(env: Env, article: ArticleSnapshot, force: boolean): Promise<"generated" | "unchanged" | "skipped"> {
  const existing = await getManifest(env, article.slug);
  if (!force && existing?.fingerprint === article.fingerprint && existing.images.some((image) => image.kind === "cover")) return "unchanged";

  const maxInline = clampInt(env.MAX_INLINE_IMAGES ?? 1, 0, 1);
  const plannedHeadings = chooseInlineHeadings(article.headings, maxInline);
  const images: VisualAsset[] = [];
  
  // ── FIXED: Dynamic version to prevent caching when forcing regeneration ──
  const version = force 
    ? `${article.fingerprint.slice(0, 8)}-${Date.now()}` 
    : article.fingerprint.slice(0, 12);

  const llmEnabled = isLlmEnabled(env);

  // ── Cover image ──
  let coverConcept: string;
  if (llmEnabled) {
    coverConcept = await generateConceptWithLLM(env, article);
  } else {
    coverConcept = visualConcept(article);
  }
  console.log(`[concept:cover] ${article.slug} :: ${coverConcept}`);

  const coverPrompt = buildFinalPrompt(article, "cover", coverConcept);
  const coverKey = `images/${article.slug}/${version}/cover.jpg`;
  const coverBytes = await generateImage(env, coverPrompt);
  await env.VISUAL_ASSETS.put(coverKey, coverBytes);
  images.push({
    kind: "cover",
    key: coverKey,
    alt: `تصویر مفهومی مقالهٔ «${article.title}»`.slice(0, 180),
    caption: "",
  });

  // ── Inline images ──
  let index = 0;
  for (const heading of plannedHeadings) {
    index++;
    let inlineConcept: string;
    if (llmEnabled) {
      inlineConcept = await generateConceptWithLLM(env, article, heading.text);
    } else {
      inlineConcept = visualConcept(article, heading.text);
    }
    console.log(`[concept:inline-${index}] ${article.slug} :: ${inlineConcept}`);

    const inlinePrompt = buildFinalPrompt(article, "inline", inlineConcept, heading.text);
    const key = `images/${article.slug}/${version}/inline-${index}.jpg`;
    const bytes = await generateImage(env, inlinePrompt);
    await env.VISUAL_ASSETS.put(key, bytes);
    images.push({
      kind: "inline",
      key,
      alt: `تصویر مفهومی برای بخش «${heading.text}» از مقالهٔ «${article.title}»`.slice(0, 180),
      heading: heading.text,
      headingIndex: heading.index,
    });
  }

  const manifest: ArticleManifest = {
    version: 1,
    slug: article.slug,
    canonicalUrl: article.url,
    title: article.title,
    description: article.description,
    fingerprint: article.fingerprint,
    generatedAt: new Date().toISOString(),
    images,
    concept: coverConcept,
  };
  await saveManifest(env, manifest);
  return "generated";
}

// ═══════════════════════════════════════════════════════════
// SWEEP
// ═══════════════════════════════════════════════════════════

async function runSweep(
  env: Env,
  requestedLimit: number,
  force: boolean,
  trigger: "cron" | "manual",
  slugs?: string[]
): Promise<void> {
  const startedAt = new Date().toISOString();
  const siteOrigin = normalizeOrigin(env.SITE_ORIGIN || "https://shorakaei.ir");
  let generated = 0;
  let unchanged = 0;
  let skipped = 0;
  let errors = 0;
  const details: Array<{ url: string; result: string; message?: string }> = [];

  try {
    const urls = await getSitemapArticleUrls(siteOrigin);
    if (!urls.length) throw new Error(`No /blog/ article URLs were found in ${siteOrigin}/sitemap.xml. Check sitemap availability and SITE_ORIGIN.`);

    let selected: string[];
    if (slugs && slugs.length) {
      selected = urls.filter((u) => slugs.includes(slugFromUrl(u))).slice(0, 10);
      if (!selected.length) throw new Error("None of the requested slugs were found in the sitemap.");
    } else {
      const state = await env.VISUAL_ASSETS.get(`${STATE_PREFIX}cursor.json`, "json") as { cursor?: number } | null;
      const cursor = Math.max(0, Number(state?.cursor) || 0) % urls.length;
      const limit = Math.min(urls.length, clampInt(requestedLimit, 1, trigger === "cron" ? 1 : 3));
      selected = [];
      for (let i = 0; i < limit; i++) selected.push(urls[(cursor + i) % urls.length]);
      const nextCursor = (cursor + limit) % urls.length;
      await env.VISUAL_ASSETS.put(`${STATE_PREFIX}cursor.json`, JSON.stringify({ cursor: nextCursor, totalUrls: urls.length, updatedAt: new Date().toISOString() }));
    }

    for (const url of selected) {
      try {
        const article = await extractArticle(url);
        if (!article) { skipped++; details.push({ url, result: "skipped", message: "Could not extract a readable article title/content." }); continue; }
        const result = await processArticle(env, article, force);
        if (result === "generated") generated++;
        else if (result === "unchanged") unchanged++;
        else skipped++;
        details.push({ url, result });
      } catch (error) {
        errors++;
        details.push({ url, result: "error", message: error instanceof Error ? error.message : "Unknown error" });
      }
    }

    const report = {
      state: errors && !generated && !unchanged ? "error" : "completed",
      trigger,
      startedAt,
      finishedAt: new Date().toISOString(),
      siteOrigin,
      sitemapArticleCount: urls.length,
      processed: selected.length,
      generated,
      unchanged,
      skipped,
      errors,
      details,
      note: "Free tier: LLM + flux per article consumes significant AI quota. Cron processes only 1 article per run.",
    };
    await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify(report));
  } catch (error) {
    const report = {
      state: "error",
      trigger,
      startedAt,
      finishedAt: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
    };
    await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify(report));
  }
}