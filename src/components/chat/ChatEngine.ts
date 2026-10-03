/* ═══════════════════════════════════════════════════════════
   CHATBOT — ENGINE v4 (Production)
   ────────────────────────────────────────────────────────────
   • Knowledge base search (888 entries)
   • Multi-layer intent detection
   • Context awareness
   • Action-driven responses
   ═══════════════════════════════════════════════════════════ */

import {
  BUSINESS_KEYWORDS,
  CATEGORY_TO_INTENT,
  INTENT_PATTERNS,
  RESPONSES,
  type ActionLink,
  type IntentType,
  type QuickReply,
} from './data';
import { searchKnowledge } from './knowledge';

/* ───────────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────────── */

export type BotResponse = {
  readonly text: string;
  readonly intent: IntentType;
  readonly quickReplies?: readonly QuickReply[];
  readonly actions?: readonly ActionLink[];
};

export type ChatContext = {
  readonly lastIntent?: IntentType;
  readonly lastTopic?: string;
};

/* ───────────────────────────────────────────────────────────
   Normalization
   ─────────────────────────────────────────────────────────── */

export function normalize(text: string): string {
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
   Intent detection
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

  if (bestScore < 4) return 'unknown';
  return bestIntent;
}

/* ───────────────────────────────────────────────────────────
   Business keyword detection (برای describe_project)
   ─────────────────────────────────────────────────────────── */

function detectBusinessDomain(text: string): string | null {
  const normalized = normalize(text);
  if (!normalized) return null;
  if (normalized.length < 5) return null;

  for (const [key, label] of Object.entries(BUSINESS_KEYWORDS)) {
    const k = normalize(key);
    if (k.length >= 3 && normalized.includes(k)) return label;
  }
  return null;
}

/* ───────────────────────────────────────────────────────────
   Response builders
   ─────────────────────────────────────────────────────────── */

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildDescribeProject(domain: string): BotResponse {
  const isFood =
    domain.includes('رستوران') ||
    domain.includes('کافه') ||
    domain.includes('قنادی') ||
    domain.includes('نانوایی');

  const isEdu = domain.includes('آموزشگاه');

  const isShop =
    domain.includes('فروشگاه') ||
    domain.includes('پوشاک') ||
    domain.includes('کفش') ||
    domain.includes('طلا') ||
    domain.includes('موبایل');

  const isHealth =
    domain.includes('کلینیک') ||
    domain.includes('دندان') ||
    domain.includes('پزشک') ||
    domain.includes('مطب');

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
  } else if (isHealth) {
    serviceHint =
      '**۲. رزرو نوبت آنلاین** — کاهش تماس تلفنی\n**۳. محتوای تخصصی** — جذب بیمار از گوگل';
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
      { label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true },
      { label: 'دیدن نمونه‌کارها', href: '/work', icon: 'arrow' },
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

export function generateResponse(
  userMessage: string,
  context?: ChatContext,
): BotResponse {
  // ۱. Knowledge base search — ۸۸۸ سوال
  const knowledge = searchKnowledge(userMessage);
  if (knowledge) {
    const mappedIntent =
      CATEGORY_TO_INTENT[knowledge.category] ?? 'ask_faq';
    return {
      text: knowledge.answer,
      intent: mappedIntent,
      actions: knowledge.actions,
    };
  }

  // ۲. Intent detection
  const intent = detectIntent(userMessage);

  // ۳. Business domain detection (فقط اگه هیچ intent قوی‌ای نبود)
  if (intent === 'unknown') {
    const domain = detectBusinessDomain(userMessage);
    if (domain) return buildDescribeProject(domain);
  }

  // ۴. describe_project با intent مستقیم
  if (intent === 'describe_project') {
    const domain = detectBusinessDomain(userMessage) ?? 'کسب‌وکار';
    return buildDescribeProject(domain);
  }

  // ۵. Standard responses
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

const INITIAL_MESSAGE: BotResponse = {
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

export function getInitialMessage(): BotResponse {
  return INITIAL_MESSAGE;
}

/* ───────────────────────────────────────────────────────────
   Stats helper (اختیاری — برای دیباگ)
   ─────────────────────────────────────────────────────────── */

export function getEngineStats() {
  return {
    intents: Object.keys(INTENT_PATTERNS).length,
    responses: Object.keys(RESPONSES).length,
    businessKeywords: Object.keys(BUSINESS_KEYWORDS).length,
    contextSupported: true,
  };
}