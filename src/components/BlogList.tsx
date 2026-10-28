"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/blog";

const WORKER_URL = (process.env.NEXT_PUBLIC_SVI_WORKER_URL || "").replace(/\/+$/, "");

export default function BlogList({ posts, tags }: { posts: BlogPost[]; tags: { tag: string; count: number }[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [covers, setCovers] = useState<Record<string, string>>({});
  
  // Limit to top 8 most used tags
  const displayedTags = tags.slice(0, 8);

  useEffect(() => {
    if (!WORKER_URL) return;
    fetch(`${WORKER_URL}/index`)
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          const map: Record<string, string> = {};
          data.items.forEach((item: any) => { map[item.slug] = item.cover; });
          setCovers(map);
        }
      })
      .catch(console.error);
  }, []);

  const filteredPosts = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;
  
  if (filteredPosts.length === 0) {
    return (
      <div className="blog-empty-state">
        <p>مقاله‌ای با این دسته‌بندی یافت نشد.</p>
        <button onClick={() => setSelectedTag(null)} className="blog-empty-btn">مشاهده همه مقالات</button>
      </div>
    );
  }

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div className="blog-index-wrapper">
      <div className="blog-filter-container">
        <button className={`blog-filter-btn ${selectedTag === null ? "is-active" : ""}`} onClick={() => setSelectedTag(null)}>
          همه مقالات
        </button>
        {displayedTags.map((t) => (
          <button key={t.tag} className={`blog-filter-btn ${selectedTag === t.tag ? "is-active" : ""}`} onClick={() => setSelectedTag(t.tag)}>
            {t.tag}
          </button>
        ))}
      </div>

      <div className="blog-editorial-grid">
        <Link href={`/blog/${featuredPost.slug}`} className="blog-card-featured">
          {covers[featuredPost.slug] && (
            <div className="svi-card-img-wrapper">
              <img src={covers[featuredPost.slug]} alt={featuredPost.title} loading="eager" />
            </div>
          )}
          <div className="blog-card-featured-bg" />
          <div className="blog-card-featured-content">
            <div className="blog-card-meta">
              <span className="blog-card-category">{featuredPost.category}</span>
              <span className="blog-card-date">{featuredPost.dateFormatted}</span>
            </div>
            <h2 className="blog-card-title-featured">{featuredPost.title}</h2>
            <p className="blog-card-excerpt-featured">{featuredPost.excerpt}</p>
            <div className="blog-card-footer">
              <span className="blog-card-read-more">مطالعه مقاله <span aria-hidden="true">←</span></span>
              <span className="blog-card-reading-time">{featuredPost.readingTime} دقیقه</span>
            </div>
          </div>
        </Link>

        <div className="blog-regular-grid">
          {restPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card-regular">
              {covers[post.slug] && (
                <div className="svi-card-img-wrapper">
                  <img src={covers[post.slug]} alt={post.title} loading="lazy" />
                </div>
              )}
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-card-category">{post.category}</span>
                  <span className="blog-card-date">{post.dateFormatted}</span>
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-footer">
                  <span className="blog-card-read-more">مطالعه مقاله <span aria-hidden="true">←</span></span>
                  <span className="blog-card-reading-time">{post.readingTime} دقیقه</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}