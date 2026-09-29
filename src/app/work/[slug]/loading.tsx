export default function Loading() {
  return (
    <main id="main" className="work-detail">
      <div className="container">
        <div className="work-skeleton-breadcrumb" />
        <div className="work-skeleton-header">
          <div className="work-skeleton-line work-skeleton-line-sm" />
          <div className="work-skeleton-line work-skeleton-line-lg" />
          <div className="work-skeleton-line work-skeleton-line-md" />
        </div>

        <div className="work-skeleton-cover" />

        <div className="work-skeleton-body">
          <div className="work-skeleton-line" />
          <div className="work-skeleton-line" />
          <div className="work-skeleton-line work-skeleton-line-md" />
          <div className="work-skeleton-line" />
          <div className="work-skeleton-line" />
          <div className="work-skeleton-line work-skeleton-line-sm" />
        </div>
      </div>
    </main>
  );
}