"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/lib/blog";

type Props = {
  posts: BlogPost[];
  tags: { tag: string; count: number }[];
};

export default function BlogList({ posts, tags }: Props) {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const filteredPosts = useMemo(() => {
    if (selectedTag === "all") return posts;
    return posts.filter((post) => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  const featuredPost =
    filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const restPosts = filteredPosts.filter(
    (p) => p.slug !== featuredPost?.slug
  );

  return (
    <>
      {/* Tags Filter */}
      {tags.length > 0 && (
        <div className="blog-tags-filter">
          <span className="blog-tags-label">فیلتر بر اساس:</span>
          <div className="blog-tags-list">
            <button
              type="button"
              className={`blog-tag-chip${
                selectedTag === "all" ? " active" : ""
              }`}
              onClick={() => setSelectedTag("all")}
            >
              همه
            </button>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                className={`blog-tag-chip${
                  selectedTag === tag ? " active" : ""
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag} ({count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="blog-featured-card"
        >
          <div className="blog-featured-badge">مقاله ویژه</div>
          <div className="blog-featured-content">
            <div className="blog-card-meta">
              <span>{featuredPost.dateFormatted}</span>
              <span className="blog-card-reading">
                {featuredPost.readingTime} دقیقه مطالعه
              </span>
            </div>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            <span className="blog-featured-cta">
              مطالعه مقاله
              <span aria-hidden="true">←</span>
            </span>
          </div>
        </Link>
      )}

      {/* Rest Posts */}
      {restPosts.length > 0 && (
        <div className="blog-grid">
          {restPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card"
            >
              <div className="blog-card-meta">
                <span className="blog-card-date">{post.dateFormatted}</span>
                <span className="blog-card-reading">
                  {post.readingTime} دقیقه مطالعه
                </span>
              </div>

              <h2 className="blog-card-title">{post.title}</h2>

              <p className="blog-card-excerpt">{post.excerpt}</p>

              <div className="blog-card-footer">
                <div className="blog-card-tags">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="blog-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="blog-card-arrow" aria-hidden="true">
                  ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && (
        <p className="blog-empty">
          مقاله‌ای با این تگ پیدا نشد.
        </p>
      )}
    </>
  );
}