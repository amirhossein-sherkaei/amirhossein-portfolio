"use client";

import { useEffect, useState } from "react";

type Sub = { num: string; label: string; target: string };

type Section = {
  id: string;
  num: string;
  label: string;
  short: string;
  subs: Sub[];
};

const SECTIONS: Section[] = [
  {
    id: "services",
    num: "01",
    label: "خدمات",
    short: "SERVICES",
    subs: [
      { num: "01", label: "وب اختصاصی", target: "services" },
      { num: "02", label: "وب + AI", target: "services" },
      { num: "03", label: "تبلیغات هوشمند", target: "services" },
      { num: "04", label: "ویدیوی تبلیغاتی", target: "services" },
    ],
  },
  {
    id: "portfolio",
    num: "02",
    label: "نمونه‌کارها",
    short: "PORTFOLIO",
    subs: [
      { num: "01", label: "آرکا", target: "portfolio" },
      { num: "02", label: "نیلا", target: "portfolio" },
      { num: "03", label: "ویرا", target: "portfolio" },
      { num: "04", label: "لومن", target: "portfolio" },
    ],
  },
  {
    id: "process",
    num: "03",
    label: "فرآیند",
    short: "PROCESS",
    subs: [
      { num: "01", label: "گفت‌وگو", target: "process-step-1" },
      { num: "02", label: "طراحی", target: "process-step-2" },
      { num: "03", label: "توسعه", target: "process-step-3" },
      { num: "04", label: "تحویل", target: "process-step-4" },
    ],
  },
  {
    id: "about",
    num: "04",
    label: "درباره من",
    short: "ABOUT",
    subs: [],
  },
  {
    id: "why",
    num: "05",
    label: "چرا من",
    short: "WHY ME",
    subs: [
      { num: "01", label: "بدون قالب", target: "why" },
      { num: "02", label: "دقت در جزئیات", target: "why" },
      { num: "03", label: "طراحی + کد", target: "why" },
    ],
  },
  {
    id: "faq",
    num: "08",
    label: "سوالات متداول",
    short: "FAQ",
    subs: [],
  },
];

const STYLE_ID = "section-nav-inline-styles";

const CSS = `
@media (max-width: 720px) {
  .section-nav {
    position: fixed;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    inset-inline: 12px;
    z-index: 95;
    display: block;
    max-width: 460px;
    margin: 0 auto;
    padding: 10px 12px;
    border-radius: 22px;
    background: #fff9f4f2;
    backdrop-filter: blur(24px) saturate(1.7);
    -webkit-backdrop-filter: blur(24px) saturate(1.7);
    border: 1px solid rgba(10,9,8,0.08);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.5),
      0 4px 12px -4px rgba(10,9,8,0.08),
      0 16px 40px -12px rgba(10,9,8,0.18);
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
    overflow: hidden;
    font-family: var(--font-sans, system-ui, sans-serif);
    direction: rtl;
  }
  .section-nav.is-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  [data-theme="dark"] .section-nav {
    background: rgba(20,18,15,0.85);
    border-color: rgba(245,239,230,0.1);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.06),
      0 4px 12px -4px rgba(0,0,0,0.3),
      0 16px 40px -12px rgba(0,0,0,0.5);
  }
  .section-nav-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  .section-nav-current {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding-inline-end: 10px;
    border-inline-end: 1px solid rgba(10,9,8,0.08);
  }
  [data-theme="dark"] .section-nav-current {
    border-inline-end-color: rgba(245,239,230,0.1);
  }
  .section-nav-badge {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: #e94b2c;
    color: #fff;
    font-family: ui-monospace, monospace;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    box-shadow: 0 4px 12px -4px rgba(233,75,44,0.4);
    flex-shrink: 0;
  }
  .section-nav-titles {
    display: grid;
    gap: 1px;
    min-width: 0;
  }
  .section-nav-label {
    font-size: 12.5px;
    font-weight: 700;
    color: #0a0908;
    line-height: 1.2;
    white-space: nowrap;
  }
  [data-theme="dark"] .section-nav-label {
    color: #f5efe6;
  }
  .section-nav-short, .section-nav-divider {
    display: none;
  }
  .section-nav-list {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    flex: 1;
    min-width: 0;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
  }
  .section-nav-list::-webkit-scrollbar { display: none; }
  .section-nav-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 11px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: #efe9e0;
    color: #3f3a34;
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: transform 220ms ease, background 220ms ease;
    -webkit-tap-highlight-color: transparent;
  }
  [data-theme="dark"] .section-nav-item {
    background: #1a1815;
    color: #c9c2b8;
  }
  .section-nav-item:active {
    transform: scale(0.94);
    background: rgba(233,75,44,0.08);
    border-color: #e94b2c;
    color: #e94b2c;
  }
  .section-nav-item-num {
    font-family: ui-monospace, monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #e94b2c;
    opacity: 0.8;
  }
  .section-nav-item-label { font-size: 11.5px; }
  .section-nav-progress {
    position: absolute;
    bottom: 0;
    inset-inline: 0;
    height: 2px;
    background: rgba(10,9,8,0.05);
    overflow: hidden;
  }
  .section-nav-progress-fill {
    display: block;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #ff7a45, #e94b2c);
    transform-origin: right center;
    transition: transform 120ms linear;
  }
}
@media (prefers-reduced-motion: reduce) {
  .section-nav, .section-nav-item, .section-nav-progress-fill {
    transition: none !important;
  }
  .section-nav { transform: none !important; }
}
`;

export default function MobileNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // detect mobile viewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // inject CSS once
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);

  // track active section
  useEffect(() => {
    if (!mounted || !isMobile) return;
    if (typeof IntersectionObserver === "undefined") return;

    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
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
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, isMobile]);

  // scroll progress + visibility
  useEffect(() => {
    if (!mounted || !isMobile) return;

    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const nearBottom = docH - (y + vh) < 500;
      setScrolled(y > 400 && !nearBottom);

      if (activeId) {
        const el = document.getElementById(activeId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const seen = Math.max(0, -rect.top);
          const total = Math.max(1, rect.height);
          setProgress(Math.max(0, Math.min(1, seen / total)));
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, isMobile, activeId]);

  // don't render on server, desktop, or before mount
  if (!mounted || !isMobile) return null;

  const active = SECTIONS.find((s) => s.id === activeId);
  const hasSubs = !!(active && active.subs.length > 0);
  const show = scrolled && hasSubs;

  const handleSubClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const offset = 160;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <nav
      className={"section-nav" + (show ? " is-visible" : "")}
      aria-label="ناوبری بخش‌ها"
      aria-hidden={!show}
    >
      <div className="section-nav-inner">
        {active && (
          <>
            <div className="section-nav-current">
              <span className="section-nav-badge" aria-hidden="true">
                {active.num}
              </span>
              <div className="section-nav-titles">
                <span className="section-nav-label">{active.label}</span>
                <span className="section-nav-short" aria-hidden="true">
                  {active.short}
                </span>
              </div>
            </div>

            <span className="section-nav-divider" aria-hidden="true" />

            {active.subs.length > 0 && (
              <ul className="section-nav-list">
                {active.subs.map((sub) => (
                  <li key={sub.num + sub.label}>
                    <button
                      type="button"
                      className="section-nav-item"
                      onClick={() => handleSubClick(sub.target)}
                    >
                      <span className="section-nav-item-num">{sub.num}</span>
                      <span className="section-nav-item-label">
                        {sub.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <span className="section-nav-progress" aria-hidden="true">
        <span
          className="section-nav-progress-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </span>
    </nav>
  );
}