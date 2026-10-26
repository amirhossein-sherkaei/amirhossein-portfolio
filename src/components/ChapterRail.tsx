"use client";

import { useEffect, useState } from "react";

type Chapter = {
  id: string;
  num: string;
  label: string;
  short: string;
};

const CHAPTERS: Chapter[] = [
  { id: "home", num: "۰۱", label: "خانه", short: "HOME" },
  { id: "services", num: "۰۲", label: "خدمات", short: "SERVICES" },
  { id: "portfolio", num: "۰۳", label: "نمونه‌کارها", short: "PORTFOLIO" },
  { id: "process", num: "۰۴", label: "فرآیند", short: "PROCESS" },
  { id: "about", num: "۰۵", label: "درباره من", short: "ABOUT" },
  { id: "why", num: "۰۶", label: "چرا من", short: "WHY ME" },
  { id: "testimonials", num: "۰۷", label: "نظر مشتری‌ها", short: "WORDS" },
  { id: "faq", num: "۰۸", label: "سوالات متداول", short: "FAQ" },
];

export default function ChapterRail() {
  const [activeId, setActiveId] = useState<string>("home");
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  /* ─── Track active chapter ─── */
  useEffect(() => {
    if (!mounted) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;

    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted]);

  /* ─── Visibility ─── */
  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const nearBottom = docH - (y + vh) < 400;
      setVisible(y > 300 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  if (!mounted) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  const activeChapter =
    CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];

  return (
    <nav
      className={`chapter-rail${visible ? " is-visible" : ""}`}
      aria-label="ناوبری فصول"
      aria-hidden={!visible}
    >
      {/* ── Active label — always visible next to the rail ── */}
      <div className="chapter-rail-active" aria-live="polite">
        <span className="chapter-rail-active-num" aria-hidden="true">
          {activeChapter.num}
        </span>
        <span className="chapter-rail-active-label">
          {activeChapter.label}
        </span>
        <span className="chapter-rail-active-short" aria-hidden="true">
          {activeChapter.short}
        </span>
      </div>

      {/* ── Glass container with dots ── */}
      <div className="chapter-rail-box">
        <span className="chapter-rail-line" aria-hidden="true" />

        <ul className="chapter-rail-list">
          {CHAPTERS.map((c) => {
            const active = activeId === c.id;
            const hovered = hoveredId === c.id;
            return (
              <li key={c.id} className="chapter-rail-item-wrap">
                <button
                  type="button"
                  className={`chapter-rail-item${
                    active ? " is-active" : ""
                  }${hovered ? " is-hovered" : ""}`}
                  onClick={() => handleClick(c.id)}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(c.id)}
                  onBlur={() => setHoveredId(null)}
                  aria-label={`برو به بخش ${c.label}`}
                  aria-current={active ? "true" : undefined}
                >
                  <span
                    className="chapter-rail-dot"
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}