"use client";
import { useEffect, useState } from "react";

type TOCItem = { id: string; title: string; level: number };

export default function TableOfContents({ items }: { items: TOCItem[] }) {
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

  return (
    <nav className="glass-toc" aria-label="فهرست مطالب">
      <h3 className="glass-toc-title">در این مقاله می‌خوانید</h3>
      <ul className="glass-toc-list">
        {items.map((item) => (
          <li key={item.id} className={`glass-toc-item ${item.level === 3 ? "is-sub" : ""}`}>
            <a
              href={`#${item.id}`}
              className={`glass-toc-link ${activeId === item.id ? "is-active" : ""}`}
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