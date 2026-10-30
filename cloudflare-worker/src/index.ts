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
  kind: "cover" | "inline"; key: string; alt: string;
  heading?: string; headingIndex?: number; caption?: string;
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
const MAX_PAGE_CHARS = 180_000;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      if (url.pathname === "/health") return json({ ok: true }, 200, cors);
      if (url.pathname === "/manifest") {
        const slug = safeSlug(url.searchParams.get("slug") || "");
        const m = await getManifest(env, slug);
        return m ? json(withAssetUrls(m, url.origin), 200, cors) : json({ error: "Not found" }, 404, cors);
      }
      if (url.pathname === "/index") {
        const index = await getIndex(env);
        return json({ 
          version: 1, 
          items: index.map((i: any) => ({ 
            ...i, 
            cover: `${url.origin}/assets?key=${encodeURIComponent(i.coverKey)}&v=${Date.now()}` 
          })) 
        }, 200, cors);
      }
      if (url.pathname === "/assets") {
        const key = url.searchParams.get("key") || "";
        const buf = await env.VISUAL_ASSETS.get(key, "arrayBuffer");
        return buf ? new Response(buf, { headers: { ...cors, "Content-Type": "image/jpeg" } }) : new Response("Not found", { status: 404, headers: cors });
      }
      if (url.pathname === "/admin/status") {
        if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401, cors);
        const s = await env.VISUAL_ASSETS.get(`${STATE_PREFIX}last-job.json`, "json");
        return json(s || { state: "idle" }, 200, cors);
      }
      if (url.pathname === "/admin/run") {
        if (!isAdmin(request, env)) return json({ error: "Unauthorized" }, 401, cors);
        const body = await request.json().catch(() => ({})) as any;
        const limit = clampInt(body.limit ?? 1, 1, 3);
        const force = body.force === true;
        const slugs = Array.isArray(body.slugs) ? body.slugs.map(safeSlug).filter(Boolean) : [];
        const job = { state: "queued", startedAt: new Date().toISOString(), limit, force, slugs };
        await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify(job));
        ctx.waitUntil(runSweep(env, limit, force, "manual", slugs));
        return json({ ok: true, ...job }, 202, cors);
      }
      return json({ error: "Not found" }, 404, cors);
    } catch (error) { return json({ error: String(error) }, 500, cors); }
  }
};

function isAdmin(req: Request, env: Env) { return (req.headers.get("Authorization") || "").replace("Bearer ", "") === (env.ADMIN_SECRET || ""); }
function corsHeaders(req: Request, env: Env) { return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }; }
function json(d: any, s = 200, h: any = {}) { return new Response(JSON.stringify(d), { status: s, headers: { ...h, "Content-Type": "application/json" } }); }
function clampInt(v: any, a: number, b: number) { return Math.max(a, Math.min(b, Number(v) || 1)); }
function safeSlug(v: string) { return v.trim().replace(/[^a-zA-Z0-9-_]/g, ""); }
function withAssetUrls(m: ArticleManifest, o: string) { const v = new Date(m.generatedAt).getTime(); return { ...m, images: m.images.map(i => ({ ...i, src: `${o}/assets?key=${encodeURIComponent(i.key)}&v=${v}` })) }; }
async function getIndex(env: Env) { return (await env.VISUAL_ASSETS.get(INDEX_KEY, "json") as any)?.items || []; }
async function getManifest(env: Env, slug: string) { return await env.VISUAL_ASSETS.get(`${MANIFEST_PREFIX}${slug}.json`, "json") as ArticleManifest; }
async function saveManifest(env: Env, m: ArticleManifest) {
  await env.VISUAL_ASSETS.put(`${MANIFEST_PREFIX}${m.slug}.json`, JSON.stringify(m));
  const items = (await getIndex(env)).filter((i: any) => i.slug !== m.slug);
  const c = m.images.find(i => i.kind === "cover");
  if (c) items.push({ slug: m.slug, title: m.title, coverKey: c.key, alt: c.alt, canonicalUrl: m.canonicalUrl, generatedAt: m.generatedAt });
  await env.VISUAL_ASSETS.put(INDEX_KEY, JSON.stringify({ items: items.sort((a: any, b: any) => a.title.localeCompare(b.title)) }));
}

async function extractArticle(url: string): Promise<ArticleSnapshot | null> {
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Accept": "text/html" } });
  } catch (e) { throw new Error(`Fetch failed: ${e}`); }
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const html = await res.text();
  const title = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "") || "";
  if (!title) return null;
  const desc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
  const slug = url.split("/").pop() || "";
  const clean = html.replace(/<(script|style|nav|footer|header|aside)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const headings = [...clean.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m, i) => ({ text: m[1].replace(/<[^>]+>/g, "").trim(), index: i })).filter(h => h.text.length > 3);
  const paras = [...clean.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, "").trim()).filter(t => t.length > 45);
  const sample = paras.slice(0, 5).join(" ").slice(0, 1200);
  const fp = await sha256([url, title, desc, headings.map(h => h.text).join("|"), paras.join(" ").slice(0, 14000)].join("\n"));
  return { url, slug, title: title.trim(), description: desc.trim(), headings, excerpt: sample, contentSample: sample, fingerprint: fp };
}
async function sha256(i: string) { const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(i)); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join(""); }

