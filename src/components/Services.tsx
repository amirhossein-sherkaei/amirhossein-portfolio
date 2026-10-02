"use client";


import SectionNumber from "@/components/SectionNumber";
import { useRef, useState } from "react";

type Service = {
  number: string;
  icon: "web" | "ai" | "banner" | "video";
  title: string;
  shortTitle: string;
  description: string;
  features: string[];
  deliverables: string;
  timeline: string;
  tags: string[];
};

const services: Service[] = [
  {
    number: "01",
    icon: "web",
    title: "طراحی و توسعه وب‌سایت اختصاصی",
    shortTitle: "وب‌سایت اختصاصی",
    description:
      "وب‌سایت اختصاصی برای برندهایی که به «قالب آماده» راضی نیستن. هر پروژه از صفر طراحی می‌شه — با ساختاری که با کسب‌وکارت هماهنگ باشه و سریع‌تر از رقبا کار کنه.",
    features: [
      "طراحی رابط کاربری اختصاصی، بدون قالب آماده",
      "پیاده‌سازی با Next.js و React برای سرعت و مقیاس‌پذیری",
      "بهینه برای موبایل، تبلت و دسکتاپ",
      "سرعت لود زیر ۲ ثانیه، حتی روی اینترنت متوسط",
    ],
    deliverables: "وب‌سایت کامل + کد منبع",
    timeline: "۲ تا ۴ هفته",
    tags: ["UI / UX", "Next.js", "Responsive"],
  },
  {
    number: "02",
    icon: "ai",
    title: "طراحی وب‌سایت با کمک هوش مصنوعی",
    shortTitle: "وب + هوش مصنوعی",
    description:
      "ترکیب طراحی اختصاصی با ابزارهای هوش مصنوعی، تا در زمان کمتر، ایده‌های متفاوت‌تری به واقعیت تبدیل بشن. از تولید محتوا و تصویر تا سرعت بیشتر در اجرا.",
    features: [
      "تولید ایده، ساختار و محتوای اختصاصی",
      "تصاویر و المان‌های بصری یکتا، نه عکس‌های استوک",
      "سرعت بالاتر در فرآیند طراحی، بدون کاهش کیفیت",
    ],
    deliverables: "وب‌سایت کامل + محتوای اختصاصی",
    timeline: "۱ تا ۳ هفته",
    tags: ["AI", "Creative", "Web"],
  },
  {
    number: "03",
    icon: "banner",
    title: "طراحی بنر و تصاویر تبلیغاتی با هوش مصنوعی",
    shortTitle: "تبلیغات هوشمند",
    description:
      "بنرها و تصاویر تبلیغاتی که توی فید شبکه‌های اجتماعی متوقف می‌کنن. تصاویر اختصاصی، هماهنگ با هویت برند، و آماده برای هر پلتفرم.",
    features: [
      "تصاویر یکتا و اختصاصی برای برند، بدون عکس‌های استوک",
      "هماهنگ با هویت بصری و پالت رنگی برند",
      "نسخه‌های متعدد برای اینستاگرام، تلگرام و کمپین",
    ],
    deliverables: "مجموعه تصاویر + نسخه‌های مختلف",
    timeline: "۳ تا ۷ روز",
    tags: ["AI Art", "Banner", "Advertising"],
  },
  {
    number: "04",
    icon: "video",
    title: "ساخت ویدیوهای تبلیغاتی با هوش مصنوعی",
    shortTitle: "ویدیوی تبلیغاتی",
    description:
      "ویدیوی تبلیغاتی با کیفیت سینمایی، بدون تیم فیلم‌برداری و بودجه‌ی سنگین. برای معرفی محصول، برند یا کمپین — از ایده تا اجرا.",
    features: [
      "روایت سینمایی و صداگذاری اختصاصی",
      "مناسب اینستاگرام، تلویزیون و کمپین",
      "بدون نیاز به تیم فیلم‌برداری و تجهیزات سنگین",
    ],
    deliverables: "ویدیوی نهایی + نسخه‌های سایز",
    timeline: "۱ تا ۲ هفته",
    tags: ["AI Video", "Cinematic", "Creative"],
  },
];

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

