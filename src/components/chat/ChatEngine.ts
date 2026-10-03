/* ═══════════════════════════════════════════════════════════
   CHATBOT — DECISION ENGINE
   ────────────────────────────────────────────────────────────
   تشخیص intent، تولید پاسخ، پیشنهاد quick replies.
   ═══════════════════════════════════════════════════════════ */

import {
  INTENT_PATTERNS,
  QUICK_REPLIES,
  RESPONSES,
  SITE_KNOWLEDGE,
  type IntentType,
  type QuickReply,
} from './data';

/* ───────────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────────── */

export type BotResponse = {
  readonly text: string;
  readonly intent: IntentType;
  readonly quickReplies?: readonly QuickReply[];
  readonly actions?: readonly { label: string; href: string; external?: boolean }[];
};

/* ───────────────────────────────────────────────────────────
   Normalization
   ─────────────────────────────────────────────────────────── */

function normalize(text: string): string {
  return text
    .replace(/[\u200c\u200e\u200f]/g, ' ')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/* ───────────────────────────────────────────────────────────
   Intent detection
   ─────────────────────────────────────────────────────────── */

function detectIntent(text: string): { intent: IntentType; score: number } {
  const normalized = normalize(text);
  if (!normalized) return { intent: 'unknown', score: 0 };

  let bestIntent: IntentType = 'unknown';
  let bestScore = 0;

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.length === 0) continue;

    let score = 0;
    for (const pattern of patterns) {
      const p = normalize(pattern);
      if (p.length === 0) continue;

      if (normalized === p) {
        score += p.length * 3;
      } else if (normalized.includes(p)) {
        score += p.length * 2;
      } else if (p.includes(normalized) && normalized.length >= 3) {
        score += normalized.length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as IntentType;
    }
  }

  // Describe project is special — detect when user gives a business description
  if (bestIntent === 'unknown' && normalized.length >= 5) {
    const businessWords = [
      'فروشگاه', 'رستوران', 'کافه', 'آموزشگاه', 'کلینیک',
      'پوشاک', 'کفش', 'لباس', 'آرایشگاه', 'دندانپزشک',
      'باشگاه', 'هتل', 'تور', 'شرکت', 'استارتاپ',
      'کسب و کار', 'کسب‌وکار', 'برند',
    ];
    if (businessWords.some((w) => normalized.includes(normalize(w)))) {
      return { intent: 'describe_project', score: 5 };
    }
  }

  if (bestScore < 4) return { intent: 'unknown', score: bestScore };

  return { intent: bestIntent, score: bestScore };
}

/* ───────────────────────────────────────────────────────────
   Response generation
   ─────────────────────────────────────────────────────────── */

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildDescribeProjectResponse(text: string): BotResponse {
  const normalized = normalize(text);

  const detected: string[] = [];

  const businessKeywords: Record<string, string> = {
    'رستوران': 'رستوران',
    'کافه': 'کافه',
    'فروشگاه': 'فروشگاه',
    'کفش': 'فروشگاه کفش',
    'پوشاک': 'فروشگاه پوشاک',
    'لباس': 'فروشگاه پوشاک',
    'آموزشگاه': 'آموزشگاه',
    'زبان': 'آموزشگاه زبان',
    'کلینیک': 'کلینیک',
    'دندانپزشک': 'دندانپزشکی',
    'آرایشگاه': 'سالن زیبایی',
    'باشگاه': 'باشگاه ورزشی',
    'هتل': 'هتل',
    'تور': 'آژانس گردشگری',
    'استارتاپ': 'استارتاپ',
    'پلتفرم': 'پلتفرم',
    'شرکت': 'شرکت',
  };

  for (const [key, label] of Object.entries(businessKeywords)) {
    if (normalized.includes(normalize(key))) {
      detected.push(label);
    }
  }

  const domain = detected[0] ?? 'کسب‌وکار';

  return {
    text:
      `عالی! متوجه شدم — یه **${domain}** داری.\n\n` +
      `بذار یه پیشنهاد اولیه بدم:\n\n` +
      `برای ${domain}، معمولاً این مسیر بهترین جواب رو می‌ده:\n\n` +
      `**۱. وب‌سایت اختصاصی** — پایه‌ی حضور آنلاین\n` +
      (domain.includes('رستوران') || domain.includes('کافه')
        ? '**۲. محتوای بصری** — عکس حرفه‌ای غذا و فضا\n**۳. رزرو/سفارش آنلاین** — کاهش تماس تلفنی\n'
        : domain.includes('آموزشگاه')
        ? '**۲. محتوای هوشمند** — جذب زبان‌آموز از گوگل\n**۳. ثبت‌نام آنلاین** — ۲۴ ساعته\n'
        : '**۲. محتوای هوشمند** — جذب مشتری از گوگل\n**۳. ویدیوی معرفی** — اعتمادسازی\n') +
      `\nمی‌خوای جزئیات بیشتر بدم یا بریم سراغ شروع؟`,
    intent: 'describe_project',
    quickReplies: QUICK_REPLIES.describe_project,
  };
}

