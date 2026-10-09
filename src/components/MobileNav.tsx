"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV — Liquid Glass Scrubbing Edition
   ────────────────────────────────────────────────────────────
   - Floating pill with liquid glass effect
   - Finger scrubbing: drag to preview, release to commit
   - Haptic ticks at each boundary
   - Sliding glass indicator with spring physics
   - Logo as home icon with progress ring
   - Full dark mode + reduced motion
   ═══════════════════════════════════════════════════════════ */

type IconName = "logo" | "services" | "portfolio" | "about" | "blog" | "spark";

const NAV_ITEMS: ReadonlyArray<{
  id: string;
  label: string;
  href: string;
  type: IconName;
  section: string;
  auraColor: string;
  haptic: number[];
}> = [
  { id: "home",      label: "خانه",      href: "/#home",      type: "logo",      section: "home",      auraColor: "rgba(233, 75, 44, 0.55)",  haptic: [0, 12] },
  { id: "services",  label: "خدمات",     href: "/#services",  type: "services",  section: "services",  auraColor: "rgba(255, 138, 92, 0.55)", haptic: [0, 10] },
  { id: "portfolio", label: "نمونه‌کار",  href: "/#portfolio", type: "portfolio", section: "portfolio", auraColor: "rgba(255, 106, 61, 0.55)", haptic: [0, 10] },
  { id: "blog",      label: "بلاگ",      href: "/blog",       type: "blog",      section: "blog",      auraColor: "rgba(255, 122, 69, 0.55)", haptic: [0, 10] },
  { id: "about",     label: "درباره",    href: "/#about",     type: "about",     section: "about",     auraColor: "rgba(200, 74, 46, 0.55)",  haptic: [0, 10] },
];

const CTA = {
  label: "شروع پروژه",
  href: "/order",
  type: "spark" as const,
  haptic: [0, 8, 30, 8],
};

/* ═══════════════════════════════════════════════════════════
   ICONS — colorful gradient SVG
   ═══════════════════════════════════════════════════════════ */
function IconServices() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnSrvDark" x1="10" y1="8" x2="10" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient id="mbnSrvWarm" x1="22" y1="6" x2="22" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#0d7377" />
        </linearGradient>
      </defs>
      <rect x="4" y="7" width="10.5" height="10.5" rx="3.2" fill="url(#mbnSrvDark)" />
      <rect x="17" y="5" width="11" height="11" rx="3.5" fill="url(#mbnSrvWarm)" />
      <rect x="4" y="20" width="10.5" height="10.5" rx="3.2" fill="url(#mbnSrvDark)" />
      <rect x="17" y="20" width="11" height="10.5" rx="3.5" fill="url(#mbnSrvDark)" />
    </svg>
  );
}

function IconPortfolio() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnPortDark" x1="16" y1="8" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient id="mbnPortWarm" x1="16" y1="3" x2="16" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#0d7377" />
        </linearGradient>
        <linearGradient id="mbnPortSun" x1="20" y1="14" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB07A" /><stop offset="1" stopColor="#FF7043" />
        </linearGradient>
      </defs>
      <path d="M8 4h14a3 3 0 0 1 3 3v2" stroke="url(#mbnPortWarm)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <rect x="4" y="8" width="24" height="20" rx="3.5" fill="url(#mbnPortDark)" />
      <rect x="6.5" y="10.5" width="19" height="15" rx="2" fill="#2A241E" />
      <circle cx="20" cy="15.5" r="2.2" fill="url(#mbnPortSun)" />
      <path d="M7.5 24.5l4.5-5 3.5 3.4 2.5-2.6 6 4.2z" fill="#8A7D70" fillOpacity="0.85" />
    </svg>
  );
}

function IconBlog() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnBlogDark" x1="16" y1="5" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient id="mbnBlogWarm" x1="21" y1="4" x2="21" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#0d7377" />
        </linearGradient>
      </defs>
      <rect x="4.5" y="4" width="23" height="24" rx="3.5" fill="url(#mbnBlogDark)" />
      <path d="M9.5 4v24" stroke="#5A4E44" strokeWidth="1.4" strokeOpacity="0.9" />
      <path d="M19 4h5v11l-2.5-2-2.5 2z" fill="url(#mbnBlogWarm)" />
      <path d="M13 12h5M13 16h5M13 20h5" stroke="#A89585" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
    </svg>
  );
}

