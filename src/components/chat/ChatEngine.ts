/* ═══════════════════════════════════════════════════════════
   CHATBOT — ENGINE v3
   ────────────────────────────────────────────────────────────
   • Knowledge base search (188 entries)
   • Multi-layer intent detection
   • Business keyword analysis
   • Action-driven responses
   ═══════════════════════════════════════════════════════════ */

import {
  BUSINESS_KEYWORDS,
  INTENT_PATTERNS,
  RESPONSES,
  SITE_SECTIONS,
  type ActionLink,
  type IntentType,
  type QuickReply,
} from './data';
import { searchKnowledge } from './knowledge';

export type BotResponse = {
  readonly text: string;
  readonly intent: IntentType;
  readonly quickReplies?: readonly QuickReply[];
  readonly actions?: readonly ActionLink[];
};

/* ───────────────────────────────────────────────────────────
   Normalization
   ─────────────────────────────────────────────────────────── */

function normalize(text: string): string {
  return text
    .replace(/[\u200c\u200e\u200f]/g, ' ')
    .replace(/[يى]/g, 'ی')
    .replace(/[ك]/g, 'ک')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/* ───────────────────────────────────────────────────────────
   Intent detection — multi-pass
   ─────────────────────────────────────────────────────────── */

function detectIntent(text: string): IntentType {
  const normalized = normalize(text);
  if (!normalized) return 'unknown';

  let bestIntent: IntentType = 'unknown';
  let bestScore = 0;

  for (const [intentKey, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.length === 0) continue;

    let score = 0;
    for (const pattern of patterns) {
      const p = normalize(pattern);
      if (p.length === 0) continue;

      if (normalized === p) score += p.length * 4;
      else if (normalized.includes(p)) score += p.length * 2;
      else if (p.includes(normalized) && normalized.length >= 3) {
        score += normalized.length * 1.5;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intentKey as IntentType;
    }
  }

  // If low score, try business keyword fallback
  if (bestScore < 6 && normalized.length >= 4) {
    for (const keyword of Object.keys(BUSINESS_KEYWORDS)) {
      if (normalized.includes(normalize(keyword))) {
        return 'describe_project';
      }
    }
  }

  if (bestScore < 4) return 'unknown';
  return bestIntent;
}

/* ───────────────────────────────────────────────────────────
   Response builder helpers
   ─────────────────────────────────────────────────────────── */

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildDescribeProject(text: string): BotResponse {
  const normalized = normalize(text);
  const detected: string[] = [];

  for (const [key, label] of Object.entries(BUSINESS_KEYWORDS)) {
    if (normalized.includes(normalize(key))) {
      detected.push(label);
    }
  }

  const domain = detected[0] ?? 'کسب‌وکار';

  const isFood = domain.includes('رستوران') || domain.includes('کافه');
  const isEdu = domain.includes('آموزشگاه');
  const isShop =
    domain.includes('فروشگاه') ||
    domain.includes('پوشاک') ||
    domain.includes('کفش');

  let serviceHint = '';
  if (isFood) {
    serviceHint =
      '**۲. محتوای بصری** — عکس حرفه‌ای غذا و فضا\n**۳. سفارش/رزرو آنلاین** — کاهش تماس تلفنی';
  } else if (isEdu) {
    serviceHint =
      '**۲. محتوای هوشمند** — جذب زبان‌آموز از گوگل\n**۳. ثبت‌نام آنلاین** — ۲۴ ساعته';
  } else if (isShop) {
    serviceHint =
      '**۲. محتوای هوشمند** — توضیحات محصول و SEO\n**۳. ویدیوی معرفی** — اعتمادسازی';
  } else {
    serviceHint =
      '**۲. محتوای هوشمند** — جذب مشتری از گوگل\n**۳. ویدیوی معرفی** — برندسازی';
  }

  return {
    text:
      `عالی! متوجه شدم — یه **${domain}** داری.\n\n` +
      `پیشنهاد اولیه:\n\n` +
      `**۱. وب‌سایت اختصاصی** — پایه‌ی حضور آنلاین\n` +
      serviceHint +
      `\n\nبرای نقشه‌ی کامل با فازها و زمان‌بندی، بریم سراغ فرم سفارش.`,
    intent: 'describe_project',
    actions: [
      {
        label: 'شروع پروژه',
        href: '/order',
        icon: 'spark',
        primary: true,
      },
      {
        label: 'دیدن نمونه‌کارها',
        href: '/work',
        icon: 'arrow',
      },
    ],
    quickReplies: [
      { label: 'قیمت حدودی', value: 'قیمت‌ها چطوره؟' },
      { label: 'زمان‌بندی', value: 'چقدر طول می‌کشه؟' },
      { label: 'فرآیند کار', value: 'فرآیند کار چطوره؟' },
    ],
  };
}

/* ───────────────────────────────────────────────────────────
   Public API — generateResponse
   ═══════════════════════════════════════════════════════════ */

export function generateResponse(userMessage: string): BotResponse {
  // ۱. Knowledge base search — ۱۸۸ سؤال
  const knowledge = searchKnowledge(userMessage);
  if (knowledge) {
    return {
      text: knowledge.answer,
      intent: 'ask_faq',
      actions: knowledge.actions,
    };
  }

  // ۲. Intent detection
  const intent = detectIntent(userMessage);

  // ۳. Special case: describe_project
  if (intent === 'describe_project') {
    return buildDescribeProject(userMessage);
  }

  // ۴. Standard responses
  const templates = RESPONSES[intent];

  if (!templates || templates.length === 0) {
    const fallback = RESPONSES.unknown[0];
    return {
      text: fallback.text,
      intent: 'unknown',
      quickReplies: fallback.quickReplies,
      actions: fallback.actions,
    };
  }

  const template = pickRandom(templates);

  return {
    text: template.text,
    intent,
    quickReplies: template.quickReplies,
    actions: template.actions,
  };
}

/* ───────────────────────────────────────────────────────────
   Initial message
   ─────────────────────────────────────────────────────────── */

export function getInitialMessage(): BotResponse {
  return {
    text:
      'سلام! 👋\n\n' +
      'من دستیار دیجیتال امیرحسین‌ام. می‌تونم درباره‌ی خدمات، نمونه‌کارها، قیمت‌ها، فرآیند کار یا هر چیز دیگه‌ای راهنماییت کنم.\n\n' +
      'حتی اگه فقط یه ایده‌ی خام داری، همین‌جا بگو — با هم شکلش می‌دیم.',
    intent: 'greeting',
    quickReplies: [
      { label: 'خدماتت چیه؟', value: 'خدماتت چیه؟' },
      { label: 'نمونه‌کار نشونم بده', value: 'نمونه کار نشونم بده' },
      { label: 'قیمت‌ها چطوره؟', value: 'قیمت‌ها چطوره؟' },
      { label: 'شروع پروژه', value: 'می‌خوام پروژه سفارش بدم' },
    ],
    actions: [
      { label: 'نمونه‌کارها', href: '/work', icon: 'arrow' },
    ],
  };
}

/* ───────────────────────────────────────────────────────────
   Site section matcher — for navigation intent
   ─────────────────────────────────────────────────────────── */

export function findSectionByText(
  text: string,
): (typeof SITE_SECTIONS)[number] | null {
  const normalized = normalize(text);

  for (const section of SITE_SECTIONS) {
    for (const keyword of section.keywords) {
      if (normalized.includes(normalize(keyword))) {
        return section;
      }
    }
  }
  return null;
}