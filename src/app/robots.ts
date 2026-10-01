import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shorakaei.ir";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* فقط API باید از ایندکس خارج باشد.
         /order صفحه‌ی اصلی سفارش است و باید ایندکس شود. */
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}