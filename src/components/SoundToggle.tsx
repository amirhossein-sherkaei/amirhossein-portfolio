"use client";

import { useEffect, useState } from "react";
import { SOUND_PREF_KEY } from "@/components/SensoryFeedback";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true); /* default ON */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(SOUND_PREF_KEY);
      /* If user never set a preference, it's ON */
      setEnabled(stored === null ? true : stored === "1");
    } catch {
      setEnabled(true);
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem(SOUND_PREF_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }

    /* Confirmation tone when enabling */
    if (next) {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new Ctx();
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 660;
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch {
        /* ignore */
      }
    }

    if ("vibrate" in navigator) {
      try {
        navigator.vibrate([0, 30]);
      } catch {
        /* ignore */
      }
    }
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      className={`sound-toggle${enabled ? " is-on" : ""}`}
      onClick={toggle}
      aria-label={
        enabled ? "خاموش کردن صداهای رابط" : "روشن کردن صداهای رابط"
      }
      aria-pressed={enabled}
      title={enabled ? "صدا: روشن" : "صدا: خاموش"}
    >
      <span className="sound-toggle-icon" aria-hidden="true">
        {enabled ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </span>
      <span className="sound-toggle-label">
        {enabled ? "صدا روشن" : "صدا خاموش"}
      </span>
    </button>
  );
}