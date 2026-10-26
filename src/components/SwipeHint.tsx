"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   SWIPE HINT — shows once per user
   ------------------------------------------------------------
   Displays a subtle hint on first visit that swiping is possible.
   After dismissal (auto or manual), it never shows again.
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "swipe-hint-seen";

export default function SwipeHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    /* Only on mobile */
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    if (!isMobile) return;

    /* Only if reduced-motion is off */
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    /* Only if not seen before */
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }

    if (seen) return;

    /* Wait for content to settle, then show */
    const timer = window.setTimeout(() => {
      setShow(true);

      /* Auto-hide after the animation completes */
      window.setTimeout(() => {
        setShow(false);
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
      }, 7000);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="swipe-hint" role="status" aria-live="polite">
      <span className="swipe-hint-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </span>
      <span>برای بخش بعدی، سوایپ کن</span>
    </div>
  );
}9