"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import MagneticButton from "@/components/MagneticButton";

type LivePost = {
  slug: string;
  title: string;
  date: string;
};

type HeroProps = {
  latestPost: LivePost | null;
  archivePost: LivePost | null;
  totalPosts: number;
  totalProjects: number;
};

const LIVE_ROTATION_MS = 5500;

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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

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

    if (!visible) {
      return () => document.removeEventListener("visibilitychange", onVis);
    }

    const id = window.setInterval(update, 1000);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [visible]);

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

function useRelativeTime(iso: string | null): string {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!iso) return;
    const compute = () => {
      const diff = Date.now() - new Date(iso).getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= 0) setText("امروز");
      else if (days === 1) setText("دیروز");
      else if (days < 30) setText(`${toPersian(days)} روز پیش`);
      else if (days < 365)
        setText(`${toPersian(Math.floor(days / 30))} ماه پیش`);
      else setText(`${toPersian(Math.floor(days / 365))} سال پیش`);
    };
    compute();
    const id = window.setInterval(compute, 120000);
    return () => window.clearInterval(id);
  }, [iso]);

  return mounted ? text : "";
}

export default function Hero({
  latestPost,
  archivePost,
  totalPosts,
  totalProjects,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const [liveIndex, setLiveIndex] = useState(0);
  const [livePaused, setLivePaused] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  const clock = useTehranClock();
  const persianDate = usePersianDate();
  const latestAgo = useRelativeTime(latestPost?.date ?? null);
  const archiveAgo = useRelativeTime(archivePost?.date ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => {
      setTabVisible(!document.hidden);
      document.documentElement.setAttribute(
        "data-tab-hidden",
        document.hidden ? "true" : "false"
      );
    };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (heroInView) section.classList.add("hero-in-view");
    else section.classList.remove("hero-in-view");
  }, [heroInView]);

  const shouldAnimate = heroInView && tabVisible;

  useEffect(() => {
    if (livePaused || !shouldAnimate) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;
    const id = window.setInterval(
      () => setLiveIndex((i) => (i + 1) % 3),
      LIVE_ROTATION_MS
    );
    return () => window.clearInterval(id);
  }, [livePaused, shouldAnimate]);

  const liveStates = useMemo(() => {
    const states: Array<{
      id: "latest" | "stats" | "archive";
      render: () => React.ReactNode;
    }> = [];

    if (latestPost) {
      states.push({
        id: "latest",
        render: () => (
          <Link
            href={`/blog/${latestPost.slug}`}
            className="hero-bento-live-item"
          >
            <span className="hero-bento-live-label">
              NOW{" "}
              <span className="hero-bento-live-label-text">
                · آخرین یادداشت
              </span>
            </span>
            <span className="hero-bento-live-title">
              {latestPost.title}
            </span>
            <span className="hero-bento-live-arrow" aria-hidden="true">
              ←
            </span>
            {latestAgo && (
              <span className="hero-bento-live-ago">{latestAgo}</span>
            )}
          </Link>
        ),
      });
    }

    states.push({
      id: "stats",
      render: () => (
        <Link
          href="/blog"
          className="hero-bento-live-item hero-bento-live-item--stats"
        >
          <span className="hero-bento-live-label">
            INDEX{" "}
            <span className="hero-bento-live-label-text">· آمار زنده</span>
          </span>
          <span className="hero-bento-live-stats">
            <span className="hero-bento-live-stat">
              <strong>{toPersian(totalPosts)}</strong>
              <span>مقاله</span>
            </span>
            <span className="hero-bento-live-stat-sep">·</span>
            <span className="hero-bento-live-stat">
              <strong>{toPersian(totalProjects)}</strong>
              <span>پروژه</span>
            </span>
          </span>
        </Link>
      ),
    });

    if (archivePost) {
      states.push({
        id: "archive",
        render: () => (
          <Link
            href={`/blog/${archivePost.slug}`}
            className="hero-bento-live-item"
          >
            <span className="hero-bento-live-label">
              ARCHIVE{" "}
              <span className="hero-bento-live-label-text">
                · از آرشیو
              </span>
            </span>
            <span className="hero-bento-live-title">
              {archivePost.title}
            </span>
            <span className="hero-bento-live-arrow" aria-hidden="true">
              ←
            </span>
            {archiveAgo && (
              <span className="hero-bento-live-ago">{archiveAgo}</span>
            )}
          </Link>
        ),
      });
    }

    return states;
  }, [
    latestPost,
    archivePost,
    latestAgo,
    archiveAgo,
    totalPosts,
    totalProjects,
  ]);

  const activeLive = liveStates[liveIndex % liveStates.length];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-section hero-in-view"
      data-hero
    >
      {/* ─── Background ─── */}
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-bg-orb hero-bg-orb-1" />
        <span className="hero-bg-orb hero-bg-orb-2" />
        <span className="hero-bg-orb hero-bg-orb-3" />
        <span className="hero-bg-grid" />
        <span className="hero-bg-grain" />
      </div>

      {/* ─── Rulers ─── */}
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

      {/* ─── Crosshairs ─── */}
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
        {/* ═══════════════════════════════════════════════
            HERO #1 — THE STATEMENT
            ═══════════════════════════════════════════════ */}
        <div className="hero-act hero-act-1">
          <div className="hero-masthead">
            <span className="hero-masthead-cell">
              <span className="hero-masthead-dot" aria-hidden="true" />
              <span>پذیرش پروژه · {CURRENT_PERSIAN_YEAR}</span>
            </span>
            <span className="hero-masthead-cell hero-masthead-cell--center">
              AMIRHOSSEIN&nbsp;SHORAKAEI
            </span>
            <span className="hero-masthead-cell hero-masthead-cell--latin">
              <span className="hero-masthead-coord">
                35.6892°N · 51.3890°E
              </span>
              <span className="hero-masthead-clock">{clock}</span>
            </span>
          </div>

          <div className="hero-statement">
            <span className="hero-kicker" aria-hidden="true">
              <span className="hero-kicker-line" />
              <span className="hero-kicker-text">
                SECTION&nbsp;·&nbsp;01&nbsp;·&nbsp;INTRO
              </span>
            </span>

            <h1 className="hero-title">
              <span className="hero-title-line">سایت اختصاصی</span>
              <span className="hero-title-line hero-title-muted">
                برای کسب‌وکارهایی که
              </span>
              <span className="hero-title-line">
                {"می‌خوان "}
                <span className="ink-word hero-title-em">
                  حرفه‌ای دیده بشن
                </span>
                <em className="hero-title-accent">.</em>
              </span>
            </h1>

            <p className="hero-description">
              از طراحی UI/UX تا توسعه و انتشار نهایی؛ یک وب‌سایت سریع،
              ریسپانسیو و متناسب با برند شما — بدون قالب تکراری.
            </p>

            <div className="hero-actions">
              <MagneticButton strength={0.18} radius={80}>
                <Link href="/order" className="hero-btn hero-btn-primary">
                  <span className="hero-btn-shine" aria-hidden="true" />
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
                  <span className="ink-word">مشاهده نمونه‌کارها</span>
                  <span className="hero-btn-count" aria-hidden="true">
                    ۰۴
                  </span>
                </a>
              </MagneticButton>
            </div>

            <ul className="hero-trust" aria-label="تعهدهای کلیدی">
              <li className="hero-trust-item">
                <span className="hero-trust-value">۱۰۰٪</span>
                <span className="hero-trust-label">طراحی اختصاصی</span>
              </li>
              <li className="hero-trust-item">
                <span className="hero-trust-value">۲۴</span>
                <span className="hero-trust-label">ساعت پاسخ</span>
              </li>
              <li className="hero-trust-item">
                <span className="hero-trust-value">۳</span>
                <span className="hero-trust-label">ماه پشتیبانی</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            HERO #2 — THE SHOWCASE
            ═══════════════════════════════════════════════ */}
        <div className="hero-act hero-act-2">
          <div className="hero-showcase-head">
            <span className="hero-kicker" aria-hidden="true">
              <span className="hero-kicker-line" />
              <span className="hero-kicker-text">
                SECTION&nbsp;·&nbsp;02&nbsp;·&nbsp;SHOWCASE
              </span>
            </span>
            <span className="hero-showcase-title">
              یک نگاه به <em>جزئیات</em> کاری که می‌سازم
            </span>
          </div>

          <aside className="hero-bento" aria-label="کارت هویت">
            {/* Cell 1 — Name */}
            <article className="hero-bento-cell hero-bento-cell--name">
              <span className="hero-bento-cell-mesh" aria-hidden="true" />
              <span className="hero-bento-num" aria-hidden="true">
                ۰۱
              </span>

              <span className="hero-bento-seal" aria-hidden="true">
                <Image
                  src="/logo.png"
                  alt=""
                  width={52}
                  height={52}
                  className="hero-bento-seal-img"
                />
              </span>

              <span className="hero-bento-status">
                <span
                  className="hero-bento-status-dot"
                  aria-hidden="true"
                />
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

            {/* Cell 2 — Clock */}
            <article className="hero-bento-cell hero-bento-cell--clock">
              <span className="hero-bento-num" aria-hidden="true">
                ۰۲
              </span>
              <span className="hero-bento-label">TEHRAN</span>
              <span className="hero-bento-clock-time">{clock}</span>
              <span className="hero-bento-live">
                <span
                  className="hero-bento-live-dot"
                  aria-hidden="true"
                />
                LIVE
              </span>
            </article>

            {/* Cell 3 — Date */}
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

            {/* Cell 4 — Score */}
            <article className="hero-bento-cell hero-bento-cell--num">
              <span className="hero-bento-cell-mesh" aria-hidden="true" />
              <span className="hero-bento-num" aria-hidden="true">
                ۰۴
              </span>
              <span className="hero-bento-label">RES / ۱۰۰</span>
              <span className="hero-bento-bignum">
                ۹۹<em>+</em>
              </span>
              <span className="hero-bento-sub">
                امتیاز تجربه‌ی کاربر
              </span>
            </article>

            {/* Cell 5 — Live */}
            <article className="hero-bento-cell hero-bento-cell--live">
              <span className="hero-bento-num" aria-hidden="true">
                ۰۵
              </span>
              <span className="hero-bento-live-badge" aria-hidden="true">
                <span className="hero-bento-live-dot" />
                LIVE
              </span>
              <div
                className="hero-bento-live-stack"
                onMouseEnter={() => setLivePaused(true)}
                onMouseLeave={() => setLivePaused(false)}
              >
                {activeLive && (
                  <div key={activeLive.id}>{activeLive.render()}</div>
                )}
              </div>
            </article>
          </aside>
        </div>
      </div>

      {/* ─── Marquee ─── */}
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="12"
        y1="0"
        x2="12"
        y2="24"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <line
        x1="0"
        y1="12"
        x2="24"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="0.7"
      />
    </svg>
  );
}