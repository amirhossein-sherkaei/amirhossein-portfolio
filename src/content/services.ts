export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  features: string[];
  deliverables: string;
  timeline: string;
  tags: string[];
  icon: string;
};

export const services: Service[] = [
  {
    slug: "web-design",
    title: "طراحی و توسعه وب‌سایت اختصاصی",
    shortTitle: "وب‌سایت اختصاصی",
    description: "وب‌سایت اختصاصی برای برندهایی که به «قالب آماده» راضی نیستن. هر پروژه از صفر طراحی می‌شه — با ساختاری که با کسب‌وکارت هماهنگ باشه و سریع‌تر از رقبا کار کنه.",
    features: [
      "طراحی رابط کاربری اختصاصی، بدون قالب آماده",
      "پیاده‌سازی با Next.js و React برای سرعت و مقیاس‌پذیری",
      "بهینه برای موبایل، تبلت و دسکتاپ",
      "سرعت لود زیر ۲ ثانیه، حتی روی اینترنت متوسط",
    ],
    deliverables: "وب‌سایت کامل + کد منبع",
    timeline: "۲ تا ۴ هفته",
    tags: ["UI / UX", "Next.js", "Responsive"],
    icon: "web",
  },
  {
    slug: "ai-website",
    title: "طراحی وب‌سایت با کمک هوش مصنوعی",
    shortTitle: "وب + هوش مصنوعی",
    description: "ترکیب طراحی اختصاصی با ابزارهای هوش مصنوعی، تا در زمان کمتر، ایده‌های متفاوت‌تری به واقعیت تبدیل بشن. از تولید محتوا و تصویر تا سرعت بیشتر در اجرا.",
    features: [
      "تولید ایده، ساختار و محتوای اختصاصی",
      "تصاویر و المان‌های بصری یکتا، نه عکس‌های استوک",
      "سرعت بالاتر در فرآیند طراحی، بدون کاهش کیفیت",
    ],
    deliverables: "وب‌سایت کامل + محتوای اختصاصی",
    timeline: "۱ تا ۳ هفته",
    tags: ["AI", "Creative", "Web"],
    icon: "ai",
  },
  {
    slug: "ai-banner",
    title: "طراحی بنر و تصاویر تبلیغاتی با هوش مصنوعی",
    shortTitle: "تبلیغات هوشمند",
    description: "بنرها و تصاویر تبلیغاتی که توی فید شبکه‌های اجتماعی متوقف می‌کنن. تصاویر اختصاصی، هماهنگ با هویت برند، و آماده برای هر پلتفرم.",
    features: [
      "تصاویر یکتا و اختصاصی برای برند، بدون عکس‌های استوک",
      "هماهنگ با هویت بصری و پالت رنگی برند",
      "نسخه‌های متعدد برای اینستاگرام، تلگرام و کمپین",
    ],
    deliverables: "مجموعه تصاویر + نسخه‌های مختلف",
    timeline: "۳ تا ۷ روز",
    tags: ["AI Art", "Banner", "Advertising"],
    icon: "banner",
  },
  {
    slug: "ai-video",
    title: "ساخت ویدیوهای تبلیغاتی با هوش مصنوعی",
    shortTitle: "ویدیوی تبلیغاتی",
    description: "ویدیوی تبلیغاتی با کیفیت سینمایی، بدون تیم فیلم‌برداری و بودجه‌ی سنگین. برای معرفی محصول، برند یا کمپین — از ایده تا اجرا.",
    features: [
      "روایت سینمایی و صداگذاری اختصاصی",
      "مناسب اینستاگرام، تلویزیون و کمپین",
      "بدون نیاز به تیم فیلم‌برداری و تجهیزات سنگین",
    ],
    deliverables: "ویدیوی نهایی + نسخه‌های سایز",
    timeline: "۱ تا ۲ هفته",
    tags: ["AI Video", "Cinematic", "Creative"],
    icon: "video",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs() {
  return services.map((s) => s.slug);
}