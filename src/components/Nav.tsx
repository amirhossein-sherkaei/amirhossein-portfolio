"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import MagneticButton from "@/components/MagneticButton";

type NavItem = {
  label: string;
  href: string;
  icon: "home" | "services" | "portfolio" | "blog" | "about";
  section?: string;
  preview: {
    title: string;
    description: string;
    stat: string;
    statLabel: string;
  };
};

const navItems: NavItem[] = [
  { label: "خانه", href: "#home", icon: "home", section: "home", preview: { title: "بازگشت به شروع", description: "معرفی کوتاه و مسیرهای اصلی", stat: "۰۱", statLabel: "بخش" } },
  { label: "خدمات", href: "#services", icon: "services", section: "services", preview: { title: "چهار مسیر همکاری", description: "وب، AI، تبلیغات، ویدیو", stat: "۰۴", statLabel: "خدمت" } },
  { label: "نمونه‌کارها", href: "#portfolio", icon: "portfolio", section: "portfolio", preview: { title: "پروژه‌های واقعی", description: "آرکا، نیلا، ویرا، لومن", stat: "۰۴", statLabel: "پروژه" } },
  { label: "بلاگ", href: "/blog", icon: "blog", preview: { title: "مقالات و یادداشت‌ها", description: "درباره طراحی، سئو و UX", stat: "۲۰", statLabel: "مقاله" } },
  { label: "درباره من", href: "#about", icon: "about", section: "about", preview: { title: "امیرحسین شرکائی", description: "طراح و توسعه‌دهنده وب", stat: "۰۵", statLabel: "سال تجربه" } },
];

/* 🎨 آیکون‌های تمیزتر با گرادیان‌های ملایم و فیلترهای نوری */
function NavIcon({ type }: { type: NavItem["icon"] }) {
  const defs = (
    <defs>
      <filter id="clean-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0D7377" floodOpacity="0.3" />
      </filter>
      <linearGradient id="clean-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B1AB" />
        <stop offset="100%" stopColor="#0A5C60" />
      </linearGradient>
      <linearGradient id="clean-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7D293F" />
        <stop offset="100%" stopColor="#9E3750" />
      </linearGradient>
      <linearGradient id="clean-dark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3E3630" />
        <stop offset="100%" stopColor="#1A1612" />
      </linearGradient>
    </defs>
  );

  switch (type) {
    case "home":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {defs}
          <g filter="url(#clean-glow)">
            <path d="M15.15 4.4a1.5 1.5 0 0 1 1.7 0l9.5 6.35a1.6 1.6 0 0 1 .65 1.3V25a2.5 2.5 0 0 1-2.5 2.5H7.5A2.5 2.5 0 0 1 5 25V12.05a1.6 1.6 0 0 1 .65-1.3z" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <path d="M11.75 27.5V19a4.25 4.25 0 0 1 8.5 0v8.5z" fill="url(#clean-grad-1)" />
          </g>
        </svg>
      );
    case "services":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {defs}
          <g filter="url(#clean-glow)">
            <rect x="4" y="7" width="10.5" height="10.5" rx="3" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <rect x="17" y="5" width="11" height="11" rx="3" fill="url(#clean-grad-1)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
            <rect x="4" y="20" width="10.5" height="10.5" rx="3" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <rect x="17" y="20" width="11" height="10.5" rx="3" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          </g>
        </svg>
      );
    case "portfolio":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {defs}
          <g filter="url(#clean-glow)">
            <path d="M8 4h14a3 3 0 0 1 3 3v2" stroke="url(#clean-grad-2)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <rect x="4" y="8" width="24" height="20" rx="3.5" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <rect x="6.5" y="10.5" width="19" height="15" rx="2" fill="#1A1612" />
            <circle cx="20" cy="15.5" r="2" fill="url(#clean-grad-1)" />
            <path d="M7.5 24.5l4.5-5 3.5 3.4 2.5-2.6 6 4.2z" fill="url(#clean-grad-2)" fillOpacity="0.6" />
          </g>
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {defs}
          <g filter="url(#clean-glow)">
            <rect x="4.5" y="4" width="23" height="24" rx="3.5" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <path d="M9.5 4v24" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <path d="M19 4h5v11l-2.5-2-2.5 2z" fill="url(#clean-grad-1)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <path d="M13 12h5M13 16h5M13 20h5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {defs}
          <g filter="url(#clean-glow)">
            <circle cx="16" cy="9.5" r="5" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <path d="M4.5 27a11.5 11.5 0 0 1 22.5-2.5c-1.5 1.3-5 1.5-8.5-.5s-7.5-2.5-11.5-1z" fill="url(#clean-dark)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <circle cx="26.5" cy="6.5" r="2" fill="url(#clean-grad-1)" />
          </g>
        </svg>
      );
  }
}

