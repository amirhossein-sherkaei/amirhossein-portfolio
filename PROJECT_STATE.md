# PROJECT STATE — امیرحسین شرکائی

آخرین بروزرسانی: 2026-10-02
نسخه: v1.0-stable

## دامنه و میزبانی
- دامنه: https://shorakaei.ir
- میزبانی: Vercel
- ریپو: github.com/amirhossein-sherkaei/amirhossein-portfolio

## Stack
- Next.js 16.3.6 (App Router + Turbopack)
- React 19.3.0
- TypeScript 5.9.3
- CSS Variables (بدون Tailwind)
- Font: Vazirmatn
- Email: EmailJS

## ساختار
- src/app/ → صفحات
- src/components/ → 35+ کامپوننت
- src/styles/ → 50+ فایل CSS
- src/content/blog/ → 22 مقاله
- src/content/projects/ → 4 پروژه
- src/lib/ → blog, schema, email

## کامپوننت‌های مهم
- SectionNumber.tsx (شماره 01-10)
- GridOverlay.tsx (Ctrl+G)
- BlogShare.tsx، BlogBreadcrumb.tsx، BlogPrevNext.tsx
- Nav.tsx (دسکتاپ)، MobileNav.tsx (موبایل)

## فایل‌های CSS جدید
- editorial-structure.css
- blog-editorial.css
- blog-article-premium.css
- grid-overlay.css
- final-polish-2026.css

## تنظیمات Vercel
- Region: dxb1 (دبی) + fra1 (فرانکفورت)
- Cache HTML: s-maxage=86400
- Cache Static: max-age=31536000
- Cache Blog: s-maxage=604800

## متغیرهای محیطی
- NEXT_PUBLIC_SITE_URL
- EMAILJS_SERVICE_ID، EMAILJS_TEMPLATE_ID
- EMAILJS_PUBLIC_KEY، EMAILJS_PRIVATE_KEY
- PROJECT_CONTACT_EMAIL

## آمار فعلی
- بازدید هفتگی: 624
- رشد: +22%
- Cache Hit Rate: 65% (هدف: 85%+)
- Mobile: 52% / Desktop: 48%
- Bounce Rate: 44%

## ستون‌های 5گانه (راه Top 100)
1. زبان بصری اختصاصی (شروع شده)
2. Case Studies واقعی (باقی‌مانده)
3. تجربه‌ی امضا — باغ گمشده (فاز 1)
4. ساختار ادیتوریال (انجام شده)
5. تایپوگرافی جسورانه (باقی‌مانده)

## پروژه‌ی فعلی: باغ گمشده
- سیال WebGL
- AI تطبیقی
- هندسه‌ی ایرانی (گره‌چینی)
- صدا (Web Audio)
- روایت اسکرول (GSAP)

## گام بعدی
فاز 1: شبیه‌سازی سیال با Three.js + React Three Fiber