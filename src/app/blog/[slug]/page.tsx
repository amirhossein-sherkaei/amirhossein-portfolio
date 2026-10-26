import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/blog";
import { getBlogPostSchema } from "@/lib/schema";
import MarkdownContent from "@/components/MarkdownContent";
import ReadingProgress from "@/components/ui/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import AIActions from "@/components/blog/AIActions";
import BlogComments from "@/components/blog/BlogComments";
import BlogShare from "@/components/BlogShare";
import BlogAuthorBox from "@/components/BlogAuthorBox";
import BlogPrevNext from "@/components/BlogPrevNext";
import BlogEndCTA from "@/components/BlogEndCTA";
import BlogInlineCTA from "@/components/BlogInlineCTA";
import BlogBreadcrumb from "@/components/BlogBreadcrumb";
import ArticleGlassNav from "@/components/blog/ArticleGlassNav";

import "@/styles/blog-post-premium.css";
import "@/styles/blog-mobile-fix.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  if (!post) return { title: "یافت نشد" };
  
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://shorakaei.ir/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://shorakaei.ir/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  if (!post) notFound();

  const articleSchema = getBlogPostSchema({
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    slug: post.slug,
  });

  const relatedPosts = getRelatedPosts(post.slug, post.tags, 3);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: "https://shorakaei.ir" },
      { "@type": "ListItem", position: 2, name: "بلاگ", item: "https://shorakaei.ir/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://shorakaei.ir/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <main className="blog-post-page">
        {/* ⭐️ نوار شیشه‌ای شناور با پراپ toc برای فهرست مطالب */}
        <ArticleGlassNav 
          title={post.title} 
          slug={post.slug} 
          toc={post.toc || []} 
        />
        
        <div className="container">
          
          <BlogBreadcrumb title={post.title} />

          <header className="blog-post-header">
            <span className="blog-post-category">{post.category}</span>
            <h1 className="blog-post-title">{post.title}</h1>
            <p className="blog-post-excerpt">{post.excerpt}</p>
            <div className="blog-post-meta">
              <span>{post.dateFormatted}</span>
              <span>{post.readingTime} دقیقه مطالعه</span>
            </div>
          </header>

          <div className="blog-post-layout">
            <article className="blog-post-content glass-panel">
              <MarkdownContent content={post.content || ""} />
              
              <AIActions title={post.title} slug={post.slug} />
              
              <BlogInlineCTA />
              <BlogShare title={post.title} />
              <BlogAuthorBox />
              <BlogEndCTA />
              
              <BlogComments serverURL="https://shorakaei-comments.vercel.app" path={`/blog/${post.slug}`} />
            </article>
            
            {/* فهرست مطالب کناری (در موبایل با CSS مخفی شده و در مودال شیشه‌ای نمایش داده می‌شود) */}
            {post.toc && post.toc.length > 0 && (
              <aside className="blog-post-sidebar">
                <TableOfContents items={post.toc} />
              </aside>
            )}
          </div>

          {relatedPosts.length > 0 && (
            <section className="related-posts-section">
              <h2 className="related-posts-title">مقالات مرتبط</h2>
              <div className="related-posts-grid">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="related-post-card">
                    <span className="blog-post-category" style={{ fontSize: '0.65rem' }}>{related.category}</span>
                    <h3 style={{ fontSize: '1rem', margin: '12px 0', color: 'var(--sh-color-ink)' }}>{related.title}</h3>
                    <time style={{ fontSize: '0.8rem', color: 'var(--sh-color-muted)' }}>{related.dateFormatted}</time>
                  </Link>
                ))}
              </div>
            </section>
          )}
          
          <BlogPrevNext currentSlug={post.slug} />

        </div>
      </main>
    </>
  );
}