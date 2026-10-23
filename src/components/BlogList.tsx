"use client";
import Link from "next/link";
import { useState } from "react";
import type { BlogPost } from "@/lib/blog";

export default function BlogList({ posts, tags }: { posts: BlogPost[]; tags: { tag: string; count: number }[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
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
      {/* فیلترها */}
      <div className="blog-filter-container">
        <button 
          className={`blog-filter-btn ${selectedTag === null ? "is-active" : ""}`} 
          onClick={() => setSelectedTag(null)}
        >
          همه مقالات
        </button>
        {tags.map((t) => (
          <button 
            key={t.tag} 
            className={`blog-filter-btn ${selectedTag === t.tag ? "is-active" : ""}`} 
            onClick={() => setSelectedTag(t.tag)}
          >
            {t.tag}
          </button>
        ))}
      </div>

      {/* گرید بلاگ */}
      <div className="blog-editorial-grid">
        
        {/* مقاله شاخص */}
        <Link href={`/blog/${featuredPost.slug}`} className="blog-card-featured">
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

        {/* بقیه مقالات */}
        <div className="blog-regular-grid">
          {restPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card-regular">
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