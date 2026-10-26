"use client";

export default function AIActions({ title, slug }: { title: string; slug: string }) {
  const url = `https://shorakaei.ir/blog/${slug}`;
  const prompt = encodeURIComponent(`Please read and summarize this article: "${title}" at ${url}`);
  
  return (
    <div className="blog-actions">
      <a
        href={`https://chat.openai.com/?q=${prompt}`}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn"
      >
        <span aria-hidden="true">🤖</span> Read with ChatGPT
      </a>
      <a
        href={`https://claude.ai/new?q=${prompt}`}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn"
      >
        <span aria-hidden="true">🧠</span> Read with Claude
      </a>
    </div>
  );
}