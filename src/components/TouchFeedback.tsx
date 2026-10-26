"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   TOUCH FEEDBACK
   ------------------------------------------------------------
   1. Ripple: sets --ripple-x / --ripple-y on tap so the visual
      wave starts from the exact touch point.
   2. Haptic: uses navigator.vibrate() on primary CTAs for a
      subtle physical feedback (Android only — iOS Safari
      doesn't support it, but gracefully no-ops).
   ═══════════════════════════════════════════════════════════ */

const RIPPLE_SELECTOR = [
  ".btn",
  ".button",
  ".nav-order-button",
  ".mobile-nav-item",
  ".mobile-nav-cta",
  ".project-modal-nav-btn",
  ".faq-question",
  ".service-item",
  ".project-type-option",
  ".contact-method",
  ".blog-tag-chip",
  ".not-found-suggestion",
].join(",");

const HAPTIC_SELECTOR = [
  ".btn-primary",
  ".button-primary",
  ".nav-order-button",
  ".mobile-nav-cta",
  ".project-modal-nav-demo",
  ".project-type-option",
  ".contact-method",
  ".theme-toggle",
  "[data-haptic]",
].join(",");

const RIPPLE_DURATION_MS = 600;

export default function TouchFeedback() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isTouch || reducedMotion) return;

    /* ── Ripple on pointerdown ── */
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const rippleEl = target.closest(RIPPLE_SELECTOR) as HTMLElement | null;
      if (!rippleEl) return;

      /* Compute ripple origin relative to the element */
      const rect = rippleEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      rippleEl.style.setProperty("--ripple-x", `${x}px`);
      rippleEl.style.setProperty("--ripple-y", `${y}px`);
      rippleEl.classList.add("is-rippling");

      window.setTimeout(() => {
        rippleEl.classList.remove("is-rippling");
        rippleEl.style.removeProperty("--ripple-x");
        rippleEl.style.removeProperty("--ripple-y");
      }, RIPPLE_DURATION_MS);

      /* ── Haptic feedback on important CTAs ── */
      const hapticEl = target.closest(HAPTIC_SELECTOR) as HTMLElement | null;
      if (hapticEl && "vibrate" in navigator) {
        try {
          navigator.vibrate(8);
        } catch {
          /* vibrate may be blocked by permissions policy */
        }
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}