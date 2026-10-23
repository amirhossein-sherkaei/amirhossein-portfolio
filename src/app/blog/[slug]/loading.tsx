import "@/styles/blog-index-premium.css";

export default function Loading() {
  return (
    <main id="main" className="section">
      <div className="container">
        
        {/* اسکلتون هدر */}
        <header className="section-heading" style={{ marginBottom: '48px' }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div className="skeleton-line skeleton-line-lg" style={{ height: '48px', marginBottom: '16px' }} />
            <div className="skeleton-line skeleton-line-md" style={{ height: '20px' }} />
          </div>
          <div style={{ width: '100%', maxWidth: '400px' }}>
             <div className="skeleton-line skeleton-line-sm" style={{ height: '16px', marginBottom: '8px' }} />
             <div className="skeleton-line skeleton-line-sm" style={{ height: '16px', width: '80%' }} />
          </div>
        </header>

        <div className="blog-index-wrapper">
          {/* اسکلتون فیلترها */}
          <div className="blog-filter-container" style={{ borderBottom: 'none' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="skeleton-line" 
                style={{ width: '100px', height: '40px', borderRadius: '999px' }} 
              />
            ))}
          </div>

          {/* اسکلتون گرید */}
          <div className="blog-editorial-grid">
            
            {/* اسکلتون مقاله شاخص */}
            <div className="blog-card-featured" style={{ opacity: 0.5 }}>
              <div className="blog-card-featured-content">
                <div className="skeleton-line skeleton-line-sm" style={{ width: '120px', marginBottom: '16px' }} />
                <div className="skeleton-line skeleton-line-lg" style={{ height: '40px', marginBottom: '16px', width: '80%' }} />
                <div className="skeleton-line skeleton-line-md" style={{ marginBottom: '8px' }} />
                <div className="skeleton-line skeleton-line-md" style={{ width: '60%', marginBottom: '24px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <div className="skeleton-line" style={{ width: '100px', height: '20px' }} />
                  <div className="skeleton-line" style={{ width: '60px', height: '20px' }} />
                </div>
              </div>
            </div>

            {/* اسکلتون مقالات عادی */}
            <div className="blog-regular-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="blog-card-regular" style={{ opacity: 0.5 }}>
                  <div className="blog-card-content">
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <div className="skeleton-line" style={{ width: '80px', height: '24px', borderRadius: '999px' }} />
                      <div className="skeleton-line" style={{ width: '60px', height: '24px' }} />
                    </div>
                    <div className="skeleton-line skeleton-line-lg" style={{ height: '28px', marginBottom: '12px' }} />
                    <div className="skeleton-line skeleton-line-md" style={{ marginBottom: '8px' }} />
                    <div className="skeleton-line skeleton-line-md" style={{ width: '70%', marginBottom: '24px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--line)', marginTop: 'auto' }}>
                      <div className="skeleton-line" style={{ width: '80px', height: '20px' }} />
                      <div className="skeleton-line" style={{ width: '50px', height: '20px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}