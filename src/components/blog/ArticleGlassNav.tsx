"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TOCItem = { id: string; title: string; level: number };

type Props = { title: string; slug: string; toc?: TOCItem[]; };

export default function ArticleGlassNav({ title, slug, toc = [] }: Props) {
  const [progress, setProgress] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const savedArticles = JSON.parse(localStorage.getItem("svi-saved-articles") || "[]");
      if (savedArticles.includes(slug)) setSaved(true);
    } catch (e) {}
  }, [slug]);

  const toggleSave = () => {
    setSaved(!saved);
    try {
      const savedArticles = JSON.parse(localStorage.getItem("svi-saved-articles") || "[]");
      if (!saved) savedArticles.push(slug);
      else { const i = savedArticles.indexOf(slug); if (i > -1) savedArticles.splice(i, 1); }
      localStorage.setItem("svi-saved-articles", JSON.stringify(savedArticles));
    } catch (e) {}
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) setProgress((y / totalHeight) * 100);
      setIsVisible(y > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isTocOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isTocOpen]);

  useEffect(() => {
    document.documentElement.style.setProperty('--article-font-scale', fontScale.toString());
  }, [fontScale]);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `https://shorakaei.ir/blog/${slug}`;
    if (navigator.share) { try { await navigator.share({ title, url }); } catch {} }
    else {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
      catch (err) { console.error("Failed to copy", err); }
    }
  };

  const scrollToTop = (e: React.MouseEvent) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <div className={`article-glass-nav${isVisible ? " is-visible" : ""}`} aria-label="ابزارهای مقاله" aria-hidden={!isVisible}>
        <div className="nav-progress-fill" style={{ width: `${progress}%` }} />
        <Link href="/blog" className="article-glass-nav-btn" aria-label="بازگشت به بلاگ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </Link>
        <button type="button" onClick={() => setIsTocOpen(true)} className="article-glass-nav-btn" aria-label="فهرست مطالب">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button type="button" onClick={handleShare} className="article-glass-nav-btn" aria-label="اشتراک‌گذاری">
          {copied ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>}
        </button>
        <div className="article-glass-nav-font">
          <button type="button" onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))} className="article-glass-nav-font-btn">A-</button>
          <button type="button" onClick={() => setFontScale((s) => Math.min(1.35, +(s + 0.1).toFixed(2)))} className="article-glass-nav-font-btn">A+</button>
        </div>
        <button type="button" onClick={toggleSave} className={`article-glass-nav-btn ${saved ? "is-active is-bookmarked" : ""}`} aria-label="ذخیره">
          <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
        </button>
        <button type="button" onClick={scrollToTop} className="article-glass-nav-btn" aria-label="بازگشت به بالا">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </div>

      {isTocOpen && (
        <div className="toc-modal-backdrop" onClick={() => setIsTocOpen(false)}>
          <div className="toc-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="toc-drag-handle" />
            <div className="toc-modal-header">
              <h3 className="toc-modal-title">در این مقاله می‌خوانید</h3>
              <button type="button" onClick={() => setIsTocOpen(false)} className="toc-modal-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
            </div>
            <ul className="toc-modal-list">
              {toc.length > 0 ? toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "is-sub" : ""}><a href={`#${item.id}`} onClick={() => setIsTocOpen(false)}><span className="toc-dot" />{item.title}</a></li>
              )) : <li className="toc-empty">فهرستی برای این مقاله تعریف نشده است.</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}