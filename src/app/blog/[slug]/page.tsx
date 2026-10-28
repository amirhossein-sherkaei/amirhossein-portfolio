"use client";
import { useEffect, useState } from "react";

type TOCItem = { id: string; title: string; level: number };

export default function TableOfContents({
  items,
  variant = "sidebar",
}: {
  items: TOCItem[];
  variant?: "sidebar" | "inline";
}) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  /* ─── Inline variant (بالای مقاله) ─── */
  if (variant === "inline") {
    return (
      <details className="toc-inline" open>
        <summary>در این مقاله می‌خوانید</summary>
        <nav>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "toc-level-3" : ""}
              >
                <a href={`#${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    );
  }

  /* ─── Sidebar variant (پنل کناری دسکتاپ) ─── */
  return (
    <nav className="glass-toc" aria-label="فهرست مطالب">
      <h3 className="glass-toc-title">در این مقاله می‌خوانید</h3>
      <ul className="glass-toc-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`glass-toc-item ${
              item.level === 3 ? "is-sub" : ""
            }`}
          >
            <a
              href={`#${item.id}`}
              className={`glass-toc-link ${
                activeId === item.id ? "is-active" : ""
              }`}
            >
              <span className="glass-toc-dot" />
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}