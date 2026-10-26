"use client";

import { useEffect, useState } from "react";
import type { TOCItem } from "@/lib/blog";

type Props = {
  items: TOCItem[];
  variant?: "sidebar" | "inline";
};

export default function TableOfContents({ items, variant = "sidebar" }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  if (variant === "inline") {
    return (
      <details className="toc-inline">
        <summary>فهرست مطالب</summary>
        <nav>
          <ul>
            {items.map((item) => (
              <li key={item.id} className={`toc-level-${item.level}`}>
                <a href={`#${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    );
  }

  return (
    <aside className="toc-sidebar" aria-label="فهرست مطالب">
      <span className="toc-sidebar-label">در این صفحه</span>
      <nav>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className={`toc-level-${item.level} ${
                activeId === item.id ? "is-active" : ""
              }`}
            >
              <a href={`#${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}