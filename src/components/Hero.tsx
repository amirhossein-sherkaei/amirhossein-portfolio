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

const TECH_STACK = ["HTML", "CSS", "JavaScript", "Next.js", "AI"];

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
      <span className="hero-corner hero-corner-tl" aria-hidden="true" />
      <span className="hero-corner hero-corner-tr" aria-hidden="true" />
      <span className="hero-corner hero-corner-bl" aria-hidden="true" />
      <span className="hero-corner hero-corner-br" aria-hidden="true" />

      <div className="hero-rail" aria-hidden="true">
        <span className="hero-rail-line" />
        <span className="hero-rail-text">
          AMIRHOSSEIN&nbsp;·&nbsp;SHERKAEI&nbsp;·&nbsp;{CURRENT_PERSIAN_YEAR}
        </span>
        <span className="hero-rail-line" />
      </div>

      <div className="hero-inner">
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

        <div className="hero-top">
          <span className="eyebrow">
            طراحی وب · فرانت‌اند · خلاقیت با AI
          </span>

          <span className="hero-top-meta">
            <span className="hero-top-meta-dot" aria-hidden="true" />
            <span>پذیرش پروژه · {CURRENT_PERSIAN_YEAR}</span>
          </span>
        </div>

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
            طراح و توسعه‌دهنده‌ی وب، خلاق دیجیتال با هوش مصنوعی، سازنده‌ی
            سایت‌های سریع
          </span>
        </p>

        <p className="hero-description">
          از صفر طراحی می‌شه، زیر ۲ ثانیه لود می‌شه، روی موبایل عالی
          کار می‌کنه. برای کسب‌وکارهایی که به قالب آماده راضی نیستن.
        </p>

        <ul className="hero-tech" aria-label="تکنولوژی‌های مورد استفاده">
          {TECH_STACK.map((tech) => (
            <li key={tech} className="hero-tech-chip">
              {tech}
            </li>
          ))}
        </ul>

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

          <span className="hero-arrow" aria-hidden="true">
            <svg
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12C16 20 24 32 26 46M26 46L18 42M26 46L34 38"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

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