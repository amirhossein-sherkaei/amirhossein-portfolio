"use client";

import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   BLOG SHARE — دکمه‌های اشتراک‌گذاری
   ═══════════════════════════════════════════════════════════ */

type Props = {
  title: string;
  url?: string;
  compact?: boolean;
};

export default function BlogShare({ title, url, compact = false }: Props) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    url ||
    (typeof window !== "undefined" ? window.location.href : "");

  const shareTo = (platform: "whatsapp" | "telegram" | "linkedin") => {
    const u = encodeURIComponent(getUrl());
    const t = encodeURIComponent(title);
    const links = {
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      telegram: `https://t.me/share/url?url=${u}&text=${t}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    };
    window.open(links[platform], "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`blog-share ${compact ? "is-compact" : ""}`}>
      <span className="blog-share-label">اشتراک‌گذاری</span>

      <div className="blog-share-buttons">
        <button
          type="button"
          className="blog-share-btn blog-share-btn--whatsapp"
          onClick={() => shareTo("whatsapp")}
          aria-label="اشتراک در واتساپ"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.84 1h.01a7.95 7.95 0 0 0 5.55-13.58ZM12.05 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.59 6.59 0 1 1 12.24-3.5 6.6 6.6 0 0 1-6.65 6.59Zm3.6-4.94c-.2-.1-1.17-.58-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.51.64-.63.77-.12.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99a5.97 5.97 0 0 1-1.1-1.37c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.45-1.09-.62-1.49-.16-.39-.33-.34-.45-.34l-.38-.01c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66 0 .98.71 1.93.81 2.06.1.13 1.4 2.14 3.4 3 1.99.86 1.99.57 2.35.54.36-.03 1.17-.48 1.34-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23Z" />
          </svg>
          <span className="blog-share-btn-text">واتساپ</span>
        </button>

        <button
          type="button"
          className="blog-share-btn blog-share-btn--telegram"
          onClick={() => shareTo("telegram")}
          aria-label="اشتراک در تلگرام"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.9 4.3 2.6 11.8c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.7c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.2-.5-1.8-1.8-1.3ZM9.2 14.1l9-5.6c.4-.2.8 0 .5.3l-7.4 6.7-.3 3-1.8-4.4Z" />
          </svg>
          <span className="blog-share-btn-text">تلگرام</span>
        </button>

        <button
          type="button"
          className="blog-share-btn blog-share-btn--linkedin"
          onClick={() => shareTo("linkedin")}
          aria-label="اشتراک در لینکدین"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3ZM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75ZM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66Z" />
          </svg>
          <span className="blog-share-btn-text">لینکدین</span>
        </button>

        <button
          type="button"
          className="blog-share-btn blog-share-btn--copy"
          onClick={copyLink}
          aria-label="کپی لینک"
        >
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          <span className="blog-share-btn-text">{copied ? "کپی شد" : "کپی لینک"}</span>
        </button>
      </div>
    </div>
  );
}