"use client";

import { useEffect, useState } from "react";

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen/dismissed the popup
    if (localStorage.getItem("svi-newsletter-dismissed") === "true") return;

    const handleScroll = () => {
      if (hasShown) return;
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    }, 45000); // 45 seconds

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("svi-newsletter-dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call
    setIsSubmitted(true);
    localStorage.setItem("svi-newsletter-dismissed", "true");
    setTimeout(() => setIsVisible(false), 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="svi-popup-backdrop" onClick={handleClose}>
      <div className="svi-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="svi-popup-close" onClick={handleClose} aria-label="بستن">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {isSubmitted ? (
          <div className="svi-popup-success">
            <div className="svi-popup-success-icon">✓</div>
            <h3>عضویت شما با موفقیت ثبت شد!</h3>
            <p>چک‌لیست ۱۰ قدمی طراحی سایت به ایمیل شما ارسال شد.</p>
          </div>
        ) : (
          <>
            <div className="svi-popup-glow" />
            <span className="svi-popup-badge">هدیه رایگان</span>
            <h3 className="svi-popup-title">چک‌لیست ۱۰ قدمی طراحی سایت</h3>
            <p className="svi-popup-text">
              قبل از سفارش طراحی سایت، این چک‌لیست را بخوانید تا از کلاهبرداری و هزینه‌های پنهان جلوگیری کنید.
            </p>
            <form onSubmit={handleSubmit} className="svi-popup-form">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
              <button type="submit">دریافت هدیه</button>
            </form>
            <button className="svi-popup-skip" onClick={handleClose}>
              خیر، ممنون
            </button>
          </>
        )}
      </div>
    </div>
  );
}
