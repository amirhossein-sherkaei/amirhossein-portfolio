/**
 * Shorakaei Visual Intelligence - Infinite Relevance Engine
 * JSON-structured prompts + relevance scoring + site-wide assets
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
  url: string; slug: string; title: string; description: string;
  headings: Array<{ text: string; index: number }>;
  excerpt: string; contentSample: string; fingerprint: string;
}

interface VisualAsset {
  kind: "cover" | "inline" | "hero" | "service" | "process" | "og" | "category";
  key: string; alt: string;
  heading?: string; headingIndex?: number; caption?: string;
  meta?: Record<string, string>;
}

interface ArticleManifest {
  version: 1; slug: string; canonicalUrl: string; title: string;
  description: string; fingerprint: string; generatedAt: string;
  images: VisualAsset[]; concept?: string;
}

const DEFAULT_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const DEFAULT_CONCEPT_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const MANIFEST_PREFIX = "manifests/articles/";
const INDEX_KEY = "manifests/index.json";
const STATE_PREFIX = "system/";
const BRAND = "Shorakaei Visual Intelligence";
const MAX_SITEMAP_FILES = 12;
const MAX_PAGE_CHARS = 180_000;

// ─── Site-wide visual assets ───
const SITE_ASSETS = [
  { kind: "hero", slug: "home-hero", title: "طراحی سایت اختصاصی برای دیده شدن", desc: "وب‌سایت‌هایی سریع، ریسپانسیو و متناسب با هویت برند" },
  { kind: "service", slug: "svc-web", title: "وب‌سایت اختصاصی", desc: "طراحی و توسعه وب‌سایت اختصاصی بدون قالب آماده" },
  { kind: "service", slug: "svc-creative", title: "توسعه خلاق", desc: "ایده‌های نوآورانه برای حضور دیجیتال متمایز" },
  { kind: "service", slug: "svc-visual", title: "تصاویر هوشمند", desc: "تولید تصاویر با هوش مصنوعی متناسب با برند" },
  { kind: "service", slug: "svc-identity", title: "هویت بصری", desc: "طراحی هویت بصری منسجم و حرفه‌ای" },
  { kind: "process", slug: "prc-discovery", title: "کشف", desc: "گفت‌وگو و کشف هدف، مخاطب و رقبا" },
  { kind: "process", slug: "prc-design", title: "طراحی", desc: "ساختار، جریان کاربر و طراحی بصری" },
  { kind: "process", slug: "prc-dev", title: "توسعه", desc: "پیاده‌سازی با Next.js و React" },
  { kind: "process", slug: "prc-deliver", title: "تحویل", desc: "انتشار، آموزش و پشتیبانی" },
  { kind: "og", slug: "og-home", title: "امیرحسین شرکائی | طراحی سایت اختصاصی", desc: "وب‌سایت‌هایی سریع، ریسپانسیو و متناسب با هویت برند" },
  { kind: "category", slug: "cat-design", title: "طراحی وب", desc: "مقالات طراحی سایت و رابط کاربری" },
  { kind: "category", slug: "cat-seo", title: "سئو", desc: "مقالات بهینه‌سازی برای موتور جستجو" },
  { kind: "category", slug: "cat-ai", title: "هوش مصنوعی", desc: "مقالات هوش مصنوعی و کاربردهای آن" },
  { kind: "category", slug: "cat-ux", title: "تجربه کاربری", desc: "مقالات UX و تجربه کاربری" },
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, service: BRAND, llmConceptEnabled: isLlmEnabled(env) }, 200, cors);
      if (url.pathname === "/manifest" && request.method === "GET") {
        const slug = safeSlug(url.searchParams.get("slug") || "");
        if (!slug) return json({ error: "Missing or invalid slug" }, 400, cors);
        const manifest = await getManifest(env, slug);
        if (!manifest) return json({ error: "Manifest not found yet", slug }, 404, cors);
        return json(withAssetUrls(manifest, url.origin), 200, { ...cors, "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" });
      }
      if (url.pathname === "/index" && request.method === "GET") {
        const index = await getIndex(env);
        return json({ version: 1, items: index.map((i) => ({...i, cover: `${url.origin}/assets?key=${encodeURIComponent(i.coverKey)}&v=${Date.now()}`})) }, 200, { ...cors, "Cache-Control": "public, max-age=300" });
      }
      if (url.pathname === "/assets" && request.method === "GET") {
        const key = url.searchParams.get("key") || "";
        if (!isAllowedAssetKey(key)) return json({ error: "Invalid asset key" }, 400, cors);
        const buffer = await env.VISUAL_ASSETS.get(key, "arrayBuffer");
        if (!buffer) return new Response("Not found", { status: 404, headers: cors });
        const headers = new Headers(cors);
        headers.set("Content-Type", "image/jpeg");
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        return new Response(buffer, { status: 200, headers });
      }
      if (url.pathname === "/admin/status" && request.method === "GET") {
        if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401, cors);
        const status = await env.VISUAL_ASSETS.get(`${STATE_PREFIX}last-job.json`, "json");
        return json(status || { state: "idle" }, 200, cors);
      }
      if (url.pathname === "/admin/run" && request.method === "POST") {
        if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401, cors);
        const body = await request.json().catch(() => ({})) as { limit?: number; force?: boolean; slugs?: string[]; siteAssets?: boolean };
        const limit = clampInt(body.limit ?? 1, 1, 3);
        const force = body.force === true;
        const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s) => typeof s === "string").map((s) => safeSlug(s)).filter(Boolean) : [];
        const job = { state: "queued", startedAt: new Date().toISOString(), limit, force, slugs, siteAssets: body.siteAssets === true, message: "Queued." };
        await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify(job));
        ctx.waitUntil(runSweep(env, limit, force, "manual", slugs, body.siteAssets === true));
        return json({ ok: true, ...job }, 202, cors);
      }
      return json({ error: "Not found" }, 404, cors);
    } catch (error) { return json({ error: error instanceof Error ? error.message : "Error" }, 500, cors); }
  },
  async scheduled(_c: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runSweep(env, 1, false, "cron", undefined, false));
  },
};

function isLlmEnabled(env: Env): boolean { return env.ENABLE_LLM_CONCEPT !== "false"; }
function corsHeaders(req: Request, env: Env): HeadersInit {
  const o = req.headers.get("Origin") || ""; const c = normalizeOrigin(env.SITE_ORIGIN || "https://shorakaei.ir");
  return { "Access-Control-Allow-Origin": o && isSameSiteOrigin(o, c) ? o : c, "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization,X-SVI-Admin" };
}
function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  const h = new Headers(headers); h.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { status, headers: h });
}
function normalizeOrigin(v: string): string { try { return new URL(v).origin; } catch { return "https://shorakaei.ir"; } }
function isSameSiteOrigin(a: string, b: string): boolean { try { return new URL(a).hostname.replace(/^www\./, "") === new URL(b).hostname.replace(/^www\./, ""); } catch { return false; } }
function isAdmin(req: Request, env: Env): boolean {
  const s = env.ADMIN_SECRET || ""; if (s.length < 24) return false;
  const a = req.headers.get("Authorization") || ""; const h = req.headers.get("X-SVI-Admin") || "";
  const sup = a.startsWith("Bearer ") ? a.slice(7) : h; return constantTimeEqual(sup, s);
}
function constantTimeEqual(a: string, b: string): boolean { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
function clampInt(v: unknown, min: number, max: number): number { const n = Number(v); return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.floor(n))) : min; }
function safeSlug(v: string): string { const s = v.trim(); if (!s || s.length > 180 || s.includes("..") || /[\\\s?#]/.test(s)) return ""; return s.replace(/^\/+|\/+$/g, ""); }
function isAllowedAssetKey(k: string): boolean { return k.startsWith("images/") && k.length < 500 && !k.includes("..") && !k.includes("\\"); }
function manifestKey(slug: string): string { return `${MANIFEST_PREFIX}${slug}.json`; }
function withAssetUrls(m: ArticleManifest, o: string) {
  const v = new Date(m.generatedAt).getTime();
  return { ...m, images: m.images.map((i) => ({ ...i, src: `${o}/assets?key=${encodeURIComponent(i.key)}&v=${v}` })) };
}
type IndexEntry = { slug: string; title: string; coverKey: string; alt: string; canonicalUrl: string; generatedAt: string };
async function getIndex(env: Env): Promise<IndexEntry[]> { const v = await env.VISUAL_ASSETS.get(INDEX_KEY, "json") as any; return v && Array.isArray(v.items) ? v.items : []; }
async function saveManifest(env: Env, m: ArticleManifest): Promise<void> {
  await env.VISUAL_ASSETS.put(manifestKey(m.slug), JSON.stringify(m));
  const c = await getIndex(env); const cover = m.images.find((i) => i.kind === "cover"); if (!cover) return;
  const e: IndexEntry = { slug: m.slug, title: m.title, coverKey: cover.key, alt: cover.alt, canonicalUrl: m.canonicalUrl, generatedAt: m.generatedAt };
  await env.VISUAL_ASSETS.put(INDEX_KEY, JSON.stringify({ version: 1, items: [...c.filter((i) => i.slug !== m.slug), e].sort((a, b) => a.title.localeCompare(b.title)) }));
}
async function getManifest(env: Env, slug: string): Promise<ArticleManifest | null> { const v = await env.VISUAL_ASSETS.get(manifestKey(slug), "json"); return v ? (v as ArticleManifest) : null; }

// ─── JSON-structured prompt builder ───
function buildJsonPrompt(article: ArticleSnapshot, kind: "cover" | "inline", concept: string, section?: string): string {
  const ratio = kind === "cover" ? "16:9" : "4:3";
  return JSON.stringify({
    subject: concept,
    action: article.title,
    environment: section ? `Section: ${section}` : "article context",
    composition: `${ratio} aspect ratio, cinematic framing, rule of thirds, negative space on one side`,
    lighting: "dramatic cinematic side lighting, deep soft shadows, subtle rim light",
    color_palette: "dominant deep teal #0d7377 and rich burgundy #8b3a4a, warm ivory #f5f5f0 only as background accent",
    style: "photorealistic 3D render, Unreal Engine 5, ray tracing, 8k resolution, extremely detailed, premium editorial",
    constraints: "NO text, NO typography, NO watermarks, NO UI elements, NO abstract glowing shapes, NO geometric patterns",
  });
}

// ─── Concept generation with semantic depth ───
async function generateConceptWithLLM(env: Env, article: ArticleSnapshot, section?: string): Promise<string> {
  const model = env.CONCEPT_MODEL || DEFAULT_CONCEPT_MODEL;
  const sec = section ? `\nSection: "${section}".` : "";
  const heads = article.headings.slice(0, 6).map((h) => `- ${h.text}`).join("\n");
  const sys = [
    "You are a world-class art director for a premium Persian tech magazine.",
    "Your task is to describe a CONCRETE, PHYSICAL SCENE that represents the article's core message.",
    "CRITICAL RULES:",
    "- MUST BE A PHYSICAL SCENE (e.g., a hand holding a tool, a specific room, an object).",
    "- NO abstract shapes, NO glowing lines, NO geometric patterns.",
    "- If the article is about 'trust', show a firm handshake in a modern office.",
    "- If the article is about 'frustration in UI', show a designer looking stressed at a broken physical prototype.",
    "- Do not mention text, letters, or code.",
    "- Write 1 or 2 descriptive sentences (max 50 words).",
    "- Only output the scene description, nothing else."
  ].join("\n");
  const usr = [`Title: ${article.title}`, `Description: ${article.description}`, `Headings:\n${heads}`, `Excerpt: ${article.contentSample}`, sec, "Describe the concrete visual scene now."].filter(Boolean).join("\n\n");
  try {
    const res = await env.AI.run(model, { messages: [{ role: "system", content: sys }, { role: "user", content: usr }], max_tokens: 150, temperature: 0.7 });
    const raw = (typeof res?.response === "string" && res.response) || (typeof res?.choices?.[0]?.message?.content === "string" && res.choices[0].message.content) || "";
    const cleaned = sanitizeConcept(raw);
    if (cleaned) return cleaned;
  } catch (e) { console.warn("LLM failed:", e); }
  return visualConcept(article, section);
}

function sanitizeConcept(raw: string): string {
  let t = raw.replace(/^["'`\s]+|["'`\s]+$/g, "").replace(/^scene:\s*/i, "").replace(/\s+/g, " ").trim();
  t = t.replace(/\b(text|letters?|typography|screenshots?|code|logos?|charts?|UI labels?|numbers?)\b/gi, "");
  return t.replace(/\s+/g, " ").trim().slice(0, 300);
}

