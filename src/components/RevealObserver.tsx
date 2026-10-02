"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   REVEAL OBSERVER — v3 (interaction-deferred · hydration-proof)
   ────────────────────────────────────────────────────────────
   Adds .is-visible to every .reveal element when it scrolls
   into view. Respects prefers-reduced-motion.

   v3 CHANGES:
   - Defers setup until the FIRST user interaction OR 2s
     timeout, whichever comes first. Prevents the is-visible
     class from being added while sibling Suspense boundaries
     are still hydrating.
   ═══════════════════════════════════════════════════════════ */

export default function RevealObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    let observer: IntersectionObserver | null = null;
    let started = false;
    let timer: number | null = null;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const start = () => {
      if (started) return;
      started = true;

      /* Clean up the one-shot listeners now that we are running */
      window.removeEventListener("scroll", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }

      const elements = document.querySelectorAll<HTMLElement>(".reveal");
      if (!elements.length) return;

      /* ── Reduced motion: show everything immediately ── */
      if (prefersReducedMotion) {
        elements.forEach((el) => el.classList.add("is-visible"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer!.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px",
        }
      );

      elements.forEach((el) => observer!.observe(el));
    };

    /* ── Defer until first interaction OR 2s timeout ── */
    window.addEventListener("scroll", start, { once: true, passive: true });
    window.addEventListener("pointerdown", start, { once: true, passive: true });
    window.addEventListener("keydown", start, { once: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });
    timer = window.setTimeout(start, 2000);

    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      if (timer !== null) window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  return null;
}