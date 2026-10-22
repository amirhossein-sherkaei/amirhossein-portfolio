"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";

type Props = {
  posts: BlogPost[];
  tags: { tag: string; count: number }[];
};

export default function BlogList({ posts, tags }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  if (filteredPosts.length === 0) return <p className="text-center" style={{ padding: "4rem", color: "var(--ink-3)" }}>مقاله‌ای با این تگ یافت نشد.</p>;

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div>
      {/* Tags Filter */}
      <div className="blog-tags-filter">
        <button
          className={`blog-tag-btn ${selectedTag === null ? "active" : ""}`}
          onClick={() => setSelectedTag(null)}
        >
          همه مقالات
        </button>
        {tags.map((t) => (
          <button
            key={t.tag}
            className={`blog-tag-btn ${selectedTag === t.tag ? "active" : ""}`}
            onClick={() => setSelectedTag(t.tag)}
          >
            {t.tag}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="blog-bento-grid">
        
        {/* Featured Post (Large) */}
        <Link href={`/blog/${featuredPost.slug}`} className="blog-card-featured">
          <div className="blog-card-featured-bg" style={{
            background: `linear-gradient(135deg, var(--accent-tint), var(--surface-2))`
          }} />
          <div className="blog-card-featured-content">
            <div className="blog-card-meta">
              <span className="blog-card-category">{featuredPost.category}</span>
              <span className="blog-card-date">{featuredPost.dateFormatted}</span>
            </div>
            <h2 className="blog-card-title-featured">{featuredPost.title}</h2>
            <p className="blog-card-excerpt-featured">{featuredPost.excerpt}</p>
            <div className="blog-card-footer">
              <span className="blog-card-read-more">
                مطالعه مقاله <span aria-hidden="true">←</span>
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>
                {featuredPost.readingTime} دقیقه مطالعه
              </span>
            </div>
          </div>
        </Link>

        {/* Rest of the Posts (Grid) */}
        <div className="blog-regular-grid">
          {restPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card-ultimate">
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-card-category">{post.category}</span>
                  <span className="blog-card-date">{post.dateFormatted}</span>
                </div>
                <h2 className="blog-card-title-ultimate">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-footer">
                  <span className="blog-card-read-more">
                    مطالعه مقاله <span aria-hidden="true">←</span>
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--ink-3)" }}>
                    {post.readingTime} دقیقه
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}