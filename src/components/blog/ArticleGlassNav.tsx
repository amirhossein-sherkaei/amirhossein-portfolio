"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  title: string;
  slug: string;
};

export default function ArticleGlassNav({ title, slug }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // محاسبه درصد پیشرفت مطالعه
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((currentScrollY / totalHeight) * 100);
      }

      // منطق نمایش و پنهان شدن (iOS Style)
      // اگر به پایین اسکرول کنیم پنهان شود، اگر به بالا بیاییم ظاهر شود
      if (currentScrollY > 80 && currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const article = document.querySelector(".blog-post-content") as HTMLElement | null;
    if (article) {
      article.style.fontSize = `${16 * fontScale}px`;
      // انتقال نرم برای تغییر سایز فونت
      article.style.transition = "font-size 0.2s ease";
    }
  }, [fontScale]);

  const handleShare = async () => {
    const url = `https://shorakaei.ir/blog/${slug}`;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleTocClick = () => {
    const toc = document.querySelector(".glass-toc");
    if (toc) {
      toc.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={`article-glass-nav ${isVisible ? "is-visible" : ""}`} aria-label="ابزارهای مقاله">
      <Link href="/blog" className="article-glass-nav-btn" aria-label="بازگشت به بلاگ">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>
      
      <button type="button" onClick={handleTocClick} className="article-glass-nav-btn" aria-label="فهرست مطالب">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>

      <button type="button" onClick={handleShare} className="article-glass-nav-btn" aria-label="اشتراک‌گذاری">
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
        )}
      </button>

      <div className="article-glass-nav-font">
        <button type="button" onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))} className="article-glass-nav-font-btn">A-</button>
        <button type="button" onClick={() => setFontScale((s) => Math.min(1.25, +(s + 0.1).toFixed(2)))} className="article-glass-nav-font-btn">A+</button>
      </div>

      <button type="button" onClick={scrollToTop} className="article-glass-nav-btn" aria-label="بازگشت به بالا">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      {/* نوار پیشرفت مطالعه در پایین شیشه */}
      <div className="nav-progress-track">
        <div className="nav-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}