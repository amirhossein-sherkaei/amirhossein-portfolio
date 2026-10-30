import SpatialOrbitShowcase from "@/components/SpatialOrbitShowcase";
import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { getBlogIndexSchema } from "@/lib/schema";
import BlogList from "@/components/BlogList";
import "@/styles/blog-index-premium.css";
import "@/styles/blog-mobile-fix.css";

export const metadata: Metadata = {
  title: "بلاگ | امیرحسین شرکائی",
  description: "مقالات امیرحسین شرکائی درباره طراحی وب، توسعه فرانت‌اند، UI/UX و هوش مصنوعی.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const blogSchema = getBlogIndexSchema(posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date })));  const orbitArticles = posts.slice(0, 6).map((post: any) => ({
    id: post.slug,
    href: `/blog/${post.slug}`,
    title: post.title,
    category: post.category || "مقاله",
    image: post.coverImage || post.image || `https://img.shorakaei.ir/assets?key=images%2F${post.slug}%2Fcover.jpg`,
    imageAlt: post.title,
    description: post.excerpt || "",
    meta: post.readingTime ? `${post.readingTime} دقیقه مطالعه` : "مقاله تحریریه",
  }));


      return (
    <main id="main" className="section">
      <SpatialOrbitShowcase
        kind="article"
        eyebrow="THE EDITORIAL ORBIT"
        title="مقالات، در یک مدار تازه"
        description="ایده‌ها و تحلیل‌های تازه را از زاویه‌ای متفاوت کشف کن."
        items={orbitArticles}
      />

      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      
      <div className="container">
        <header className="section-heading reveal" style={{ marginBottom: '48px' }}>
          <div>
            <h1>مجله و <em className="ink-word">مقالات</em></h1>
          </div>
          <p>یادداشت‌ها و تجربه‌های من درباره طراحی وب، توسعه، هوش مصنوعی و رشد کسب‌وکار.</p>
        </header>
        
        <BlogList posts={posts} tags={tags} />
      </div>
    </main>
  );
}