async function generateConcept(env: Env, article: ArticleSnapshot, section?: string) {
  const model = env.CONCEPT_MODEL || DEFAULT_CONCEPT_MODEL;
  try {
    const res = await env.AI.run(model, { messages: [{ role: "system", content: "You are an art director. Output ONLY 1-2 sentences describing a concrete physical scene (no text, no abstract shapes)." }, { role: "user", content: `Title: ${article.title}\nDesc: ${article.description}\nSection: ${section || "cover"}\nCreate the scene:` }], max_tokens: 100 });
    return (res as any).response || "A modern editorial scene.";
  } catch { return "A modern editorial scene."; }
}

async function generateImage(env: Env, prompt: string) {
  const model = env.IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
  let res;
  try {
    res = await env.AI.run(model, { prompt, steps: 4 });
  } catch (e) { throw new Error(`AI run failed: ${e}`); }
  const b64 = (res as any).image;
  if (!b64) throw new Error("AI returned no image data.");
  const raw = atob(b64); const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  if (bytes.length < 1000) throw new Error("Image too small.");
  return bytes;
}

async function runSweep(env: Env, limit: number, force: boolean, trigger: string, slugs?: string[]) {
  const st = new Date().toISOString();
  let g = 0, u = 0, s = 0, e = 0;
  const details: any[] = [];
  try {
    const sitemapRes = await fetch(`${env.SITE_ORIGIN}/sitemap.xml`);
    const xml = await sitemapRes.text();
    const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m => m[1].trim()).filter(u => u.includes("/blog/") && u !== `${env.SITE_ORIGIN}/blog`);
    let selected: string[];
    if (slugs && slugs.length) {
      selected = urls.filter(u => slugs.includes(u.split("/").pop() || ""));
    } else {
      const cursorState = await env.VISUAL_ASSETS.get(`${STATE_PREFIX}cursor.json`, "json") as { cursor?: number } | null;
      const cursor = (cursorState?.cursor || 0) % urls.length;
      selected = [];
      for (let i = 0; i < Math.min(limit, urls.length); i++) {
        selected.push(urls[(cursor + i) % urls.length]);
      }
      await env.VISUAL_ASSETS.put(`${STATE_PREFIX}cursor.json`, JSON.stringify({ 
        cursor: (cursor + limit) % urls.length,
        updatedAt: new Date().toISOString()
      }));
    }
    if (!selected.length) throw new Error("No matching URLs in sitemap.");
    for (const url of selected) {
      try {
        const a = await extractArticle(url);
        if (!a) { s++; details.push({ url, result: "skipped" }); continue; }
        const existing = await getManifest(env, a.slug);
        if (!force && existing?.fingerprint === a.fingerprint) { u++; details.push({ url, result: "unchanged" }); continue; }
        const imgs: VisualAsset[] = [];
        const cc = await generateConcept(env, a);
        const ver = Date.now();
        const ck = `images/${a.slug}/${ver}/cover.jpg`;
        const cb = await generateImage(env, `${cc}. Premium 3D editorial, deep teal #0d7377, burgundy #8b3a4a, ivory background, 16:9.`);
        await env.VISUAL_ASSETS.put(ck, cb);
        imgs.push({ kind: "cover", key: ck, alt: a.title });
        for (const h of a.headings.slice(0, 1)) {
          const ic = await generateConcept(env, a, h.text);
          const ik = `images/${a.slug}/${ver}/inline-1.jpg`;
          const ib = await generateImage(env, `${ic}. Premium 3D editorial, deep teal #0d7377, burgundy #8b3a4a.`);
          await env.VISUAL_ASSETS.put(ik, ib);
          imgs.push({ kind: "inline", key: ik, alt: h.text, heading: h.text, headingIndex: h.index });
        }
        await saveManifest(env, { version: 1, slug: a.slug, canonicalUrl: a.url, title: a.title, description: a.description, fingerprint: a.fingerprint, generatedAt: new Date().toISOString(), images: imgs, concept: cc });
        g++;
        details.push({ url, result: "generated" });
      } catch (err) { e++; details.push({ url, result: "error", message: err instanceof Error ? err.message : String(err) }); }
    }
    await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify({ state: "completed", trigger, startedAt: st, finishedAt: new Date().toISOString(), generated: g, unchanged: u, skipped: s, errors: e, details }));
  } catch (err) {
    await env.VISUAL_ASSETS.put(`${STATE_PREFIX}last-job.json`, JSON.stringify({ state: "error", message: err instanceof Error ? err.message : String(err) }));
  }
}