function PreviewCard({ item }: { item: NavItem }) {
  return (
    <div className="nav-preview" aria-hidden="true">
      <span className="nav-preview-arrow" />
      <div className="nav-preview-inner">
        <span className="nav-preview-icon">
          <NavIcon type={item.icon} />
        </span>
        <div className="nav-preview-body">
          <strong className="nav-preview-title">{item.preview.title}</strong>
          <span className="nav-preview-desc">{item.preview.description}</span>
        </div>
        <div className="nav-preview-stat">
          <strong>{item.preview.stat}</strong>
          <span>{item.preview.statLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking.current = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (pathname !== "/") return;

    const sections = navItems
      .filter((item) => item.section)
      .map((item) => document.getElementById(item.section!))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof Element && visible.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const isBlogPage = pathname?.startsWith("/blog") ?? false;

  let activeIndex = 0;
  if (isBlogPage) {
    activeIndex = navItems.findIndex((item) => item.icon === "blog");
  } else if (pathname === "/") {
    const found = navItems.findIndex((item) => item.section === activeSection);
    if (found >= 0) activeIndex = found;
  }

  const previewItem = hoveredIndex !== null ? navItems[hoveredIndex] : null;
  const totalCount = navItems.length;

  return (
    <header className={"site-nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="container">
        <div className="nav-inner">
          <div className="nav-pill">
            <a href="/#home" className="brand" aria-label="بازگشت به بالای صفحه">
              <span className="brand-mark-wrap">
                <Image src="/logo.png" alt="" width={72} height={72}
                  className="brand-mark brand-logo" aria-hidden="true" priority />
              </span>
              <span className="brand-text">
                <strong>امیرحسین شرکائی</strong>
                <small>Amirhossein Shorakaei</small>
              </span>
            </a>

            <nav
              className="desktop-nav"
              aria-label="منوی اصلی سایت"
              style={
                {
                  "--nav-index": activeIndex,
                  "--nav-total": totalCount,
                } as React.CSSProperties
              }
            >
              <div className="desktop-nav-list">
                <span className="desktop-nav-slider" aria-hidden="true">
                  <span className="desktop-nav-slider-pulse" />
                </span>
                {navItems.map((item, i) => {
                  const isHash = item.href.startsWith("#");
                  const isBlogLink = item.href === "/blog";
                  const sectionId = item.section ?? "";
                  const isActive = isBlogLink
                    ? isBlogPage
                    : isHash && pathname === "/" && activeSection === sectionId;

                  const content = (
                    <>
                      <span className="desktop-nav-icon" aria-hidden="true">
                        <NavIcon type={item.icon} />
                      </span>
                      <span className="desktop-nav-text">{item.label}</span>
                    </>
                  );

                  const commonProps = {
                    className:
                      "desktop-nav-item" + (isActive ? " is-active" : ""),
                    onMouseEnter: () => setHoveredIndex(i),
                    onMouseLeave: () => setHoveredIndex(null),
                    onFocus: () => setHoveredIndex(i),
                    onBlur: () => setHoveredIndex(null),
                    style: { "--nav-i": i } as React.CSSProperties,
                  };

                  if (isHash) {
                    return (
                      <a
                        key={item.href}
                        href={pathname === "/" ? item.href : `/${item.href}`}
                        aria-current={isActive ? "true" : undefined}
                        {...commonProps}
                      >
                        {content}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      {...commonProps}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              {previewItem && <PreviewCard item={previewItem} />}
            </nav>

            <div className="nav-actions">
              <MagneticButton strength={0.15} radius={50}>
                <Link href="/order" prefetch={false} className="nav-order-button">
                  <span className="nav-order-shine" aria-hidden="true" />
                  <span>شروع پروژه</span>
                  <span className="nav-order-arrow" aria-hidden="true">←</span>
                </Link>
              </MagneticButton>
              <button
                type="button"
                className="theme-toggle"
                aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
                aria-pressed={theme === "dark"}
                onClick={toggleTheme}
              >
                <span className="theme-toggle-inner" aria-hidden="true">
                  <svg className="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                  <svg className="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}