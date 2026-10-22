import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/content/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);
  if (!project) return { title: "یافت نشد" };
  return {
    title: `${project.title} | نمونه‌کارها`,
    description: project.fullDescription,
    alternates: { canonical: `https://shorakaei.ir/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://shorakaei.ir/work/${project.slug}`,
      images: project.coverImage ? [{ url: `https://shorakaei.ir${project.coverImage}` }] : [],
    },
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);
  if (!project) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        image: project.coverImage ? `https://shorakaei.ir${project.coverImage}` : undefined,
        author: { "@type": "Person", name: "امیرحسین شرکائی" },
        url: `https://shorakaei.ir/work/${project.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "خانه", item: "https://shorakaei.ir" },
          { "@type": "ListItem", position: 2, name: "نمونه‌کارها", item: "https://shorakaei.ir/work" },
          { "@type": "ListItem", position: 3, name: project.title, item: `https://shorakaei.ir/work/${project.slug}` },
        ],
      },
    ],
  };

  return (
    <main className="section container" style={{ paddingTop: "140px", maxWidth: "900px", margin: "0 auto" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb Nav */}
      <nav style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "var(--ink-3)", marginBottom: "32px" }}>
        <Link href="/">خانه</Link>
        <span>/</span>
        <Link href="/work">نمونه‌کارها</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>{project.title}</span>
      </nav>

      <header style={{ marginBottom: "48px" }}>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.1em" }}>
          {project.category} · {project.year}
        </span>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginTop: "12px", marginBottom: "24px", color: "var(--ink)" }}>
          {project.title}
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--ink-2)", lineHeight: 1.8 }}>
          {project.fullDescription}
        </p>
      </header>

      {project.coverImage && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "24px", overflow: "hidden", marginBottom: "64px", boxShadow: "0 24px 64px -24px rgba(0,0,0,0.2)" }}>
          <Image src={project.coverImage} alt={project.title} fill style={{ objectFit: "cover" }} priority />
        </div>
      )}

      {project.caseStudy && (
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          
          {/* Overview & Challenge */}
          <section>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "24px", color: "var(--ink)" }}>چالش و هدف پروژه</h2>
            <div style={{ background: "var(--surface-2)", padding: "32px", borderRadius: "24px", borderLeft: "4px solid var(--accent)" }}>
              <p style={{ color: "var(--ink-2)", lineHeight: 2 }}>{project.caseStudy.challenge}</p>
            </div>
          </section>

          {/* Approach */}
          <section>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "24px", color: "var(--ink)" }}>رویکرد و راه‌حل</h2>
            <ul style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
              {project.caseStudy.approach.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "16px", color: "var(--ink-2)", fontSize: "1.05rem", lineHeight: 1.8 }}>
                  <span style={{ display: "grid", placeItems: "center", width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-tint)", color: "var(--accent)", fontWeight: "bold", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Metrics */}
          {project.caseStudy.metrics && (
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              {project.caseStudy.metrics.map((metric, i) => (
                <div key={i} style={{ textAlign: "center", padding: "32px", background: "var(--surface)", border: "1px solid var(--line-strong)", borderRadius: "24px" }}>
                  <strong style={{ display: "block", fontSize: "2.5rem", color: "var(--burgundy)", marginBottom: "8px" }}>{metric.value}</strong>
                  <span style={{ fontSize: "1rem", color: "var(--ink-3)" }}>{metric.label}</span>
                </div>
              ))}
            </section>
          )}

          {/* Learnings */}
          {project.caseStudy.learnings && (
            <section>
              <h2 style={{ fontSize: "1.75rem", marginBottom: "24px", color: "var(--ink)" }}>درس‌های این پروژه</h2>
              <p style={{ color: "var(--ink-2)", lineHeight: 2, fontStyle: "italic" }}>«{project.caseStudy.learnings}»</p>
            </section>
          )}

          {/* Tech Stack */}
          {project.technologies && (
            <section>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "16px", color: "var(--ink)" }}>تکنولوژی‌های استفاده شده</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {project.technologies.map((tech) => (
                  <span key={tech} style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--surface-2)", border: "1px solid var(--line)", fontSize: "0.9rem", color: "var(--ink-2)" }}>
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <div style={{ marginTop: "96px", textAlign: "center", padding: "64px 24px", background: "var(--surface-2)", borderRadius: "32px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "16px", color: "var(--ink)" }}>شما هم چنین پروژه‌ای دارید؟</h2>
        <Link href="/order" style={{ display: "inline-flex", padding: "16px 32px", background: "var(--accent)", color: "#fff", borderRadius: "99px", fontWeight: 700, textDecoration: "none", marginTop: "16px" }}>
          شروع پروژه
        </Link>
      </div>
    </main>
  );
}