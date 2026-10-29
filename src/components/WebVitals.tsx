"use client";



import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // در اینجا می‌توانید متریک‌ها را به یک API یا Google Analytics ارسال کنید
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}`);
  });
  return null;
}


