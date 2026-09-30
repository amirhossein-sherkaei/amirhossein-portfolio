"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   ULTRA PREMIUM MOBILE BOTTOM NAV — World-Class Edition
   ────────────────────────────────────────────────────────────
   - Custom iconography with personality
   - Multi-layer glassmorphism (5 layers)
   - Sliding glow indicator
   - Logo as home icon (38px with halo)
   - Ripple + haptic feedback
   - Full dark mode + reduced motion
   ═══════════════════════════════════════════════════════════ */

type IconName = "logo" | "services" | "portfolio" | "about" | "spark";

const NAV_ITEMS: ReadonlyArray<{
  id: string;
  label: string;
  href: string;
  type: IconName;
  section: string;
}> = [
  { id: "home",      label: "خانه",      href: "/#home",      type: "logo",      section: "home" },
  { id: "services",  label: "خدمات",     href: "/#services",  type: "services",  section: "services" },
  { id: "portfolio", label: "نمونه‌کار",  href: "/#portfolio", type: "portfolio", section: "portfolio" },
  { id: "about",     label: "درباره",    href: "/#about",     type: "about",     section: "about" },
];

const CTA = {
  label: "شروع پروژه",
  href: "/order",
  type: "spark" as const,
};

/* ═══════════════════════════════════════════════════════════
   CUSTOM ICONS — هر آیکون با شخصیت خودش
   ═══════════════════════════════════════════════════════════ */
function Icon({ type }: { type: IconName }) {
  switch (type) {
    case "services":
      /* Grid با یه خانه بزرگ + ۳ تا کوچیک — مثل dashboard */
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="10" height="10" rx="2.5" />
          <rect x="16" y="3" width="5" height="5" rx="1.8" />
          <rect x="16" y="11" width="5" height="10" rx="1.8" />
          <rect x="3" y="16" width="10" height="5" rx="1.8" />
        </svg>
      );

    case "portfolio":
      /* قاب عکس با منظره — کوه + خورشید + پرنده */
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2.5" y="4" width="19" height="16" rx="3" />
          <circle cx="8" cy="9.5" r="1.8" />
          <path d="M2.5 17.5 7 13l3.2 2.8L13 13l8.5 6" />
          <path d="M17.5 8.5c.8-.6 1.6-.6 2.4 0" strokeWidth="1.4" />
        </svg>
      );

    case "about":
      /* آدم با شانه و کمی شخصیت — head + shoulders */
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="7.5" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          <path d="M9.5 7.5c.5-.5 1.4-.8 2.5-.8s2 .3 2.5.8" strokeWidth="1.3" />
        </svg>
      );

    case "spark":
      /* ستاره درخشان + جرقه‌های جانبی */
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.5 14 9l5.5 2-5.5 2-2 5.5-2-5.5L4.5 11 10 9z"
                fill="currentColor" fillOpacity="0.15" />
          <path d="M18.5 3v3M17 4.5h3" strokeWidth="1.5" />
          <path d="M4 18.5v2.5M2.75 19.75h2.5" strokeWidth="1.5" />
        </svg>
      );

    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [rippleKey, setRippleKey] = useState<string | null>(null);

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

  /* Haptic + ripple on tap */
  const handleTap = useCallback(
    (id: string) => {
      setRippleKey(id);
      window.setTimeout(() => setRippleKey(null), 600);

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(10);
        } catch {
          /* ignore */
        }
      }
    },
    []
  );

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
      className="mbn"
      aria-label="ناوبری موبایل"
      data-hide-indicator={hideIndicator ? "true" : "false"}
      style={{ "--mbn-index": indicatorIndex } as React.CSSProperties}
    >
      {/* Ambient aura under the active item */}
      <span className="mbn-aura" aria-hidden="true" />

      <div className="mbn-items">
        {/* Sliding glass indicator */}
        <span className="mbn-slider" aria-hidden="true">
          <span className="mbn-slider-glow" />
        </span>

        {NAV_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                "mbn-item" +
                (isActive ? " is-active" : "") +
                (rippleKey === item.id ? " is-rippling" : "")
              }
              aria-current={isActive ? "page" : undefined}
              onClick={() => handleTap(item.id)}
            >
              <span className="mbn-item-ripple" aria-hidden="true" />
              <span className="mbn-item-icon" aria-hidden="true">
                {item.type === "logo" ? (
                  <Image
                    src="/logo.png"
                    alt=""
                    width={76}
                    height={76}
                    className="mbn-item-logo"
                    priority={false}
                  />
                ) : (
                  <Icon type={item.type} />
                )}
              </span>
              <span className="mbn-item-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Link
        href={CTA.href}
        className={"mbn-cta" + (isOrderPage ? " is-active" : "")}
        aria-label={CTA.label}
        onClick={() => handleTap("cta")}
      >
        <span className="mbn-cta-shine" aria-hidden="true" />
        <span className="mbn-item-icon" aria-hidden="true">
          <Icon type={CTA.type} />
        </span>
        <span className="mbn-item-label">{CTA.label}</span>
      </Link>
    </nav>
  );
}