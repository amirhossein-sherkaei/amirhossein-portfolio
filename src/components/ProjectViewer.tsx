"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/content/projects";

type ProjectViewerProps = {
  project: Project;
  index: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
};

/* ═══════════════════════════════════════════════════════════
   PROJECT VIEWER
   ------------------------------------------------------------
   Desktop: centered modal with grid layout
   Mobile: bottom sheet with drag-to-close
   ═══════════════════════════════════════════════════════════ */

const DRAG_CLOSE_THRESHOLD = 120; // px
const DRAG_VELOCITY_THRESHOLD = 0.5; // px/ms

export default function ProjectViewer({
  project,
  index,
  total,
  onPrev,
  onNext,
  onClose,
}: ProjectViewerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const [shareLabel, setShareLabel] = useState("اشتراک‌گذاری");
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    startY: 0,
    startTime: 0,
    currentY: 0,
  });

  /* ── Mounted gate for portal ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Detect mobile ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 720px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ── Body scroll lock + keyboard nav + focus trap ── */
  useEffect(() => {
    if (!mounted) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPaddingRight = document.body.style.paddingRight;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && onNext) {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key === "ArrowRight" && onPrev) {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPaddingRight;
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [mounted, onClose, onNext, onPrev]);

  /* ── Reset share label on project change ── */
  useEffect(() => {
    setShareLabel("اشتراک‌گذاری");
    setDragY(0);
  }, [project.id]);

  /* ═══════════════════════════════════════════════════════════
     DRAG-TO-CLOSE (mobile only)
     ═══════════════════════════════════════════════════════════ */
  const handleDragStart = (clientY: number) => {
    if (!isMobile) return;
    setIsDragging(true);
    dragState.current = {
      startY: clientY,
      startTime: Date.now(),
      currentY: clientY,
    };
  };

  const handleDragMove = (clientY: number) => {
    if (!isMobile || !isDragging) return;
    dragState.current.currentY = clientY;
    const delta = clientY - dragState.current.startY;
    /* Only allow dragging downward */
    setDragY(Math.max(0, delta));
  };

  const handleDragEnd = () => {
    if (!isMobile || !isDragging) return;

    const delta = dragState.current.currentY - dragState.current.startY;
    const elapsed = Date.now() - dragState.current.startTime;
    const velocity = Math.abs(delta) / Math.max(elapsed, 1);

    if (
      delta > DRAG_CLOSE_THRESHOLD ||
      (delta > 40 && velocity > DRAG_VELOCITY_THRESHOLD)
    ) {
      /* Close */
      onClose();
    } else {
      /* Snap back */
      setDragY(0);
    }

    setIsDragging(false);
  };

  /* Touch events on drag handle */
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  /* Pointer events (for hybrid devices) */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return; // handled by touch events
    handleDragStart(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    handleDragMove(e.clientY);
  };

  const handlePointerUp = () => {
    handleDragEnd();
  };

  /* ── Share handler ── */
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: project.title,
          text: project.description,
          url,
        });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareLabel("کپی شد ✓");
        window.setTimeout(() => setShareLabel("اشتراک‌گذاری"), 2000);
      }
    } catch {
      /* cancelled */
    }
  };

  if (!mounted) return null;

  /* ── Compute drag-dependent values ── */
  const dragProgress = Math.min(dragY / DRAG_CLOSE_THRESHOLD, 1);
  const sheetTransform = isMobile
    ? `translateY(${dragY}px)`
    : undefined;
  const backdropOpacity = 1 - dragProgress * 0.6;

  const modalContent = (
    <div
      className="project-modal"
      role="presentation"
      data-dragging={isDragging ? "true" : "false"}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="project-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        style={
          {
            transform: sheetTransform,
            "--backdrop-opacity": backdropOpacity,
          } as React.CSSProperties
        }
      >
        {/* ═══════ Mobile Drag Handle ═══════ */}
        <div
          className="project-modal-drag-handle"
          aria-hidden="true"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span className="project-modal-drag-bar" />
        </div>

        {/* ═══════ Navigation bar ═══════ */}
        <div className="project-modal-nav">
          <div className="project-modal-nav-left">
            <span className="project-modal-nav-counter">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-nav-demo"
              >
                <span
                  className="project-modal-nav-demo-dot"
                  aria-hidden="true"
                />
                <span className="project-modal-nav-demo-text">
                  مشاهده دموی زنده
                </span>
                <ExternalIcon />
              </a>
            )}
          </div>

          <div className="project-modal-nav-buttons">
            <button
              type="button"
              className="project-modal-nav-btn"
              onClick={onPrev}
              disabled={!onPrev}
              aria-label="پروژه‌ی قبلی"
            >
              →
            </button>
            <button
              type="button"
              className="project-modal-nav-btn"
              onClick={onNext}
              disabled={!onNext}
              aria-label="پروژه‌ی بعدی"
            >
              ←
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              className="project-modal-nav-btn"
              onClick={onClose}
              aria-label="بستن"
            >
              ×
            </button>
          </div>
        </div>

        {/* ═══════ Main content ═══════ */}
        <div className="project-modal-main">
          <div className="project-modal-visual">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={`نمونه‌کار ${project.title}`}
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <>
                <span className="eyebrow">{project.category}</span>
                <strong id="project-modal-title">{project.title}</strong>
              </>
            )}

            {project.caseStudy?.metrics &&
              project.caseStudy.metrics.length > 0 && (
                <div className="project-modal-metrics">
                  {project.caseStudy.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="project-modal-metric"
                    >
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="project-modal-body">
            <span className="section-index" style={{ marginBottom: 0 }}>
              PROJECT · {project.id.split("-").pop()}
            </span>

            <h2 id="project-modal-title">{project.title}</h2>

            <div className="project-modal-subtitle">
              <span>{project.category}</span>
              {project.year && (
                <>
                  <span className="dot">·</span>
                  <span>{project.year}</span>
                </>
              )}
              {project.role && (
                <>
                  <span className="dot">·</span>
                  <span>{project.role}</span>
                </>
              )}
            </div>

            <p>{project.description}</p>

            {project.caseStudy && (
              <div className="project-case-study">
                {project.caseStudy.overview && (
                  <div className="case-study-section">
                    <h3 className="case-study-heading">
                      <span className="case-study-num">۰۱</span>
                      خلاصه پروژه
                    </h3>
                    <p>{project.caseStudy.overview}</p>
                  </div>
                )}

                {project.caseStudy.challenge && (
                  <div className="case-study-section">
                    <h3 className="case-study-heading">
                      <span className="case-study-num">۰۲</span>
                      چالش اصلی
                    </h3>
                    <p>{project.caseStudy.challenge}</p>
                  </div>
                )}

                {project.caseStudy.approach &&
                  project.caseStudy.approach.length > 0 && (
                    <div className="case-study-section">
                      <h3 className="case-study-heading">
                        <span className="case-study-num">۰۳</span>
                        رویکرد من
                      </h3>
                      <ul className="case-study-list">
                        {project.caseStudy.approach.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {project.caseStudy.highlights &&
                  project.caseStudy.highlights.length > 0 && (
                    <div className="case-study-section">
                      <h3 className="case-study-heading">
                        <span className="case-study-num">۰۴</span>
                        نقاط برجسته
                      </h3>
                      <ul className="case-study-list case-study-list--highlight">
                        {project.caseStudy.highlights.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {project.caseStudy.learnings && (
                  <div className="case-study-section case-study-section--quote">
                    <h3 className="case-study-heading">
                      <span className="case-study-num">۰۵</span>
                      درس‌آموخته
                    </h3>
                    <blockquote>{project.caseStudy.learnings}</blockquote>
                  </div>
                )}
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="project-modal-tech">
                <span className="project-modal-tech-label">
                  تکنولوژی‌ها
                </span>
                <div className="project-modal-tech-list">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="project-modal-tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="project-modal-meta-grid">
              <div>
                <span>دسته‌بندی</span>
                <strong>{project.category}</strong>
              </div>
              <div>
                <span>وضعیت</span>
                <strong>{project.status ?? "آماده همکاری"}</strong>
              </div>
              <div>
                <span>سال</span>
                <strong>{project.year ?? "۱۴۰۵"}</strong>
              </div>
              <div>
                <span>نقش</span>
                <strong>{project.role ?? "طراح و توسعه‌دهنده"}</strong>
              </div>
            </div>

            <div className="project-modal-actions">
              <a href="/order" className="button button-primary">
                پروژه‌ای مشابه می‌خواهم
                <span aria-hidden="true">←</span>
              </a>

              <button
                type="button"
                className="project-modal-share"
                onClick={handleShare}
              >
                <ShareIcon />
                {shareLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}