import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://shorakaei.ir";

  const rssItems = posts.map((post) => `
    <item>
      <title>${post.title}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${post.excerpt}</description>
      <category>${post.category}</category>
    </item>
  `).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>امیرحسین شرکائی | مجله و مقالات</title>
    <link>${baseUrl}/blog</link>
    <description>مقالات امیرحسین شرکائی درباره طراحی وب، توسعه فرانت‌اند، UI/UX و هوش مصنوعی.</description>
    <language>fa</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