// ─── Relevance scoring ───
async function scoreRelevance(env: Env, article: ArticleSnapshot, concept: string): Promise<number> {
  const model = env.CONCEPT_MODEL || DEFAULT_CONCEPT_MODEL;
  const sys = "You are a strict relevance judge. Given an article's title and a visual scene description, rate how relevant the scene is to the article's core message on a scale of 1 to 10. Reply with ONLY a single integer number.";
  const usr = `Article title: ${article.title}\nArticle description: ${article.description}\nVisual scene: ${concept}\nRelevance score (1-10):`;
  try {
    const res = await env.AI.run(model, { messages: [{ role: "system", content: sys }, { role: "user", content: usr }], max_tokens: 5, temperature: 0.1 });
    const raw = (typeof res?.response === "string" && res.response) || (typeof res?.choices?.[0]?.message?.content === "string" && res.choices[0].message.content) || "";
    const num = parseInt(raw.replace(/\D/g, ""), 10);
    return Number.isFinite(num) ? Math.max(1, Math.min(10, num)) : 5;
  } catch { return 5; }
}

// ─── Site asset generation ───
async function generateSiteAsset(env: Env, asset: { kind: string; slug: string; title: string; desc: string }): Promise<void> {
  const articleLike: ArticleSnapshot = {
    url: `${normalizeOrigin(env.SITE_ORIGIN || "https://shorakaei.ir")}/${asset.kind}/${asset.slug}`,
    slug: asset.slug, title: asset.title, description: asset.desc,
    headings: [], excerpt: asset.desc, contentSample: asset.desc, fingerprint: await sha256(asset.slug + asset.title),
  };
  const concept = await generateConceptWithLLM(env, articleLike);
  const prompt = buildJsonPrompt(articleLike, "cover", concept);
  const key = `images/site/${asset.kind}/${asset.slug}.jpg`;
  const bytes = await generateImage(env, prompt);
  await env.VISUAL_ASSETS.put(key, bytes);
  // Store a simple manifest for site assets
  const manifest: ArticleManifest = {
    version: 1, slug: asset.slug, canonicalUrl: articleLike.url, title: asset.title,
    description: asset.desc, fingerprint: articleLike.fingerprint, generatedAt: new Date().toISOString(),
    images: [{ kind: asset.kind as any, key, alt: asset.title.slice(0, 180) }],
    concept,
  };
  await saveManifest(env, manifest);
}

