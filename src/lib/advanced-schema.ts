/* ============================================================
   ADVANCED SCHEMA — Structured Data Helpers (2026)
   ============================================================ */

/**
 * Article Schema for blog posts
 * Note: Blog posts are text-only (no cover images)
 */
export const getArticleSchema = (post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  image: "https://shorakaei.ir/icon.webp",
  datePublished: post.date,
  dateModified: post.date,
  author: {
    "@type": "Person",
    name: "امیرحسین شرکائی",
    url: "https://shorakaei.ir",
  },
  publisher: {
    "@type": "Organization",
    name: "امیرحسین شرکائی",
    logo: {
      "@type": "ImageObject",
      url: "https://shorakaei.ir/icon.webp",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://shorakaei.ir/blog/${post.slug}`,
  },
});

/**
 * CreativeWork Schema for portfolio projects
 */
export const getCreativeWorkSchema = (project: {
  title: string;
  description: string;
  slug: string;
  year?: string;
  coverImage?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.title,
  description: project.description,
  image: project.coverImage
    ? `https://shorakaei.ir${project.coverImage}`
    : "https://shorakaei.ir/icon.webp",
  creator: {
    "@type": "Person",
    name: "امیرحسین شرکائی",
  },
  dateCreated: project.year ? `${project.year}-01-01` : undefined,
  url: `https://shorakaei.ir/work/${project.slug}`,
});
