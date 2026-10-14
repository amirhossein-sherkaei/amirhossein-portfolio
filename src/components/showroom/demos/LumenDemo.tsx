"use client";

import { useState, useEffect, useCallback } from "react";
import "./lumen-demo.css";

type Frame = {
  id: number;
  title: string;
  label: string;
  description: string;
  gradient: string;
};

const FRAMES: Frame[] = [
  {
    id: 1,
    title: "بیداری",
    label: "The Awakening",
    description: "نور اول از میان تاریکی — شروع روایت در سکوت.",
    gradient: "radial-gradient(circle at 30% 40%, rgba(255,90,58,.7), transparent 55%), linear-gradient(160deg, #1a0808, #2c0a05)",
  },
  {
    id: 2,
    title: "گرما",
    label: "Warmth",
    description: "رنگ‌های گرم، لحظه‌ی نفس‌کشیدن قاب.",
    gradient: "radial-gradient(circle at 70% 60%, rgba(255,179,71,.6), transparent 50%), linear-gradient(160deg, #1c1508, #2a1f08)",
  },
  {
    id: 3,
    title: "سیگنال",
    label: "The Signal",
    description: "اولین نشانه از پیام اصلی کمپین.",
    gradient: "radial-gradient(ellipse at 50% 50%, rgba(255,45,85,.7), transparent 45%), linear-gradient(160deg, #08070a, #1a0505)",
  },
  {
    id: 4,
    title: "فاصله",
    label: "Interval",
    description: "سکوت پیش از اوج روایت.",
    gradient: "linear-gradient(180deg, #0a0805 0%, #2a1a10 100%)",
  },
  {
    id: 5,
    title: "فرود",
    label: "Descent",
    description: "لحظه‌ی رها شدن — نقطه‌ی اوج بصری.",
    gradient: "radial-gradient(circle at 40% 50%, rgba(255,90,58,.65), transparent 55%), linear-gradient(140deg, #150808, #050408)",
  },
  {
    id: 6,
    title: "حل شدن",
    label: "Resolution",
    description: "پایان آرام، آغاز یک سؤال در ذهن مخاطب.",
    gradient: "linear-gradient(135deg, #08070a, #2c0a05, #08070a)",
  },
];

export default function LumenDemo() {
  const [activeFrame, setActiveFrame] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);

  const frame = FRAMES.find((f) => f.id === activeFrame)!;

  const next = useCallback(() => {
    setActiveFrame((prev) => (prev >= FRAMES.length ? 1 : prev + 1));
  }, []);

  const prev = useCallback(() => {
    setActiveFrame((prev) => (prev <= 1 ? FRAMES.length : prev - 1));
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, 2200);
    return () => clearInterval(timer);
  }, [autoPlay, next]);

  const reset = () => {
    setActiveFrame(1);
    setAutoPlay(false);
  };

  return (
    <div className="lumen-demo" dir="rtl">
      {/* Reset */}
      {(activeFrame !== 1 || autoPlay) && (
        <button
          type="button"
          className="showroom-demo-reset"
          onClick={reset}
          aria-label="بازنشانی"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          بازنشانی
        </button>
      )}

      {/* Stage */}
      <div className="lumen-stage">
        <div className="lumen-frame-big" style={{ background: frame.gradient }}>
          <div className="lumen-frame-overlay" />
          <div className="lumen-frame-info">
            <div className="lumen-frame-num">FRAME / ۰{frame.id}</div>
            <div className="lumen-frame-title">{frame.title}</div>
            <div className="lumen-frame-label">{frame.label}</div>
            <p className="lumen-frame-desc">{frame.description}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="lumen-timeline">
        <button
          type="button"
          className="lumen-tl-nav"
          onClick={prev}
          aria-label="فریم قبلی"
        >
          ›
        </button>

        <div className="lumen-tl-track">
          {FRAMES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`lumen-tl-frame ${f.id === activeFrame ? "is-active" : ""}`}
              onClick={() => setActiveFrame(f.id)}
              aria-label={`فریم ${f.id} — ${f.title}`}
            >
              <div className="lumen-tl-thumb" style={{ background: f.gradient }} />
              <div className="lumen-tl-num">۰{f.id}</div>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="lumen-tl-nav"
          onClick={next}
          aria-label="فریم بعدی"
        >
          ‹
        </button>
      </div>

      {/* Controls */}
      <div className="lumen-controls">
        <button
          type="button"
          className={`lumen-auto-btn ${autoPlay ? "is-active" : ""}`}
          onClick={() => setAutoPlay((v) => !v)}
        >
          {autoPlay ? (
            <>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              توقف پخش
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              پخش خودکار
            </>
          )}
        </button>

        <div className="lumen-progress">
          <div
            className="lumen-progress-bar"
            style={{ width: `${(activeFrame / FRAMES.length) * 100}%` }}
          />
        </div>

        <div className="lumen-counter">
          {activeFrame} از {FRAMES.length}
        </div>
      </div>
    </div>
  );
}