function visualConcept(article: ArticleSnapshot, heading?: string): string {
  const topic = `${article.title} ${article.description} ${heading || ""} ${article.headings.map((i) => i.text).join(" ")}`;
  const rules: Array<{ pattern: RegExp; concept: string }> = [
    { pattern: /سئو|seo|گوگل|جستجو|رتبه|ترافیک/i, concept: "A glowing magnifying glass hovering over a complex, miniature 3D model of a city, representing search discovery." },
    { pattern: /تجربه.?کاربر|رابط.?کاربر|ui\/?ux|ux|طراحی سایت|طراحی وب|interface/i, concept: "A frustrated designer standing in front of a chaotic, messy 3D wireframe sculpture, showing the pain of bad UX." },
    { pattern: /هوش مصنوعی|\bai\b|machine learning|یادگیری ماشین|llm/i, concept: "A futuristic, sleek robotic hand gently interacting with a glowing, intricate 3D model of a human brain." },
    { pattern: /سرعت|عملکرد|performance|core web vitals|بارگذاری/i, concept: "A sleek, glowing sports car engine made of transparent digital glass, representing extreme speed and performance." },
    { pattern: /تبدیل|فروش|conversion|cro|بازاریابی|مشتری/i, concept: "A large, beautiful glowing funnel where small, precious 3D spheres are elegantly falling through, representing conversion." },
    { pattern: /کد|برنامه.?نویسی|توسعه|next\.js|javascript|typescript|css|html|api|امنیت/i, concept: "A sleek, futuristic server room with glowing blue cables and a massive digital lock, representing secure code." },
    { pattern: /ویدیو|موشن|تصویر|گرافیک|خلاقیت|ادیت/i, concept: "A cinematic creative workspace with a vintage camera, glowing light panels, and a perfectly styled director's chair." },
    { pattern: /آموزش|راهنما|مرحله|گام به گام|چطور|چگونه/i, concept: "A beautiful, glowing path of stepping stones crossing a deep river, leading towards a bright, warm light." },
  ];
  return rules.find((r) => r.pattern.test(topic))?.concept || "A stunning, highly detailed premium editorial photo representing the article's theme.";
}
function truncatePromptText(v: string, max = 150): string { return v.replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max); }

