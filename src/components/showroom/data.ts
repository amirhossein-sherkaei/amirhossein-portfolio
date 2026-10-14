/* ═══════════════════════════════════════════════════════════
   SHOWROOM — Project Data
   ═══════════════════════════════════════════════════════════ */

export type ShowroomProjectId = "arka" | "nila" | "vira" | "lumen";

export type ShowroomProject = {
  id: ShowroomProjectId;
  title: string;
  latinTitle: string;
  category: string;
  tagline: string;
  description: string;
  liveUrl: string;
  coverImage: string;
  accentColor: string;
  accentSoft: string;
  accentGradient: string;
  demoLabel: string;
  resetLabel: string;
};

export const showroomProjects: ShowroomProject[] = [
  {
    id: "arka",
    title: "آرکا",
    latinTitle: "Arka",
    category: "پلتفرم SaaS",
    tagline: "محصول دیجیتال",
    description:
      "صفحه‌ی فرودی که ارزش محصول را در ۳ ثانیه منتقل می‌کند. یک تور تعاملی از رابط کاربری واقعی محصول.",
    liveUrl: "/projects/arka.html",
    coverImage: "/projects/arka.webp",
    accentColor: "#2563eb",
    accentSoft: "rgba(37, 99, 235, 0.12)",
    accentGradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    demoLabel: "شروع تور محصول",
    resetLabel: "شروع مجدد تور",
  },
  {
    id: "nila",
    title: "نیلا",
    latinTitle: "Nila",
    category: "فروشگاه آنلاین",
    tagline: "تجربه‌ی خرید",
    description:
      "مسیر خرید پوشاک را بدون خروج از سایت امتحان کن. محصول را انتخاب کن، به سبد اضافه کن، و drawer خرید را ببین.",
    liveUrl: "/projects/nila.html",
    coverImage: "/projects/nila.webp",
    accentColor: "#8b3a4a",
    accentSoft: "rgba(139, 58, 74, 0.12)",
    accentGradient: "linear-gradient(135deg, #8b3a4a 0%, #4d1f29 100%)",
    demoLabel: "شروع تجربه‌ی خرید",
    resetLabel: "بازنشانی دمو",
  },
  {
    id: "vira",
    title: "ویرا",
    latinTitle: "Vira",
    category: "هویت بصری AI",
    tagline: "سیستم هویت بصری",
    description:
      "پالت رنگی، تایپوگرافی، و واریاسیون‌های لوگو — همه را همان‌جا تغییر بده و تأثیرش را ببین.",
    liveUrl: "/projects/vira.html",
    coverImage: "/projects/vira.webp",
    accentColor: "#b537f2",
    accentSoft: "rgba(181, 55, 242, 0.12)",
    accentGradient: "linear-gradient(135deg, #ff4d6d 0%, #b537f2 100%)",
    demoLabel: "شروع آزمایش پالت",
    resetLabel: "بازنشانی رنگ‌ها",
  },
  {
    id: "lumen",
    title: "لومن",
    latinTitle: "Lumen",
    category: "کمپین سینمایی",
    tagline: "روایت تصویری",
    description:
      "استوری‌بورد و خط زمانی کمپین — هر فریم، یک جمله. ساختار روایت را با حرکت میان قاب‌ها کشف کن.",
    liveUrl: "/projects/lumen.html",
    coverImage: "/projects/lumen.webp",
    accentColor: "#ff5a3a",
    accentSoft: "rgba(255, 90, 58, 0.12)",
    accentGradient: "linear-gradient(135deg, #ff5a3a 0%, #ff2d55 100%)",
    demoLabel: "شروع مرور فریم‌ها",
    resetLabel: "بازنشانی فریم‌ها",
  },
];