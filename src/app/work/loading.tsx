export default function Loading() {
  return (
    <main id="main" className="work-page">
      <div className="container">
        <div className="work-skeleton-breadcrumb" />
        <div className="work-skeleton-header">
          <div className="work-skeleton-line work-skeleton-line-sm" />
          <div className="work-skeleton-line work-skeleton-line-lg" />
          <div className="work-skeleton-line work-skeleton-line-md" />
        </div>

        <div
          className="work-grid"
          aria-busy="true"
          aria-label="در حال بارگذاری نمونه‌کارها"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="portfolio-card-skeleton"
              aria-hidden="true"
            >
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
          ))}
        </div>
      </div>
    </main>
  );
}