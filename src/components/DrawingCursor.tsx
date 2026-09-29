"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   DRAWING CURSOR — Brush trail in the Hero
   ────────────────────────────────────────────────────────────
   A thin ink trail follows the mouse across the Hero section.
   Fades over 1.5s. Desktop only. Zero CPU when idle.
   Canvas-based for performance (no DOM churn).

   Trailing behavior:
   - Point added every pointer move (>3px from last point)
   - Bezier-smoothed path drawn through recent points
   - Width tapers at ends (brush feel)
   - All points fade by age
   - RAF loop auto-stops when trail is empty
   ═══════════════════════════════════════════════════════════ */

const MAX_AGE = 1400;         // ms — how long a point lives
const MAX_POINTS = 32;        // trail length cap
const MIN_DISTANCE = 3;       // px — ignore micro-moves
const BASE_WIDTH = 1.1;       // px
const MAX_WIDTH_BOOST = 2.2;  // px added at trail center

export default function DrawingCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    /* ─── Guards ─── */
    const isTouch = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hero = document.querySelector<HTMLElement>(".hero-section");
    if (!hero) return;

    /* ─── Resize / DPR ─── */
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* ─── Color (auto-adapts to theme) ─── */
    const readAccent = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      return raw || "#e94b2c";
    };
    let accent = readAccent();

    const themeObserver = new MutationObserver(() => {
      accent = readAccent();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    /* ─── Trail state ─── */
    type Point = { x: number; y: number; t: number };
    const trail: Point[] = [];
    let lastX = -999;
    let lastY = -999;
    let raf = 0;
    let active = false;

    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(loop);
    };

    const loop = () => {
      const now = performance.now();

      /* Age out */
      while (trail.length && now - trail[0].t > MAX_AGE) {
        trail.shift();
      }

      /* Clear */
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Nothing to draw → stop RAF (zero CPU when idle) */
      if (trail.length < 2) {
        raf = 0;
        return;
      }

      /* Draw segments */
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = accent;

      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const age = now - b.t;
        const life = 1 - age / MAX_AGE;
        if (life <= 0) continue;

        /* Width tapers toward both ends */
        const progress = i / trail.length;
        const taper = Math.sin(progress * Math.PI);
        ctx.globalAlpha = life * 0.85;
        ctx.lineWidth = BASE_WIDTH + taper * MAX_WIDTH_BOOST;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(loop);
    };

    /* ─── Pointer events ─── */
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      /* Skip micro-moves */
      const dx = x - lastX;
      const dy = y - lastY;
      if (dx * dx + dy * dy < MIN_DISTANCE * MIN_DISTANCE) return;

      lastX = x;
      lastY = y;
      trail.push({ x, y, t: performance.now() });
      if (trail.length > MAX_POINTS) trail.shift();

      schedule();
    };

    const onLeave = () => {
      lastX = -999;
      lastY = -999;
      /* Let trail age out naturally — loop handles RAF */
      schedule();
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="drawing-cursor-canvas"
      aria-hidden="true"
    />
  );
}