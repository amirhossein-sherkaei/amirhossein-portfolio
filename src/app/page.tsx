import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import { getAllPosts, getLatestPosts } from "@/lib/blog";
import { projects } from "@/content/projects";

/* ── Above-the-fold: direct import (need immediate render) ── */
/* Nav, MobileNav, Hero */

/* ── Below-the-fold: dynamic imports with SSR preserved ── */
/* ssr: true means server renders them into HTML for SEO,
   but client-side JS chunk loads separately = smaller initial bundle */

const Services = dynamic(() => import("@/components/Services"), {
  ssr: true,
  loading: () => (
    <section className="section" aria-busy="true">
      <div className="container">
        <div className="lazy-skeleton-grid" aria-hidden="true">
          <div className="lazy-skeleton-card" />
          <div className="lazy-skeleton-card" />
        </div>
      </div>
    </section>
  ),
});

const Process = dynamic(() => import("@/components/Process"), { ssr: true });

const Portfolio = dynamic(() => import("@/components/Portfolio"), {
  ssr: true,
  loading: () => (
    <section
      className="section portfolio-section"
      aria-busy="true"
      aria-label="در حال بارگذاری نمونه‌کارها"
    >
      <div className="container">
        <div className="lazy-skeleton-grid" aria-hidden="true">
          <div className="lazy-skeleton-card" />
          <div className="lazy-skeleton-card" />
          <div className="lazy-skeleton-card" />
        </div>
      </div>
    </section>
  ),
});

const About = dynamic(() => import("@/components/About"), { ssr: true });

const WhyMe = dynamic(() => import("@/components/WhyMe"), { ssr: true });

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: true,
});

const LatestBlogPosts = dynamic(
  () => import("@/components/LatestBlogPosts"),
  { ssr: true }
);

const Newsletter = dynamic(() => import("@/components/Newsletter"), {
  ssr: true,
});

const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: true });

const FinalCTA = dynamic(() => import("@/components/FinalCTA"), { ssr: true });

const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: true });

const RevealObserver = dynamic(() => import("@/components/RevealObserver"), {
  ssr: true,
});

const SectionSwipeHandler = dynamic(
  () => import("@/components/SectionSwipeHandler"),
  { ssr: true }
);

const SwipeHint = dynamic(() => import("@/components/SwipeHint"), {
  ssr: true,
});

const PerfObserver = dynamic(() => import("@/components/PerfObserver"), {
  ssr: true,
});

export default function Home() {
  const allPosts = getAllPosts();
  const recentPosts = getLatestPosts(6);

  const latestPost = recentPosts[0]
    ? {
        slug: recentPosts[0].slug,
        title: recentPosts[0].title,
        date: recentPosts[0].date,
      }
    : null;

  const archiveSource =
    recentPosts.length > 4
      ? recentPosts[4]
      : recentPosts[recentPosts.length - 1];
  const archivePost =
    archiveSource && archiveSource.slug !== latestPost?.slug
      ? {
          slug: archiveSource.slug,
          title: archiveSource.title,
          date: archiveSource.date,
        }
      : null;

  return (
    <>
      <Nav />
      <MobileNav />

      <main id="main">
        <Hero
          latestPost={latestPost}
          archivePost={archivePost}
          totalPosts={allPosts.length}
          totalProjects={projects.length}
        />
        <Services />
        <Process />
        <Portfolio />
        <About />
        <WhyMe />
        <Testimonials />
        <LatestBlogPosts />
        <Newsletter />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
      <BackToTop />
      <RevealObserver />
      <SectionSwipeHandler />
      <SwipeHint />
      <PerfObserver />
    </>
  );
}