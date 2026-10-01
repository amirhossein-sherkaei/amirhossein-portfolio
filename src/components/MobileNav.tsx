"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   ULTRA PREMIUM MOBILE BOTTOM NAV — Infinite Edition
   ────────────────────────────────────────────────────────────
   - Logo as home icon
   - Colorful custom SVG icons (services, portfolio, about, spark)
   - Sliding spring indicator
   - Ambient aura that follows active item
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
   ICON — SERVICES
   2×2 rounded squares: 3 dark gradient + 1 orange (top-right)
   ═══════════════════════════════════════════════════════════ */
function IconServices() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnSrvDark" x1="10" y1="8" x2="10" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E3630" />
          <stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient id="mbnSrvWarm" x1="22" y1="6" x2="22" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" />
          <stop offset="1" stopColor="#E94B2C" />
        </linearGradient>
      </defs>
      <rect x="4" y="7" width="10.5" height="10.5" rx="3.2" fill="url(#mbnSrvDark)" />
      <rect x="17" y="5" width="11" height="11" rx="3.5" fill="url(#mbnSrvWarm)" />
      <rect x="4" y="20" width="10.5" height="10.5" rx="3.2" fill="url(#mbnSrvDark)" />
      <rect x="17" y="20" width="11" height="10.5" rx="3.5" fill="url(#mbnSrvDark)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICON — PORTFOLIO
   Photo frame + mountain + sun + orange accent line
   ═══════════════════════════════════════════════════════════ */
function IconPortfolio() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnPortDark" x1="16" y1="8" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E3630" />
          <stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient id="mbnPortWarm" x1="16" y1="3" x2="16" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" />
          <stop offset="1" stopColor="#E94B2C" />
        </linearGradient>
        <linearGradient id="mbnPortSun" x1="20" y1="14" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB07A" />
          <stop offset="1" stopColor="#FF7043" />
        </linearGradient>
      </defs>
      <path
        d="M8 4h14a3 3 0 0 1 3 3v2"
        stroke="url(#mbnPortWarm)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="4" y="8" width="24" height="20" rx="3.5" fill="url(#mbnPortDark)" />
      <rect x="6.5" y="10.5" width="19" height="15" rx="2" fill="#2A241E" />
      <circle cx="20" cy="15.5" r="2.2" fill="url(#mbnPortSun)" />
      <path
        d="M7.5 24.5l4.5-5 3.5 3.4 2.5-2.6 6 4.2z"
        fill="#8A7D70"
        fillOpacity="0.85"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICON — ABOUT
   Person silhouette + warm swoosh + accent dot
   ═══════════════════════════════════════════════════════════ */
function IconAbout() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnAboutDark" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E3630" />
          <stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient id="mbnAboutWarm" x1="24" y1="18" x2="30" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" />
          <stop offset="1" stopColor="#E94B2C" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="9.5" r="5.5" fill="url(#mbnAboutDark)" />
      <path
        d="M4.5 27a11.5 11.5 0 0 1 22.5-2.5c-1.5 1.3-5 1.5-8.5-.5s-7.5-2.5-11.5-1z"
        fill="url(#mbnAboutDark)"
      />
      <path
        d="M22 25.5c2.5-1 4.5-3 5-5.5.4 2.8-.4 5.3-2.5 6.5-1 .6-2 .6-2.5-1z"
        fill="url(#mbnAboutWarm)"
      />
      <circle cx="26.5" cy="6.5" r="2.2" fill="url(#mbnAboutWarm)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICON — SPARK (CTA)
   C-ring with gradient + plus sign + accent dot
   ═══════════════════════════════════════════════════════════ */
function IconSpark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnSparkRing" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#18140F" />
          <stop offset="0.55" stopColor="#7A3D22" />
          <stop offset="1" stopColor="#FF7043" />
        </linearGradient>
        <linearGradient id="mbnSparkPlus" x1="16" y1="10" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" />
          <stop offset="1" stopColor="#E94B2C" />
        </linearGradient>
      </defs>
      <path
        d="M24.4 7.6a11 11 0 1 0 3.1 7.4"
        stroke="url(#mbnSparkRing)"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 11.5v9M11.5 16h9"
        stroke="url(#mbnSparkPlus)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="26.5" cy="6.5" r="2.2" fill="url(#mbnSparkPlus)" />
    </svg>
  );
}

/* ─── Icon router ─── */
function Icon({ type }: { type: IconName }) {
  switch (type) {
    case "services":
      return <IconServices />;
    case "portfolio":
      return <IconPortfolio />;
    case "about":
      return <IconAbout />;
    case "spark":
      return <IconSpark />;
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

  const handleTap = useCallback((id: string) => {
    setRippleKey(id);
    window.setTimeout(() => setRippleKey(null), 600);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        /* ignore */
      }
    }
  }, []);

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
      <span className="mbn-aura" aria-hidden="true" />

      <div className="mbn-items">
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