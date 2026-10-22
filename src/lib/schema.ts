export const allSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://shorakaei.ir/#person",
    name: "امیرحسین شرکائی",
    alternateName: "Amirhossein Shorakaei",
    url: "https://shorakaei.ir",
    image: "https://shorakaei.ir/icon.webp",
    jobTitle: "طراح و توسعه‌دهنده وب",
    knowsAbout: ["Web Design", "Next.js", "React", "UI/UX", "Artificial Intelligence", "SEO"],
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
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://shorakaei.ir/#localbusiness",
    name: "امیرحسین شرکائی | طراحی سایت اختصاصی",
    image: "https://shorakaei.ir/icon.webp",
    url: "https://shorakaei.ir",
    telephone: "+989371932549",
    address: {
      "@type": "PostalAddress",
      addressLocality: "تهران",
      addressCountry: "IR",
    },
    areaServed: "تهران",
    description: "طراحی و توسعه وب‌سایت‌های اختصاصی و حرفه‌ای در تهران با استفاده از Next.js و هوش مصنوعی.",
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  },
];

export function getBlogPostSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  dateModified?: string;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    author: {
      "@type": "Person",
      "@id": "https://shorakaei.ir/#person",
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
    image: post.image || "https://shorakaei.ir/icon.webp",
    url: `https://shorakaei.ir/blog/${post.slug}`,
  };
}

export function getProjectSchema(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: {
      "@type": "Person",
      "@id": "https://shorakaei.ir/#person",
      name: "امیرحسین شرکائی",
    },
    image: project.image || "https://shorakaei.ir/icon.webp",
    url: `https://shorakaei.ir/work/${project.slug}`,
  };
}

export const faqItems = [
  {
    q: "آیا امکان سفارش پروژه‌های سفارشی وجود دارد؟",
    a: "بله، تمام پروژه‌ها به صورت کاملاً اختصاصی و مطابق با نیاز و هویت برند شما طراحی و اجرا می‌شوند. هیچ قالب آماده یا از پیش‌ساخته‌ای استفاده نمی‌شود.",
  },
  {
    q: "مدت زمان تحویل پروژه‌ها چقدر است؟",
    a: "بسته به پیچیدگی و دامنه کار، معمولاً بین ۲ تا ۶ هفته زمان می‌برد. زمان‌بندی دقیق پس از مشاوره اولیه و بررسی نیازمندی‌ها اعلام می‌شود.",
  },
  {
    q: "هزینه پروژه‌ها چگونه محاسبه می‌شود؟",
    a: "هزینه بر اساس دامنه کار، پیچیدگی فنی و ویژگی‌های درخواستی محاسبه می‌شود. پس از بررسی اولیه، یک پیش‌فاکتور شفاف و دقیق ارائه می‌شود.",
  },
  {
    q: "آیا پس از تحویل پروژه، پشتیبانی هم ارائه می‌دهید؟",
    a: "بله، تمامی پروژه‌ها شامل یک دوره پشتیبانی رایگان (حداقل ۱ ماهه) هستند. پس از آن نیز می‌توانید بسته‌های پشتیبانی دوره‌ای را انتخاب کنید.",
  },
];

export function getBlogIndexSchema(
  posts: Array<{ slug: string; title: string; date: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "بلاگ امیرحسین شرکائی",
    description: "مقالات امیرحسین شرکائی درباره طراحی وب، توسعه فرانت‌اند، UI/UX و هوش مصنوعی.",
    url: "https://shorakaei.ir/blog",
    publisher: {
      "@type": "Person",
      "@id": "https://shorakaei.ir/#person",
      name: "امیرحسین شرکائی",
      url: "https://shorakaei.ir",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      url: `https://shorakaei.ir/blog/${post.slug}`,
    })),
  };
}

export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}