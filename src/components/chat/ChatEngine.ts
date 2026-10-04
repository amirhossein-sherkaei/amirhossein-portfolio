/* ═══════════════════════════════════════════════════════════
   CHATBOT — ENGINE v5 (Debug Edition)
   ────────────────────────────────────────────────────────────
   • Priority intent detection (fixes greeting hijack)
   • Knowledge base search (888 entries)
   • Business domain detection
   • Context awareness
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
   Priority Intent Detection
   — این تابع قبل از KB search اجرا می‌شه تا greeting هرگز
     با یه کلیدواژه تصادفی قاطی نشه.
   ─────────────────────────────────────────────────────────── */

const PRIORITY_INTENTS: readonly IntentType[] = [
  'greeting',
  'thanks',
  'goodbye',
];

const PRIORITY_PATTERNS: Record<string, readonly string[]> = {
  greeting: INTENT_PATTERNS.greeting.map(normalize),
  thanks: INTENT_PATTERNS.thanks.map(normalize),
  goodbye: INTENT_PATTERNS.goodbye.map(normalize),
};

function detectPriorityIntent(normalized: string): IntentType | null {
  if (!normalized) return null;

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  if (words.length > 4) return null; // پیام‌های طولانی احتمالاً سؤال جدی‌ان

  for (const intent of PRIORITY_INTENTS) {
    const patterns = PRIORITY_PATTERNS[intent];

    // حالت ۱: تک‌کلمه‌ای که دقیقاً با یه pattern مطابقت داره
    if (words.length === 1 && patterns.includes(words[0])) {
      return intent;
    }

    // حالت ۲: چندکلمه‌ای — همه‌ی کلمات باید در pattern های همون intent باشن
    if (words.length >= 2) {
      const allMatch = words.every((w) => patterns.includes(w));
      if (allMatch) return intent;

      // حالت ۳: کلمه‌ی اول greeting + حداکثر ۱ کلمه‌ی اضافی
      if (words.length === 2 && patterns.includes(words[0])) {
        return intent;
      }
    }
  }

  return null;
}

/* ───────────────────────────────────────────────────────────
   Intent detection — عمومی
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
   Business keyword detection
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
   Helpers
   ─────────────────────────────────────────────────────────── */

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildFromIntent(intent: IntentType): BotResponse {
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
   Public API
   ─────────────────────────────────────────────────────────── */

export function generateResponse(
  userMessage: string,
  _context?: ChatContext,
): BotResponse {
  const normalized = normalize(userMessage);

  // ۰. ورودی خالی
  if (!normalized || normalized.length < 2) {
    return buildFromIntent('unknown');
  }

  // ۱. PRIORITY — greeting/thanks/goodbye قبل از هر چیز
  //    این جلوی hijack شدن توسط KB رو می‌گیره
  const priorityIntent = detectPriorityIntent(normalized);
  if (priorityIntent) {
    return buildFromIntent(priorityIntent);
  }

  // ۲. Knowledge base search (فقط برای پیام‌های >= ۳ کاراکتر)
  if (normalized.length >= 3) {
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
  }

  // ۳. Intent detection
  const intent = detectIntent(userMessage);

  // ۴. Business domain detection (وقتی هیچ intent قوی‌ای نبود)
  if (intent === 'unknown') {
    const domain = detectBusinessDomain(userMessage);
    if (domain) return buildDescribeProject(domain);
  }

  if (intent === 'describe_project') {
    const domain = detectBusinessDomain(userMessage) ?? 'کسب‌وکار';
    return buildDescribeProject(domain);
  }

  // ۵. پاسخ استاندارد
  return buildFromIntent(intent);
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
   Debug helper
   ─────────────────────────────────────────────────────────── */

export function debugIntent(userMessage: string) {
  const normalized = normalize(userMessage);
  const priority = detectPriorityIntent(normalized);
  const knowledge = searchKnowledge(userMessage);
  const intent = detectIntent(userMessage);

  return {
    normalized,
    priorityIntent: priority,
    knowledgeMatch: knowledge
      ? { id: knowledge.id, category: knowledge.category }
      : null,
    regularIntent: intent,
    finalResponse: generateResponse(userMessage),
  };
}