function IconAbout() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnAboutDark" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3E3630" /><stop offset="1" stopColor="#18140F" />
        </linearGradient>
        <linearGradient id="mbnAboutWarm" x1="24" y1="18" x2="30" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#0d7377" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="9.5" r="5.5" fill="url(#mbnAboutDark)" />
      <path d="M4.5 27a11.5 11.5 0 0 1 22.5-2.5c-1.5 1.3-5 1.5-8.5-.5s-7.5-2.5-11.5-1z" fill="url(#mbnAboutDark)" />
      <path d="M22 25.5c2.5-1 4.5-3 5-5.5.4 2.8-.4 5.3-2.5 6.5-1 .6-2 .6-2.5-1z" fill="url(#mbnAboutWarm)" />
      <circle cx="26.5" cy="6.5" r="2.2" fill="url(#mbnAboutWarm)" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mbnSparkRing" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#18140F" /><stop offset="0.55" stopColor="#7A3D22" /><stop offset="1" stopColor="#FF7043" />
        </linearGradient>
        <linearGradient id="mbnSparkPlus" x1="16" y1="10" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A55" /><stop offset="1" stopColor="#0d7377" />
        </linearGradient>
      </defs>
      <path d="M24.4 7.6a11 11 0 1 0 3.1 7.4" stroke="url(#mbnSparkRing)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
      <path d="M16 11.5v9M11.5 16h9" stroke="url(#mbnSparkPlus)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="26.5" cy="6.5" r="2.2" fill="url(#mbnSparkPlus)" />
    </svg>
  );
}

