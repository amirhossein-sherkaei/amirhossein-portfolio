"use client";

import { useState } from "react";

export default function AIActions({ title, slug }: { title: string; slug: string }) {
  const url = `https://shorakaei.ir/blog/${slug}`;
  const prompt = encodeURIComponent(`Please read and summarize this article: "${title}" at ${url}`);
  
  return (
    <div className="blog-actions" style={{ opacity: 0.8, fontSize: "0.85rem" }}>
      <span style={{ color: "var(--ink-3)", marginRight: "8px" }}>خواندن با هوش مصنوعی:</span>
      <a
        href={`https://chat.openai.com/?q=${prompt}`}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn"
        style={{ padding: "6px 12px", fontSize: "0.75rem", background: "var(--paper-2)", border: "1px solid var(--line)" }}
      >
        <span aria-hidden="true">🤖</span> ChatGPT
      </a>
      <a
        href={`https://claude.ai/new?q=${prompt}`}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn"
        style={{ padding: "6px 12px", fontSize: "0.75rem", background: "var(--paper-2)", border: "1px solid var(--line)" }}
      >
        <span aria-hidden="true">🧠</span> Claude
      </a>
    </div>
  );
}