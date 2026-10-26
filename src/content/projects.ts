export type ProjectStatus =
  | "پروژه مفهومی"
  | "پروژه شخصی"
  | "مطالعه موردی"
  | "آماده همکاری";

export type ProjectVisual =
  | "preview-web"
  | "preview-shop"
  | "preview-ai"
  | "preview-video"
  | "preview-mobile"
  | "preview-editorial";

export type ProjectCaseStudy = {
  overview: string;
  challenge: string;
  approach: string[];
  highlights: string[];
  metrics?: Array<{ label: string; value: string }>;
  learnings?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  latinTitle: string;
  category: string;
  description: string;
  fullDescription: string;
  tags: string[];
  coverImage?: string;
  images?: string[];
  technologies?: string[];
  projectUrl?: string;
  demoUrl?: string;
  liveDemoUrl?: string;
  status?: ProjectStatus;
  year?: string;
  role?: string;
  client?: string;
  duration?: string;
  caseStudy?: ProjectCaseStudy;
};

/* سال شمسی جاری */
const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

/* ═══════════════════════════════════════════════════════════
   PROJECTS
   ═══════════════════════════════════════════════════════════ */
export const projects: Project[] = [
  {
    id: "project-01",
    slug: "arka",
    title: "آرکا",
    latinTitle: "Arka",
    category: "پلتفرم SaaS",
    description:
      "صفحه فرودی که ارزش محصول را در ۳ ثانیه منتقل می‌کند — بدون متن‌های طولانی، بدون اصطلاحات فنی، بدون سردرگمی.",
    fullDescription:
      "آرکا یک پلتفرم SaaS ایرانی است که با هدف ساخت صفحه‌ی فرودی طراحی شد که بدون متن‌های طولانی، ارزش محصول را در چند ثانیه منتقل کند. چالش اصلی، ساده‌سازی یک محصول پیچیده به زبانی بود که هر بازدیدکننده در ۳ ثانیه بفهمد.",
    tags: ["SaaS", "Web Design", "Corporate"],
    coverImage: "/projects/arka.webp",
    liveDemoUrl: "/projects/arka.html",
    year: CURRENT_PERSIAN_YEAR,
    status: "پروژه مفهومی",
    role: "طراح و توسعه‌دهنده",
    client: "پروژه‌ی شخصی",
    duration: "۲ هفته",
    technologies: ["HTML", "CSS", "JavaScript"],

    caseStudy: {
      overview:
        "آرکا یک پروژه‌ی مفهومی در حوزه‌ی SaaS است که با هدف کاوش در صفحات فرود مدرن طراحی شد. تمرکز اصلی: ساختن صفحه‌ای که بدون متن‌های طولانی، ارزش محصول را در چند ثانیه منتقل کند.",
      challenge:
        "اکثر سایت‌های SaaS ایرانی با متن‌های طولانی و اصطلاحات فنی، کاربر را در همان ثانیه‌های اول گیج می‌کنند. سؤال اصلی طراحی این بود: چطور می‌شود در کمتر از ۳ ثانیه، کاربر بفهمد محصول چیست، برای چه کسی است، و چه ارزشی می‌سازد؟",
      approach: [
        "تحلیل ۲۰ سایت موفق SaaS ایرانی و خارجی برای شناسایی الگوهای مشترک",
        "طراحی معماری اطلاعات با تمرکز بر سلسله‌مراتب بصری واضح",
        "ساخت دیزاین سیستم مینیمال با پالت خنثی و یک رنگ تأکیدی",
        "پیاده‌سازی با HTML/CSS/JS خالص برای کنترل کامل روی جزئیات",
        "تست سه نسخه‌ی مختلف از Hero Section تا انتخاب بهترین",
      ],
      highlights: [
        "Hero Section که در ۳ ثانیه پیام اصلی را منتقل می‌کند",
        "داشبورد mockup با داده‌های شبیه‌سازی‌شده",
        "سیستم pricing با toggle ماهانه/سالانه",
        "FAQ accordion و tab system بدون کتابخانه خارجی",
        "دسترسی‌پذیری کامل طبق WCAG 2.2 AA",
      ],
      metrics: [
        { label: "زمان درک پیام اصلی", value: "۳ ثانیه" },
        { label: "تعداد بخش‌های طراحی‌شده", value: "۷ بخش" },
        { label: "زمان پروژه", value: "۲ هفته" },
      ],
      learnings:
        "در طراحی SaaS، «کمتر» همیشه «بیشتر» است. حذف ۴۰٪ از متن‌ها، تجربه‌ی کاربر را به‌طرز محسوسی بهتر کرد.",
    },
  },
  {
    id: "project-02",
    slug: "nila",
    title: "نیلا",
    latinTitle: "Nila",
    category: "فروشگاه آنلاین",
    description:
      "فروشگاه پوشاک با مسیر خرید ۴ مرحله‌ای و سبد خرید drawer — تجربه‌ای روان از دیدن محصول تا پرداخت.",
    fullDescription:
      "نیلا یک فروشگاه آنلاین پوشاک با تمرکز بر تجربه‌ی خرید روان طراحی شد. هدف: کاهش سبدهای رهاشده با ساده‌سازی مسیر خرید و ایجاد اطمینان در هر مرحله.",
    tags: ["E-Commerce", "Fashion", "UI/UX"],
    coverImage: "/projects/nila.webp",
    liveDemoUrl: "/projects/nila.html",
    year: CURRENT_PERSIAN_YEAR,
    status: "پروژه مفهومی",
    role: "طراح و توسعه‌دهنده",
    client: "پروژه‌ی شخصی",
    duration: "۳ هفته",
    technologies: ["HTML", "CSS", "JavaScript"],

    caseStudy: {
      overview:
        "نیلا یک پروژه‌ی مفهومی در حوزه‌ی فروشگاه آنلاین پوشاک است. هدف: طراحی تجربه‌ای که مشتری را نگه دارد — با کاهش اصطکاک در هر مرحله‌ی خرید و ایجاد اطمینان در تصمیم‌گیری.",
      challenge:
        "فروشگاه‌های آنلاین پوشاک معمولاً با مشکل سبد خرید رهاشده مواجهند. علت اصلی، پیچیدگی فرآیند خرید و عدم اطمینان کاربر از تصمیمش است.",
      approach: [
        "طراحی مسیر خرید در ۴ مرحله‌ی واضح: مشاهده، انتخاب، اطلاعات، پرداخت",
        "سبد خرید drawer که در همه‌ی صفحات قابل دسترسی است",
        "Quick View modal برای مشاهده‌ی سریع محصول بدون ترک صفحه",
        "فیلترهای هوشمند محصول با حفظ وضعیت",
        "اولویت‌بندی موبایل به‌عنوان تجربه‌ی اصلی (Mobile-first)",
      ],
      highlights: [
        "سبد خرید تعاملی با افزایش/کاهش تعداد و حذف محصول",
        "Quick View modal با انتخاب سایز",
        "Product filter system با حفظ وضعیت",
        "سیستم Toast برای بازخورد بصری هر اقدام",
        "طراحی احساسی برای ایجاد اعتماد (Badges, Reviews)",
      ],
      metrics: [
        { label: "مراحل خرید", value: "۴ مرحله" },
        { label: "تعداد محصولات نمونه", value: "۸ محصول" },
        { label: "زمان پروژه", value: "۳ هفته" },
      ],
      learnings:
        "طراحی فروشگاه، بیشتر از رابط کاربری، به روانشناسی کاربر مربوط می‌شود. اعتماد و اطمینان، مهم‌تر از زیبایی است.",
    },
  },
  {
    id: "project-03",
    slug: "vira",
    title: "ویرا",
    latinTitle: "Vira",
    category: "هویت بصری AI",
    description:
      "برندبوک کامل یک استودیو — پالت رنگی تعاملی، سیستم تایپوگرافی، ۶ واریاسیون لوگو، و ۴ کاربرد عملی.",
    fullDescription:
      "ویرا یک برندبوک تعاملی برای یک استودیو طراحی شد — با استفاده از هوش مصنوعی به‌عنوان تسریع‌کننده، در زمان کمتر و با کیفیت بالاتر از روش‌های سنتی.",
    tags: ["AI Creative", "Branding", "Visual"],
    coverImage: "/projects/vira.webp",
    liveDemoUrl: "/projects/vira.html",
    year: CURRENT_PERSIAN_YEAR,
    status: "پروژه مفهومی",
    role: "طراح هویت بصری",
    client: "پروژه‌ی شخصی",
    duration: "۳ هفته",
    technologies: ["AI Generation", "Brand Design", "HTML/CSS"],

    caseStudy: {
      overview:
        "ویرا یک پروژه‌ی مستقل هویت بصری است که برای کاوش در مرزهای هوش مصنوعی و برندینگ طراحی شد. هدف: ساختن یک سیستم هویت بصری کامل در زمانی کوتاه، با استفاده از ابزارهای AI به‌عنوان تسریع‌کننده.",
      challenge:
        "استودیوهای کوچک معمولاً نمی‌توانند هزینه و زمان لازم برای ساخت هویت بصری کامل را بپردازند. سؤال طراحی: چطور می‌شود با کمک AI، فرآیند را چند برابر سریع‌تر کرد — بدون کاهش کیفیت؟",
      approach: [
        "طراحی پالت رنگی ۵ مرحله‌ای با تحلیل روانشناسی رنگ",
        "سیستم تایپوگرافی سه‌فونته (Display + Body + Mono) با هماهنگی بصری",
        "تولید ۶ واریاسیون از لوگو برای بسترهای مختلف",
        "طراحی کاربردهای عملی در ۴ حوزه: چاپ، بسته‌بندی، دیجیتال، محیطی",
        "ساخت برندبوک تعاملی با قابلیت کپی رنگ‌ها",
      ],
      highlights: [
        "پالت رنگی تعاملی با copy-to-clipboard",
        "Type scale showcase با ۶ سطح مختلف",
        "۶ واریاسیون لوگو (Primary, Outline, Gradient, Color, Italic, Inverse)",
        "Orbit animation برای نمایش هویت بصری",
        "بخش Applications با ۴ کاربرد عملی",
      ],
      metrics: [
        { label: "تعداد asset", value: "۲۴۰+" },
        { label: "زمان پروژه", value: "۳ هفته" },
        { label: "کاهش هزینه", value: "۶۰٪" },
      ],
      learnings:
        "هوش مصنوعی جایگزین طراح نیست، بلکه ابزاری است که سرعت اجرا را چند برابر می‌کند. اما نظارت انسانی و چشم طراح، همچنان حیاتی است.",
    },
  },
  {
    id: "project-04",
    slug: "lumen",
    title: "لومن",
    latinTitle: "Lumen",
    category: "کمپین سینمایی",
    description:
      "کمپین تبلیغاتی سینمایی با storyboard، timeline تولید، و روایتی که در سکوت پیام را منتقل می‌کند.",
    fullDescription:
      "لومن یک کمپین تبلیغاتی سینمایی بدون دیالوگ است — با استفاده از ابزارهای AI، تجربه‌ای روایی در ۴۸ ثانیه ساخته شد که به‌جای فریاد زدن پیام، آن را در سکوت پنهان می‌کند.",
    tags: ["AI Video", "Campaign", "Cinematic"],
    coverImage: "/projects/lumen.webp",
    liveDemoUrl: "/projects/lumen.html",
    year: CURRENT_PERSIAN_YEAR,
    status: "پروژه مفهومی",
    role: "کارگردان خلاق",
    client: "پروژه‌ی شخصی",
    duration: "۲ هفته",
    technologies: ["AI Video", "Storyboard", "Motion"],

    caseStudy: {
      overview:
        "لومن یک پروژه‌ی مفهومی کمپین سینمایی است که با هدف کاوش در روایت‌های تبلیغاتی متفاوت طراحی شد. چالش: ساختن یک تجربه‌ی روایی بدون دیالوگ، فقط با تصویر، نور و ریتم.",
      challenge:
        "تولید ویدیوی تبلیغاتی سینمایی به‌طور معمول نیاز به تیم بزرگ و بودجه‌ی سنگین دارد. اما با ابزارهای AI، می‌توان این فرآیند را تا ۸۰٪ سریع‌تر کرد — اگر بدانی چطور.",
      approach: [
        "ایده‌پردازی روایی بر اساس ساختار سه‌پرده‌ای (Setup, Confrontation, Resolution)",
        "طراحی استوری‌بورد دقیق با ۶ فریم کلیدی",
        "ساخت صفحه‌ای که خودش مثل یک فیلم روایت می‌شود",
        "استفاده از film grain و vignette برای حس سینمایی",
        "طراحی timeline تولید در ۴ مرحله‌ی شفاف",
      ],
      highlights: [
        "روایت سینمایی با ساختار سه‌پرده‌ای کلاسیک",
        "۶ storyboard frame با طراحی اختصاصی",
        "Timeline تولید شفاف در ۴ مرحله",
        "Video stage با play animation",
        "Film grain overlay برای حس سینمایی واقعی",
      ],
      metrics: [
        { label: "مدت کمپین", value: "۴۸ ثانیه" },
        { label: "زمان تولید", value: "۲ هفته" },
        { label: "کاهش هزینه", value: "۸۰٪" },
      ],
      learnings:
        "در تولید محتوای ویدیویی، «ایده» همچنان مهم‌ترین عنصر است. ابزارها فقط اجرا را سریع‌تر می‌کنند، نه بهتر.",
    },
  },
];

/* ── Helpers ── */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}