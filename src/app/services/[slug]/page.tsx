import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/content/services";

// تولید متادیتای اختصاصی برای هر خدمت
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: "یافت نشد" };
  
  return {
    title: `${service.title} | امیرحسین شرکائی`,
    description: service.description,
    alternates: { canonical: `https://shorakaei.ir/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `https://shorakaei.ir/services/${service.slug}`,
      type: "website",
    },
  };
}

// تولید مسیرهای استاتیک
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  // اسکیمای داده ساختاریافته برای این سرویس
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
      url: "https://shorakaei.ir"
    },
    areaServed: "IR",
    url: `https://shorakaei.ir/services/${service.slug}`
  };

  return (
    <main className="section container" style={{ paddingTop: "140px", maxWidth: "800px", margin: "0 auto" }}>
      {/* تزریق اسکیما */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <Link href="/services" style={{ color: "var(--accent)", display: "inline-block", marginBottom: "32px", fontWeight: 600 }}>
        ← بازگشت به لیست خدمات
      </Link>

      <header style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "16px", color: "var(--ink)" }}>{service.title}</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--ink-2)", lineHeight: 1.8 }}>{service.description}</p>
      </header>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "var(--ink)" }}>این خدمت شامل چه مواردی است؟</h2>
        <ul style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {service.features.map((feature, i) => (
            <li key={i} style={{ display: "flex", gap: "12px", fontSize: "1rem", color: "var(--ink-2)" }}>
              <span style={{ color: "var(--accent)", fontWeight: "bold" }}>✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ padding: "32px", background: "var(--surface-2)", borderRadius: "24px", marginBottom: "48px", border: "1px solid var(--line)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <span style={{ display: "block", fontSize: "0.85rem", color: "var(--ink-3)", marginBottom: "4px" }}>تحویل نهایی</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--ink)" }}>{service.deliverables}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "0.85rem", color: "var(--ink-3)", marginBottom: "4px" }}>زمان تقریبی</span>
            <strong style={{ fontSize: "1.1rem", color: "var(--ink)" }}>{service.timeline}</strong>
          </div>
        </div>
      </section>

      <div style={{ textAlign: "center", marginTop: "64px" }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "16px", color: "var(--ink)" }}>آماده شروع این پروژه هستید؟</h2>
        <Link href="/order" style={{
          display: "inline-flex", padding: "16px 32px", background: "var(--burgundy)", color: "#fff", borderRadius: "99px", fontWeight: 700, textDecoration: "none", marginTop: "16px"
        }}>
          ثبت سفارش پروژه
        </Link>
      </div>
    </main>
  );
}