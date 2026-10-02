"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   PERF OBSERVER
   ────────────────────────────────────────────────────────────
   Watches every top-level section/footer. When a section is
   off-screen, sets data-perf-pause="true" so all its
   animations pause.

   IMPORTANT: We delay the observer setup by 100ms after mount
   to avoid hydration mismatch — React needs time to complete
   hydration before we start modifying the DOM.
   ═══════════════════════════════════════════════════════════ */

export default function PerfObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (typeof document === "undefined") return;

    let io: IntersectionObserver | null = null;

    /* ── Delay setup until after hydration completes ── */
    const timer = window.setTimeout(() => {
      const blocks = document.querySelectorAll<HTMLElement>(
        "section, footer.site-footer"
      );

      if (!blocks.length) return;

      io = new IntersectionObserver(
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
          rootMargin: "300px 0px 300px 0px",
          threshold: 0,
        }
      );

      blocks.forEach((el) => io!.observe(el));
    }, 100);

    return () => {
      window.clearTimeout(timer);
      io?.disconnect();
    };
  }, []);

  return null;
}