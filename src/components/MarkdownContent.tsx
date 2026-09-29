import { marked } from "marked";

type Props = {
  content: string;
};

/* ═══════════════════════════════════════════════════════════
   INLINE CTA — auto-injected in the middle of every article
   ────────────────────────────────────────────────────────────
   Appears after roughly 45% of paragraphs have been read.
   Falls back to no CTA for very short articles (< 4 paragraphs).
   ═══════════════════════════════════════════════════════════ */

const INLINE_CTA_HTML = `
<aside class="blog-inline-cta" aria-label="پیشنهاد همکاری">
  <span class="blog-inline-cta-eyebrow" aria-hidden="true">— یه لحظه</span>
  <p class="blog-inline-cta-title">اگه این مقاله به کارت اومد،<br><em>بذار درباره‌ی پروژه‌ت حرف بزنیم.</em></p>
  <div class="blog-inline-cta-actions">
    <a href="/order" class="blog-inline-cta-btn blog-inline-cta-btn--primary">شروع پروژه <span aria-hidden="true">←</span></a>
    <a href="/#portfolio" class="blog-inline-cta-btn">دیدن نمونه‌کارها</a>
  </div>
</aside>
`;

function injectInlineCTA(html: string): string {
  /* Split into paragraphs and re-join with CTA in the middle */
  const closing = "</p>";
  const parts = html.split(closing);

  /* Skip short articles — need enough reading before interrupting */
  if (parts.length < 5) return html;

  const midIndex = Math.floor(parts.length * 0.45);
  const firstHalf = parts.slice(0, midIndex).join(closing) + closing;
  const secondHalf = parts.slice(midIndex).join(closing);

  return firstHalf + INLINE_CTA_HTML + secondHalf;
}

export default function MarkdownContent({ content }: Props) {
  const renderer = new marked.Renderer();

  renderer.heading = function ({ text, depth }) {
    const id = text
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-");
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  const rawHtml = marked.parse(content, { renderer }) as string;
  const html = injectInlineCTA(rawHtml);

  return (
    <div
      className="blog-post-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}