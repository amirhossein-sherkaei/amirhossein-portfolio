"use client";

import Image from "next/image";
import Link from "next/link";
import { testimonials } from "@/content/testimonials";
import SectionNumber from "@/components/SectionNumber";

export default function Testimonials() {
  // Build Review schema for SEO
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: testimonials.map((t, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: t.name,
        },
        reviewBody: t.text,
        reviewRating: {
          "@type": "Rating",
          ratingValue: t.rating,
          bestRating: 5,
        },
        itemReviewed: {
          "@type": "Person",
          name: "امیرحسین شرکائی",
          jobTitle: "طراح و توسعه‌دهنده وب",
        },
      },
    })),
  };

  return (
    <section className="testimonials-section section" aria-labelledby="testimonials-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
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
                  <span key={i} aria-hidden="true">
                    {i < t.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className="testimonial-text">«{t.text}»</p>
              <div className="testimonial-author">
                {t.avatar && (
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="testimonial-avatar"
                  />
                )}
                <div>
                  <strong>{t.name}</strong>
                  <br />
                  <small>
                    {t.role} — {t.company}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-footer reveal">
          <Link href="/order" className="button button-primary">
            شروع همکاری با من
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}