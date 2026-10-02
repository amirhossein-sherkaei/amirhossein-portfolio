"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   PERF OBSERVER — v3 (interaction-deferred · hydration-proof)
   ────────────────────────────────────────────────────────────
   Watches every top-level section/footer. When a section is
   off-screen, sets data-perf-pause="true" so its animations
   pause.

   v3: Defers setup until the FIRST user interaction OR 2s
   timeout, whichever comes first. This guarantees all
   Suspense boundaries have finished hydrating before we
   mutate the DOM.
   ═══════════════════════════════════════════════════════════ */

export default function PerfObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof document === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    let io: IntersectionObserver | null = null;
    let started = false;
    let timer: number | null = null;

    const start = () => {
      if (started) return;
      started = true;

      window.removeEventListener("scroll", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }

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
    };

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
      io?.disconnect();
    };
  }, []);

  return null;
}