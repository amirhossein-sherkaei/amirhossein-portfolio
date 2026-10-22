"use client";

import Link from "next/link";
import { useState } from "react";
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

      {/* Blog Grid */}
      <div className="blog-grid-ultimate">
        {filteredPosts.map((post) => (
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
  );
}