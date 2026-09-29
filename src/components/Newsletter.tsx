"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;

    setMessage("");

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("ایمیل معتبر وارد کن.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "ثبت نشد. یه بار دیگه امتحان کن.");
        return;
      }

      setStatus("success");
      setMessage("");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("اتصال برقرار نشد. اینترنتت رو چک کن.");
    }
  };

  return (
    <section
      id="newsletter"
      className="newsletter-section section"
      aria-labelledby="newsletter-title"
    >
      <div className="container">
        <div className="newsletter-card reveal">
          <span className="newsletter-eyebrow">
            07 — NEWSLETTER
          </span>

          <h2 id="newsletter-title" className="newsletter-title">
            هفته‌ای یه ایمیل،
            <br />
            <em className="ink-word">بدون اسپم.</em>
          </h2>

          <p className="newsletter-text">
            هر هفته، یه یادداشت کوتاه درباره‌ی طراحی وب، تجربه‌ی
            کاربری و چیزهایی که یاد می‌گیرم. کوتاه، مفید، بدون
            تبلیغ.
          </p>

          {status === "success" ? (
            <div className="newsletter-success" role="status">
              <span className="newsletter-success-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div className="newsletter-success-text">
                <strong>ثبت شد.</strong>
                <span>از هفته‌ی بعد، اولین ایمیل برات میاد.</span>
              </div>
            </div>
          ) : (
            <form
              className="newsletter-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="newsletter-input-wrap">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="you@example.com"
                  dir="ltr"
                  autoComplete="email"
                  inputMode="email"
                  aria-label="ایمیل"
                  aria-invalid={status === "error"}
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className="newsletter-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <span className="newsletter-btn-spinner" aria-hidden="true" />
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    عضویت
                    <span aria-hidden="true">←</span>
                  </>
                )}
              </button>
            </form>
          )}

          {status === "error" && message && (
            <p className="newsletter-error" role="alert">
              {message}
            </p>
          )}

          {status !== "success" && (
            <p className="newsletter-hint">
              بدون اسپم. هر وقت خواستی، با یه کلیک لغو کن.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}