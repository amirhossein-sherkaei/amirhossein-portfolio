"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   USE SWIPE NAVIGATION
   ------------------------------------------------------------
   Detects horizontal swipes on the main content area and
   triggers callbacks for previous/next section navigation.

   Key design decisions:
   - Only fires when the gesture is HORIZONTAL (dy << dx)
   - Requires minimum distance (60px) and velocity
   - Ignores swipes on interactive zones (carousels, etc.)
   - Disabled on desktop (mouse users don't swipe)
   ═══════════════════════════════════════════════════════════ */

const MIN_DISTANCE = 60; // px
const MAX_ANGLE_RATIO = 0.6; // dy/dx must be below this
const MAX_DURATION = 500; // ms — anything slower is a drag, not a swipe

type Options = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Elements to ignore (selector). Default: interactive elements */
  ignoreSelector?: string;
  enabled?: boolean;
};

const DEFAULT_IGNORE = [
  "input",
  "textarea",
  "select",
  "button",
  "[contenteditable]",
  ".blog-tags-list",
  ".hero-marquee",
  ".toc-inline",
  ".project-modal",
  ".project-modal-shell",
  ".mobile-nav",
  ".site-nav",
  "[data-no-swipe]",
].join(",");

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  ignoreSelector = DEFAULT_IGNORE,
  enabled = true,
}: Options) {
  const touchStart = useRef<{
    x: number;
    y: number;
    time: number;
    target: EventTarget | null;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !enabled) return;

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest(ignoreSelector)) return;

      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        target: e.target,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const start = touchStart.current;
      if (!start) return;

      /* Only consider single-finger gestures */
      if (e.changedTouches.length !== 1) {
        touchStart.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const dt = Date.now() - start.time;

      touchStart.current = null;

      /* Duration filter — slow drags aren't swipes */
      if (dt > MAX_DURATION) return;

      /* Distance filter */
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < MIN_DISTANCE) return;

      /* Angle filter — must be mostly horizontal */
      if (absY / absX > MAX_ANGLE_RATIO) return;

      /* Fire callback (in RTL, "left swipe" moves forward) */
      if (dx < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (dx > 0 && onSwipeRight) {
        onSwipeRight();
      }
    };

    const handleTouchCancel = () => {
      touchStart.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [onSwipeLeft, onSwipeRight, ignoreSelector, enabled]);
}