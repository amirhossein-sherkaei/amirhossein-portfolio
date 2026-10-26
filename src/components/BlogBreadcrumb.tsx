import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   BLOG BREADCRUMB — ناوبری مسیر
   ═══════════════════════════════════════════════════════════ */

type Props = {
  title: string;
};

export default function BlogBreadcrumb({ title }: Props) {
  return (
    <nav className="blog-breadcrumb" aria-label="مسیر صفحه">
      <ol className="blog-breadcrumb-list">
        <li className="blog-breadcrumb-item">
          <Link href="/">خانه</Link>
        </li>
        <li className="blog-breadcrumb-sep" aria-hidden="true">/</li>
        <li className="blog-breadcrumb-item">
          <Link href="/blog">بلاگ</Link>
        </li>
        <li className="blog-breadcrumb-sep" aria-hidden="true">/</li>
        <li className="blog-breadcrumb-item" aria-current="page">
          <span>{title}</span>
        </li>
      </ol>
    </nav>
  );
}