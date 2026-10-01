"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR — Desktop only
   ────────────────────────────────────────────────────────────
   - Two layers: outer ring (spring lag) + inner dot (instant)
   - State detection via data-cursor attributes or tag names
   - Zero impact on touch devices
   - Respects prefers-reduced-motion
   ═══════════════════════════════════════════════════════════ */

type CursorState = "default" | "link" | "button" | "text" | "image";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Enable only on desktop with fine pointer + no reduced motion */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasHover = window.matchMedia("(hover: hover)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!hasHover || !finePointer || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  /* Main animation loop */
  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const loop = () => {
      // Dot follows instantly (with tiny spring for smoothness)
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      // Ring lags (spring physics)
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(loop);
    };

    /* State detection on hover */
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const custom = target.closest("[data-cursor]") as HTMLElement | null;
      if (custom?.dataset.cursor) {
        setState(custom.dataset.cursor as CursorState);
        return;
      }

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label'
      ) as HTMLElement | null;
      if (interactive) {
        if (interactive.tagName === "INPUT" || interactive.tagName === "TEXTAREA") {
          setState("text");
        } else if (
          interactive.classList.contains("button") ||
          interactive.classList.contains("btn") ||
          interactive.classList.contains("hero-btn")
        ) {
          setState("button");
        } else {
          setState("link");
        }
        return;
      }

      const img = target.closest("img, picture") as HTMLElement | null;
      if (img) {
        setState("image");
        return;
      }

      const text = target.closest("p, h1, h2, h3, h4, h5, h6, blockquote") as HTMLElement | null;
      if (text) {
        setState("text");
        return;
      }

      setState("default");
    };

    /* Click state */
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!mounted || !enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={"cursor-dot" + (clicking ? " is-clicking" : "")}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={
          "cursor-ring" +
          ` cursor-ring--${state}` +
          (clicking ? " is-clicking" : "")
        }
        aria-hidden="true"
      />
    </>
  );
}