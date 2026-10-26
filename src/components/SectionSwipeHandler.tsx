"use client";

import { useCallback, useEffect, useState } from "react";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

/* ═══════════════════════════════════════════════════════════
   SECTION SWIPE HANDLER
   ═══════════════════════════════════════════════════════════ */

const SECTION_IDS = [
  "home",
  "services",
  "process",
  "portfolio",
  "about",
  "why",
  "commitments",
  "faq",
] as const;

const OPT_OUT = new Set(["blog", "cta", "final-cta"]);

export default function SectionSwipeHandler() {
  const [currentSection, setCurrentSection] = useState<string>("home");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () =>
      setEnabled(window.matchMedia("(max-width: 720px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof IntersectionObserver === "undefined") return;

    const elements = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setCurrentSection(visible.target.id);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);

  const goToSection = useCallback(
    (direction: "next" | "prev") => {
      const idx = SECTION_IDS.indexOf(
        currentSection as (typeof SECTION_IDS)[number]
      );
      if (idx === -1) return;

      const nextIdx = direction === "next" ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= SECTION_IDS.length) return;

      const targetId = SECTION_IDS[nextIdx];
      if (OPT_OUT.has(targetId)) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [currentSection]
  );

  useSwipeNavigation({
    onSwipeLeft: () => goToSection("next"),
    onSwipeRight: () => goToSection("prev"),
    enabled,
  });

  return null;
}