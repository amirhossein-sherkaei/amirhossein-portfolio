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

function usePersianDate() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState({
    day: "--",
    month: "--",
    year: "----",
    weekday: "--",
  });

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat("fa-IR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
        timeZone: "Asia/Tehran",
      });
      const parts = fmt.formatToParts(now);
      const get = (t: string) =>
        parts.find((p) => p.type === t)?.value ?? "--";
      setDate({
        day: get("day"),
        month: get("month"),
        year: get("year").replace(/[^\u06F0-\u06F9]/g, ""),
        weekday: get("weekday"),
      });
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);

  return mounted
    ? date
    : { day: "--", month: "--", year: "----", weekday: "--" };
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const clock = useTehranClock();
  const persianDate = usePersianDate();

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
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-bg-orb hero-bg-orb-1" />
        <span className="hero-bg-orb hero-bg-orb-2" />
        <span className="hero-bg-orb hero-bg-orb-3" />
        <span className="hero-bg-grid" />
        <span className="hero-bg-grain" />
      </div>

      <div className="hero-ruler hero-ruler-top" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, i) => (
          <span key={i}>{toPersian(String(i).padStart(2, "0"))}</span>
        ))}
      </div>
      <div className="hero-ruler hero-ruler-left" aria-hidden="true">
        {["A", "B", "C", "D", "E", "F", "G", "H"].map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>

      <span className="hero-crosshair hero-crosshair-tl" aria-hidden="true">
        <CrosshairMark />
      </span>
      <span className="hero-crosshair hero-crosshair-tr" aria-hidden="true">
        <CrosshairMark />
      </span>
      <span className="hero-crosshair hero-crosshair-bl" aria-hidden="true">
        <CrosshairMark />
      </span>
      <span className="hero-crosshair hero-crosshair-br" aria-hidden="true">
        <CrosshairMark />
      </span>

      <div className="hero-inner">
        <div className="hero-masthead">
          <span className="hero-masthead-cell">
            <span className="hero-masthead-dot" aria-hidden="true" />
            <span>پذیرش پروژه · {CURRENT_PERSIAN_YEAR}</span>
          </span>
          <span className="hero-masthead-cell hero-masthead-cell--center">
            AMIRHOSSEIN&nbsp;SHORAKAEI
          </span>
          <span className="hero-masthead-cell hero-masthead-cell--latin">
            <span className="hero-masthead-coord">35.6892°N · 51.3890°E</span>
            <span className="hero-masthead-clock">{clock}</span>
          </span>
        </div>

        <div className="hero-grid">
          <div className="hero-main">
            <span className="hero-kicker" aria-hidden="true">
              <span className="hero-kicker-line" />
              <span className="hero-kicker-text">
                SECTION&nbsp;·&nbsp;01&nbsp;·&nbsp;INTRO
              </span>
            </span>

            <h1 className="hero-title">
              <span className="hero-title-line">برای برندهایی</span>
              <span className="hero-title-line hero-title-muted">
                که به «قالب آماده»
              </span>
              <span className="hero-title-line">
                <span className="ink-word">راضی نمی‌شن</span>
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
                  <span className="ink-word ink-word--on-dark">
                    شروع پروژه
                  </span>
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
                  <span className="ink-word">دیدن نمونه‌کارها</span>
                  <span className="hero-btn-count" aria-hidden="true">
                    ۰۴
                  </span>
                </a>
              </MagneticButton>
            </div>
          </div>

          <aside className="hero-bento" aria-label="کارت هویت">
            <article className="hero-bento-cell hero-bento-cell--name">
              <span className="hero-bento-cell-mesh" aria-hidden="true" />
              <span className="hero-bento-num" aria-hidden="true">
                ۰۱
              </span>
              <span className="hero-bento-status">
                <span className="hero-bento-status-dot" aria-hidden="true" />
                آماده همکاری
              </span>
              <div className="hero-bento-body">
                <span className="hero-bento-eyebrow">STUDIO</span>
                <h2 className="hero-bento-name">
                  امیرحسین
                  <br />
                  شرکائی
                </h2>
                <p className="hero-bento-role">
                  طراح و توسعه‌دهنده‌ی وب
                </p>
              </div>
            </article>

            <article className="hero-bento-cell hero-bento-cell--clock">
              <span className="hero-bento-num" aria-hidden="true">
                ۰۲
              </span>
              <span className="hero-bento-label">TEHRAN</span>
              <span className="hero-bento-clock-time">{clock}</span>
              <span className="hero-bento-live">
                <span className="hero-bento-live-dot" aria-hidden="true" />
                LIVE
              </span>
            </article>

            <article className="hero-bento-cell hero-bento-cell--date">
              <span className="hero-bento-num" aria-hidden="true">
                ۰۳
              </span>
              <span className="hero-bento-label">TODAY</span>

              <div className="hero-bento-date">
                <span className="hero-bento-date-weekday">
                  {persianDate.weekday}
                </span>
                <span className="hero-bento-date-day">
                  {persianDate.day}
                </span>
                <span className="hero-bento-date-month">
                  {persianDate.month}
                </span>
                <span className="hero-bento-date-year">
                  {persianDate.year}
                </span>
              </div>
            </article>

            <article className="hero-bento-cell hero-bento-cell--num">
              <span className="hero-bento-cell-mesh" aria-hidden="true" />
              <span className="hero-bento-num" aria-hidden="true">
                ۰۴
              </span>
              <span className="hero-bento-label">RES / ۱۰۰</span>
              <span className="hero-bento-bignum">
                ۹۹<em>+</em>
              </span>
              <span className="hero-bento-sub">امتیاز تجربه‌ی کاربر</span>
            </article>
          </aside>
        </div>
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

function CrosshairMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="0.7" />
      <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}