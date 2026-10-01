"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   PERF OBSERVER
   ────────────────────────────────────────────────────────────
   Watches every top-level section/footer. When a section is
   off-screen, sets data-perf-pause="true" so all its
   animations (infinite or not) pause. Saves GPU/CPU cycles.
   Zero visual impact — animations resume when scrolling back.
   ═══════════════════════════════════════════════════════════ */

export default function PerfObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (typeof document === "undefined") return;

    const blocks = document.querySelectorAll<HTMLElement>(
      "section, footer.site-footer"
    );

    if (!blocks.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.removeAttribute("data-perf-pause");
          } else {
            el.setAttribute("data-perf-pause", "true");
          }
        }
      },
      {
        // Start/stop animations 300px outside the viewport
        // so they're already running by the time user sees them.
        rootMargin: "300px 0px 300px 0px",
        threshold: 0,
      }
    );

    blocks.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}