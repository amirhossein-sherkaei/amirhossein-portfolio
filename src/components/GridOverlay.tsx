"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   GRID OVERLAY — 12-column grid + baseline grid
   ────────────────────────────────────────────────────────────
   - Toggle: Ctrl+G (Windows/Linux) or ⌘+G (Mac)
   - Shows: 12 columns, gutters, baseline grid (8px)
   - Read-only (pointer-events: none)
   - Hidden in production by default (only activates on toggle)
   ═══════════════════════════════════════════════════════════ */

const COLUMNS = 12;

export default function GridOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKey = (e: KeyboardEvent) => {
      const isToggle = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g";
      if (!isToggle) return;

      // Ignore when typing in inputs
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      document.body.classList.toggle("show-grid");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid-overlay" aria-hidden="true">
      {/* Columns */}
      <div className="grid-overlay-container">
        <div className="grid-overlay-columns">
          {Array.from({ length: COLUMNS }).map((_, i) => (
            <div key={i} className="grid-overlay-column">
              <span className="grid-overlay-column-num">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Baselines */}
      <div className="grid-overlay-baselines" />

      {/* Top ruler */}
      <div className="grid-overlay-ruler">
        <span>0</span>
        <span>1/12</span>
        <span>6/12</span>
        <span>9/12</span>
        <span>12/12</span>
      </div>
    </div>
  );
}