import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "خدمات طراحی و توسعه وب | امیرحسین شرکائی",
  description: "خدمات تخصصی طراحی وب‌سایت اختصاصی، توسعه با هوش مصنوعی، طراحی بنر و ساخت ویدیوهای تبلیغاتی.",
  alternates: { canonical: "https://shorakaei.ir/services" },
};

export default function ServicesPage() {
  return (
    <main className="section container" style={{ paddingTop: "140px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "16px", color: "var(--ink)" }}>خدمات من</h1>
        <p style={{ color: "var(--ink-3)", fontSize: "1.1rem" }}>چهار مسیر برای ساختن یک حضور دیجیتال ماندگار</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {services.map((service) => (
          <Link key={service.slug} href={`/services/${service.slug}`} style={{
            display: "block", padding: "32px", background: "var(--surface)", border: "1px solid var(--line-strong)", borderRadius: "24px", transition: "transform 0.3s"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "12px", color: "var(--ink)" }}>{service.shortTitle}</h2>
            <p style={{ color: "var(--ink-3)", marginBottom: "24px", lineHeight: 1.8 }}>{service.description}</p>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>مشاهده جزئیات ←</span>
          </Link>
        ))}
      </div>
    </main>
  );
}