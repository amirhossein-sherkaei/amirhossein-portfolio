"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   MAGNETIC BUTTON
   ------------------------------------------------------------
   Attracts its child toward the pointer when the pointer
   enters a defined radius. Uses RAF-driven spring physics.

   Usage:
   <MagneticButton strength={0.35} radius={80}>
     <a href="/order" className="btn btn-primary">
       سفارش پروژه
     </a>
   </MagneticButton>
   ═══════════════════════════════════════════════════════════ */

type Props = {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
};

export default function MagneticButton({
  children,
  strength = 0.35,
  radius = 80,
  className = "",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || reducedMotion) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const state = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius + Math.max(rect.width, rect.height) / 2) {
        isHovering.current = true;
        state.targetX = dx * strength;
        state.targetY = dy * strength;
      } else if (isHovering.current) {
        isHovering.current = false;
        state.targetX = 0;
        state.targetY = 0;
      }
    };

    const onPointerLeave = () => {
      isHovering.current = false;
      state.targetX = 0;
      state.targetY = 0;
    };

    const loop = () => {
      /* Spring physics — critically damped */
      const stiffness = 0.15;
      state.currentX += (state.targetX - state.currentX) * stiffness;
      state.currentY += (state.targetY - state.currentY) * stiffness;

      inner.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;

      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    wrapper.addEventListener("pointerleave", onPointerLeave);

    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [enabled, strength, radius]);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={wrapperRef} className={`magnetic ${className}`}>
      <div ref={innerRef} className="magnetic-inner">
        {children}
      </div>
    </div>
  );
}