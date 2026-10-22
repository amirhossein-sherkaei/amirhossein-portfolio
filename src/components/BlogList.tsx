"use client";
import Link from "next/link";
import { useState } from "react";
import type { BlogPost } from "@/lib/blog";

export default function BlogList({ posts, tags }: { posts: BlogPost[]; tags: { tag: string; count: number }[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const filteredPosts = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;
  if (filteredPosts.length === 0) return <p style={{ padding: "4rem", textAlign: "center" }}>مقاله‌ای یافت نشد.</p>;
  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div>
      <div className="blog-tags-filter">
        <button className={`blog-tag-btn ${selectedTag === null ? "active" : ""}`} onClick={() => setSelectedTag(null)}>همه مقالات</button>
        {tags.map((t) => (
          <button key={t.tag} className={`blog-tag-btn ${selectedTag === t.tag ? "active" : ""}`} onClick={() => setSelectedTag(t.tag)}>{t.tag}</button>
        ))}
      </div>
      <div className="blog-bento-grid">
        <Link href={`/blog/${featuredPost.slug}`} className="blog-card-featured">
          <div className="blog-card-featured-bg" style={{ background: `linear-gradient(135deg, var(--accent-tint), var(--surface-2))` }} />
          <div className="blog-card-featured-content">
            <div className="blog-card-meta"><span className="blog-card-category">{featuredPost.category}</span><span className="blog-card-date">{featuredPost.dateFormatted}</span></div>
            <h2 className="blog-card-title-featured">{featuredPost.title}</h2>
            <p className="blog-card-excerpt-featured">{featuredPost.excerpt}</p>
            <div className="blog-card-footer"><span className="blog-card-read-more">مطالعه مقاله <span aria-hidden="true">←</span></span><span style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>{featuredPost.readingTime} دقیقه</span></div>
          </div>
        </Link>
        <div className="blog-regular-grid">
          {restPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card-ultimate">
              <div className="blog-card-content">
                <div className="blog-card-meta"><span className="blog-card-category">{post.category}</span><span className="blog-card-date">{post.dateFormatted}</span></div>
                <h2 className="blog-card-title-ultimate">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-footer"><span className="blog-card-read-more">مطالعه مقاله <span aria-hidden="true">←</span></span><span style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>{post.readingTime} دقیقه</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}