import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import About from "@/components/About";
import WhyMe from "@/components/WhyMe";
import Testimonials from "@/components/Testimonials";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { getAllPosts, getLatestPosts } from "@/lib/blog";
import { projects } from "@/content/projects";

/* ═══════════════════════════════════════════════════════════
   CODE SPLITTING — همه ssr: true
   کامپوننت‌های client-only (BackToTop, PerfObserver, ...)
   خودشون "use client" دارن و روی سرور null رندر می‌کنن.
   ═══════════════════════════════════════════════════════════ */

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

const Newsletter = dynamic(() => import("@/components/Newsletter"), {
  ssr: true,
});

const FAQ = dynamic(() => import("@/components/FAQ"), {
  ssr: true,
});

const BackToTop = dynamic(() => import("@/components/BackToTop"), {
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