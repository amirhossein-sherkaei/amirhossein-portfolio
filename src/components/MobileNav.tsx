"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV — Premium Glass Edition
   ────────────────────────────────────────────────────────────
   - Multi-layer glassmorphism
   - Sliding glass indicator (spring physics)
   - Logo as home icon
   - Premium CTA with shine sweep
   - Full dark mode + reduced motion
   ═══════════════════════════════════════════════════════════ */

type IconName = "logo" | "grid" | "image" | "user" | "spark";

const NAV_ITEMS: ReadonlyArray<{
  id: string;
  label: string;
  href: string;
  type: IconName;
  section: string;
}> = [
  { id: "home", label: "خانه", href: "/#home", type: "logo", section: "home" },
  { id: "services", label: "خدمات", href: "/#services", type: "grid", section: "services" },
  { id: "portfolio", label: "نمونه‌کار", href: "/#portfolio", type: "image", section: "portfolio" },
  { id: "about", label: "درباره", href: "/#about", type: "user", section: "about" },
];

const CTA = {
  label: "شروع پروژه",
  href: "/order",
  type: "spark" as const,
};

/* ─── SVG Icons ─── */
function Icon({ type }: { type: IconName }) {
  switch (type) {
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="m4 17.5 4.5-4.2 3.5 3.2 3-2.8 5 4.8" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="3.8" />
          <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3 2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5z" />
          <path d="M19 4v3M17.5 5.5h3M5 17v2.5M3.75 18.25h2.5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Component ─── */
export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Track active section on home page */
  useEffect(() => {
    if (!mounted) return;
    if (pathname !== "/") return;
    if (typeof IntersectionObserver === "undefined") return;

    const ids = NAV_ITEMS.map((i) => i.section);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, pathname]);

  /* Haptic feedback on tap (mobile only) */
  const handleTap = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        /* ignore */
      }
    }
  }, []);

  /* Compute active index */
  const isOnHome = pathname === "/";
  const activeIndex = isOnHome
    ? NAV_ITEMS.findIndex((item) => item.section === activeSection)
    : -1;
  const indicatorIndex = activeIndex >= 0 ? activeIndex : 0;
  const hideIndicator = activeIndex < 0;
  const isOrderPage = pathname?.startsWith("/order") ?? false;

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="ناوبری موبایل"
    >
      <div
        className="mobile-bottom-nav-items"
        data-hide-indicator={hideIndicator ? "true" : "false"}
        style={{ "--active-index": indicatorIndex } as React.CSSProperties}
      >
        <span className="mobile-bottom-nav-indicator" aria-hidden="true" />

        {NAV_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                "mobile-bottom-nav-item" + (isActive ? " is-active" : "")
              }
              aria-current={isActive ? "page" : undefined}
              onClick={handleTap}
            >
              <span className="mobile-bottom-nav-icon" aria-hidden="true">
                {item.type === "logo" ? (
                  <Image
                    src="/logo.png"
                    alt=""
                    width={30}
                    height={30}
                    className="mobile-bottom-nav-logo"
                    priority={false}
                  />
                ) : (
                  <Icon type={item.type} />
                )}
              </span>
              <span className="mobile-bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Link
        href={CTA.href}
        className={
          "mobile-bottom-nav-cta" + (isOrderPage ? " is-active" : "")
        }
        aria-label={CTA.label}
        onClick={handleTap}
      >
        <span className="mobile-bottom-nav-icon" aria-hidden="true">
          <Icon type={CTA.type} />
        </span>
        <span className="mobile-bottom-nav-label">{CTA.label}</span>
      </Link>
    </nav>
  );
}