"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   COUNT UP — Scroll-triggered number animation
   ────────────────────────────────────────────────────────────
   Persian-aware. When the element scrolls into view:
   - Numeric values ("۹۹", "۲۴") count up from 0
   - Non-numeric values ("AAA") fade in
   - Respects prefers-reduced-motion
   ═══════════════════════════════════════════════════════════ */

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toLatin(str: string): string {
  return str.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
}

function toPersian(num: number | string): string {
  return String(num).replace(/\d/g, (d) => PERSIAN_DIGITS[+d]);
}

function isNumericValue(value: string): boolean {
  return /^[۰-۹]+$/.test(value) || /^\d+$/.test(value);
}

type Props = {
  value: string;
  duration?: number;
  className?: string;
};

export default function CountUp({
  value,
  duration = 1400,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const el = ref.current;
    if (!el) return;

    const numeric = isNumericValue(value);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          io.disconnect();

          if (reduced || !numeric) {
            setDisplay(value);
            return;
          }

          const target = +toLatin(value);
          if (isNaN(target)) {
            setDisplay(value);
            return;
          }

          const startTime = performance.now();

          const tick = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            /* Ease-out cubic — fast then gentle */
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(toPersian(Math.round(target * eased)));
            if (progress < 1) {
              window.requestAnimationFrame(tick);
            } else {
              setDisplay(value);
            }
          };

          setDisplay(toPersian(0));
          window.requestAnimationFrame(tick);
        }
      },
      {
        threshold: 0.4,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, value, duration]);

  /* SSR safe: always render the actual value on server */
  if (!mounted) {
    return <span className={className}>{value}</span>;
  }

  /* Non-numeric values (like AAA) — just a span */
  if (!isNumericValue(value)) {
    return <span ref={ref} className={className}>{display}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}