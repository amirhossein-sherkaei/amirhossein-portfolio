import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import MarkdownContent from "@/components/MarkdownContent";
import BlogAuthorBox from "@/components/BlogAuthorBox";
import BlogEndCTA from "@/components/BlogEndCTA";
import BlogShare from "@/components/BlogShare";
import BlogBreadcrumb from "@/components/BlogBreadcrumb";
import BlogPrevNext from "@/components/BlogPrevNext";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: "مقاله یافت نشد" };

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shorakaei.ir";

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      url: `${siteUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.tags);

  return (
    <>
      <ReadingProgress />
      <main id="main" className="blog-post-page">
        <div className="container blog-post-container">
          <Link href="/blog" className="blog-back-link">
            <span aria-hidden="true">→</span>
            بازگشت به بلاگ
          </Link>

          {/* ─── Breadcrumb ─── */}
          <BlogBreadcrumb title={post.title} />

          <article className="blog-post">
            <header className="blog-post-header">
              <div className="blog-post-meta">
                <span className="blog-card-date">{post.dateFormatted}</span>
                <span className="blog-card-reading">
                  {post.readingTime} دقیقه مطالعه
                </span>
              </div>

              <h1>{post.title}</h1>

              <p className="blog-post-excerpt">{post.excerpt}</p>

              <div className="blog-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="blog-card-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* ─── Share (top) ─── */}
            <BlogShare title={post.title} />

            {post.toc && post.toc.length > 0 && (
              <TableOfContents items={post.toc} variant="inline" />
            )}

            <MarkdownContent content={post.content || ""} />
          </article>

          {/* ─── Prev / Next ─── */}
          <BlogPrevNext currentSlug={post.slug} />

          {/* ─── About Author ─── */}
          <BlogAuthorBox />

          {/* ─── Related Posts ─── */}
          {relatedPosts.length > 0 && (
            <section className="blog-related">
              <h3 className="blog-related-title">مقالات مرتبط</h3>
              <div className="blog-related-grid">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="blog-related-card"
                  >
                    <span className="blog-card-date">
                      {related.dateFormatted}
                    </span>
                    <h4>{related.title}</h4>
                    <p>{related.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ─── End CTA (Lead Funnel) ─── */}
          <BlogEndCTA />
        </div>

        {post.toc && post.toc.length > 0 && (
          <TableOfContents items={post.toc} variant="sidebar" />
        )}
      </main>
    </>
  );
}