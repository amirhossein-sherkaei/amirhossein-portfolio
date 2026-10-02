import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

/* ═══════════════════════════════════════════════════════════
   BLOG PREV NEXT — ناوبری بین مقالات
   ═══════════════════════════════════════════════════════════ */

type Props = {
  currentSlug: string;
};

export default function BlogPrevNext({ currentSlug }: Props) {
  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === currentSlug);

  if (idx === -1) return null;

  const older = all[idx + 1] ?? null;
  const newer = all[idx - 1] ?? null;

  if (!older && !newer) return null;

  return (
    <nav className="blog-prevnext" aria-label="ناوبری بین مقالات">
      {newer ? (
        <Link
          href={`/blog/${newer.slug}`}
          className="blog-prevnext-card blog-prevnext-card--next"
        >
          <span className="blog-prevnext-label">
            <span aria-hidden="true">←</span> مقاله‌ی جدیدتر
          </span>
          <span className="blog-prevnext-title">{newer.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {older ? (
        <Link
          href={`/blog/${older.slug}`}
          className="blog-prevnext-card blog-prevnext-card--prev"
        >
          <span className="blog-prevnext-label">
            مقاله‌ی قدیمی‌تر <span aria-hidden="true">→</span>
          </span>
          <span className="blog-prevnext-title">{older.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}