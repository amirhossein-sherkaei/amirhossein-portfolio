"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SectionNumber from "@/components/SectionNumber";
import { showroomProjects, type ShowroomProjectId } from "./data";
import "./showroom.css";

const demos = {
  arka: dynamic(() => import("./demos/ArkaDemo"), { loading: () => null }),
  nila: dynamic(() => import("./demos/NilaDemo"), { loading: () => null }),
  vira: dynamic(() => import("./demos/ViraDemo"), { loading: () => null }),
  lumen: dynamic(() => import("./demos/LumenDemo"), { loading: () => null }),
};

export default function Showroom() {
  const [activeId, setActiveId] = useState<ShowroomProjectId>("nila");
  const activeProject = showroomProjects.find((p) => p.id === activeId)!;
  const ActiveDemo = demos[activeId];

  return (
    <section
      id="showroom"
      className="showroom section"
      aria-label="نمایشگاه تعاملی پروژه‌ها"
    >
      <div className="container">
        {/* Section head */}
        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۴" label="SHOWROOM" />
            <h2>
              چهار پروژه.
              <em className="ink-word"> چهار تجربه.</em>
            </h2>
          </div>
          <p>
            هر پروژه را از نزدیک تجربه کن؛ از منطق رابط کاربری تا جزئیات طراحی
            و اجرای واقعی. تعامل‌ها زنده و قابل بازنشانی هستند.
          </p>
        </div>

        {/* Project selector tabs */}
        <div
          className="showroom-tabs"
          role="tablist"
          aria-label="انتخاب پروژه"
        >
          {showroomProjects.map((project) => {
            const isActive = project.id === activeId;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`showroom-panel-${project.id}`}
                id={`showroom-tab-${project.id}`}
                className={`showroom-tab ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveId(project.id)}
                style={
                  {
                    "--project-accent": project.accentColor,
                    "--project-accent-soft": project.accentSoft,
                  } as React.CSSProperties
                }
              >
                <span className="showroom-tab-index">
                  ۰{showroomProjects.indexOf(project) + 1}
                </span>
                <span className="showroom-tab-text">
                  <span className="showroom-tab-title">{project.title}</span>
                  <span className="showroom-tab-cat">{project.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Preview panel */}
        <div
          className="showroom-stage reveal"
          role="tabpanel"
          id={`showroom-panel-${activeId}`}
          aria-labelledby={`showroom-tab-${activeId}`}
          style={
            {
              "--project-accent": activeProject.accentColor,
              "--project-accent-soft": activeProject.accentSoft,
              "--project-accent-grad": activeProject.accentGradient,
            } as React.CSSProperties
          }
        >
          {/* Info sidebar */}
          <aside className="showroom-info">
            <div className="showroom-info-eyebrow">
              <span className="showroom-info-dot" aria-hidden="true" />
              <span>{activeProject.category}</span>
            </div>

            <h3 className="showroom-info-title">{activeProject.title}</h3>
            <p className="showroom-info-desc">{activeProject.description}</p>

            <div className="showroom-info-actions">
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="showroom-btn showroom-btn-primary"
              >
                <span>مشاهده‌ی پروژه‌ی کامل</span>
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </a>
            </div>
          </aside>

          {/* Demo area */}
          <div className="showroom-demo">
            <ActiveDemo key={activeId} />
          </div>
        </div>
      </div>
    </section>
  );
}