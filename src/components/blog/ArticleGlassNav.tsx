"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  title: string;
  slug: string;
};

export default function ArticleGlassNav({ title, slug }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const article = document.querySelector(".blog-post-content") as HTMLElement | null;
    if (article) {
      article.style.fontSize = `${16 * fontScale}px`;
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={`article-glass-nav ${scrolled ? "is-scrolled" : ""}`} aria-label="ابزارهای مقاله">
      <Link href="/blog" className="article-glass-nav-btn" aria-label="بازگشت به بلاگ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>
      <button type="button" onClick={handleShare} className="article-glass-nav-btn" aria-label="اشتراک‌گذاری">
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
        )}
      </button>
      <button type="button" onClick={() => setSaved(!saved)} className={`article-glass-nav-btn ${saved ? "is-active" : ""}`} aria-label="ذخیره">
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
      </button>
      <div className="article-glass-nav-font">
        <button type="button" onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))} className="article-glass-nav-font-btn">A-</button>
        <button type="button" onClick={() => setFontScale((s) => Math.min(1.25, +(s + 0.1).toFixed(2)))} className="article-glass-nav-font-btn">A+</button>
      </div>
      <button type="button" onClick={scrollToTop} className="article-glass-nav-btn" aria-label="بازگشت به بالا">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
    </div>
  );
}