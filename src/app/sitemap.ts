import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getArticleManifest } from "@/lib/visual-intelligence";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const baseUrl = "https://shorakaei.ir";

  const blogEntries = await Promise.all(
    posts.map(async (post) => {
      let images: string[] = [];
      try {
        const manifest = await getArticleManifest(post.slug);
        if (manifest?.images) {
          images = manifest.images.map((img: any) => img.src);
        }
      } catch (e) {}

      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        images,
      };
    })
  );

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/order`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...blogEntries,
  ];
}
