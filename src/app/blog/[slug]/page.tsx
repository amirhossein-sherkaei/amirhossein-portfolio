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
      
      <main className="blog-post">
        <div className="container">
          
          <header className="blog-post-header">
            <span className="blog-post-category">{post.category}</span>
            <h1 className="blog-post-title">{post.title}</h1>
            <p className="blog-post-excerpt">{post.excerpt}</p>
            <div className="blog-post-meta">
              <span>{post.dateFormatted}</span>
              <span>·</span>
              <span>{post.readingTime} دقیقه مطالعه</span>
            </div>
          </header>

          <div className="blog-post-layout">
            <article className="blog-post-content">
              <MarkdownContent content={post.content || ""} />
              
              <AIActions title={post.title} slug={post.slug} />
              
              <BlogInlineCTA />
              <BlogShare title={post.title} />
              <BlogAuthorBox />
              <BlogEndCTA />
              
              <BlogComments />
            </article>
            
            {post.toc && post.toc.length > 0 && (
              <aside className="blog-post-sidebar">
                <TableOfContents items={post.toc} />
              </aside>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="related-posts-section" style={{ marginTop: "5rem", paddingTop: "3rem", borderTop: "1px solid var(--line-strong)" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "var(--ink)" }}>مقالات مرتبط</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="related-post-card" style={{ padding: "1.5rem", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line-strong)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)" }}>{related.category}</span>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--ink)", lineHeight: 1.4 }}>{related.title}</h3>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink-3)" }}>{related.dateFormatted}</span>
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