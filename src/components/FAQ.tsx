"use client";


import SectionNumber from "@/components/SectionNumber";
import { useState } from "react";
import { faqItems } from "@/lib/schema";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section section" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۸" label="FAQ" />
            <h2 id="faq-title">
              سوال‌هایی که
              <em className="ink-word"> زیاد می‌شنوم</em>
            </h2>
          </div>
          <p>
            اگه سؤال دیگه‌ای داری، از طریق صفحه‌ی سفارش یا فرم تماس
            بپرس. توی ۲۴ ساعت جواب می‌دم.
          </p>
        </div>

        <div className="faq-list reveal">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`faq-item${isOpen ? " is-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="faq-question-text"
                    data-num={String(index + 1).padStart(2, "0")}
                  >
                    {item.q}
                  </span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                <div
                  className="faq-answer"
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <div className="faq-answer-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}