"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

const defs = (
  <defs>
    <filter id="mbn-glass-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0D7377" floodOpacity="0.3" />
    </filter>
    <linearGradient id="mbn-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#14B1AB" />
      <stop offset="100%" stopColor="#0A5C60" />
    </linearGradient>
    <linearGradient id="mbn-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#7D293F" />
      <stop offset="100%" stopColor="#9E3750" />
    </linearGradient>
    <linearGradient id="mbn-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#3E3630" />
      <stop offset="100%" stopColor="#1A1612" />
    </linearGradient>
  </defs>
);

function IconServices() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {defs}
      <g filter="url(#mbn-glass-glow)">
        <rect x="4" y="7" width="10.5" height="10.5" rx="3" fill="url(#mbn-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        <rect x="17" y="5" width="11" height="11" rx="3" fill="url(#mbn-grad-1)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
        <rect x="4" y="20" width="10.5" height="10.5" rx="3" fill="url(#mbn-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        <rect x="17" y="20" width="11" height="10.5" rx="3" fill="url(#mbn-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

function IconPortfolio() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {defs}
      <g filter="url(#mbn-glass-glow)">
        <path d="M8 4h14a3 3 0 0 1 3 3v2" stroke="url(#mbn-grad-2)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <rect x="4" y="8" width="24" height="20" rx="3.5" fill="url(#mbn-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        <rect x="6.5" y="10.5" width="19" height="15" rx="2" fill="#1A1612" />
        <circle cx="20" cy="15.5" r="2" fill="url(#mbn-grad-1)" />
        <path d="M7.5 24.5l4.5-5 3.5 3.4 2.5-2.6 6 4.2z" fill="url(#mbn-grad-2)" fillOpacity="0.6" />
      </g>
    </svg>
  );
}

function IconBlog() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {defs}
      <g filter="url(#mbn-glass-glow)">
        <rect x="4.5" y="4" width="23" height="24" rx="3.5" fill="url(#mbn-dark)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        <path d="M9.5 4v24" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <path d="M19 4h5v11l-2.5-2-2.5 2z" fill="url(#mbn-grad-1)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <path d="M13 12h5M13 16h5M13 20h5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function IconAbout() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {defs}
      <g filter="url(#mbn-glass-glow)">
        <circle cx="16" cy="9.5" r="5" fill="url(#mbn-dark)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <path d="M4.5 27a11.5 11.5 0 0 1 22.5-2.5c-1.5 1.3-5 1.5-8.5-.5s-7.5-2.5-11.5-1z" fill="url(#mbn-dark)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <circle cx="26.5" cy="6.5" r="2" fill="url(#mbn-grad-1)" />
      </g>
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {defs}
      <g filter="url(#mbn-glass-glow)">
        <path d="M24.4 7.6a11 11 0 1 0 3.1 7.4" stroke="url(#mbn-grad-2)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M16 11.5v9M11.5 16h9" stroke="url(#mbn-grad-1)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="26.5" cy="6.5" r="2" fill="url(#mbn-grad-1)" />
      </g>
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
      <span className="mbn-aurora" aria-hidden="true">
        <span className="mbn-aurora-glow" />
      </span>

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