"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

type OrbitKind = "article" | "project";

export type SpatialOrbitItem = {
  id: string;
  href: string;
  title: string;
  category: string;
  image: string;
  imageAlt?: string;
  description?: string;
  meta?: string;
  year?: string;
};

export type SpatialOrbitShowcaseProps = {
  items: SpatialOrbitItem[];
  kind?: OrbitKind;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  reverseDirection?: boolean;
};

type OrbitStyle = CSSProperties & {
  "--orbit-slot-angle"?: string;
  "--orbit-depth"?: number;
  "--orbit-progress"?: number;
  "--orbit-count"?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const mod = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

export default function SpatialOrbitShowcase({
  items,
  kind = "article",
  eyebrow,
  title,
  description,
  className = "",
  reverseDirection = false,
}: SpatialOrbitShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const headingId = useId();
  const descriptionId = useId();

  const itemCount = items.length;
  const direction = reverseDirection ? 1 : -1;
  const actionLabel = kind === "project" ? "مشاهدهٔ پروژه" : "مطالعهٔ مقاله";
  const sectionEyebrow = eyebrow ?? (kind === "project" ? "SELECTED WORKS / ORBIT" : "THE EDITORIAL ORBIT");

  const scrollToIndex = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section || itemCount < 2 || reducedMotion) return;

      const normalizedIndex = mod(index, itemCount);
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const stickyHeight = Math.min(window.innerHeight, section.clientHeight);
      const travel = Math.max(1, section.offsetHeight - stickyHeight);
      const targetStep = reverseDirection
        ? mod(itemCount - normalizedIndex, itemCount)
        : normalizedIndex;
      const progress = targetStep / itemCount;
      window.scrollTo({
        top: sectionTop + progress * travel,
        behavior: "smooth",
      });
    },
    [itemCount, reducedMotion, reverseDirection]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const ring = ringRef.current;
    if (!section || !ring || itemCount < 2 || reducedMotion) return;

    let isVisible = true;

    const update = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        if (!isVisible) return;

        const rect = section.getBoundingClientRect();
        const stickyHeight = Math.min(window.innerHeight, section.clientHeight);
        const travel = Math.max(1, section.offsetHeight - stickyHeight);
        const progress = clamp(-rect.top / travel, 0, 1);
        const rotation = direction * progress * 360;

        ring.style.setProperty("--orbit-rotation", `${rotation}deg`);
        section.style.setProperty("--orbit-progress", String(progress));

        let nextActiveIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const slotAngle = (index / itemCount) * 360;
          const angle = mod(slotAngle + rotation, 360);
          const signedAngle = angle > 180 ? angle - 360 : angle;
          const distance = Math.abs(signedAngle);
          const radians = (angle * Math.PI) / 180;
          const depth = (Math.cos(radians) + 1) / 2;

          card.style.setProperty("--orbit-depth", depth.toFixed(3));
          card.style.zIndex = String(Math.round(depth * 1000));
          card.dataset.facing = depth > 0.72 ? "front" : depth > 0.34 ? "side" : "back";

          if (distance < closestDistance) {
            closestDistance = distance;
            nextActiveIndex = index;
          }
        });

        setActiveIndex((current) =>
          current === nextActiveIndex ? current : nextActiveIndex
        );
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) update();
      },
      { rootMargin: "100px 0px 100px 0px" }
    );

    observer.observe(section);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [direction, itemCount, reducedMotion]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  };

  if (itemCount === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`spatial-orbit ${className}`.trim()}
      data-kind={kind}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      aria-labelledby={headingId}
      aria-describedby={description ? descriptionId : undefined}
      onKeyDown={handleKeyDown}
      style={{ "--orbit-count": itemCount } as OrbitStyle}
    >
      <div className="spatial-orbit__sticky">
        <div className="spatial-orbit__ambient spatial-orbit__ambient--teal" aria-hidden="true" />
        <div className="spatial-orbit__ambient spatial-orbit__ambient--burgundy" aria-hidden="true" />
        <div className="spatial-orbit__grain" aria-hidden="true" />

        <header className="spatial-orbit__header">
          <div className="spatial-orbit__heading-copy">
            <div className="spatial-orbit__eyebrow">
              <span className="spatial-orbit__eyebrow-mark" aria-hidden="true" />
              {sectionEyebrow}
            </div>
            <h2 id={headingId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <div className="spatial-orbit__header-index" aria-hidden="true">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <i />
            <span>{String(itemCount).padStart(2, "0")}</span>
          </div>
        </header>

        <div className="spatial-orbit__scene" aria-label="نمایش سه‌بعدی آیتم‌ها؛ با اسکرول عمودی، کارت‌ها روی مدار می‌چرخند">
          <div className="spatial-orbit__horizon" aria-hidden="true" />
          <div className="spatial-orbit__axis spatial-orbit__axis--outer" aria-hidden="true" />
          <div className="spatial-orbit__axis spatial-orbit__axis--inner" aria-hidden="true" />

          <div className="spatial-orbit__ring" ref={ringRef}>
            {items.map((item, index) => {
              const slotAngle = (index / itemCount) * 360;
              const isActive = index === activeIndex;

              return (
                <a
                  key={item.id}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className="spatial-orbit__card"
                  href={item.href}
                  data-active={isActive ? "true" : "false"}
                  style={{ "--orbit-slot-angle": `${slotAngle}deg` } as OrbitStyle}
                  aria-label={`${item.title} — ${actionLabel}`}
                  onFocus={() => scrollToIndex(index)}
                >
                  <span className="spatial-orbit__card-edge" aria-hidden="true" />
                  <span className="spatial-orbit__card-surface">
                    <span className="spatial-orbit__media">
                      <Image
                        src={item.image}
                        alt={item.imageAlt ?? item.title}
                        fill
                        sizes="(max-width: 700px) 72vw, (max-width: 1100px) 34vw, 300px"
                        preload={index === 0}
                        className="spatial-orbit__image"
                      />
                      <span className="spatial-orbit__image-shade" aria-hidden="true" />
                      <span className="spatial-orbit__image-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>

                    <span className="spatial-orbit__card-content">
                      <span className="spatial-orbit__category">{item.category}</span>
                      <span className="spatial-orbit__card-title">{item.title}</span>
                      {item.description ? (
                        <span className="spatial-orbit__card-description">{item.description}</span>
                      ) : null}
                      <span className="spatial-orbit__card-footer">
                        <span>{item.meta ?? item.year ?? actionLabel}</span>
                        <span className="spatial-orbit__arrow" aria-hidden="true">↗</span>
                      </span>
                    </span>
                    <span className="spatial-orbit__card-glint" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <footer className="spatial-orbit__footer">
          <div className="spatial-orbit__active-copy" aria-live="polite" aria-atomic="true">
            <span>{kind === "project" ? "PROJECT IN FOCUS" : "NOW IN ORBIT"}</span>
            <strong>{items[activeIndex]?.title ?? items[0].title}</strong>
          </div>

          <div className="spatial-orbit__controls">
            <span className="spatial-orbit__scroll-hint">
              <span className="spatial-orbit__scroll-line" aria-hidden="true" />
              برای چرخش، اسکرول کن
            </span>
            <button
              type="button"
              className="spatial-orbit__control"
              aria-label="نمایش مورد قبلی"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={reducedMotion || itemCount < 2}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="spatial-orbit__control"
              aria-label="نمایش مورد بعدی"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={reducedMotion || itemCount < 2}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </footer>

        <div className="spatial-orbit__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}