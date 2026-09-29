"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import MagneticButton from "@/components/MagneticButton";

const navItems = [
  { label: "خانه", href: "#home" },
  { label: "خدمات", href: "#services" },
  { label: "نمونه‌کارها", href: "#portfolio" },
  { label: "درباره من", href: "#about" },
  { label: "بلاگ", href: "/blog" },
];

const SCROLL_HIDE_THRESHOLD = 120;
const SCROLL_DELTA = 8;

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, y / docHeight) : 0;
      setScrollProgress(pct);

      const delta = y - lastScrollY.current;

      if (Math.abs(delta) > SCROLL_DELTA) {
        if (y > SCROLL_HIDE_THRESHOLD && delta > 0) {
          setHeaderHidden(true);
        } else if (delta < 0) {
          setHeaderHidden(false);
        }
        lastScrollY.current = y;
      }
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
    const handleBottom = () => {
      const y = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight - y < 200) {
        setHeaderHidden(false);
      }
    };
    window.addEventListener("scroll", handleBottom, { passive: true });
    return () => window.removeEventListener("scroll", handleBottom);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (pathname !== "/") return;

    const sections = navItems
      .filter((item) => item.href.startsWith("#"))
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

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
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const sectionItems = navItems.filter((item) => item.href.startsWith("#"));
  const activeIndex = Math.max(
    0,
    sectionItems.findIndex((item) => item.href.slice(1) === activeSection)
  );
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(sectionItems.length).padStart(2, "0");

  const isBlogPage = pathname?.startsWith("/blog");
  const shouldHide = !isBlogPage && headerHidden;

  return (
    <header
      className={`site-nav${scrolled ? " is-scrolled" : ""}${
        shouldHide ? " is-hidden" : ""
      }`}
    >
      <div className="container">
        <div className="nav-inner">
          <a
            href="/#home"
            className="brand"
            aria-label="امیرحسین شرکائی — بازگشت به بالای صفحه"
          >
            <span className="brand-mark" aria-hidden="true">
              ا
            </span>
            <span className="brand-text">
              <strong>امیرحسین شرکائی</strong>
              <small>Amirhossein Shorakaei</small>
            </span>

            <span className="brand-issue" aria-hidden="true">
              <span className="brand-issue-sep">/</span>
              <span className="brand-issue-num">Nº 01</span>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="منوی اصلی سایت">
            <span className="desktop-nav-label" aria-hidden="true">
              MENU
            </span>

            <div className="desktop-nav-list">
              {navItems.map((item) => {
                const isHash = item.href.startsWith("#");
                const isBlogLink = item.href === "/blog";
                const sectionId = isHash ? item.href.slice(1) : "";

                const isActive = isHash
                  ? pathname === "/" && activeSection === sectionId
                  : isBlogLink
                  ? pathname.startsWith("/blog")
                  : false;

                const className = isActive ? "active" : "";

                if (isHash) {
                  return (
                    <a
                      key={item.href}
                      href={pathname === "/" ? item.href : `/${item.href}`}
                      className={className}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={className}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <span
                className="desktop-nav-indicator"
                style={
                  {
                    "--nav-index": activeIndex,
                    "--nav-total": sectionItems.length,
                  } as React.CSSProperties
                }
                aria-hidden="true"
              />
            </div>

            <span className="desktop-nav-counter" aria-hidden="true">
              <span className="desktop-nav-counter-current">
                {activeNumber}
              </span>
              <span className="desktop-nav-counter-sep">/</span>
              <span className="desktop-nav-counter-total">{totalNumber}</span>
            </span>
          </nav>

          <div className="nav-actions">
            <MagneticButton strength={0.15} radius={50}>
              <Link href="/order" className="nav-order-button">
                شروع پروژه
              </Link>
            </MagneticButton>

            <button
              type="button"
              className="theme-toggle"
              aria-label={
                theme === "dark"
                  ? "حالت روشن رو فعال کن"
                  : "حالت تاریک رو فعال کن"
              }
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              <span className="theme-toggle-inner" aria-hidden="true">
                <svg
                  className="theme-icon theme-icon-sun"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                <svg
                  className="theme-icon theme-icon-moon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="nav-progress"
        style={{ "--nav-progress": scrollProgress } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="nav-progress-bar" />
      </div>
    </header>
  );
}