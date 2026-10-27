const WORKER_URL = (process.env.NEXT_PUBLIC_SVI_WORKER_URL || "").replace(/\/+$/, "");

export async function getArticleManifest(slug: string) {
  if (!WORKER_URL) return null;
  try {
    const res = await fetch(`${WORKER_URL}/manifest?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
