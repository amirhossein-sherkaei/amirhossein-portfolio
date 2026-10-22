export const allSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "امیرحسین شرکائی",
    alternateName: "Amirhossein Shorakaei",
    url: "https://shorakaei.ir",
    image: "https://shorakaei.ir/icon.webp",
    jobTitle: "طراح و توسعه‌دهنده وب",
    worksFor: {
      "@type": "Organization",
      name: "Amirhossein Shorakaei Studio",
    },
    sameAs: [
      "https://rubika.ir/@Amirhosein2076",
      "https://eitaa.com/@AmirHosseinsherakaei",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "امیرحسین شرکائی",
    url: "https://shorakaei.ir",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://shorakaei.ir/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
];

export function getBlogPostSchema(post: { title: string; excerpt: string; date: string; slug: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
      url: "https://shorakaei.ir",
    },
    image: post.image || "https://shorakaei.ir/icon.webp",
    url: `https://shorakaei.ir/blog/${post.slug}`,
  };
}

export function getProjectSchema(project: { title: string; description: string; slug: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
    },
    image: project.image || "https://shorakaei.ir/icon.webp",
    url: `https://shorakaei.ir/work/${project.slug}`,
  };
}