async function generateImage(env: Env, prompt: string): Promise<Uint8Array> {
  const model = env.IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
  const res = await env.AI.run(model, { prompt, steps: 6 });
  const b64 = typeof res?.image === "string" ? res.image : "";
  if (!b64) throw new Error("No image data.");
  const raw = atob(b64); const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  if (bytes.length < 1000) throw new Error("Image too small.");
  return bytes;
}

async function processArticle(env: Env, article: ArticleSnapshot, force: boolean): Promise<"generated" | "unchanged" | "skipped"> {
  const existing = await getManifest(env, article.slug);
  if (!force && existing?.fingerprint === article.fingerprint && existing.images.some((i) => i.kind === "cover")) return "unchanged";
  const maxInline = clampInt(env.MAX_INLINE_IMAGES ?? 1, 0, 1);
  const heads = chooseInlineHeadings(article.headings, maxInline);
  const imgs: VisualAsset[] = [];
  const ver = force ? `${article.fingerprint.slice(0, 8)}-${Date.now()}` : article.fingerprint.slice(0, 12);
  const llm = isLlmEnabled(env);

  // Cover with relevance loop
  let cc = llm ? await generateConceptWithLLM(env, article) : visualConcept(article);
  let score = await scoreRelevance(env, article, cc);
  let attempts = 0;
  while (score < 7 && attempts < 2 && llm) {
    console.log(`[relevance] low score ${score}, retrying concept...`);
    cc = await generateConceptWithLLM(env, article);
    score = await scoreRelevance(env, article, cc);
    attempts++;
  }
  console.log(`[cover] ${article.slug} :: score=${score} :: ${cc}`);
  const cp = buildJsonPrompt(article, "cover", cc);
  const ck = `images/${article.slug}/${ver}/cover.jpg`;
  const cb = await generateImage(env, cp);
  await env.VISUAL_ASSETS.put(ck, cb);
  imgs.push({ kind: "cover", key: ck, alt: `کاور مقاله ${article.title}`.slice(0, 180), caption: "" });

  let idx = 0;
  for (const h of heads) {
    idx++;
    let ic = llm ? await generateConceptWithLLM(env, article, h.text) : visualConcept(article, h.text);
    let iscore = await scoreRelevance(env, article, ic);
    let iatt = 0;
    while (iscore < 7 && iatt < 2 && llm) {
      ic = await generateConceptWithLLM(env, article, h.text);
      iscore = await scoreRelevance(env, article, ic);
      iatt++;
    }
    console.log(`[inline-${idx}] ${article.slug} :: score=${iscore} :: ${ic}`);
    const ip = buildJsonPrompt(article, "inline", ic, h.text);
    const k = `images/${article.slug}/${ver}/inline-${idx}.jpg`;
    const b = await generateImage(env, ip);
    await env.VISUAL_ASSETS.put(k, b);
    imgs.push({ kind: "inline", key: k, alt: `تصویر بخش ${h.text}`.slice(0, 180), heading: h.text, headingIndex: h.index });
  }

  const m: ArticleManifest = { version: 1, slug: article.slug, canonicalUrl: article.url, title: article.title, description: article.description, fingerprint: article.fingerprint, generatedAt: new Date().toISOString(), images: imgs, concept: cc };
  await saveManifest(env, m);
  return "generated";
}

