"use client";
import { useEffect, useState } from "react";

type TOCItem = { id: string; title: string; level: number };

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
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
    <nav 
      style={{
        position: 'relative',
        padding: '24px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)'
      }} 
      aria-label="فهرست مطالب"
    >
      <h3 style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--ink-3)',
        margin: '0 0 16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--line)'
      }}>
        در این مقاله می‌خوانید
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li 
              key={item.id} 
              style={{ 
                paddingInlineStart: item.level === 3 ? '16px' : '0' 
              }}
            >
              <a
                href={`#${item.id}`}
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: isActive ? 'var(--accent)' : 'var(--ink-2)',
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  paddingInlineStart: '16px'
                }}
              >
                {/* نقطه نشانگر وضعیت فعال */}
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: '6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  border: isActive ? 'none' : '1.5px solid var(--line-strong)',
                  transition: 'all 0.2s ease'
                }} />
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}