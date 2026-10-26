import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/content/projects";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://amirhossein-portfolio.vercel.app";

export const metadata: Metadata = {
  title: "نمونه‌کارها",
  description:
    "مجموعه‌ی پروژه‌های منتخب امیرحسین شرکائی — از طراحی وب‌سایت‌های اختصاصی تا کمپین‌های تبلیغاتی با هوش مصنوعی.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "نمونه‌کارها | امیرحسین شرکائی",
    description:
      "مجموعه‌ی پروژه‌های منتخب — طراحی، توسعه و خلاقیت دیجیتال.",
    url: `${siteUrl}/work`,
    type: "website",
  },
};

export default function WorkPage() {
  return (
    <main id="main" className="work-page">
      <div className="container">
        {/* ═══════ Breadcrumb ═══════ */}
        <nav className="work-breadcrumb" aria-label="مسیر">
          <Link href="/">خانه</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">نمونه‌کارها</span>
        </nav>

        {/* ═══════ Header ═══════ */}
        <header className="work-header">
          <span className="section-index">WORK — {String(projects.length).padStart(2, "0")} PROJECTS</span>
          <h1 className="work-title">
            پروژه‌هایی با
            <em> جزئیات متفاوت.</em>
          </h1>
          <p className="work-intro">
            مجموعه‌ای از پروژه‌های منتخب در حوزه‌های طراحی وب،
            فروشگاه آنلاین، هویت بصری و کمپین‌های تبلیغاتی. هر
            پروژه با یک مطالعه‌ی موردی کامل.
          </p>
        </header>

        {/* ═══════ Grid ═══════ */}
        <div className="work-grid">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="work-card"
            >
              <div className="work-card-visual">
                {project.coverImage && (
                  <Image
                    src={project.coverImage}
                    alt={`نمونه‌کار ${project.title}`}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 640px"
                    priority={index === 0}
                    style={{ objectFit: "cover" }}
                  />
                )}
                <span className="work-card-badge">
                  {project.status || "پروژه"}
                </span>
              </div>

              <div className="work-card-body">
                <div className="work-card-meta">
                  <span className="work-card-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="work-card-category">
                    {project.category}
                  </span>
                </div>

                <h2 className="work-card-title">{project.title}</h2>

                <p className="work-card-desc">{project.description}</p>

                <div className="work-card-footer">
                  <div className="work-card-tags">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="work-card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="work-card-arrow" aria-hidden="true">
                    ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ═══════ CTA ═══════ */}
        <div className="work-cta">
          <div className="work-cta-content">
            <span className="eyebrow">پروژه‌ی بعدی</span>
            <h2>ایده‌ای داری که شبیه این‌ها باشه؟</h2>
            <p>
              اگر می‌خوای پروژه‌ات هم با همین دقت و جزئیات ساخته
              بشه، با من تماس بگیر.
            </p>
          </div>
          <Link href="/order" className="button button-primary button-lg">
            شروع پروژه
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </main>
  );
}