async function runSweep(env: Env, reqLim: number, force: boolean, trig: "cron" | "manual", slugs?: string[], siteAssets?: boolean): Promise<void> {
  const st = new Date().toISOString(); const so = normalizeOrigin(env.SITE_ORIGIN || "https://shorakaei.ir");
  let g = 0; let u = 0; let s = 0; let e = 0; const det: any[] = [];
  try {
    if (siteAssets) {
      for (const asset of SITE_ASSETS) {
        try {
          await generateSiteAsset(env, asset);
          g++;
          det.push({ slug: asset.slug, kind: asset.kind, result: "generated" });
        } catch (err) { e++; det.push({ slug: asset.slug, result: "error", message: String(err) }); }
      }
      await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify({ state: "completed", trigger: trig, startedAt: st, finishedAt: new Date().toISOString(), generated: g, errors: e, details: det }));
      return;
    }

    const urls = await getSitemapArticleUrls(so);
    if (!urls.length) throw new Error("No URLs found.");
    let sel: string[];
    if (slugs && slugs.length) { sel = urls.filter((x) => slugs.includes(slugFromUrl(x))).slice(0, 10); }
    else {
      const c = await env.VISUAL_ASSETS.get(`${STATE_PREFIX}cursor.json`, "json") as any;
      const cur = Math.max(0, Number(c?.cursor) || 0) % urls.length;
      const lim = Math.min(urls.length, clampInt(reqLim, 1, trig === "cron" ? 1 : 3));
      sel = []; for (let i = 0; i < lim; i++) sel.push(urls[(cur + i) % urls.length]);
      await env.VISUAL_ASSETS.put(`${STATE_PREFIX}cursor.json`, JSON.stringify({ cursor: (cur + lim) % urls.length }));
    }
    for (const url of sel) {
      try {
        const a = await extractArticle(url); if (!a) { s++; det.push({ url, result: "skipped" }); continue; }
        const r = await processArticle(env, a, force);
        if (r === "generated") g++; else if (r === "unchanged") u++; else s++;
        det.push({ url, result: r });
      } catch (err) { e++; det.push({ url, result: "error" }); }
    }
    await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify({ state: "completed", trigger: trig, startedAt: st, finishedAt: new Date().toISOString(), generated: g, unchanged: u, skipped: s, errors: e, details: det }));
  } catch (err) {
    await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify({ state: "error", trigger: trig, startedAt: st, message: String(err) }));
  }
}

