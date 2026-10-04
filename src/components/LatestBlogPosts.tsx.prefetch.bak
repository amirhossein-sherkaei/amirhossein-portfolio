import SectionNumber from "@/components/SectionNumber";

import Link from "next/link";
import { getLatestPosts } from "@/lib/blog";

export default function LatestBlogPosts() {
  const posts = getLatestPosts(3);

  if (posts.length === 0) return null;

  return (
    <section
      className="section latest-blog-section"
      aria-labelledby="latest-blog-title"
    >
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۹" label="BLOG" />
            <h2 id="latest-blog-title">
              مقالات و
              <em className="ink-word"> یادداشت‌ها</em>
            </h2>
          </div>
          <p>
            درباره‌ی طراحی وب، افزایش فروش، سئو و تجربه‌ی کاربری — چیزهایی
            که به رشد کسب‌وکارت کمک می‌کنه.
          </p>
        </div>

        <div className="latest-blog-grid">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="latest-blog-card reveal"
            >
              <div className="latest-blog-meta">
                <span className="latest-blog-date">
                  {post.dateFormatted}
                </span>
                <span className="latest-blog-reading">
                  {post.readingTime} دقیقه
                </span>
              </div>

              <h3 className="latest-blog-title">{post.title}</h3>

              <p className="latest-blog-excerpt">{post.excerpt}</p>

              <span className="latest-blog-cta">
                مطالعه مقاله
                <span aria-hidden="true">←</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="latest-blog-footer reveal">
          <Link href="/blog" className="button button-secondary">
            مشاهده همه مقالات
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}