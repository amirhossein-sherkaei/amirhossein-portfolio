# CHAT HANDOFF — سند انتقال

## سلیقه‌ی کاربر
✅ دوست داره: جسورانه، مینیمال، RTL بومی، میکرو-اینتراکشن
❌ دوست نداره: تایپوگرافی غول‌آسا، شلوغی، کارهای نصفه
🎨 سبک گفتگو: خودمونی، صادق، قاطع، تحقیق‌محور

## قوانین کار
1. قبل از هر کد، تحقیق کن
2. کد کامل بده، نه تیکه
3. صادق باش، حتی اگه تلخه
4. هر تغییر رو تست کن
5. فرض نکن چیزی کار می‌کنه

## تاریخچه‌ی چت (خلاصه)
- نقطه‌ی شروع: رفع مشکل cascade-guardian
- ساخت: 5 مقاله‌ی بلند، SectionNumber، Final Polish 2026
- رفع: BOM در package.json، swcMinify deprecated
- Cache Hit Rate 65% → هدف 85%
- Region Frankfurt → Dubai

## پروژه‌ی فعلی: باغ گمشده
یک تجربه‌ی تعاملی زنده:
1. سیال WebGL (Three.js + R3F)
2. AI تطبیقی (Vercel AI SDK)
3. هندسه‌ی ایرانی (گره‌چینی)
4. صدای فضایی (Web Audio)
5. روایت اسکرول (GSAP)

## 4 فاز ساخت
- فاز 1: سیال (2-3 هفته)
- فاز 2: هندسه (2 هفته)
- فاز 3: صدا (1-2 هفته)
- فاز 4: AI (2-3 هفته)

## وضعیت فعلی
- Backup کامل گرفته شد (v1.0-stable)
- کار روی branch: feature/lost-garden
- سایت زنده: shorakaei.ir (دست‌نخورده)
- آخرین commit: f5331d6

## چطور ادامه بده
1. PROJECT_STATE.md رو بخون
2. بگو "کجاییم و چی باید بکنیم؟"
3. شروع کن از فاز 1
---

## 📌 آخرین بروزرسانی — لحظه‌ی شروع Lost Garden

**تاریخ:** 2026-10-02
**Branch فعال:** feature/lost-garden
**وضعیت:** در حال ساخت فاز ۱

### کارهای انجام‌شده در این لحظه:
- ✅ Backup کامل (ZIP + branch + tag)
- ✅ branch `feature/lost-garden` ساخته شد
- ✅ Three.js + React Three Fiber نصب شد
- ✅ `@types/three` نصب شد

### کارهای در حال انجام:
- 🔄 ساخت `src/components/lost-garden/LiquidVeil.tsx`
- 🔄 ساخت `src/styles/liquid-veil.css`
- 🔄 اضافه‌کردن به `Hero.tsx`
- 🔄 اضافه‌کردن import به `layout.tsx`

### فایل‌هایی که باید ساخته بشن (کد کامل در چت موجود است):
1. `src/components/lost-garden/LiquidVeil.tsx` — شیدر سیال WebGL
2. `src/styles/liquid-veil.css` — استایل canvas
3. آپدیت `src/app/layout.tsx` — import
4. آپدیت `src/components/Hero.tsx` — اضافه‌کردن `<LiquidVeil />`

### اگر چت بسته شد، به چت جدید این رو بگو:
"من در حال ساخت پروژه‌ی Lost Garden هستم. Phase 1 (Liquid Veil شیدر WebGL) رو شروع کردم. Three.js نصب شده. فایل `LiquidVeil.tsx` رو باید بسازم. کد کاملش رو از من بخواه."

### هدف فاز ۱:
- سیال زنده با شیدر GLSL
- تعامل با موس (کشیده شدن به سمت pointer)
- پالت رنگ: شنگرف + زر (نارنجی و طلایی)
- 60fps روی GPU
- احترام به prefers-reduced-motion

### هدف فاز ۲ (بعد از فاز ۱):
- هندسه‌ی گنبدی (Dome geometry) با tessellation
- جایگزینی سیال 2D با مش سه‌بعدی


<!-- AUTO-SAVE-START -->
---

## Ø¢Ø®Ø±ÛŒÙ† ÙˆØ¶Ø¹ÛŒØª (Auto-Save)

**ØªØ§Ø±ÛŒØ®:** 2026-10-02 11:46
**Branch:** feature/lost-garden
**Ø¢Ø®Ø±ÛŒÙ† Commit:** 886dc85

### ÙØ§ÛŒÙ„â€ŒÙ‡Ø§ÛŒ ØªØºÛŒÛŒØ±â€ŒÛŒØ§ÙØªÙ‡:

 M .gitignore
 M package-lock.json
 M package.json
 M src/app/layout.tsx
 M src/components/Hero.tsx
 M src/components/PerfObserver.tsx
 M src/components/ThemeProvider.tsx
?? scripts/save-progress.ps1
?? src/components/lost-garden/
?? src/styles/liquid-veil.css

### Ø¨Ø±Ø§ÛŒ Ø§Ø¯Ø§Ù…Ù‡ Ø¯Ø± Ú†Øª Ø¬Ø¯ÛŒØ¯:

1. Ø§ÛŒÙ† ÙØ§ÛŒÙ„ + PROJECT_STATE.md Ø±Ùˆ Ø¨Ù‡ AI Ø¬Ø¯ÛŒØ¯ Ù†Ø´ÙˆÙ† Ø¨Ø¯Ù‡
2. Ø¨Ú¯Ùˆ: Â«Ù…Ù† Ø¯Ø± Ø­Ø§Ù„ Ø³Ø§Ø®Øª Lost Garden Ù‡Ø³ØªÙ…. Ø¨Ø±ÛŒÙ… Ø§Ø¯Ø§Ù…Ù‡Â»
3. AI Ø¬Ø¯ÛŒØ¯ Ø§Ø² Ù‡Ù…ÛŒÙ† Ù†Ù‚Ø·Ù‡ Ø§Ø¯Ø§Ù…Ù‡ Ù…ÛŒâ€ŒØ¯Ù‡

<!-- AUTO-SAVE-END -->