"use client";

import { useEffect, useRef, useState } from "react";
import { useCompanion } from "./CompanionProvider";

/* ═══════════════════════════════════════════════════════════
   COMPANION — Floating AI assistant
   ────────────────────────────────────────────────────────────
   Appears after a short delay. Observes section changes via
   IntersectionObserver and asks the AI for a contextual tip.
   Fully keyboard-accessible, screen-reader friendly.
   ═══════════════════════════════════════════════════════════ */

const SECTION_LABELS: Record<string, string> = {
  home: "the homepage intro",
  services: "the services section",
  process: "the work process",
  portfolio: "the portfolio of projects",
  about: "the about me section",
  commitments: "the commitments section",
  faq: "the FAQ section",
  "latest-blog": "the latest blog posts",
  newsletter: "the newsletter signup",
};

const APPEAR_DELAY_MS = 4000;
const SECTION_DWELL_MS = 2500;
const BUBBLE_AUTO_HIDE_MS = 12000;

export default function Companion() {
  const { message, isAvailable, isThinking, generateMessage, dismiss } =
    useCompanion();

  const [visible, setVisible] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  const dwellTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const lastSectionRef = useRef<string>("");
  const bubbleRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* ── Appearance delay ── */
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  /* ── Section observer ── */
  useEffect(() => {
    if (!visible || !isAvailable) return;
    if (typeof IntersectionObserver === "undefined") return;

    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === lastSectionRef.current) continue;
            lastSectionRef.current = id;

            if (dwellTimerRef.current)
              window.clearTimeout(dwellTimerRef.current);

            dwellTimerRef.current = window.setTimeout(() => {
              const label = SECTION_LABELS[id] || id;
              generateMessage(label);
            }, SECTION_DWELL_MS);
          }
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0.4 }
    );

    sections.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      if (dwellTimerRef.current)
        window.clearTimeout(dwellTimerRef.current);
    };
  }, [visible, isAvailable, generateMessage]);

  /* ── Open bubble when a message arrives ── */
  useEffect(() => {
    if (message) {
      setBubbleOpen(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setBubbleOpen(false);
      }, BUBBLE_AUTO_HIDE_MS);
    }
  }, [message]);

  /* ── Cleanup timers ── */
  useEffect(() => {
    return () => {
      if (dwellTimerRef.current) window.clearTimeout(dwellTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  /* ── Focus management for accessibility ── */
  useEffect(() => {
    if (bubbleOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [bubbleOpen]);

  /* ── Escape key to close ── */
  useEffect(() => {
    if (!bubbleOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBubbleOpen(false);
        dismiss();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bubbleOpen, dismiss]);

  if (!visible || shouldHide || !isAvailable) return null;

  return (
    <>
      {/* ── Floating button ── */}
      <button
        type="button"
        className={`companion-trigger${bubbleOpen ? " is-active" : ""}`}
        onClick={() => {
          setBubbleOpen((v) => !v);
          if (!bubbleOpen && !message) {
            generateMessage("the homepage");
          }
        }}
        aria-label="دستیار هوشمند"
        aria-expanded={bubbleOpen}
      >
        <span className="companion-trigger-orb" aria-hidden="true" />
        <span className="companion-trigger-icon" aria-hidden="true">
          <SparkleIcon />
        </span>
      </button>

      {/* ── Speech bubble ── */}
      {bubbleOpen && (
        <div
          ref={bubbleRef}
          className="companion-bubble"
          role="dialog"
          aria-label="پیام دستیار"
        >
          <div className="companion-bubble-inner">
            {isThinking ? (
              <span className="companion-thinking" aria-live="polite">
                <span className="companion-dot" />
                <span className="companion-dot" />
                <span className="companion-dot" />
              </span>
            ) : (
              <p className="companion-text" aria-live="polite">
                {message || "سلام! من اینجام تا کمکت کنم."}
              </p>
            )}

            <div className="companion-actions">
              <button
                ref={closeBtnRef}
                type="button"
                className="companion-btn companion-btn--ghost"
                onClick={() => setBubbleOpen(false)}
                aria-label="بستن"
              >
                بعداً
              </button>
              <button
                type="button"
                className="companion-btn companion-btn--ghost"
                onClick={() => {
                  setBubbleOpen(false);
                  setShouldHide(true);
                  dismiss();
                }}
                aria-label="دیگر نشان نده"
              >
                دیگه نشون نده
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════ */

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}