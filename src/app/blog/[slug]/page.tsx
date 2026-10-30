import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import SpatialOrbitShowcase from "@/components/SpatialOrbitShowcase";

export default async function BlogPage() {
  const posts = getAllPosts();

  // رفع خطای TypeScript با استفاده از any
  const orbitArticles = posts.slice(0, 6).map((post: any) => ({
    id: post.slug,
    href: `/blog/${post.slug}`,
    title: post.title,
    category: post.category || "مقاله",
    image: post.coverImage || post.image || `https://img.shorakaei.ir/assets?key=images%2F${post.slug}%2Fcover.jpg`,
    imageAlt: post.title,
    description: post.excerpt || post.description || "",
    meta: post.readingTime ? `${post.readingTime} دقیقه مطالعه` : "مقاله تحریریه",
  }));

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] pb-24">
      {/* هدر بلاگ */}
      <section className="pt-32 pb-12 px-4 max-w-4xl mx-auto text-center" dir="rtl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          مقالات و تحلیل‌های شرکائی
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          ایده‌ها، تجربه‌ها و تکنولوژی‌های دنیای وب و هوش مصنوعی
        </p>
      </section>

      {/* نمایشگر جدید */}
      <div className="px-4">
        <SpatialOrbitShowcase
          kind="article"
          eyebrow="THE EDITORIAL ORBIT"
          title="مقالات، در یک مدار تازه"
          description="ایده‌ها و تحلیل‌های تازه را از زاویه‌ای متفاوت کشف کن."
          items={orbitArticles}
        />
      </div>

      {/* لیست عادی مقالات */}
      <section className="px-4 max-w-4xl mx-auto mt-20" dir="rtl">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white border-r-4 border-[#0d7377] pr-3">
          آرشیو تمام مقالات
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#0d7377] transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-[#8b3a4a] font-medium bg-[#8b3a4a]/10 px-2 py-1 rounded">
                  {(post as any).category || "مقاله"}
                </span>
                <span className="text-xs text-gray-500">{(post as any).readingTime} دقیقه</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#0d7377] transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}