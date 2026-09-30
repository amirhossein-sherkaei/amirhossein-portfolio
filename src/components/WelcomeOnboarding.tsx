"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "welcome-seen-v2";

const STEPS = [
  {
    id: "welcome",
    num: "۰۱",
    eyebrow: "WELCOME",
    title: "به پورتفولیو",
    titleEm: "امیرحسین خوش آمدی.",
    subtitle:
      "اینجا کارهای من رو می‌بینی — طراحی و توسعه‌ی وب‌سایت‌های اختصاصی با کمک هوش مصنوعی.",
    cta: "بزن بریم",
    items: [],
  },
  {
    id: "guide",
    num: "۰۲",
    eyebrow: "THE MAP",
    title: "چهار مسیر در",
    titleEm: "این پورتفولیو.",
    subtitle: "هر بخش رو می‌تونی از منوی بالا یا پایین ببینی.",
    cta: "ادامه",
    items: [
      {
        num: "۰۱",
        title: "نمونه‌کارها",
        text: "پروژه‌های واقعی با جزئیات کامل.",
      },
      {
        num: "۰۲",
        title: "خدمات",
        text: "چهار مسیر برای همکاری.",
      },
      {
        num: "۰۳",
        title: "فرآیند",
        text: "چهار قدم تا تحویل نهایی.",
      },
      {
        num: "۰۴",
        title: "بلاگ",
        text: "یادداشت‌هایی درباره‌ی طراحی.",
      },
    ],
  },
  {
    id: "start",
    num: "۰۳",
    eyebrow: "START",
    title: "می‌خوای پروژه‌ت رو",
    titleEm: "شروع کنیم؟",
    subtitle:
      "فرم ساده‌ی شروع پروژه — چند خط کافیه. حداکثر ۲۴ ساعت جواب می‌گیری.",
    cta: "شروع پروژه",
    items: [],
  },
];

export default function WelcomeOnboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState<"next" | "prev">("next");

  const cardRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  /* ─── Check localStorage ─── */
  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
      const t = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(t);
    } catch {
      /* ignore */
    }
  }, []);

  /* ─── Body scroll lock ─── */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* ─── Focus trap + auto focus ─── */
  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const t = window.setTimeout(() => primaryBtnRef.current?.focus(), 120);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      /* Arrow navigation */
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "ArrowRight") handlePrev();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lastFocusedRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  const handleClose = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const handleNext = useCallback(() => {
    setStep((cur) => {
      if (cur < STEPS.length - 1) {
        setDir("next");
        return cur + 1;
      }
      handleClose();
      return cur;
    });
  }, [handleClose]);

  const handlePrev = useCallback(() => {
    setStep((cur) => {
      if (cur > 0) {
        setDir("prev");
        return cur - 1;
      }
      return cur;
    });
  }, []);

  if (!mounted || !open) return null;

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-subtitle"
    >
      <div
        className="welcome-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div ref={cardRef} className="welcome-card">
        {/* ─── Editorial corners ─── */}
        <span className="welcome-corner welcome-corner-tl" aria-hidden="true" />
        <span className="welcome-corner welcome-corner-tr" aria-hidden="true" />
        <span className="welcome-corner welcome-corner-bl" aria-hidden="true" />
        <span className="welcome-corner welcome-corner-br" aria-hidden="true" />

        {/* ─── Editorial ruler (top) ─── */}
        <div className="welcome-ruler" aria-hidden="true">
          {Array.from({ length: 13 }).map((_, i) => (
            <span key={i}>
              {String(i).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d])}
            </span>
          ))}
        </div>

        {/* ─── Masthead ─── */}
        <header className="welcome-masthead">
          <span className="welcome-masthead-left">GUIDE · 2026</span>

          <div
            className="welcome-progress"
            role="tablist"
            aria-label="مراحل معرفی"
          >
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-label={`مرحله ${i + 1} از ${STEPS.length}`}
                className={`welcome-progress-dot${
                  i === step ? " is-active" : ""
                }${i < step ? " is-done" : ""}`}
                onClick={() => {
                  setDir(i > step ? "next" : "prev");
                  setStep(i);
                }}
              />
            ))}
          </div>

          <span className="welcome-masthead-right">
            AMIRHOSSEIN SHORAKAEI
          </span>
        </header>

        {/* ─── Step number ─── */}
        <div className="welcome-step-num">
          <span className="welcome-step-num-current">{current.num}</span>
          <span className="welcome-step-num-sep" aria-hidden="true">
            /
          </span>
          <span className="welcome-step-num-total">
            {"۰۳"}
          </span>
        </div>

        {/* ─── Body ─── */}
        <div className="welcome-body" key={step} data-dir={dir}>
          <span className="welcome-eyebrow">{current.eyebrow}</span>

          <h2 id="welcome-title" className="welcome-title">
            {current.title}
            <br />
            <em className="welcome-title-em">{current.titleEm}</em>
          </h2>

          <p id="welcome-subtitle" className="welcome-subtitle">
            {current.subtitle}
          </p>

          {current.items.length > 0 && (
            <ul className="welcome-chapters">
              {current.items.map((item) => (
                <li key={item.num} className="welcome-chapter">
                  <span className="welcome-chapter-num">{item.num}</span>
                  <div className="welcome-chapter-body">
                    <h3 className="welcome-chapter-title">{item.title}</h3>
                    <p className="welcome-chapter-text">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ─── Footer ─── */}
        <footer className="welcome-footer">
          <button
            type="button"
            className="welcome-skip"
            onClick={handleClose}
          >
            رد کردن
          </button>

          <div className="welcome-footer-actions">
            {!isFirst && (
              <button
                type="button"
                className="welcome-nav-btn welcome-nav-prev"
                onClick={handlePrev}
                aria-label="مرحله قبل"
              >
                <span aria-hidden="true">→</span>
                <span>قبلی</span>
              </button>
            )}

            <button
              ref={primaryBtnRef}
              type="button"
              className="welcome-nav-btn welcome-nav-next"
              onClick={handleNext}
            >
              <span>{isLast ? current.cta : current.cta}</span>
              <span aria-hidden="true">←</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}