/* ═══════════════════════════════════════════════════════════
   PREMIUM ICONS — colorful gradient with signature orange
   ═══════════════════════════════════════════════════════════ */
function ServiceIconLarge({ type }: { type: Service["icon"] }) {
  switch (type) {
    case "web":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="svcWebDark" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" />
              <stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="svcWebWarm" x1="20" y1="14" x2="44" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" />
              <stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          {/* Browser window */}
          <rect x="8" y="12" width="48" height="40" rx="6" fill="url(#svcWebDark)" />
          {/* Top bar with orange tab */}
          <rect x="8" y="12" width="48" height="10" rx="6" fill="url(#svcWebWarm)" />
          <rect x="8" y="18" width="48" height="4" fill="url(#svcWebWarm)" />
          {/* Dots */}
          <circle cx="15" cy="17" r="1.4" fill="#fff" fillOpacity="0.7" />
          <circle cx="20" cy="17" r="1.4" fill="#fff" fillOpacity="0.7" />
          <circle cx="25" cy="17" r="1.4" fill="#fff" fillOpacity="0.7" />
          {/* Content blocks */}
          <rect x="14" y="28" width="14" height="14" rx="2.5" fill="#8A7D70" fillOpacity="0.5" />
          <rect x="32" y="28" width="18" height="3" rx="1.5" fill="#8A7D70" fillOpacity="0.7" />
          <rect x="32" y="34" width="18" height="3" rx="1.5" fill="#8A7D70" fillOpacity="0.5" />
          <rect x="32" y="40" width="12" height="3" rx="1.5" fill="#8A7D70" fillOpacity="0.4" />
        </svg>
      );

    case "ai":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="svcAiWarm" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" />
              <stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          {/* Central spark */}
          <path
            d="M32 10 L36 24 L50 28 L36 32 L32 46 L28 32 L14 28 L28 24 Z"
            fill="url(#svcAiWarm)"
          />
          {/* Orbiting nodes */}
          <circle cx="48" cy="16" r="3" fill="url(#svcAiWarm)" />
          <circle cx="16" cy="48" r="2.4" fill="url(#svcAiWarm)" />
          <circle cx="50" cy="46" r="2.4" fill="url(#svcAiWarm)" />
          {/* Neural connections */}
          <path
            d="M32 28 L48 16 M32 32 L16 48 M32 32 L50 46"
            stroke="url(#svcAiWarm)"
            strokeWidth="1.4"
            strokeOpacity="0.5"
            strokeDasharray="2 3"
          />
        </svg>
      );

    case "banner":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="svcBanDark" x1="32" y1="14" x2="32" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" />
              <stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="svcBanWarm" x1="16" y1="10" x2="48" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" />
              <stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          {/* Frame */}
          <rect x="6" y="14" width="52" height="36" rx="5" fill="url(#svcBanDark)" />
          <rect x="6" y="14" width="52" height="36" rx="5" stroke="url(#svcBanWarm)" strokeWidth="1.4" strokeOpacity="0.4" />
          {/* Interior */}
          <rect x="10" y="18" width="44" height="28" rx="3" fill="#2A241E" />
          {/* Sun */}
          <circle cx="40" cy="28" r="3.5" fill="url(#svcBanWarm)" />
          {/* Mountains */}
          <path
            d="M10 42 L20 32 L27 38 L34 31 L54 46 Z"
            fill="#8A7D70"
            fillOpacity="0.7"
          />
          {/* Orange accent brush */}
          <path
            d="M10 12 Q20 8 32 12 T54 12"
            stroke="url(#svcBanWarm)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "video":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="svcVidDark" x1="32" y1="14" x2="32" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" />
              <stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="svcVidWarm" x1="26" y1="22" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" />
              <stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          {/* Video frame */}
          <rect x="6" y="14" width="40" height="36" rx="5" fill="url(#svcVidDark)" />
          {/* Right side triangle */}
          <path
            d="M46 22 L58 18 L58 46 L46 42 Z"
            fill="url(#svcVidDark)"
          />
          {/* Play button */}
          <circle cx="26" cy="32" r="9" fill="url(#svcVidWarm)" />
          <path
            d="M23 28 L33 32 L23 36 Z"
            fill="#ffffff"
          />
          {/* Timeline dots */}
          <circle cx="46" cy="32" r="1.4" fill="url(#svcVidWarm)" />
        </svg>
      );
  }
}

