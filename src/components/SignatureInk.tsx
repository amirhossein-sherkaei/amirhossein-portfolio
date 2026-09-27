"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   SIGNATURE INK — Global controller
   ────────────────────────────────────────────────────────────
   Uses event delegation on document, so it works for:
   - Server-rendered sections (About, WhyMe, Process, FAQ…)
   - Client-rendered sections (Services, Portfolio…)
   - Dynamically added content (modals, future pages)
   
   On desktop: CSS handles :hover and :focus-visible.
   On touch:   this listens for pointerdown and adds .is-inking
               to the tapped .ink-word for 2.5s.
   ═══════════════════════════════════════════════════════════ */

const INK_DURATION_MS = 2500;

export default function SignatureInk() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPointerDown = (e: PointerEvent) => {
      /* Only fire on real touch (not pen, not mouse) */
      if (e.pointerType !== "touch") return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const ink = target.closest(".ink-word") as HTMLElement | null;
      if (!ink) return;

      /* Restart the animation */
      ink.classList.remove("is-inking");
      /* Force reflow so the animation can replay */
      void ink.offsetWidth;
      ink.classList.add("is-inking");

      window.setTimeout(
        () => ink.classList.remove("is-inking"),
        INK_DURATION_MS
      );
    };

    document.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}