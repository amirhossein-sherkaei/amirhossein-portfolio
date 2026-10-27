"use client";

import { useEffect } from "react";

const WORKER_URL = (process.env.NEXT_PUBLIC_SVI_WORKER_URL || "").replace(/\/+$/, "");
const BLOG_ROOT = "/blog";
const STYLE_ID = "svi-auto-article-visuals-styles";
const IMAGE_MARKER = "data-svi-auto-image";

interface ManifestImage {
  kind: "cover" | "inline";
  key: string;
  src: string;
  alt: string;
  heading?: string;
  headingIndex?: number;
  caption?: string;
}

interface ArticleManifest {
  slug: string;
  title: string;
  images: ManifestImage[];
}

function normalize(value: string): string {
  return value.normalize("NFKC").replace(/[\u200b-\u200f\u202a-\u202e]/g, "").replace(/\s+/g, " ").trim().toLocaleLowerCase("fa-IR");
}

function currentSlug(pathname: string): string {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts.length < 2 || parts[0] !== "blog") return "";
  return parts[parts.length - 1];
}

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .svi-auto-figure{display:block;width:100%;margin:clamp(1.5rem,3vw,2.5rem) 0;position:relative;isolation:isolate;}
    .svi-auto-figure img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:clamp(14px,2vw,24px);border:1px solid rgba(13,115,119,.18);box-shadow:0 18px 45px rgba(22,35,38,.10);}
    .svi-auto-figure--cover{margin-block:1.25rem 2.25rem;}
    .svi-auto-figure--cover img{aspect-ratio:16/10;}
    .svi-auto-figure figcaption{margin:.6rem auto 0;max-width:68ch;color:var(--muted, #6b7280);font-size:.82rem;line-height:1.8;text-align:center;}
    [data-theme="dark"] .svi-auto-figure img{border-color:rgba(255,255,255,.12);box-shadow:0 18px 45px rgba(0,0,0,.22);}
  `;
  document.head.appendChild(style);
}

function createFigure(image: ManifestImage, cover = false): HTMLElement {
  const figure = document.createElement("figure");
  figure.className = `svi-auto-figure${cover ? " svi-auto-figure--cover" : ""}`;
  figure.setAttribute(IMAGE_MARKER, image.kind);
  const img = document.createElement("img");
  img.src = image.src;
  img.alt = image.alt || "تصویر مفهومی مرتبط با مقاله";
  img.loading = cover ? "eager" : "lazy";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  img.width = 1200;
  img.height = 750;
  if (cover) img.fetchPriority = "high";
  img.addEventListener("error", () => figure.remove(), { once: true });
  figure.appendChild(img);
  const captionText = image.caption?.trim();
  if (captionText) {
    const caption = document.createElement("figcaption");
    caption.textContent = captionText;
    figure.appendChild(caption);
  }
  return figure;
}

function findArticleRoot(): HTMLElement | null {
  const selectors = ["[data-article-content]", "[data-blog-content]", ".article-content", ".blog-content", "article .prose", "main article", "main .prose", "article"];
  for (const selector of selectors) {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const candidate = candidates.filter((node) => node.querySelector("h1, h2, p") && (node.innerText || "").trim().length > 120).sort((a, b) => (b.innerText || "").length - (a.innerText || "").length)[0];
    if (candidate) return candidate;
  }
  return null;
}

function alreadyHasCover(root: HTMLElement): boolean {
  if (root.querySelector(`[${IMAGE_MARKER}="cover"]`)) return true;
  const firstH2 = root.querySelector("h2");
  const imgs = Array.from(root.querySelectorAll("img, picture, figure"));
  return imgs.some((node) => {
    if (!firstH2) return true;
    return Boolean(node.compareDocumentPosition(firstH2) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
}

function headingForImage(root: HTMLElement, image: ManifestImage): HTMLElement | null {
  const headings = Array.from(root.querySelectorAll<HTMLElement>("h2"));
  const wanted = normalize(image.heading || "");
  if (wanted) {
    const match = headings.find((heading) => {
      const current = normalize(heading.textContent || "");
      return current === wanted || current.includes(wanted) || wanted.includes(current);
    });
    if (match) return match;
  }
  if (typeof image.headingIndex === "number" && headings[image.headingIndex]) return headings[image.headingIndex];
  return null;
}

function nearbyImageExists(heading: HTMLElement): boolean {
  let node: Element | null = heading.nextElementSibling;
  while (node && !/^H[1-6]$/.test(node.tagName)) {
    if (node.matches("img, picture, figure") || node.querySelector("img, picture, figure")) return true;
    node = node.nextElementSibling;
  }
  return false;
}

function placeArticleImages(root: HTMLElement, manifest: ArticleManifest): void {
  injectStyles();
  const cover = manifest.images.find((image) => image.kind === "cover");
  if (cover && !alreadyHasCover(root)) {
    const firstHeading = root.querySelector("h2");
    const figure = createFigure(cover, true);
    if (firstHeading?.parentElement) firstHeading.parentElement.insertBefore(figure, firstHeading);
    else root.prepend(figure);
  }

  for (const image of manifest.images.filter((candidate) => candidate.kind === "inline")) {
    const alreadyInserted = Array.from(root.querySelectorAll<HTMLElement>(`[${IMAGE_MARKER}="inline"]`)).some((node) => node.dataset.sviKey === image.key);
    if (alreadyInserted) continue;
    const heading = headingForImage(root, image);
    if (!heading || nearbyImageExists(heading)) continue;
    const figure = createFigure(image, false);
    figure.setAttribute("data-svi-key", image.key);
    heading.insertAdjacentElement("afterend", figure);
  }
}

export default function AutoArticleVisuals() {
  useEffect(() => {
    if (!WORKER_URL) return;
    let cancelled = false;
    let running = false;
    let lastHandledPath = "";

    const run = async () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      if (cancelled || running || path === lastHandledPath) return;
      
      // 🔥 مهم: فقط در صفحات مقاله اجرا شود، نه در صفحه لیست بلاگ
      const isArticle = path.startsWith(`${BLOG_ROOT}/`);
      if (!isArticle) { 
        lastHandledPath = path; 
        return; 
      }

      if (!findArticleRoot()) return;

      running = true;
      try {
        const slug = currentSlug(path);
        if (!slug) { lastHandledPath = path; return; }
        
        const response = await fetch(`${WORKER_URL}/manifest?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!response.ok) { lastHandledPath = path; return; }
        
        const manifest = await response.json() as ArticleManifest;
        if (cancelled) return;
        const root = findArticleRoot();
        if (root && Array.isArray(manifest.images)) placeArticleImages(root, manifest);
        lastHandledPath = path;
      } catch (error) {
        lastHandledPath = path;
      } finally {
        running = false;
      }
    };

    void run();
    const observer = new MutationObserver(() => {
      const current = window.location.pathname.replace(/\/+$/, "") || "/";
      if (!cancelled && current !== lastHandledPath) void run();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return null;
}
