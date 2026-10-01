/* ═══════════════════════════════════════════════════════════════
   Schema.org Structured Data
   Single source of truth — FAQ data lives here once
   ═══════════════════════════════════════════════════════════════ */

import { projects } from "@/content/projects";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shorakaei.ir";

const PERSON_NAME = "امیرحسین شرکائی";
const PERSON_NAME_EN = "Amirhossein Shorakaei";

/* ─────────────────────────────────────────────────────────────
   1. PERSON
   ───────────────────────────────────────────────────────────── */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON_NAME,
  alternateName: PERSON_NAME_EN,
  url: SITE_URL,
  image: `${SITE_URL}/icon.webp`,
  jobTitle: "Frontend Developer & UI/UX Designer",
  description:
    "طراح و توسعه‌دهنده وب با تخصص در ساخت وب‌سایت‌های اختصاصی و خلاقیت دیجیتال با کمک هوش مصنوعی.",
  knowsAbout: [
    "Web Design",
    "Web Development",
    "Frontend Development",
    "UI/UX Design",
    "Artificial Intelligence",
    "Next.js",
    "React",
    "TypeScript",
  ],
};

/* ─────────────────────────────────────────────────────────────
   2. WEBSITE
   ───────────────────────────────────────────────────────────── */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: PERSON_NAME,
  alternateName: PERSON_NAME_EN,
  description:
    "پورتفولیوی امیرحسین شرکائی — طراحی و توسعه وب‌سایت‌های اختصاصی، UI/UX و خلاقیت دیجیتال.",
  inLanguage: "fa-IR",
};

/* ─────────────────────────────────────────────────────────────
   3. SERVICE
   ───────────────────────────────────────────────────────────── */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: PERSON_NAME_EN,
  url: SITE_URL,
  image: `${SITE_URL}/icon.webp`,
  description:
    "طراحی و توسعه وب‌سایت‌های اختصاصی، رابط کاربری، تجربه کاربری و خلاقیت دیجیتال.",
  areaServed: "Iran",
};

/* ─────────────────────────────────────────────────────────────
   4. BREADCRUMB
   ───────────────────────────────────────────────────────────── */
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "نمونه‌کارها",
      item: `${SITE_URL}#portfolio`,
    },
  ],
};

/* ─────────────────────────────────────────────────────────────
   5. PROJECTS
   ───────────────────────────────────────────────────────────── */
export function getProjectSchemas() {
  return projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: {
      "@type": "Person",
      name: PERSON_NAME,
    },
    keywords: project.tags.join(", "),
    genre: project.category,
  }));
}

/* ─────────────────────────────────────────────────────────────
   6. BLOG POST
   ───────────────────────────────────────────────────────────── */
export function getBlogPostSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}/icon.webp`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: PERSON_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: PERSON_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.webp`,
      },
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "fa-IR",
  };
}

/* ─────────────────────────────────────────────────────────────
   7. BLOG (Index Page)
   ───────────────────────────────────────────────────────────── */
