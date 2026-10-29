import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

/* 01-04 - Foundation */
import "@/styles/tokens.css";
import "@/styles/motion.css";
import "@/styles/base.css";
import "@/styles/magnetic.css";

/* 05-09 - Core systems */
import "@/styles/reveal.css";
import "@/styles/mobile-touch.css";
import "@/styles/mobile-modal.css";
import "@/styles/mobile-typography.css";
import "@/styles/mobile-nav-v2.css";

/* 10-14 - Mobile foundations */
import "@/styles/mobile-bottom-nav.css";
import "@/styles/perceived-performance.css";
import "@/styles/adaptive-navigation.css";
import "@/styles/sensory.css";
import "@/styles/welcome-onboarding.css";

/* 15-17 - Forms */
import "@/styles/order-form-v2.css";
import "@/styles/order-premium.css";
import "@/styles/mobile-declutter.css";

/* 18-22 - Work + Layout */
import "@/styles/work-pages.css";
import "@/styles/work-premium.css";
import "@/styles/layout.css";
import "@/styles/layout-more.css";
import "@/styles/footer-effects.css";

/* 23-27 - Pages + Responsive */
import "@/styles/pages.css";
import "@/styles/responsive.css";
import "@/styles/enhancements.css";
import "@/styles/process.css";
import "@/styles/commitments.css";

/* 28-29 - Mobile overrides */
import "@/styles/mobile-fix.css";
import "@/styles/mobile-polish-v2.css";

/* 31 - Theme + Hero */
import "@/styles/theme-toggle.css";
import "@/styles/hero-editorial.css";

/* 34-38 - Hero + Branding */
import "@/styles/hero-premium.css";
import "@/styles/signature-ink.css";
import "@/styles/density-standardization.css";
import "@/styles/services-premium.css";
import "@/styles/manuscript-grid.css";

/* 39-42 - Sections */
import "@/styles/hero-bento-live.css";
import "@/styles/testimonials.css";
import "@/styles/brand-logo.css";
import "@/styles/newsletter.css";

/* 43-47 - Performance + Footer */
import "@/styles/footer-v2.css";
import "@/styles/contact-links.css";
import "@/styles/count-up.css";
import "@/styles/chapter-rail.css";

/* 48-50 - Performance + Nav */
import "@/styles/nav-premium.css";

/* 51-55 - Final polish + Editorial */
import "@/styles/polish.css";
import "@/styles/mobile-performance-fix.css";
import "@/styles/editorial-structure.css";

/* 56 - Dev tools */
import "@/styles/grid-overlay.css";

/* 57 - ULTIMATE FINAL (Desktop Base) */
import "@/styles/polish-2026.css";
import "@/styles/balance-turquoise-burgundy.css";
import "@/styles/waline-custom.css";
import "@/styles/shahkar-typography.css";
import "@/styles/shahkar-ui-fixes.css";
import "@/styles/liquid-glass-infinity.css";
import "@/styles/infinity-icons.css";
import "@/styles/chat-bubble-glass.css";
import "@/styles/theme-smooth-fix.css";
import "@/styles/mobile-layout.css";
import "@/styles/mobile-navbar-clean.css";
import "@/styles/3d-material.css";

/* ============================================================
   INFINITY MOBILE LUXURY (The New Design System)
   ============================================================ */
import "@/styles/infinity-tokens.css";
import "@/styles/infinity-order-mobile.css";
import "@/styles/infinity-blog-mobile.css";
import "@/styles/infinity-speed-engine.css";
import "@/styles/infinity-home-performance.css";
import "@/styles/infinity-visual-system.css";
import "@/styles/blog-skeleton.css";
import "@/styles/view-transitions.css";
import "@/styles/infinity-pwa-cro.css";
import "@/styles/mdx-infinity.css";
import "@/styles/infinity-search.css";
import "@/styles/infinity-performance.css";
import "@/styles/infinity-typography.css";
import "@/styles/infinity-home-speed.css";

/* Components */
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientOverlays from "@/components/ClientOverlays";
import GlassFilters from "@/components/GlassFilters";
import WebVitals from "@/components/WebVitals";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import AutoArticleVisuals from "@/components/AutoArticleVisuals";
import NewsletterPopup from "@/components/NewsletterPopup";
import SearchCommand from "@/components/SearchCommand";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { allSchemas } from "@/lib/schema";
import { SpeculationRules } from '@/components/SpeculationRules';

const estedad = localFont({
  src: "../../public/fonts/Estedad-Variable.woff2",
  variable: "--font-estedad",
  display: "swap",
  weight: "100 900",
  style: "normal",
  fallback: ["system-ui", "arial"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorakaei.ir";
const siteName = "امیرحسین شرکائی";
const siteTitle = "طراحی سایت اختصاصی و حرفه‌ای در تهران | امیرحسین شرکائی";
const siteDescription = "طراحی و توسعه وب‌سایت‌های اختصاصی، سریع و مدرن در تهران. خلق تجربه‌های دیجیتال با هوش مصنوعی و تمرکز بر رشد کسب‌وکار شما. مشاوره رایگان.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | " + siteName },
  description: siteDescription,
  keywords: ["طراحی سایت اختصاصی", "طراحی سایت در تهران", "طراح سایت حرفه‌ای", "طراحی سایت فروشگاهی", "قیمت طراحی سایت", "طراحی وب سایت", "توسعه وب", "هوش مصنوعی", "طراحی سایت با هوش مصنوعی", "امیرحسین شرکائی", "Amirhossein Shorakaei", "Next.js", "React"],
  applicationName: "Amirhossein Shorakaei",
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: "/icon.webp", apple: "/apple-icon.webp" },
  openGraph: { type: "website", locale: "fa_IR", url: siteUrl, siteName: siteName, title: siteTitle, description: siteDescription },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
  appleWebApp: { capable: true, title: siteName, statusBarStyle: "default" },
  formatDetection: { telephone: false, email: false, address: false },
  verification: { google: "xJlni40EBpeF6mGC_CN1Hy5ko-0pjdMar6sEvc5O_wY" },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const themeInitScript = "(function(){try{var s=localStorage.getItem('theme');var t;if(s==='light'||s==='dark'){t=s;}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){t='dark';}else{t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        {children}
        <SpeedInsights />
        <SpeculationRules />
      </body>
    </html>
  );
}


