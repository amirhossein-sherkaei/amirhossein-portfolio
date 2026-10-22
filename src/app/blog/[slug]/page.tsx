import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { getBlogPostSchema } from "@/lib/schema";
import MarkdownContent from "@/components/MarkdownContent";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import BlogShare from "@/components/BlogShare";
import BlogAuthorBox from "@/components/BlogAuthorBox";
import BlogPrevNext from "@/components/BlogPrevNext";
import BlogEndCTA from "@/components/BlogEndCTA";
import BlogInlineCTA from "@/components/BlogInlineCTA";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
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
    },
  };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const articleSchema = getBlogPostSchema({
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    slug: post.slug,
  });

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
          
          <nav className="blog-post-breadcrumb" aria-label="مسیر">
            <Link href="/">خانه</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">بلاگ</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{post.title}</span>
          </nav>

          <header className="blog-post-header">
            <div className="blog-post-meta">
              <span className="blog-post-category">{post.category}</span>
              <span className="blog-post-date">{post.dateFormatted}</span>
              <span className="blog-post-reading">{post.readingTime} دقیقه مطالعه</span>
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
            <p className="blog-post-excerpt">{post.excerpt}</p>
          </header>

          <div className="blog-post-layout">
            <article className="blog-post-content">
              <MarkdownContent content={post.content || ""} />
              <BlogInlineCTA />
              <BlogShare title={post.title} />
              <BlogAuthorBox />
              <BlogEndCTA />
            </article>
            
            {post.toc && post.toc.length > 0 && (
              <aside className="blog-post-sidebar">
                <TableOfContents items={post.toc} />
              </aside>
            )}
          </div>

          <BlogPrevNext currentSlug={post.slug} />

        </div>
      </main>
    </>
  );
}