export function getBlogIndexSchema(
  posts: Array<{
    slug: string;
    title: string;
    date: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "بلاگ امیرحسین شرکائی",
    description:
      "مقالات درباره‌ی طراحی وب، افزایش فروش، سئو و تجربه‌ی کاربری",
    url: `${SITE_URL}/blog`,
    inLanguage: "fa-IR",
    author: {
      "@type": "Person",
      name: PERSON_NAME,
      url: SITE_URL,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  };
}

/* ═════════════════════════════════════════════════════════════
   8. FAQ — Single source of truth
   ═════════════════════════════════════════════════════════════ */
export const faqItems = [
  {
    q: "طراحی سایت چقدر طول می‌کشه؟",
    a: "بستگی به نوع پروژه داره. لندینگ تک‌صفحه‌ای ۳ تا ۷ روز، سایت شرکتی ۲ تا ۴ هفته، و فروشگاه آنلاین ۴ تا ۸ هفته. زمان دقیق رو قبل از شروع، در قرارداد می‌نویسم.",
  },
  {
    q: "هزینه‌ی طراحی سایت چقدره؟",
    a: "لندینگ از ۸ میلیون تومان، سایت شرکتی از ۱۵ میلیون، و فروشگاه آنلاین از ۳۰ میلیون شروع می‌شه. قیمت نهایی بعد از بررسی دقیق پروژه مشخص می‌شه — بدون هزینه‌ی پنهان.",
  },
  {
    q: "با چه تکنولوژی‌هایی کار می‌کنی؟",
    a: "Next.js و React برای پروژه‌های حرفه‌ای، و HTML/CSS/JavaScript خالص برای پروژه‌های سبک. تکنولوژی رو بر اساس نیاز پروژه انتخاب می‌کنم، نه بر اساس مد روز.",
  },
  {
    q: "چرا سایت اختصاصی بهتر از قالب آماده‌ست؟",
    a: "قالب آماده یعنی سایتت شبیه صدها سایت دیگه‌ست. سایت اختصاصی سریع‌تره، امن‌تره، با سئو بهتر و بدون محدودیت در طراحی. و مهم‌تر: کد کامل مال خودته.",
  },
  {
    q: "بعد از تحویل، پشتیبانی چطوره؟",
    a: "همه‌ی پروژه‌ها ۳ ماه پشتیبانی رایگان دارن — شامل رفع باگ، به‌روزرسانی جزئی و پاسخ به سؤالات فنی. بعد از اون، پکیج‌های ماهانه یا سالانه هم موجودن.",
  },
  {
    q: "آیا سئو هم انجام می‌دی؟",
    a: "سئوی فنی از پایه در همه‌ی پروژه‌ها لحاظ می‌شه: ساختار معنایی، Schema.org، سرعت، Sitemap، متا تگ‌ها و موبایل‌فرندلی. برای سئوی محتوایی و لینک‌سازی، با متخصص همکاری می‌کنم.",
  },
  {
    q: "اگه راضی نبودم، چی می‌شه؟",
    a: "قبل از شروع، محدوده‌ی کار، تحویل‌دادنی‌ها و زمان‌بندی در قرارداد نوشته می‌شه. در طول پروژه، دو مرحله بازبینی و اصلاح داری. اگه کار مطابق قرارداد پیش نره، می‌تونی پروژه رو متوقف کنی.",
  },
  {
    q: "چطور می‌تونم پروژه‌ام رو شروع کنم؟",
    a: "فرم صفحه‌ی سفارش رو پر کن. حتی اگر جزئیات کامل نداری، خلاصه‌ای از ایده‌ات بنویس. حداکثر ۲۴ ساعت بعد با تو تماس می‌گیرم.",
  },
  {
    q: "آیا سایت موبایل‌فرندلی می‌سازی؟",
    a: "با رویکرد Mobile-first طراحی می‌کنم. سایت روی هر اندازه‌ای تست می‌شه — از موبایل ۳۶۰ پیکسلی تا مانیتور ۴K. طبق استانداردهای WCAG 2.2.",
  },
  {
    q: "چند تا نمونه‌کار داری؟",
    a: "چندین پروژه‌ی مفهومی و واقعی در پورتفولیوم هست، هر کدوم با دموی زنده و جزئیات کامل. نمونه‌کارهای بیشتر به‌زودی اضافه می‌شن.",
  },
];

/* ─────────────────────────────────────────────────────────────
   9. FAQ SCHEMA — Derived from faqItems
   ───────────────────────────────────────────────────────────── */
export function getFaqSchema() {
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

/* ─────────────────────────────────────────────────────────────
   Bundle
   ───────────────────────────────────────────────────────────── */
export const allSchemas = [
  personSchema,
  websiteSchema,
  serviceSchema,
  breadcrumbSchema,
  ...getProjectSchemas(),
];