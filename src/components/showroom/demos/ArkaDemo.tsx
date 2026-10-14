"use client";

import { useState } from "react";
import "./arka-demo.css";

type Hotspot = {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "nav",
    label: "نوار ناوبری",
    description: "دسترسی سریع به محصولات، قیمت‌گذاری و مستندات.",
    x: 50,
    y: 8,
  },
  {
    id: "stats",
    label: "داشبورد آماری",
    description: "نمایش زنده‌ی درخواست‌ها، تأخیر و نرخ خطا در یک نگاه.",
    x: 30,
    y: 45,
  },
  {
    id: "chart",
    label: "نمودار عملکرد",
    description: "روند درخواست‌ها در ۱۲ ساعت گذشته با جزئیات کامل.",
    x: 65,
    y: 72,
  },
  {
    id: "status",
    label: "وضعیت سیستم",
    description: "اعلام لحظه‌ای سالم بودن تمام سرویس‌های زیرساخت.",
    x: 82,
    y: 30,
  },
];

export default function ArkaDemo() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const activeHotspot = HOTSPOTS.find((h) => h.id === activeId);
  const isTourActive = step > 0 && step <= HOTSPOTS.length;
  const isDone = step > HOTSPOTS.length;
  const currentHotspot = isTourActive ? HOTSPOTS[step - 1] : null;

  const startTour = () => {
    setStep(1);
    setActiveId(HOTSPOTS[0].id);
  };

  const next = () => {
    if (step >= HOTSPOTS.length) {
      setStep(HOTSPOTS.length + 1);
      setActiveId(null);
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    setActiveId(HOTSPOTS[nextStep - 1].id);
  };

  const prev = () => {
    if (step <= 1) return;
    const prevStep = step - 1;
    setStep(prevStep);
    setActiveId(HOTSPOTS[prevStep - 1].id);
  };

  const reset = () => {
    setStep(0);
    setActiveId(null);
  };

  const handleHotspotClick = (id: string) => {
    setActiveId(id);
    const idx = HOTSPOTS.findIndex((h) => h.id === id);
    if (idx >= 0) setStep(idx + 1);
  };

  return (
    <div className="arka-demo" dir="rtl">
      {/* Reset button */}
      {(isTourActive || isDone) && (
        <button
          type="button"
          className="showroom-demo-reset"
          onClick={reset}
          aria-label="بازنشانی تور"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          بازنشانی
        </button>
      )}

      {/* UI Mockup */}
      <div className="arka-ui">
        {/* Browser Chrome */}
        <div className="arka-chrome">
          <div className="arka-chrome-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="arka-chrome-url">app.arka.cloud / dashboard</div>
        </div>

        {/* Nav */}
        <div className={`arka-nav ${activeId === "nav" ? "is-active" : ""}`}>
          <div className="arka-logo">
            <span className="arka-logo-mark" aria-hidden="true" />
            <span>آرکا</span>
          </div>
          <div className="arka-nav-links" aria-hidden="true">
            <span>محصول</span>
            <span>قیمت‌گذاری</span>
            <span>مستندات</span>
          </div>
          <div className="arka-nav-cta" aria-hidden="true">شروع رایگان</div>
        </div>

        {/* Body */}
        <div className="arka-body">
          {/* Sidebar */}
          <div className="arka-sidebar" aria-hidden="true">
            <div className="arka-sidebar-item is-active">Overview</div>
            <div className="arka-sidebar-item">Deployments</div>
            <div className="arka-sidebar-item">Analytics</div>
            <div className="arka-sidebar-item">Logs</div>
            <div className="arka-sidebar-item">Settings</div>
          </div>

          {/* Main */}
          <div className="arka-main">
            <div className="arka-main-head">
              <div>
                <div className="arka-main-title">Overview</div>
                <div className="arka-main-sub">آخرین بروزرسانی: همین الان</div>
              </div>
              <div className={`arka-status ${activeId === "status" ? "is-active" : ""}`}>
                <span className="arka-status-dot" />
                All systems operational
              </div>
            </div>

            <div className={`arka-stats ${activeId === "stats" ? "is-active" : ""}`}>
              <div className="arka-stat">
                <div className="arka-stat-label">Requests</div>
                <div className="arka-stat-value">۲.۴M</div>
                <div className="arka-stat-up">↑ ۱۲.۳٪</div>
              </div>
              <div className="arka-stat">
                <div className="arka-stat-label">Latency</div>
                <div className="arka-stat-value">۱۲ms</div>
                <div className="arka-stat-down">↓ ۸.۱٪</div>
              </div>
              <div className="arka-stat">
                <div className="arka-stat-label">Error rate</div>
                <div className="arka-stat-value">۰.۰۲٪</div>
                <div className="arka-stat-down">↓ ۴۵٪</div>
              </div>
            </div>

            <div className={`arka-chart ${activeId === "chart" ? "is-active" : ""}`}>
              <div className="arka-chart-bars">
                <span style={{ height: "32%" }} />
                <span style={{ height: "48%" }} />
                <span style={{ height: "38%" }} />
                <span style={{ height: "62%" }} />
                <span style={{ height: "74%" }} />
                <span style={{ height: "58%" }} />
                <span style={{ height: "82%" }} />
                <span style={{ height: "68%" }} />
                <span style={{ height: "92%" }} />
                <span style={{ height: "78%" }} />
                <span style={{ height: "88%" }} />
                <span style={{ height: "96%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Hotspots */}
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`arka-hotspot ${activeId === h.id ? "is-active" : ""}`}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => handleHotspotClick(h.id)}
            aria-label={h.label}
          >
            <span className="arka-hotspot-dot" />
          </button>
        ))}
      </div>

      {/* Bottom panel */}
      <div className="arka-panel">
        {!isTourActive && !isDone && !activeHotspot && (
          <div className="arka-panel-start">
            <div>
              <div className="arka-panel-title">تور تعاملی محصول</div>
              <p className="arka-panel-desc">
                روی نقاط نارنجی کلیک کن یا تور هدایت‌شده را شروع کن.
              </p>
            </div>
            <button type="button" className="arka-btn arka-btn-primary" onClick={startTour}>
              شروع تور
            </button>
          </div>
        )}

        {activeHotspot && (
          <div className="arka-panel-info">
            <div className="arka-panel-num">
              {String(HOTSPOTS.findIndex((h) => h.id === activeHotspot.id) + 1).padStart(2, "۰")}
              <span> / ۰{HOTSPOTS.length}</span>
            </div>
            <div className="arka-panel-body">
              <div className="arka-panel-label">{activeHotspot.label}</div>
              <p className="arka-panel-text">{activeHotspot.description}</p>
            </div>
            <div className="arka-panel-controls">
              <button type="button" className="arka-btn" onClick={prev} disabled={step <= 1} aria-label="مرحله قبل">
                ←
              </button>
              <button type="button" className="arka-btn arka-btn-primary" onClick={next}>
                {step >= HOTSPOTS.length ? "پایان" : "بعدی"}
              </button>
            </div>
          </div>
        )}

        {isDone && (
          <div className="arka-panel-done">
            <div>
              <div className="arka-panel-title">✓ تور کامل شد</div>
              <p className="arka-panel-desc">همه‌ی بخش‌های اصلی رابط آرکا رو دیدی.</p>
            </div>
            <button type="button" className="arka-btn arka-btn-primary" onClick={startTour}>
              شروع مجدد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}