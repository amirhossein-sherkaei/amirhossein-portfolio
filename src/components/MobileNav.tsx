"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
   ────────────────────────────────────────────────────────────
   - همیشه رندر می‌شه (SSR safe) — روی دسکتاپ با CSS مخفی می‌شه
   - روی موبایل (≤ 900px) پایین صفحه ثابت
   - هرگز محو نمی‌شه
   - ۵ آیتم: خانه، خدمات، نمونه‌کار، درباره، شروع پروژه
   ═══════════════════════════════════════════════════════════ */

const NAV_ITEMS = [
  { id: "home",      label: "خانه",       href: "/#home",      type: "home"  },
  { id: "services",  label: "خدمات",      href: "/#services",  type: "grid"  },
  { id: "portfolio", label: "نمونه‌کار",   href: "/#portfolio", type: "image" },
  { id: "about",     label: "درباره",     href: "/#about",     type: "user"  },
] as const;

const CTA = {
  label: "شروع پروژه",
  href: "/order",
  type: "spark" as const,
};

type IconName = "home" | "grid" | "image" | "user" | "spark";

function Icon({ type }: { type: IconName }) {
  switch (type) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="m3 18 5-5 4 4 3-3 6 6" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3 1.9 5.6L19.5 10l-4.9 3.4L16.5 19 12 15.8 7.5 19l1.9-5.6L4.5 10l5.6-1.4z" />
        </svg>
      );
  }
}

export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeHash, setActiveHash] = useState("home");

  useEffect(() => {
    setMounted(true);
  }, []);

  // track active section (only on home page)
  useEffect(() => {
    if (!mounted) return;
    if (pathname !== "/") return;
    if (typeof IntersectionObserver === "undefined") return;

    const ids = ["home", "services", "portfolio", "about"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveHash(visible.target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, pathname]);

  const isOrderPage = pathname?.startsWith("/order") ?? false;

  return (
    <nav className="mobile-bottom-nav" aria-label="ناوبری موبایل">
      <ul className="mobile-bottom-nav-list">
        {NAV_ITEMS.map((item) => {
          const sectionId = item.href.split("#")[1] ?? "";
          const isActive =
            !isOrderPage && pathname === "/" && activeHash === sectionId;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={
                  "mobile-bottom-nav-item" + (isActive ? " is-active" : "")
                }
                aria-current={isActive ? "page" : undefined}
              >
                <span className="mobile-bottom-nav-icon" aria-hidden="true">
                  <Icon type={item.type} />
                </span>
                <span className="mobile-bottom-nav-label">{item.label}</span>
              </Link>
            </li>
          );
        })}

        <li className="mobile-bottom-nav-cta-wrap">
          <Link
            href={CTA.href}
            className={
              "mobile-bottom-nav-cta" + (isOrderPage ? " is-active" : "")
            }
            aria-label={CTA.label}
          >
            <span className="mobile-bottom-nav-icon" aria-hidden="true">
              <Icon type={CTA.type} />
            </span>
            <span className="mobile-bottom-nav-label">{CTA.label}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}