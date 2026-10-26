import { BlogGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <main id="main" className="blog-page">
      <div className="container">
        <div className="blog-back-home-skeleton" />
        <div className="blog-header-skeleton">
          <div className="skeleton-line skeleton-line-sm" />
          <div className="skeleton-line skeleton-line-lg" />
          <div className="skeleton-line skeleton-line-md" />
        </div>
        <BlogGridSkeleton count={3} />
      </div>
    </main>
  );
}