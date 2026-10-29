"use client";

import Image from "next/image";
import { useState } from "react";
import ProjectViewer from "@/components/ProjectViewer";
import SectionNumber from "@/components/SectionNumber";
import { projects } from "@/content/projects";

export default function Portfolio() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedProject = selectedIndex !== null ? projects[selectedIndex] : null;

  return (
    <section id="portfolio" className="portfolio-section section">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۳" label="PORTFOLIO" />
            <h2>
              پروژه‌هایی با
              <em className="ink-word"> جزئیات متفاوت</em>
            </h2>
          </div>
          <p>
            بخشی از پروژه‌ها و تجربه‌های طراحی و توسعه؛ با تمرکز بر ظاهر
            حرفه‌ای، تجربه کاربری و اجرای دقیق ایده.
          </p>
        </div>

        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`portfolio-card portfolio-card-${index + 1} reveal`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`مشاهده پروژه ${project.title} — ${project.category}`}
            >
              <div className="portfolio-card-visual">
                <div className="portfolio-card-chrome">
                  <div className="portfolio-card-chrome-dots" aria-hidden="true">
                    <span /><span /><span />
                  </div>
                  <div className="portfolio-card-chrome-url">{project.slug}.shorakaei.ir</div>
                  <span className="portfolio-card-chrome-meta">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="portfolio-card-canvas">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={`نمونه‌کار ${project.title} — ${project.category}`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1080px) 55vw, 640px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : null}
                  {project.status && (
                    <span className="portfolio-card-status-badge">{project.status}</span>
                  )}
                </div>

                <div className="portfolio-card-caption">
                  <div className="portfolio-card-caption-text">
                    <span className="portfolio-card-category">{project.category}</span>
                    <span className="portfolio-card-title">{project.title}</span>
                    <span className="portfolio-card-subtitle">{project.description}</span>
                    <span className="portfolio-card-view" aria-hidden="true">مشاهده پروژه</span>
                  </div>
                  <span className="portfolio-card-arrow" aria-hidden="true">↗</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="portfolio-footer reveal">
          <span>{String(projects.length).padStart(2, "0")} نمونه‌کار</span>
          <span>نمونه‌کارهای بیشتر، به‌زودی</span>
        </div>
      </div>

      {selectedProject && selectedIndex !== null && (
        <ProjectViewer
          project={selectedProject}
          index={selectedIndex}
          total={projects.length}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : undefined}
          onNext={selectedIndex < projects.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : undefined}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}