import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";

/* ═══════════════════════════════════════════════════════════
   CSS — Order matters!
   ═══════════════════════════════════════════════════════════ */

/* 1. Design tokens */
import "@/styles/tokens.css";

/* 2. Motion system */
import "@/styles/motion.css";

/* 3. Base */
import "@/styles/base.css";

/* 4. Magnetic buttons */
import "@/styles/magnetic.css";

/* 5. Reveal system */
import "@/styles/reveal.css";

/* 6. Mobile touch */
import "@/styles/mobile-touch.css";

/* 7. Mobile modal */
import "@/styles/mobile-modal.css";

/* 8. Mobile typography */
import "@/styles/mobile-typography.css";

/* 9. Mobile nav v2 */
import "@/styles/mobile-nav-v2.css";

/* 9b. Mobile bottom nav */
import "@/styles/mobile-bottom-nav.css";

/* 10. Perceived performance */
import "@/styles/perceived-performance.css";

/* 11. Adaptive navigation */
import "@/styles/adaptive-navigation.css";

/* 12. Sensory feedback */
import "@/styles/sensory.css";

/* 13. Welcome onboarding */
import "@/styles/welcome-onboarding.css";

/* 14. Order form v2 */
import "@/styles/order-form-v2.css";

/* 14b. Order Premium */
import "@/styles/order-premium.css";

/* 15. Mobile declutter */
import "@/styles/mobile-declutter.css";

/* 16. Work pages */
import "@/styles/work-pages.css";

/* 16b. Work Premium */
import "@/styles/work-premium.css";

/* 17. Layout */
import "@/styles/layout.css";

/* 18. Layout more */
import "@/styles/layout-more.css";

/* 19. Footer effects */
import "@/styles/footer-effects.css";

/* 20. Pages */
import "@/styles/pages.css";

/* 21. Responsive */
import "@/styles/responsive.css";

/* 22. Enhancements */
import "@/styles/enhancements.css";

/* 23. Process */
import "@/styles/process.css";

/* 24. Commitments */
import "@/styles/commitments.css";

/* 25. Mobile fix */
import "@/styles/mobile-fix.css";

/* 26. Mobile polish v2 */
import "@/styles/mobile-polish-v2.css";

/* 27. Blog */
import "@/app/blog/blog.css";

/* 27b. Blog Premium */
import "@/styles/blog-premium.css";

/* 28. Theme toggle */
import "@/styles/theme-toggle.css";

/* 29. Hero Editorial */
import "@/styles/hero-editorial.css";

/* 29b. Hero Premium */
import "@/styles/hero-premium.css";

/* 30. Signature Ink */
import "@/styles/signature-ink.css";

/* 31. Density Standardization */
import "@/styles/density-standardization.css";
import "@/styles/services-premium.css";

/* 32. Manuscript Grid */
import "@/styles/manuscript-grid.css";

/* 33. Hero Bento Live cell */
import "@/styles/hero-bento-live.css";

/* 34. Testimonials */
import "@/styles/testimonials.css";

/* 35. Brand Logo */
import "@/styles/brand-logo.css";

/* 36. Newsletter */
import "@/styles/newsletter.css";

/* 37. Performance Boost */
import "@/styles/performance-boost.css";

/* 38. Footer V2 */
import "@/styles/footer-v2.css";

/* 39. Contact Links */
import "@/styles/contact-links.css";

/* 40. Count Up */
import "@/styles/count-up.css";

/* 41. Chapter Rail */
import "@/styles/chapter-rail.css";

/* 42. Performance Layer */
import "@/styles/performance-layer.css";

/* 42b. Nav Premium */
import "@/styles/nav-premium.css";

/* 43. Performance Pro */
import "@/styles/performance-pro.css";

/* 44. Final Polish */
import "@/styles/final-polish.css";
import "@/styles/mobile-performance-fix.css";

/* 45. Editorial Structure */
import "@/styles/editorial-structure.css";

/* 46. Blog Editorial */
import "@/styles/blog-editorial.css";

/* 47. Blog Article Premium */
import "@/styles/blog-article-premium.css";

/* 48. Grid Overlay (design tool, hidden by default) */
import "@/styles/grid-overlay.css";

/* ═══════════════════════════════════════════════════════════
   49. FINAL POLISH 2026 — باید آخرین CSS باشه
   ═══════════════════════════════════════════════════════════ */
import "@/styles/final-polish-2026.css";

/* ═══════════════════════════════════════════════════════════
   Components
   ═══════════════════════════════════════════════════════════ */
import { ThemeProvider } from "@/components/ThemeProvider";
import WelcomeOnboarding from "@/components/WelcomeOnboarding";
import TouchFeedback from "@/components/TouchFeedback";
import SensoryFeedback from "@/components/SensoryFeedback";
import SignatureInk from "@/components/SignatureInk";
import PerfObserver from "@/components/PerfObserver";
import PageTransition from "@/components/PageTransition";
import GridOverlay from "@/components/GridOverlay";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { allSchemas } from "@/lib/schema";

/* ═══════════════════════════════════════════════════════════
   Fonts
   ═══════════════════════════════════════════════════════════ */
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "arial"],
});

/* ═══════════════════════════════════════════════════════════
   Metadata
   ═══════════════════════════════════════════════════════════ */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shorakaei.ir";

const siteName = "امیرحسین شرکائی";
const siteTitle = "امیرحسین شرکائی | طراحی وب و خلاقیت دیجیتال";
const siteDescription =
  "امیرحسین شرکائی؛ طراحی و توسعه وب‌سایت‌های اختصاصی و خلق تجربه‌های بصری و تبلیغاتی با کمک هوش مصنوعی.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "امیرحسین شرکائی",
    "Amirhossein Shorakaei",
    "طراحی سایت",
    "طراحی وب",
    "توسعه وب",
    "طراحی سایت اختصاصی",
    "طراحی سایت حرفه‌ای",
    "هوش مصنوعی",
    "AI",
    "UI UX",
    "فرانت‌اند",
    "Next.js",
    "React",
    "پورتفولیو",
  ],
  applicationName: "Amirhossein Shorakaei",
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.webp",
    apple: "/apple-icon.webp",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteUrl,
    siteName: siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: {
    google: "xJlni40EBpeF6mGC_CN1Hy5ko-0pjdMar6sEvc5O_wY",
  },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0908" },
  ],
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme;
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {allSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        ))}
      </head>

      <body>
        <a href="#main" className="skip-link">
          پرش به محتوای اصلی
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <WelcomeOnboarding />
        <TouchFeedback />
        <SensoryFeedback />
        <SignatureInk />
        <PerfObserver />
        <PageTransition />
        <GridOverlay />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}