"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  section: string;
  label: string;
  icon: React.ReactNode | null;
  isPage?: boolean;
  isBrand?: boolean;
};

const ITEMS: Item[] = [
  {
    href: "#home",
    section: "home",
    label: "خانه",
    icon: null,
    isBrand: true,
  },
  {
    href: "#services",
    section: "services",
    label: "خدمات",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "#portfolio",
    section: "portfolio",
    label: "نمونه‌ها",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    href: "/blog",
    section: "blog",
    label: "بلاگ",
    isPage: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19.5V6a2 2 0 0 1 2-2h9l5 5v10.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M14 4v5h5" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    ),
  },
  {
    href: "#about",
    section: "about",
    label: "درباره",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1" />
      </svg>
    ),
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("home");
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (pathname !== "/") return;

    const sections = ITEMS.filter((i) => !i.isPage)
      .map((i) => document.getElementById(i.section))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted) return;
    if (typeof IntersectionObserver === "undefined") return;
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0.4 }
    );

    io.observe(footer);
    return () => io.disconnect();
  }, [mounted]);

  const isBlogPage = pathname?.startsWith("/blog");

  return (
    <nav
      className={`mobile-nav${hidden ? " is-hidden" : ""}`}
      aria-label="ناوبری موبایل"
      suppressHydrationWarning
    >
      <ul className="mobile-nav-list">
        {ITEMS.map((item) => {
          const isActive = item.isPage
            ? isBlogPage
            : pathname === "/" && active === item.section;

          const className = `mobile-nav-item${
            isActive ? " is-active" : ""
          }${item.isBrand ? " mobile-nav-item--brand" : ""}`;

          const resolvedHref =
            !item.isPage && pathname !== "/"
              ? `/${item.href}`
              : item.href;

          if (item.isPage) {
            return (
              <li key={item.section}>
                <Link
                  href={item.href}
                  className={className}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.section}>
              <a
                href={resolvedHref}
                className={className}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="mobile-nav-icon">
                  {item.isBrand ? (
                    <Image
                      src="/logo.png"
                      alt=""
                      width={26}
                      height={26}
                      className="mobile-nav-brand-img"
                      aria-hidden="true"
                      priority
                    />
                  ) : (
                    item.icon
                  )}
                </span>
                <span className="mobile-nav-label">{item.label}</span>
              </a>
            </li>
          );
        })}

        <li className="mobile-nav-cta-wrap">
          <Link
            href="/order"
            className="mobile-nav-cta"
            aria-label="شروع پروژه"
          >
            <span className="mobile-nav-cta-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="mobile-nav-label">شروع</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}