function Icon({ type }: { type: IconName }) {
  switch (type) {
    case "services":  return <IconServices />;
    case "portfolio": return <IconPortfolio />;
    case "blog":      return <IconBlog />;
    case "about":     return <IconAbout />;
    case "spark":     return <IconSpark />;
    default:          return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   SOUND — subtle haptic tick tone
   ═══════════════════════════════════════════════════════════ */
let audioCtx: AudioContext | null = null;

function playTick() {
  if (typeof window === "undefined") return;
  try {
    if (!audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 680;
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch { /* ignore */ }
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);

  const itemsRef = useRef<HTMLDivElement>(null);
  const lastTickIndex = useRef<number | null>(null);
  const dragRaf = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  /* Track active section */
  useEffect(() => {
    if (!mounted) return;
    if (pathname !== "/") return;
    if (typeof IntersectionObserver === "undefined") return;

    const ids = NAV_ITEMS.map((i) => i.section).filter((s) => s !== "blog");
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
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, pathname]);

  /* Scroll progress for logo ring */
  useEffect(() => {
    if (!mounted) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  /* ─── Finger Scrubbing ─── */
  const haptic = useCallback((pattern: number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(pattern); } catch { /* ignore */ }
    }
  }, []);

  const handleScrubStart = useCallback((e: React.TouchEvent) => {
    if (!itemsRef.current) return;
    setIsDragging(true);
    lastTickIndex.current = null;
    haptic([0, 8]);
  }, [haptic]);

  const handleScrubMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !itemsRef.current) return;
    const touch = e.touches[0];
    const rect = itemsRef.current.getBoundingClientRect();
    const relativeX = touch.clientX - rect.left;
    const itemWidth = rect.width / NAV_ITEMS.length;
    const index = Math.max(0, Math.min(NAV_ITEMS.length - 1, Math.floor(relativeX / itemWidth)));

    if (dragRaf.current) cancelAnimationFrame(dragRaf.current);
    dragRaf.current = requestAnimationFrame(() => {
      setScrubIndex(index);
      if (lastTickIndex.current !== index) {
        lastTickIndex.current = index;
        haptic([0, 10]);
        playTick();
      }
    });
  }, [isDragging, haptic]);

  const handleScrubEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragRaf.current) cancelAnimationFrame(dragRaf.current);

    if (scrubIndex !== null) {
      const target = NAV_ITEMS[scrubIndex];
      haptic([0, 6, 20, 6]);
      if (target.href.startsWith("#")) {
        const el = document.getElementById(target.section);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else {
        window.location.href = target.href;
      }
    }
    setScrubIndex(null);
    lastTickIndex.current = null;
  }, [isDragging, scrubIndex, haptic]);

  if (!mounted) return null;

  const isOnHome = pathname === "/";
  const isBlogPage = pathname?.startsWith("/blog") ?? false;

  let activeIndex = -1;
  if (isBlogPage) {
    activeIndex = NAV_ITEMS.findIndex((item) => item.section === "blog");
  } else if (isOnHome) {
    activeIndex = NAV_ITEMS.findIndex((item) => item.section === activeSection);
  }

  const indicatorIndex = scrubIndex !== null ? scrubIndex : activeIndex >= 0 ? activeIndex : 0;
  const hideIndicator = activeIndex < 0 && scrubIndex === null;
  const isOrderPage = pathname?.startsWith("/order") ?? false;

  const activeAuraColor = NAV_ITEMS[indicatorIndex]?.auraColor ?? "rgba(233, 75, 44, 0.55)";
  const RING_R = 14;
  const RING_C = 2 * Math.PI * RING_R;

  return (
    <nav
      className="mbn"
      aria-label="ناوبری موبایل"
      data-hide-indicator={hideIndicator ? "true" : "false"}
      data-dragging={isDragging ? "true" : "false"}
      style={{
        "--mbn-index": indicatorIndex,
        "--mbn-aura": activeAuraColor,
        "--mbn-count": NAV_ITEMS.length,
      } as React.CSSProperties}
    >
      {/* Aurora glow */}
      <span className="mbn-aurora" aria-hidden="true">
        <span className="mbn-aurora-glow" />
      </span>

      {/* Items container with scrub handlers */}
      <div
        ref={itemsRef}
        className="mbn-items"
        onTouchStart={handleScrubStart}
        onTouchMove={handleScrubMove}
        onTouchEnd={handleScrubEnd}
        onTouchCancel={handleScrubEnd}
      >
        <span className="mbn-slider" aria-hidden="true">
          <span className="mbn-slider-glow" />
        </span>

        {NAV_ITEMS.map((item, i) => {
          const isActive = i === indicatorIndex && !hideIndicator;
          const isHome = item.type === "logo";
          const isScrubbing = scrubIndex === i;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                "mbn-item" +
                (isActive ? " is-active" : "") +
                (isScrubbing ? " is-scrubbing" : "")
              }
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <span className="mbn-item-icon" aria-hidden="true">
                {isHome ? (
                  <span className="mbn-logo-wrap">
                    <svg className="mbn-logo-ring" viewBox="0 0 34 34" aria-hidden="true">
                      <circle cx="17" cy="17" r={RING_R} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.6" />
                      <circle cx="17" cy="17" r={RING_R} fill="none" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeDasharray={RING_C}
                        strokeDashoffset={RING_C * (1 - scrollProgress)}
                        transform="rotate(-90 17 17)" className="mbn-logo-ring-progress" />
                    </svg>
                    <Image src="/logo.png" alt="" width={76} height={76} className="mbn-item-logo" priority={false} />
                  </span>
                ) : (
                  <Icon type={item.type} />
                )}
              </span>
              <span className="mbn-item-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href={CTA.href}
        className={"mbn-cta" + (isOrderPage ? " is-active" : "")}
        aria-label={CTA.label}
        onClick={() => haptic(CTA.haptic)}
      >
        <span className="mbn-cta-shine" aria-hidden="true" />
        <span className="mbn-cta-pulse" aria-hidden="true" />
        <span className="mbn-item-icon" aria-hidden="true">
          <Icon type={CTA.type} />
        </span>
        <span className="mbn-item-label">{CTA.label}</span>
      </Link>
    </nav>
  );
}