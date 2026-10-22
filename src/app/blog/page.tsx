import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { getBlogIndexSchema } from "@/lib/schema";
import BlogList from "@/components/BlogList";
import "@/styles/blog-index-ultimate.css";

export const metadata: Metadata = {
  title: "بلاگ | امیرحسین شرکائی",
  description: "مقالات امیرحسین شرکائی درباره طراحی وب، توسعه فرانت‌اند، UI/UX و هوش مصنوعی.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const blogSchema = getBlogIndexSchema(posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date })));

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <header className="blog-index-header">
        <h1 className="blog-index-title">مجله و مقالات</h1>
        <p className="blog-index-subtitle">یادداشت‌ها و تجربه‌های من درباره طراحی وب، توسعه، هوش مصنوعی و رشد کسب‌وکار.</p>
      </header>
      <div className="container">
        <BlogList posts={posts} tags={tags} />
      </div>
    </main>
  );
}