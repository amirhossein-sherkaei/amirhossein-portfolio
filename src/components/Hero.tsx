"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/MagneticButton";

const ROLES = [
  "طراح و توسعه‌دهنده‌ی وب",
  "خلاق دیجیتال با کمک AI",
  "سازنده‌ی سایت‌های سریع",
];
const ROTATION_MS = 3600;

const MARQUEE_WORDS = [
  "WEB DESIGN",
  "CREATIVE DEVELOPMENT",
  "AI VISUALS",
  "BRAND IDENTITY",
  "MOTION",
  "INTERFACE",
];

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toPersian(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[+d]);
}

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

function useTehranClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      });
      setTime(fmt.format(now));
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);

  return mounted ? toPersian(time) : "--:--";
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const clock = useTehranClock();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;
    const id = window.setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      ROTATION_MS
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="home" className="hero-section">
      {/* ═══════ Ambient background ═══════ */}
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-bg-orb hero-bg-orb-1" />
        <span className="hero-bg-orb hero-bg-orb-2" />
        <span className="hero-bg-grain" />
      </div>

      {/* ═══════ Corners ═══════ */}
      <span className="hero-corner hero-corner-tl" aria-hidden="true" />
      <span className="hero-corner hero-corner-tr" aria-hidden="true" />
      <span className="hero-corner hero-corner-bl" aria-hidden="true" />
      <span className="hero-corner hero-corner-br" aria-hidden="true" />

      <div className="hero-inner">
        {/* ═══════ Masthead ═══════ */}
        <div className="hero-masthead">
          <span className="hero-masthead-side">
            <span className="hero-masthead-dot" aria-hidden="true" />
            <span>پذیرش پروژه · {CURRENT_PERSIAN_YEAR}</span>
          </span>
          <span className="hero-masthead-side hero-masthead-side--latin">
            TEHRAN&nbsp;·&nbsp;{clock}
          </span>
        </div>

        {/* ═══════ Main grid ═══════ */}
        <div className="hero-grid">
          {/* ─── Text column ─── */}
          <div className="hero-main">
            <span className="hero-kicker" aria-hidden="true">
              <span className="hero-kicker-line" />
              <span className="hero-kicker-text">PORTFOLIO · MMXXVI</span>
            </span>

            <h1 className="hero-title">
              <span className="hero-title-line">برای برندهایی</span>
              <span className="hero-title-line hero-title-muted">
                که به «قالب آماده»
              </span>
              <span className="hero-title-line">
                راضی نمی‌شن
                <em className="hero-title-accent">.</em>
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
              طراحی از صفر، سرعت لود زیر ۲ ثانیه، کد کامل به نام شما.
              بدون وابستگی — بدون قالب آماده.
            </p>

            <div className="hero-actions">
              <MagneticButton strength={0.18} radius={80}>
                <Link href="/order" className="hero-btn hero-btn-primary">
                  <span>شروع پروژه</span>
                  <span className="hero-btn-arrow" aria-hidden="true">
                    ←
                  </span>
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.12} radius={70}>
                <a
                  href="#portfolio"
                  className="hero-btn hero-btn-secondary"
                >
                  <span>دیدن نمونه‌کارها</span>
                  <span className="hero-btn-count" aria-hidden="true">
                    ۰۴
                  </span>
                </a>
              </MagneticButton>
            </div>
          </div>

          {/* ═══════ SIGNATURE GLASS CARD — always visible ═══════ */}
          <aside className="hero-card-wrap">
            <article className="hero-card">
              <span className="hero-card-corner hero-card-corner-tl" />
              <span className="hero-card-corner hero-card-corner-tr" />
              <span className="hero-card-corner hero-card-corner-bl" />
              <span className="hero-card-corner hero-card-corner-br" />

              {/* Inner gradient mesh */}
              <div className="hero-card-mesh" aria-hidden="true" />

              {/* Issue number top-right */}
              <div className="hero-card-issue">
                <span className="hero-card-issue-label">ISSUE</span>
                <span className="hero-card-issue-num">
                  Nº&nbsp;{CURRENT_PERSIAN_YEAR}
                </span>
              </div>

              {/* Status pill top-left */}
              <span className="hero-card-status">
                <span className="hero-card-status-dot" aria-hidden="true" />
                <span>آماده همکاری</span>
              </span>

              {/* Big name center */}
              <div className="hero-card-body">
                <span className="hero-card-eyebrow">STUDIO</span>
                <h2 className="hero-card-name">
                  امیرحسین
                  <br />
                  شرکائی
                </h2>
                <p className="hero-card-role">
                  طراح و توسعه‌دهنده‌ی وب
                </p>
              </div>

              {/* Bottom: signature + latin */}
              <div className="hero-card-foot">
                <span className="hero-card-sig" aria-hidden="true">
                  <SignatureMark />
                </span>
                <span className="hero-card-latin">
                  AMIRHOSSEIN&nbsp;·&nbsp;SHERKAEI
                </span>
              </div>
            </article>
          </aside>
        </div>
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
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="212" cy="16" r="2.4" fill="currentColor" />
    </svg>
  );
}