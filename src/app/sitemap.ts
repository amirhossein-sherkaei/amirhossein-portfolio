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
        // یک تایم‌اوت ۲ ثانیه‌ای تعریف می‌کنیم تا اگر ورکر شلوغ بود، بیلد متوقف نشه
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 2000)
        );
        
        // بین گرفتن دیتا و تایم‌اوت، هر کدوم زودتر تموم شد رو قبول می‌کنیم
        const manifest = await Promise.race([
          getArticleManifest(post.slug),
          timeoutPromise
        ]) as any;

        if (manifest?.images) {
          images = manifest.images.map((img: any) => img.src);
        }
      } catch (e) {
        // اگر ورکر جواب نداد (تایم‌اوت شد)، ارور رو نادیده می‌گیریم و مقاله رو بدون عکس ثبت می‌کنیم
        console.warn(`Skipping images for ${post.slug} due to timeout.`);
      }

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