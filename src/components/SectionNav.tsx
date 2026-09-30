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

export default function SectionNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* ─── Track active section ─── */
  useEffect(() => {
    if (!mounted) return;
    if (typeof IntersectionObserver === "undefined") return;

    const els = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target.id) setActiveId(top.target.id);
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted]);

  /* ─── Visibility + progress ─── */
  useEffect(() => {
    if (!mounted) return;

    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const nearBottom = docH - (y + vh) < 400;

      setVisible(y > 500 && !nearBottom);

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
  }, [mounted, activeId]);

  if (!mounted) return null;

  const active = SECTIONS.find((s) => s.id === activeId);
  const show = visible && active;

  const handleSubClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const offset = 140;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <nav
      className={`section-nav${show ? " is-visible" : ""}`}
      aria-label="ناوبری بخش‌ها"
      aria-hidden={!show}
    >
      <div className="section-nav-inner">
        {active && (
          <>
            <div className="section-nav-current">
              <span className="section-nav-num">{active.num}</span>
              <span className="section-nav-sep" aria-hidden="true">
                ·
              </span>
              <span className="section-nav-label">{active.label}</span>
            </div>

            {active.subs.length > 0 && (
              <ul className="section-nav-list">
                {active.subs.map((sub) => (
                  <li key={sub.num + sub.label}>
                    <button
                      type="button"
                      className="section-nav-item"
                      onClick={() => handleSubClick(sub.target)}
                    >
                      <span className="section-nav-item-num">
                        {sub.num}
                      </span>
                      <span className="section-nav-item-label">
                        {sub.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <span className="section-nav-short" aria-hidden="true">
              {active.short}
            </span>
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