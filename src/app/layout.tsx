import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";

/* 1-34. ... همه‌ی importهای قبلی بدون تغییر */

/* 34. Testimonials */
import "@/styles/testimonials.css";

/* 35. Brand Logo */
import "@/styles/brand-logo.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import WelcomeOnboarding from "@/components/WelcomeOnboarding";
import TouchFeedback from "@/components/TouchFeedback";
import SensoryFeedback from "@/components/SensoryFeedback";
import SignatureInk from "@/components/SignatureInk";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { allSchemas } from "@/lib/schema";
