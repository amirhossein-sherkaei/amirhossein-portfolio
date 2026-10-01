import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllProjectSlugs } from "@/content/projects";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://shorakaei.ir";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const projectSlugs = getAllProjectSlugs();
  const now = new Date();

  /* ── Blog posts ── */
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  /* ── Work (project) pages ── */
  const workEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${siteUrl}/work/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  /* ── Static pages ── */
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/order`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  return [...staticEntries, ...workEntries, ...blogEntries];
}