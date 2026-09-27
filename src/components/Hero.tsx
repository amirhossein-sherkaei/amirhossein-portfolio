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

const CURRENT_TASKS = [
  "در حال طراحی فروشگاه نیلا",
  "نوشتن مقاله‌ی جدید بلاگ",
  "ساخت ویدیوی تبلیغاتی لومن",
];

const MARQUEE_WORDS = [
  "WEB DESIGN",
  "CREATIVE DEVELOPMENT",
  "AI VISUALS",
  "BRAND IDENTITY",
  "MOTION",
  "INTERFACE",
  "STORYTELLING",
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

/* ═══════════════════════════════════════════════════════════
   LIVE TEHRAN CLOCK — updates every second
   ═══════════════════════════════════════════════════════════ */
function useTehranClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      });
      const parts = fmt.formatToParts(now);
      const get = (t: string) =>
        parts.find((p) => p.type === t)?.value ?? "00";
      setTime(`${get("hour")}:${get("minute")}:${get("second")}`);
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return mounted ? toPersian(time) : "--:--:--";
}

/* ═══════════════════════════════════════════════════════════
   LIVE TASK TICKER — rotates every 4s
   ═══════════════════════════════════════════════════════════ */
function useTaskTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % CURRENT_TASKS.length),
      4000
    );
    return () => window.clearInterval(id);
  }, []);

  return CURRENT_TASKS[index];
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const clock = useTehranClock();
  const currentTask = useTaskTicker();

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
        <span className="hero-bg-grid" />
      </div>

      {/* ═══════ Signature: Aperture (unique) ═══════ */}
      <div className="hero-aperture" aria-hidden="true">
        <ApertureMark />
      </div>

      {/* ═══════ Corner marks ═══════ */}
      <span className="hero-corner hero-corner-tl" aria-hidden="true" />
      <span className="hero-corner hero-corner-tr" aria-hidden="true" />
      <span className="hero-corner hero-corner-bl" aria-hidden="true" />
      <span className="hero-corner hero-corner-br" aria-hidden="true" />

      {/* ═══════ Vertical Persian date rail ═══════ */}
      <aside className="hero-rail" aria-hidden="true">
        <span className="hero-rail-line" />
        <span className="hero-rail-text">
          {CURRENT_PERSIAN_YEAR}&nbsp;·&nbsp;TEHRAN&nbsp;·&nbsp;IRAN
        </span>
        <span className="hero-rail-line" />
      </aside>

      <div className="hero-inner">
        {/* ═══════ Top bar: LIVE + clock ═══════ */}
        <div className="hero-topbar">
          <span className="hero-live">
            <span className="hero-live-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="hero-live-text">LIVE</span>
          </span>

          <span className="hero-clock" aria-hidden="true">
            <span className="hero-clock-label">TEHRAN</span>
            <span className="hero-clock-time">{clock}</span>
          </span>
        </div>

        {/* ═══════ Masthead ═══════ */}
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

        {/* ═══════ Main grid ═══════ */}
        <div className="hero-grid">
          {/* ─── Text column ─── */}
          <div className="hero-main">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              <span>پذیرش پروژه · {CURRENT_PERSIAN_YEAR}</span>
            </span>

            <h1 className="hero-title">
              <span className="hero-title-line">برای برندهایی که</span>
              <span className="hero-title-line hero-title-muted">
                با «قالب آماده»
              </span>
              <span className="hero-title-line">
                راضی نمی‌شن<em className="hero-title-accent">.</em>
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
              طراحی اختصاصی از صفر، سرعت لود زیر ۲ ثانیه، و کد کامل به
              نام شما. بدون وابستگی، بدون قالب آماده، بدون هزینه‌ی
              پنهان.
            </p>

            <div className="hero-actions">
              <MagneticButton strength={0.18} radius={80}>
                <Link href="/order" className="hero-btn hero-btn-primary">
                  <span className="hero-btn-text">شروع پروژه</span>
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
                  <span className="hero-btn-text">دیدن نمونه‌کارها</span>
                  <span className="hero-btn-count" aria-hidden="true">
                    ۰۴
                  </span>
                </a>
              </MagneticButton>
            </div>

            <div className="hero-trust" aria-label="اثبات‌های کوتاه">
              <div className="hero-trust-item">
                <strong className="hero-trust-value">۹۹</strong>
                <span className="hero-trust-label">RES / ۱۰۰</span>
              </div>
              <div className="hero-trust-item">
                <strong className="hero-trust-value">۲۴</strong>
                <span className="hero-trust-label">ساعت پاسخ</span>
              </div>
              <div className="hero-trust-item">
                <strong className="hero-trust-value">۱۰۰٪</strong>
                <span className="hero-trust-label">کد به نام شما</span>
              </div>
            </div>
          </div>

          {/* ─── Glass signature card ─── */}
          <aside className="hero-visual" aria-hidden="true">
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

              <div className="hero-glass-currently">
                <span className="hero-glass-currently-label">
                  الان در حال
                </span>
                <span
                  key={currentTask}
                  className="hero-glass-currently-text"
                >
                  {currentTask}
                </span>
              </div>

              <div className="hero-glass-capacity">
                <span className="hero-glass-capacity-label">
                  ظرفیت این ماه
                </span>
                <div className="hero-glass-capacity-dots">
                  <span className="is-open" />
                  <span className="is-open" />
                  <span className="is-filled" />
                  <span className="is-filled" />
                </div>
                <span className="hero-glass-capacity-count">
                  ۲ از ۴ باز
                </span>
              </div>

              <div className="hero-glass-clock">
                <span className="hero-glass-clock-label">تهران</span>
                <span className="hero-glass-clock-time">{clock}</span>
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

        {/* ═══════ Footer ═══════ */}
        <footer className="hero-footer">
          <span className="hero-signature" aria-hidden="true">
            <SignatureMark />
          </span>
          <span className="hero-footer-meta">
            <span>AMIRHOSSEIN&nbsp;SHERKAEI</span>
            <span>PORTFOLIO&nbsp;·&nbsp;{CURRENT_PERSIAN_YEAR}</span>
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

/* ═══════════════════════════════════════════════════════════
   APERTURE — signature visual
   ═══════════════════════════════════════════════════════════ */
function ApertureMark() {
  const blades = [0, 60, 120, 180, 240, 300];
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <circle
        cx="100"
        cy="100"
        r="94"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <circle
        cx="100"
        cy="100"
        r="56"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <circle
        cx="100"
        cy="100"
        r="22"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <g transform="rotate(8 100 100)">
        {blades.map((angle) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = 100 + 22 * Math.cos(rad);
          const y1 = 100 + 22 * Math.sin(rad);
          const rad2 = ((angle - 90 + 24) * Math.PI) / 180;
          const x2 = 100 + 94 * Math.cos(rad2);
          const y2 = 100 + 94 * Math.sin(rad2);
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="0.7"
              opacity="0.55"
            />
          );
        })}
      </g>
      <circle
        cx="100"
        cy="100"
        r="2"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
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