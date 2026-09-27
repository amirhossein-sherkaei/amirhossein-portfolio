"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/MagneticButton";

const ROLES = [
  "طراح و توسعه‌دهنده‌ی وب",
  "خلاق دیجیتال با کمک AI",
  "سازنده‌ی سایت‌های سریع",
];
const ROTATION_MS = 3400;

const TECH_STACK = ["Next.js", "React", "TypeScript", "AI"];

const MARQUEE_WORDS = [
  "WEB DESIGN",
  "CREATIVE DEVELOPMENT",
  "AI VISUALS",
  "BRAND IDENTITY",
  "MOTION",
  "EXPERIMENTATION",
  "INTERFACE",
  "STORYTELLING",
];

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % ROLES.length);
    }, ROTATION_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="home" className="hero-section">
      {/* ═══════ Ambient aurora ═══════ */}
      <div className="hero-aurora" aria-hidden="true">
        <span className="hero-aurora-blob hero-aurora-blob-1" />
        <span className="hero-aurora-blob hero-aurora-blob-2" />
        <span className="hero-aurora-blob hero-aurora-blob-3" />
        <span className="hero-aurora-grid" />
      </div>

      {/* ═══════ Corner marks ═══════ */}
      <span className="hero-corner hero-corner-tl" aria-hidden="true" />
      <span className="hero-corner hero-corner-tr" aria-hidden="true" />
      <span className="hero-corner hero-corner-bl" aria-hidden="true" />
      <span className="hero-corner hero-corner-br" aria-hidden="true" />

      {/* ═══════ Vertical rail ═══════ */}
      <div className="hero-rail" aria-hidden="true">
        <span className="hero-rail-line" />
        <span className="hero-rail-text">
          AMIRHOSSEIN&nbsp;·&nbsp;SHERKAEI&nbsp;·&nbsp;{CURRENT_PERSIAN_YEAR}
        </span>
        <span className="hero-rail-line" />
      </div>

      <div className="hero-inner">
        {/* ═══════ Editorial masthead ═══════ */}
        <div className="hero-masthead">
          <span className="hero-masthead-left">
            VOL.&nbsp;01&nbsp;—&nbsp;ISSUE&nbsp;{CURRENT_PERSIAN_YEAR}
          </span>
          <span className="hero-masthead-center" aria-hidden="true">
            ✦
          </span>
          <span className="hero-masthead-right">
            PORTFOLIO&nbsp;·&nbsp;SPECIMEN
          </span>
        </div>

        {/* ═══════ Split grid: main + glass aside ═══════ */}
        <div className="hero-grid">
          {/* ─── Main column ─── */}
          <div className="hero-main">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              <span>طراحی وب · فرانت‌اند · خلاقیت با AI</span>
            </span>

            <h1 className="hero-title">
              <span className="hero-title-line">سایتی که</span>
              <span className="hero-title-line hero-title-muted">
                بازدیدکننده رو
              </span>
              <span className="hero-title-line">
                <em className="hero-title-em">مشتری</em> می‌کنه.
              </span>
            </h1>

            <p className="hero-role">
              <span className="hero-role-dot" aria-hidden="true" />
              <span
                key={roleIndex}
                className="hero-role-text"
                aria-hidden="true"
              >
                {ROLES[roleIndex]}
              </span>
              <span className="sr-only">
                طراح و توسعه‌دهنده‌ی وب، خلاق دیجیتال با هوش مصنوعی،
                سازنده‌ی سایت‌های سریع
              </span>
            </p>

            <p className="hero-description">
              از صفر طراحی می‌شه، زیر ۲ ثانیه لود می‌شه، روی موبایل
              عالی کار می‌کنه. برای کسب‌وکارهایی که به قالب آماده راضی
              نیستن.
            </p>

            <div className="hero-actions">
              <MagneticButton strength={0.2} radius={70}>
                <Link href="/order" className="btn btn-primary">
                  شروع پروژه
                  <span aria-hidden="true">←</span>
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.15} radius={60}>
                <a href="#portfolio" className="btn btn-secondary">
                  دیدن نمونه‌کارها
                </a>
              </MagneticButton>
            </div>

            <div className="hero-tech-row">
              <span className="hero-tech-label">Stack</span>
              <ul className="hero-tech" aria-label="تکنولوژی‌های مورد استفاده">
                {TECH_STACK.map((tech) => (
                  <li key={tech} className="hero-tech-chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── Glass aside card ─── */}
          <aside className="hero-aside" aria-hidden="true">
            <div className="hero-glass">
              <span className="hero-glass-corner hero-glass-corner-tl" />
              <span className="hero-glass-corner hero-glass-corner-tr" />
              <span className="hero-glass-corner hero-glass-corner-bl" />
              <span className="hero-glass-corner hero-glass-corner-br" />

              <div className="hero-glass-head">
                <span className="hero-glass-live">
                  <span className="hero-glass-live-dot" />
                  LIVE
                </span>
                <span className="hero-glass-issue">
                  Nº&nbsp;{CURRENT_PERSIAN_YEAR}
                </span>
              </div>

              <div className="hero-glass-status">
                <span className="hero-glass-status-label">وضعیت</span>
                <span className="hero-glass-status-value">
                  <span className="hero-glass-status-pulse" />
                  پذیرش پروژه
                </span>
              </div>

              <div className="hero-glass-stats">
                <div className="hero-glass-stat">
                  <strong>۹۹</strong>
                  <span>RES / ۱۰۰</span>
                </div>
                <div className="hero-glass-stat">
                  <strong>۲۴</strong>
                  <span>ساعت پاسخ</span>
                </div>
                <div className="hero-glass-stat">
                  <strong>۱۰۰٪</strong>
                  <span>کد اختصاصی</span>
                </div>
              </div>

              <div className="hero-glass-foot">
                <span className="hero-glass-name">امیرحسین شرکائی</span>
                <span className="hero-glass-latin">
                  AMIRHOSSEIN&nbsp;SHERKAEI
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* ═══════ Footer signature ═══════ */}
        <footer className="hero-footer">
          <div className="hero-signature">
            <span className="hero-signature-mark" aria-hidden="true">
              <SignatureMark />
            </span>
            <span className="hero-signature-name">
              <strong>امیرحسین شرکائی</strong>
              <small>AMIRHOSSEIN SHERKAEI</small>
            </span>
          </div>

          <span className="hero-footer-meta">
            <span>PORTFOLIO</span>
            <span>01 / 04</span>
          </span>
        </footer>
      </div>

      {/* ═══════ Marquee ═══════ */}
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span key={i} className="hero-marquee-item">
              {word}
              <span className="hero-marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignatureMark() {
  return (
    <svg
      viewBox="0 0 220 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 34C24 14 46 40 70 22C88 8 106 34 130 22C150 12 172 30 206 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="212" cy="16" r="2.2" fill="currentColor" />
    </svg>
  );
}