export function generateResponse(
  userMessage: string,
): BotResponse {
  const { intent } = detectIntent(userMessage);

  // Special case: describe project
  if (intent === 'describe_project') {
    return buildDescribeProjectResponse(userMessage);
  }

  // Standard intents
  const texts = RESPONSES[intent];

  if (!texts || texts.length === 0) {
    return {
      text: pickRandom(RESPONSES.unknown),
      intent: 'unknown',
      quickReplies: QUICK_REPLIES.unknown,
    };
  }

  return {
    text: pickRandom(texts),
    intent,
    quickReplies: QUICK_REPLIES[intent],
  };
}

/* ───────────────────────────────────────────────────────────
   Initial message
   ─────────────────────────────────────────────────────────── */

export function getInitialMessage(): BotResponse {
  return {
    text:
      'سلام! 👋\n\n' +
      'من دستیار دیجیتال امیرحسین‌ام. می‌تونم درباره‌ی خدمات، نمونه‌کارها، قیمت‌ها، یا هر چیز دیگه‌ای راهنماییت کنم.\n\n' +
      'چطور کمکت کنم؟',
    intent: 'greeting',
    quickReplies: QUICK_REPLIES.greeting,
  };
}

/* ───────────────────────────────────────────────────────────
   Analyze project description
   ─────────────────────────────────────────────────────────── */

export function analyzeProject(description: string): string {
  const normalized = normalize(description);

  // Detect industry
  const industries: Record<string, { name: string; features: string[] }> = {
    'کفش': {
      name: 'فروشگاه کفش',
      features: [
        'راهنمای سایز هوشمند',
        'بازگشت ۱۴ روزه',
        'نمای ۳۶۰ درجه',
      ],
    },
    'رستوران': {
      name: 'رستوران',
      features: [
        'منوی تعاملی با عکس',
        'سفارش آنلاین',
        'رزرو میز',
      ],
    },
    'کافه': {
      name: 'کافه',
      features: [
        'اتمسفر بصری',
        'منوی فصلی',
        'رویدادها',
      ],
    },
    'آموزشگاه': {
      name: 'آموزشگاه',
      features: [
        'تست سطح آنلاین',
        'معرفی اساتید',
        'ثبت‌نام ۲۴ ساعته',
      ],
    },
    'کلینیک': {
      name: 'کلینیک',
      features: [
        'رزرو آنلاین + یادآور',
        'پروفایل پزشکان',
        'Before/After',
      ],
    },
    'فروشگاه': {
      name: 'فروشگاه آنلاین',
      features: [
        'مسیر خرید ساده',
        'سبد خرید drawer',
        'فیلتر هوشمند',
      ],
    },
  };

  let detectedIndustry = 'کسب‌وکار';
  let detectedFeatures: string[] = [];

  for (const [key, data] of Object.entries(industries)) {
    if (normalized.includes(normalize(key))) {
      detectedIndustry = data.name;
      detectedFeatures = data.features;
      break;
    }
  }

  const featuresText = detectedFeatures.length > 0
    ? `\n\nویژگی‌های پیشنهادی:\n${detectedFeatures.map((f) => `• ${f}`).join('\n')}`
    : '';

  return (
    `تحلیل ایده‌ت:\n\n` +
    `**حوزه:** ${detectedIndustry}\n` +
    `**مسیر پیشنهادی:** وب + محتوا + ویدیو${featuresText}\n\n` +
    `اگه می‌خوای نقشه‌ی کامل با فازها و زمان‌بندی ببینی، بگو «بریم سراغ پروژه».`
  );
}