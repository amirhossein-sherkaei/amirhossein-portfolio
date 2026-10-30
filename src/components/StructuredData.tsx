export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "امیرحسین شرکائی",
    "url": "https://shorakaei.ir",
    "image": "https://shorakaei.ir/profile.jpg",
    "jobTitle": "طراح و توسعه‌دهنده وب",
    "worksFor": {
      "@type": "Organization",
      "name": "Shorakaei Studio"
    },
    "sameAs": [
      "https://github.com/amirhossein-sherkaei",
      "https://www.linkedin.com/in/amirhossein-sherkaei"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "امیرحسین شرکائی | طراحی سایت اختصاصی",
    "url": "https://shorakaei.ir",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://shorakaei.ir/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}