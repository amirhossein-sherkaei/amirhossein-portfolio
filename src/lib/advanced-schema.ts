import { BlogPost } from "./blog"; // Assuming this type exists

export const getArticleSchema = (post: BlogPost) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage ? `https://shorakaei.ir${post.coverImage}` : "https://shorakaei.ir/icon.webp",
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

export const getCreativeWorkSchema = (project: any) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.title,
  description: project.description,
  image: project.coverImage ? `https://shorakaei.ir${project.coverImage}` : undefined,
  creator: {
    "@type": "Person",
    name: "امیرحسین شرکائی",
  },
  dateCreated: project.year ? `${project.year}-01-01` : undefined,
  url: `https://shorakaei.ir/work/${project.slug}`,
});