// ─── Helpers (sitemap, extraction, etc.) ───
async function getSitemapArticleUrls(siteOrigin: string): Promise<string[]> {
  const origin = normalizeOrigin(siteOrigin); const visited = new Set<string>(); const urls = new Set<string>(); const queue = [`${origin}/sitemap.xml`];
  for (let r = 0; queue.length && r < MAX_SITEMAP_FILES; r++) {
    const su = queue.shift()!; if (visited.has(su)) continue; visited.add(su);
    let res: Response; try { res = await fetch(su, { headers: { "User-Agent": "SVI/1.0" } }); } catch { continue; }
    if (!res.ok) continue; const xml = (await res.text()).slice(0, 2000000);
    for (const loc of [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => decodeXml(m[1].trim()))) {
      let p: URL; try { p = new URL(loc); } catch { continue; }
      if (!isAllowedSiteUrl(p, origin)) continue;
      if (/\.xml(?:\.gz)?$/i.test(p.pathname) && /sitemap/i.test(p.pathname)) { if (!visited.has(p.href) && queue.length < MAX_SITEMAP_FILES) queue.push(p.href); }
      else if (isBlogArticlePath(p.pathname)) { p.search = ""; p.hash = ""; urls.add(p.href); }
    }
  }
  return [...urls].sort((a, b) => a.localeCompare(b));
}
function isAllowedSiteUrl(u: URL, o: string): boolean { const c = new URL(o); if (u.protocol !== "https:" && u.protocol !== "http:") return false; return u.hostname.replace(/^www\./, "") === c.hostname.replace(/^www\./, ""); }
function isBlogArticlePath(p: string): boolean { const c = p.replace(/\/+$/, ""); if (!c.startsWith("/blog/") || c === "/blog") return false; if (/^\/blog\/(category|tag|page|author|feed)(\/|$)/i.test(c)) return false; if (/\.(xml|json|jpg|jpeg|png|webp|svg|pdf)$/i.test(c)) return false; return c.split("/").filter(Boolean).length >= 2; }
function decodeXml(v: string): string { return v.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'"); }
function slugFromUrl(u: string): string { const p = new URL(u).pathname.split("/").filter(Boolean); return p[p.length - 1] || ""; }
async function extractArticle(url: string): Promise<ArticleSnapshot | null> {
  const res = await fetch(url, { headers: { "User-Agent": "SVI/1.0", "Accept": "text/html" } });
  if (!res.ok) return null; const html = (await res.text()).slice(0, MAX_PAGE_CHARS);
  if (!/<html[\s>]/i.test(html)) return null;
  const ah = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] || html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const title = extractMeta(html, "property", "og:title") || extractTagText(html, "h1") || extractTagText(html, "title");
  const desc = extractMeta(html, "name", "description") || extractMeta(html, "property", "og:description");
  if (!title) return null;
  const clean = ah.replace(/<(script|style|noscript|svg|nav|footer|header|aside)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const headings = [...clean.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m, i) => ({ text: cleanText(m[1]).slice(0, 180), index: i })).filter((h) => h.text.length > 3);
  const paras = [...clean.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => cleanText(m[1])).filter((t) => t.length > 45).slice(0, 60);
  const sample = paras.slice(0, 5).join(" ").slice(0, 1200);
  const excerpt = paras.slice(0, 4).join(" ").slice(0, 1800) || cleanText(clean).slice(0, 1800);
  const sig = paras.join(" ").slice(0, 14000);
  const slug = slugFromUrl(url);
  const fp = await sha256([url, title, desc, headings.map((h) => h.text).join("|"), sig].join("\n"));
  return { url, slug, title: title.slice(0, 180), description: (desc || excerpt).slice(0, 500), headings, excerpt, contentSample: sample, fingerprint: fp };
}
function extractMeta(h: string, a: string, n: string): string { const e = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); const rA = new RegExp(`<meta\\b(?=[^>]*\\b${a}=["']${e}["'])(?=[^>]*\\bcontent=["']([^"']*)["'])[^>]*>`, "i"); const rB = new RegExp(`<meta\\b(?=[^>]*\\bcontent=["']([^"']*)["'])(?=[^>]*\\b${a}=["']${e}["'])[^>]*>`, "i"); const m = h.match(rA) || h.match(rB); return m ? cleanText(m[1]) : ""; }
function extractTagText(h: string, t: string): string { const m = h.match(new RegExp(`<${t}\\b[^>]*>([\\s\\S]*?)<\\/${t}>`, "i")); return m ? cleanText(m[1]) : ""; }
function cleanText(v: string): string { return decodeEntities(v.replace(/<[^>]+>/g, " ").replace(/<!--[\s\S]*?-->/g, " ")).replace(/[\u200b\u200c\u200d]/g, " ").replace(/\s+/g, " ").trim(); }
function decodeEntities(v: string): string { return v.replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#(\d+);/g, (_m, c) => String.fromCodePoint(Math.min(0x10ffff, Number(c)))).replace(/&#x([\da-f]+);/gi, (_m, c) => String.fromCodePoint(Math.min(0x10ffff, parseInt(c, 16)))); }
async function sha256(input: string): Promise<string> { const d = new TextEncoder().encode(input); const h = await crypto.subtle.digest("SHA-256", d); return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
function chooseInlineHeadings(headings: ArticleSnapshot["headings"], maxInline: number): Array<{ text: string; index: number }> {
  if (headings.length < 2 || maxInline < 1) return [];
  const desired = headings.length >= 5 ? Math.min(2, maxInline) : 1;
  const chosen: Array<{ text: string; index: number }> = [];
  for (let n = 1; n <= desired; n++) { const t = Math.round((n * (headings.length - 1)) / (desired + 1)); const item = headings[t]; if (item && !chosen.some((c) => c.index === item.index)) chosen.push(item); }
  return chosen;
}