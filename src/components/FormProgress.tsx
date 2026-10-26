"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   FORM PROGRESS — Refined
   ------------------------------------------------------------
   - Compact circular percentage badge
   - Smooth gradient bar that fills as user progresses
   - No "stuck to header" feel — part of the form itself
   - Auto-hides at 100%
   ═══════════════════════════════════════════════════════════ */

type Props = {
  progress: number;
  label?: string;
};

export default function FormProgress({ progress, label }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (progress > 5 && progress < 100) {
      setVisible(true);
    } else if (progress >= 100) {
      const timer = window.setTimeout(() => setVisible(false), 400);
      return () => window.clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [progress]);

  if (!visible) return null;

  const rounded = Math.round(progress);

  return (
    <div
      className="form-progress"
      role="progressbar"
      aria-valuenow={rounded}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "پیشرفت فرم"}
    >
      <div className="form-progress-inner">
        <span className="form-progress-badge" aria-hidden="true">
          <span className="form-progress-badge-value">{rounded}</span>
          <span className="form-progress-badge-unit">٪</span>
        </span>

        <div className="form-progress-track">
          <div
            className="form-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="form-progress-label">
          {rounded >= 100 ? "آماده‌ی ارسال" : "در حال تکمیل"}
        </span>
      </div>
    </div>
  );
}