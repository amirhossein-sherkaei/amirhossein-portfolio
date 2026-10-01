"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import MagneticButton from "@/components/MagneticButton";

/* ═══════════════════════════════════════════════════════════
   DESKTOP NAV — Always Visible Edition
   ────────────────────────────────────────────────────────────
   - Single unified glass pill
   - Colorful gradient icons
   - Sliding orange indicator
   - Never hides on scroll
   - Full dark mode + reduced motion
   ═══════════════════════════════════════════════════════════ */

type NavItem = {
  label: string;
  href: string;
  icon: "home" | "services" | "portfolio" | "blog" | "about";
  section?: string;
};

const navItems: NavItem[] = [
  { label: "خانه",       href: "#home",      icon: "home",      section: "home" },
  { label: "خدمات",      href: "#services",  icon: "services",  section: "services" },
  { label: "نمونه‌کارها", href: "#portfolio", icon: "portfolio", section: "portfolio" },
  { label: "بلاگ",       href: "/blog",      icon: "blog" },
  { label: "درباره من",  href: "#about",     icon: "about",     section: "about" },
];

/* ═══════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════ */
function NavIcon({ type }: { type: NavItem["icon"] }) {
  switch (type) {
    case "home":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="navHomeDark" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="navHomeWarm" x1="16" y1="14" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          <path d="M15.15 4.4a1.5 1.5 0 0 1 1.7 0l9.5 6.35a1.6 1.6 0 0 1 .65 1.3V25a2.5 2.5 0 0 1-2.5 2.5H7.5A2.5 2.5 0 0 1 5 25V12.05a1.6 1.6 0 0 1 .65-1.3z" fill="url(#navHomeDark)" />
          <path d="M11.75 27.5V19a4.25 4.25 0 0 1 8.5 0v8.5z" fill="url(#navHomeWarm)" />
          <circle cx="26" cy="6.75" r="2.6" fill="url(#navHomeWarm)" />
        </svg>
      );
    case "services":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="navSrvDark" x1="10" y1="8" x2="10" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="navSrvWarm" x1="22" y1="6" x2="22" y2="14" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          <rect x="4" y="7" width="10.5" height="10.5" rx="3.2" fill="url(#navSrvDark)" />
          <rect x="17" y="5" width="11" height="11" rx="3.5" fill="url(#navSrvWarm)" />
          <rect x="4" y="20" width="10.5" height="10.5" rx="3.2" fill="url(#navSrvDark)" />
          <rect x="17" y="20" width="11" height="10.5" rx="3.5" fill="url(#navSrvDark)" />
        </svg>
      );
    case "portfolio":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="navPortDark" x1="16" y1="8" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="navPortWarm" x1="16" y1="3" x2="16" y2="8" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
            <linearGradient id="navPortSun" x1="20" y1="14" x2="20" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFB07A" /><stop offset="1" stopColor="#FF7043" />
            </linearGradient>
          </defs>
          <path d="M8 4h14a3 3 0 0 1 3 3v2" stroke="url(#navPortWarm)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <rect x="4" y="8" width="24" height="20" rx="3.5" fill="url(#navPortDark)" />
          <rect x="6.5" y="10.5" width="19" height="15" rx="2" fill="#2A241E" />
          <circle cx="20" cy="15.5" r="2.2" fill="url(#navPortSun)" />
          <path d="M7.5 24.5l4.5-5 3.5 3.4 2.5-2.6 6 4.2z" fill="#8A7D70" fillOpacity="0.85" />
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="navBlogDark" x1="16" y1="5" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="navBlogWarm" x1="21" y1="4" x2="21" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          <rect x="4.5" y="4" width="23" height="24" rx="3.5" fill="url(#navBlogDark)" />
          <path d="M9.5 4v24" stroke="#5A4E44" strokeWidth="1.4" strokeOpacity="0.9" />
          <path d="M19 4h5v11l-2.5-2-2.5 2z" fill="url(#navBlogWarm)" />
          <path d="M13 12h5M13 16h5M13 20h5" stroke="#A89585" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="navAboutDark" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
            </linearGradient>
            <linearGradient id="navAboutWarm" x1="24" y1="18" x2="30" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#E94B2C" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="9.5" r="5.5" fill="url(#navAboutDark)" />
          <path d="M4.5 27a11.5 11.5 0 0 1 22.5-2.5c-1.5 1.3-5 1.5-8.5-.5s-7.5-2.5-11.5-1z" fill="url(#navAboutDark)" />
          <path d="M22 25.5c2.5-1 4.5-3 5-5.5.4 2.8-.4 5.3-2.5 6.5-1 .6-2 .6-2.5-1z" fill="url(#navAboutWarm)" />
          <circle cx="26.5" cy="6.5" r="2.2" fill="url(#navAboutWarm)" />
        </svg>
      );
  }
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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

  return (
    <header className={"site-nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="container">
        <div className="nav-inner">
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

          <nav className="desktop-nav" aria-label="منوی اصلی سایت"
            style={{ "--nav-index": activeIndex, "--nav-total": navItems.length } as React.CSSProperties}>
            <div className="desktop-nav-list">
              <span className="desktop-nav-slider" aria-hidden="true">
                <span className="desktop-nav-slider-glow" />
              </span>
              {navItems.map((item) => {
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

                if (isHash) {
                  return (
                    <a key={item.href}
                      href={pathname === "/" ? item.href : `/${item.href}`}
                      className={"desktop-nav-item" + (isActive ? " is-active" : "")}
                      aria-current={isActive ? "true" : undefined}>
                      {content}
                    </a>
                  );
                }
                return (
                  <Link key={item.href} href={item.href}
                    className={"desktop-nav-item" + (isActive ? " is-active" : "")}
                    aria-current={isActive ? "page" : undefined}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="nav-actions">
            <MagneticButton strength={0.15} radius={50}>
              <Link href="/order" className="nav-order-button">
                <span className="nav-order-shine" aria-hidden="true" />
                <span>شروع پروژه</span>
                <span className="nav-order-arrow" aria-hidden="true">←</span>
              </Link>
            </MagneticButton>
            <button type="button" className="theme-toggle"
              aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
              aria-pressed={theme === "dark"} onClick={toggleTheme}>
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
    </header>
  );
}