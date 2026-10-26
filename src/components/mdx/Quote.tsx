import React from "react";

export default function Quote({ author, children }: { author?: string; children: React.ReactNode }) {
  return (
    <blockquote style={{ position: "relative", margin: "2.5rem 0", padding: "1.5rem 2rem", background: "var(--surface-2)", borderRadius: "16px", borderLeft: "4px solid var(--accent)" }}>
      <div style={{ fontSize: "1.25rem", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.8 }}>
        {children}
      </div>
      {author && (
        <footer style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--ink-3)", fontWeight: 600 }}>
          — {author}
        </footer>
      )}
    </blockquote>
  );
}