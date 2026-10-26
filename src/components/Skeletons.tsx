/* ═══════════════════════════════════════════════════════════
   SKELETONS — Content-aware loading placeholders
   ------------------------------------------------------------
   - Each skeleton mirrors the real content dimensions
   - Uses CSS shimmer animation (GPU accelerated)
   - No layout shift when real content arrives
   ═══════════════════════════════════════════════════════════ */

/* ── Portfolio card skeleton ── */
export function PortfolioCardSkeleton() {
  return (
    <div className="portfolio-card-skeleton" aria-hidden="true">
      <div className="pcs-chrome">
        <span className="pcs-dot" />
        <span className="pcs-dot" />
        <span className="pcs-dot" />
        <span className="pcs-url" />
      </div>
      <div className="pcs-canvas" />
      <div className="pcs-caption">
        <div className="pcs-line pcs-line-sm" />
        <div className="pcs-line pcs-line-md" />
        <div className="pcs-line pcs-line-lg" />
      </div>
    </div>
  );
}

/* ── Blog card skeleton ── */
export function BlogCardSkeleton() {
  return (
    <div className="blog-card-skeleton" aria-hidden="true">
      <div className="bcs-meta">
        <div className="bcs-chip" />
        <div className="bcs-chip bcs-chip-sm" />
      </div>
      <div className="bcs-title" />
      <div className="bcs-excerpt" />
      <div className="bcs-excerpt bcs-excerpt-2" />
      <div className="bcs-footer">
        <div className="bcs-tag" />
        <div className="bcs-tag" />
      </div>
    </div>
  );
}

/* ── Blog post skeleton (single article) ── */
export function BlogPostSkeleton() {
  return (
    <div className="blog-post-skeleton" aria-hidden="true">
      <div className="bps-header">
        <div className="bps-meta" />
        <div className="bps-title" />
        <div className="bps-excerpt" />
      </div>
      <div className="bps-body">
        <div className="bps-line" />
        <div className="bps-line" />
        <div className="bps-line bps-line-short" />
        <div className="bps-line" />
        <div className="bps-line" />
        <div className="bps-line bps-line-short" />
      </div>
    </div>
  );
}

/* ── Grid of skeleton cards ── */
export function PortfolioGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="portfolio-grid" aria-busy="true" aria-label="در حال بارگذاری نمونه‌کارها">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`portfolio-card portfolio-card-${i + 1}`}>
          <PortfolioCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function BlogGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="blog-grid" aria-busy="true" aria-label="در حال بارگذاری مقالات">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}