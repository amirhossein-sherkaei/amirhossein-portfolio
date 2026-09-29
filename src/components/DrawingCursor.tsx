"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   DRAWING CURSOR — Brush trail in the Hero
   ────────────────────────────────────────────────────────────
   Performance-optimized:
   - RAF pauses when tab is hidden
   - Trail ages out naturally — zero CPU when idle
   - Pointermove throttled via distance threshold
   - Canvas cleared only when trail exists
   - Auto-disabled on touch + reduced motion
   ═══════════════════════════════════════════════════════════ */

const MAX_AGE = 1200;
const MAX_POINTS = 24;
const MIN_DISTANCE = 4;
const BASE_WIDTH = 1.0;
const MAX_WIDTH_BOOST = 2.0;

export default function DrawingCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const hero = document.querySelector<HTMLElement>(".hero-section");
    if (!hero) return;

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

    type Point = { x: number; y: number; t: number };
    const trail: Point[] = [];
    let lastX = -999;
    let lastY = -999;
    let raf = 0;

    const schedule = () => {
      if (!raf && !document.hidden) {
        raf = window.requestAnimationFrame(loop);
      }
    };

    const loop = () => {
      raf = 0;

      /* Pause completely when tab is hidden */
      if (document.hidden) return;

      const now = performance.now();

      while (trail.length && now - trail[0].t > MAX_AGE) {
        trail.shift();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.length < 2) {
        return;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = accent;

      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const age = now - b.t;
        const life = 1 - age / MAX_AGE;
        if (life <= 0) continue;

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
      schedule();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (document.hidden) return;

      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

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
      schedule();
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) {
          window.cancelAnimationFrame(raf);
          raf = 0;
        }
        trail.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
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