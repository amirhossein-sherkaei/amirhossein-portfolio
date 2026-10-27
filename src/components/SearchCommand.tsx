"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

export default function SearchCommand() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load search data
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error);

    // Keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fuse = new Fuse(data, {
      keys: ["title", "excerpt", "category"],
      threshold: 0.3,
      includeScore: true,
    });
    const res = fuse.search(query).slice(0, 5).map((r) => r.item);
    setResults(res);
    setSelectedIndex(0);
  }, [query, data]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      router.push(`/blog/${results[selectedIndex].slug}`);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="svi-search-trigger" onClick={() => setIsOpen(true)} aria-label="جستجو">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span className="svi-search-trigger-text">جستجو...</span>
        <kbd className="svi-search-kbd">Ctrl K</kbd>
      </button>
    );
  }

  return (
    <div className="svi-search-backdrop" onClick={() => setIsOpen(false)}>
      <div className="svi-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="svi-search-input-wrap">
          <svg className="svi-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref={inputRef}
            type="text"
            className="svi-search-input"
            placeholder="جستجو در مقالات..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            dir="rtl"
          />
          <button className="svi-search-close" onClick={() => setIsOpen(false)}>ESC</button>
        </div>

        {results.length > 0 && (
          <ul className="svi-search-results">
            {results.map((item, index) => (
              <li
                key={item.slug}
                className={`svi-search-item ${index === selectedIndex ? "is-active" : ""}`}
                onClick={() => { router.push(`/blog/${item.slug}`); setIsOpen(false); }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="svi-search-item-icon">📄</div>
                <div className="svi-search-item-content">
                  <span className="svi-search-item-title">{item.title}</span>
                  <span className="svi-search-item-category">{item.category}</span>
                </div>
                <span className="svi-search-item-arrow">←</span>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <div className="svi-search-empty">
            نتیجه‌ای برای «{query}» یافت نشد.
          </div>
        )}

        <div className="svi-search-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> برای حرکت</span>
          <span><kbd>Enter</kbd> برای انتخاب</span>
          <span><kbd>ESC</kbd> برای بستن</span>
        </div>
      </div>
    </div>
  );
}
