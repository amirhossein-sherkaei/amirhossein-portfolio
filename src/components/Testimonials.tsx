"use client";

import Link from "next/link";
import { testimonials } from "@/content/testimonials";
import SectionNumber from "@/components/SectionNumber";

export default function Testimonials() {
  return (
    <section className="testimonials-section section" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۶" label="TESTIMONIALS" />
            <h2 id="testimonials-title">
              نظر مشتریان
              <em className="ink-word"> درباره همکاری با من</em>
            </h2>
          </div>
          <p>
            اعتماد شما بزرگ‌ترین سرمایه من است. این‌ها بخشی از تجربه‌های
            کسانی است که با من همکاری کرده‌اند.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card reveal">
              <div className="testimonial-stars" aria-label={`امتیاز ${t.rating} از 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} aria-hidden="true">{i < t.rating ? "★" : "☆"}</span>
                ))}
              </div>
              <p className="testimonial-text">«{t.text}»</p>
              <div className="testimonial-author">
                <div>
                  <strong>{t.name}</strong>
                  <br />
                  <small>{t.role} — {t.company}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: "28px", fontSize: "0.78rem", color: "var(--ink-3)", opacity: 0.85 }}>
          نظرات بالا نمونه‌ای از بازخوردهای همکاری‌های فرضی هستند و به‌عنوان نمونه ارائه شده‌اند.
        </p>

        <div className="testimonials-footer reveal" style={{ marginTop: "24px" }}>
          <Link href="/order" className="button button-primary">
            شروع همکاری با من
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}