export default function Services() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = services[active];

  const focusTab = (index: number) => {
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = services.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      nextIndex = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      nextIndex = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = last;
    } else {
      return;
    }

    focusTab(nextIndex);
  };

  const activeNumber = String(active + 1).padStart(2, "0");
  const totalNumber = String(services.length).padStart(2, "0");

  return (
    <section id="services" className="services-section section">
      <div className="container">
        {/* ═══════ MASTHEAD ═══════ */}
        <div className="services-masthead reveal">
          <span className="services-masthead-left">
            CHAPTER&nbsp;·&nbsp;01&nbsp;—&nbsp;SERVICES
          </span>
          <span className="services-masthead-center" aria-hidden="true">
            §
          </span>
          <span className="services-masthead-right">
            SELECTED&nbsp;·&nbsp;{CURRENT_PERSIAN_YEAR}
          </span>
        </div>

        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۱" label="SERVICES" />
            <h2>
              از ایده تا یک
              <em> حضور دیجیتالِ دقیق</em>
            </h2>
          </div>
          <p>
            چهار مسیر برای ساختن چیزی که فقط زیبا نیست — کار می‌کنه. هر
            خدمت با هدف مشخص، زمان مشخص و نتیجه‌ی قابل اندازه‌گیری.
          </p>
        </div>

        <div className="services-layout">
          {/* ═══════ LIST ═══════ */}
          <div
            className="services-list reveal"
            role="tablist"
            aria-label="فهرست خدمات"
            aria-orientation="vertical"
          >
            <div className="services-list-header" aria-hidden="true">
              <span className="services-list-header-label">INDEX</span>
              <span className="services-list-header-count">
                {activeNumber}&nbsp;/&nbsp;{totalNumber}
              </span>
            </div>

            {services.map((service, index) => (
              <button
                key={service.number}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`service-tab-${index}`}
                aria-selected={active === index}
                aria-controls={`service-panel-${index}`}
                tabIndex={active === index ? 0 : -1}
                className={
                  "service-item" + (active === index ? " is-active" : "")
                }
                onClick={() => setActive(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="service-item-dot" aria-hidden="true" />

                <span className="service-number">{service.number}</span>

                <span className="service-icon" aria-hidden="true">
                  <ServiceIconLarge type={service.icon} />
                </span>

                <span className="service-title">{service.shortTitle}</span>

                <span className="service-arrow" aria-hidden="true">
                  ↙
                </span>
              </button>
            ))}
          </div>

          {/* ═══════ PREVIEW ═══════ */}
          <div
            className="service-preview reveal"
            role="tabpanel"
            id={`service-panel-${active}`}
            aria-labelledby={`service-tab-${active}`}
          >
            <span className="service-preview-corner service-preview-corner-tl" aria-hidden="true" />
            <span className="service-preview-corner service-preview-corner-tr" aria-hidden="true" />
            <span className="service-preview-corner service-preview-corner-bl" aria-hidden="true" />
            <span className="service-preview-corner service-preview-corner-br" aria-hidden="true" />

            <div className="service-preview-top">
              <span>
                {current.number} / {String(services.length).padStart(2, "0")}
              </span>
              <span>SELECTED SERVICE</span>
            </div>

            <div className="service-preview-content">
              <span className="service-preview-icon" aria-hidden="true">
                <ServiceIconLarge type={current.icon} />
              </span>

              <span className="service-preview-label">
                {current.shortTitle}
              </span>

              <h3>{current.title}</h3>

              <p>{current.description}</p>

              <ul className="service-features">
                {current.features.map((feature) => (
                  <li key={feature} className="service-feature">
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="service-meta">
                <div className="service-meta-item">
                  <span>تحویل</span>
                  <strong>{current.deliverables}</strong>
                </div>
                <div className="service-meta-item">
                  <span>زمان تقریبی</span>
                  <strong>{current.timeline}</strong>
                </div>
              </div>

              <div className="service-tags">
                {current.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="service-visual" aria-hidden="true">
              <span className="service-visual-numeral">
                {current.number}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}