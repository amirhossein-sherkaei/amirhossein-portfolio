"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   LONG PRESS WRAPPER
   ------------------------------------------------------------
   Wraps a child component and adds long-press preview behavior.
   Uses haptic feedback (vibrate) when the preview opens.

   Mobile only — desktop users get the standard click behavior.
   ═══════════════════════════════════════════════════════════ */

const LONG_PRESS_DELAY = 500; // ms
const MOVE_THRESHOLD = 10; // px

type Props = {
  children: React.ReactNode;
  /** Called when long-press activates (preview shown) */
  onLongPress?: () => void;
  /** Called when the preview is dismissed */
  onRelease?: () => void;
  /** Content to render inside the preview overlay */
  previewContent?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function LongPressCard({
  children,
  onLongPress,
  onRelease,
  previewContent,
  className = "",
  disabled = false,
}: Props) {
  const [pressing, setPressing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const timer = useRef<number | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const isMobile = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    isMobile.current = window.matchMedia("(max-width: 720px)").matches;
  }, []);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isMobile.current) return;
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      setPressing(true);
      clearTimer();

      timer.current = window.setTimeout(() => {
        setPressing(false);
        setShowPreview(true);

        /* Haptic feedback */
        if ("vibrate" in navigator) {
          try {
            navigator.vibrate(15);
          } catch {
            /* ignore */
          }
        }

        onLongPress?.();
      }, LONG_PRESS_DELAY);
    },
    [disabled, clearTimer, onLongPress]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pressing || !startPos.current) return;
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startPos.current.x);
      const dy = Math.abs(touch.clientY - startPos.current.y);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        clearTimer();
        setPressing(false);
        startPos.current = null;
      }
    },
    [pressing, clearTimer]
  );

  const handleTouchEnd = useCallback(() => {
    clearTimer();
    setPressing(false);
    startPos.current = null;

    if (showPreview) {
      setShowPreview(false);
      onRelease?.();
    }
  }, [clearTimer, showPreview, onRelease]);

  /* Prevent click after long-press */
  const handleClickCapture = useCallback(
    (e: React.MouseEvent) => {
      if (showPreview) {
        e.preventDefault();
        e.stopPropagation();
        setShowPreview(false);
        onRelease?.();
      }
    },
    [showPreview, onRelease]
  );

  /* Cleanup on unmount */
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return (
    <div
      className={`long-press-wrapper${pressing ? " is-pressing" : ""} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClickCapture={handleClickCapture}
    >
      {children}

      {showPreview && previewContent && (
        <div className="long-press-preview" role="tooltip">
          <div className="long-press-preview-inner">{previewContent}</div>
        </div>
      )}
    </div>
  );
}