/* ═══════════════════════════════════════════════════════════
   CHATBOT — ENGINE v10 (Legendary)
   ────────────────────────────────────────────────────────────
   • Priority intent detection
   • Slash commands
   • Easter eggs
   • Emotional response
   ─────────────────────────────────────────────────────────── */

import {
  BUSINESS_KEYWORDS, CATEGORY_TO_INTENT, INTENT_PATTERNS, RESPONSES,
  type ActionLink, type IntentType, type QuickReply,
} from './data';
import { searchKnowledge } from './knowledge';

export type BotResponse = {
  readonly text: string;
  readonly intent: IntentType;
  readonly quickReplies?: readonly QuickReply[];
  readonly actions?: readonly ActionLink[];
  readonly mood?: 'happy' | 'calm' | 'excited' | 'thinking' | 'neutral';
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
    .replace(/[يى]/g, 'ی').replace(/[ك]/g, 'ک')
    .replace(/[أإآٱ]/g, 'ا').replace(/[ة]/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ').trim().toLowerCase();
}

/* ───────────────────────────────────────────────────────────
   Slash Commands
   ─────────────────────────────────────────────────────────── */

export const SLASH_COMMANDS: Record<string, { text: string; intent: IntentType }> = {
  '/help': { text: '**دستورات موجود:**\n\n`/price` — قیمت‌ها\n`/demo` — نمونه‌کارها\n`/services` — خدمات\n`/contact` — راه تماس\n`/new` — گفت‌وگوی جدید\n`/clear` — پاک‌کردن مکالمه', intent: 'help' },
  '/price': { text: 'تعرفه‌ها:\n\n• **لندینگ:** از ۸ میلیون\n• **سایت شرکتی:** از ۱۵ میلیون\n• **فروشگاه:** از ۳۰ میلیون\n\nقیمت دقیق بعد از بررسی — بدون هزینه‌ی پنهان.', intent: 'ask_pricing' },
  '/demo': { text: 'چهار پروژه‌ی منتخب:\n\n• **آرکا** — SaaS\n• **نیلا** — فروشگاه پوشاک\n• **ویرا** — برندبوک\n• **لومن** — کمپین سینمایی', intent: 'ask_portfolio' },
  '/services': { text: 'سه خدمت اصلی:\n\n**۱. وب‌سایت اختصاصی**\n**۲. محتوای هوشمند با AI**\n**۳. ویدیوی سینمایی**', intent: 'ask_services' },
  '/contact': { text: 'راه‌های تماس:\n\n• فرم سفارش (توصیه می‌شه)\n• پیامک: ۰۹۳۷ ۱۹۳ ۲۵۴۹\n• روبیکا: @Amirhosein2076', intent: 'ask_contact' },
};

/* ───────────────────────────────────────────────────────────
   Easter Eggs
   ─────────────────────────────────────────────────────────── */

const EASTER_EGGS: Record<string, string> = {
  '42': '🌌 پاسخ به سؤال زندگی، جهان و همه‌چیز: **۴۲**.\n\nولی سؤال واقعی اینه — پروژه‌ات چیه؟',
  'lorem ipsum': '😄 متن ساختگی؟! بذار یه چیز واقعی بسازیم:\n\n**وب‌سایت اختصاصی** — از طراحی تا کد، با Next.js.',
  'hello world': '👋 Hello World!\n\nحالا که کد رو یاد گرفتیم، بریم سایت بسازیم؟',
  'قرآن': '📖 جمله‌ی زیبایی رو یادآوری کردی.\n\nحالا بگو چطور می‌تونم به کسب‌وکارت کمک کنم؟',
  'حافظ': '🕊️ *بشنو این نکته که خود را ز غم آزاده کنی*\n\n— حافظ\n\nحالا، پروژه‌ات چیه؟',
  'مولانا': '🕊️ *بشنو از نی چون حکایت می‌کند*\n\n— مولانا\n\nحکایت پروژه‌ی تو چیه؟',
  'اسپم': '😄 نه بابا، اینجا اسپم نداریم.\n\nهمه‌چیز شفاف و مستقیم.',
  'love': '❤️ ممنون! چقدر محبت.\n\nحالا چطور می‌تونم کمکت کنم؟',
  'fuck': '😊 متأسفم اگه ناراحت شدی.\n\nبگو چطور می‌تونم بهتر کمکت کنم.',
  '💩': '😄 خب... نظرت درباره‌ی یه سایت حرفه‌ای چیه؟',
  'فیبوناچی': '🔢 **۰، ۱، ۱، ۲، ۳، ۵، ۸، ۱۳، ۲۱...**\n\nحالا بگو دنبال چه نوع سایتی هستی؟',
  'فبوناچی': '🔢 **۰، ۱، ۱، ۲، ۳، ۵، ۸، ۱۳، ۲۱...**\n\nحالا بگو دنبال چه نوع سایتی هستی؟',
  'بازی': '🎮 بازی دوست داری؟\n\nولی اینجا بازی نداریم — ولی سایت می‌سازیم که کاربرا عاشقش بشن!',
};

function detectEasterEgg(normalized: string): string | null {
  for (const [key, value] of Object.entries(EASTER_EGGS)) {
    if (normalized === normalize(key)) return value;
  }
  return null;
}

/* ───────────────────────────────────────────────────────────
   Priority Intent
   ─────────────────────────────────────────────────────────── */

const PRIORITY_PATTERNS: Record<string, readonly string[]> = {
  greeting: INTENT_PATTERNS.greeting.map(normalize),
  thanks: INTENT_PATTERNS.thanks.map(normalize),
  goodbye: INTENT_PATTERNS.goodbye.map(normalize),
};

function detectPriorityIntent(normalized: string): IntentType | null {
  if (!normalized) return null;
  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 4) return null;

  for (const intent of ['greeting', 'thanks', 'goodbye'] as IntentType[]) {
    const patterns = PRIORITY_PATTERNS[intent];
    if (words.length === 1 && patterns.includes(words[0])) return intent;
    if (words.length >= 2 && words.every((w) => patterns.includes(w))) return intent;
    if (words.length === 2 && patterns.includes(words[0])) return intent;
  }
  return null;
}

/* ───────────────────────────────────────────────────────────
   Intent Detection
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
      else if (p.includes(normalized) && normalized.length >= 3) score += normalized.length * 1.5;
    }
    if (score > bestScore) { bestScore = score; bestIntent = intentKey as IntentType; }
  }

  if (bestScore < 4) return 'unknown';
  return bestIntent;
}

/* ───────────────────────────────────────────────────────────
   Business Domain
   ─────────────────────────────────────────────────────────── */

function detectBusinessDomain(text: string): string | null {
  const normalized = normalize(text);
  if (!normalized || normalized.length < 5) return null;
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

function getMoodForIntent(intent: IntentType): BotResponse['mood'] {
  const moodMap: Partial<Record<IntentType, BotResponse['mood']>> = {
    greeting: 'happy', thanks: 'happy', compliment: 'excited',
    ask_pricing: 'thinking', ask_process: 'thinking',
    ask_portfolio: 'excited', start_project: 'excited',
    describe_project: 'excited', unknown: 'thinking',
    ask_faq: 'neutral', help: 'neutral',
  };
  return moodMap[intent] ?? 'neutral';
}

function buildFromIntent(intent: IntentType): BotResponse {
  const templates = RESPONSES[intent];
  if (!templates || templates.length === 0) {
    const fallback = RESPONSES.unknown[0];
    return { text: fallback.text, intent: 'unknown', quickReplies: fallback.quickReplies, actions: fallback.actions, mood: 'thinking' };
  }
  const template = pickRandom(templates);
  return { text: template.text, intent, quickReplies: template.quickReplies, actions: template.actions, mood: getMoodForIntent(intent) };
}

function buildDescribeProject(domain: string): BotResponse {
  const isFood = /رستوران|کافه|قنادی|نانوایی/.test(domain);
  const isEdu = domain.includes('آموزشگاه');
  const isShop = /فروشگاه|پوشاک|کفش|طلا|موبایل/.test(domain);
  const isHealth = /کلینیک|دندان|پزشک|مطب/.test(domain);

  let hint = '';
  if (isFood) hint = '**۲. محتوای بصری** — عکس حرفه‌ای غذا و فضا\n**۳. سفارش/رزرو آنلاین** — کاهش تماس تلفنی';
  else if (isEdu) hint = '**۲. محتوای هوشمند** — جذب زبان‌آموز از گوگل\n**۳. ثبت‌نام آنلاین** — ۲۴ ساعته';
  else if (isShop) hint = '**۲. محتوای هوشمند** — توضیحات محصول و SEO\n**۳. ویدیوی معرفی** — اعتمادسازی';
  else if (isHealth) hint = '**۲. رزرو نوبت آنلاین** — کاهش تماس تلفنی\n**۳. محتوای تخصصی** — جذب بیمار از گوگل';
  else hint = '**۲. محتوای هوشمند** — جذب مشتری از گوگل\n**۳. ویدیوی معرفی** — برندسازی';

  return {
    text: `عالی! متوجه شدم — یه **${domain}** داری.\n\nپیشنهاد اولیه:\n\n**۱. وب‌سایت اختصاصی** — پایه‌ی حضور آنلاین\n${hint}\n\nبرای نقشه‌ی کامل با فازها و زمان‌بندی، بریم سراغ فرم سفارش.`,
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
    mood: 'excited',
  };
}

/* ───────────────────────────────────────────────────────────
   Public API
   ─────────────────────────────────────────────────────────── */

export function generateResponse(userMessage: string, _context?: ChatContext): BotResponse {
  const normalized = normalize(userMessage);

  if (!normalized || normalized.length < 2) return buildFromIntent('unknown');

  // ۰. Easter egg
  const egg = detectEasterEgg(normalized);
  if (egg) return { text: egg, intent: 'unknown', mood: 'excited' };

  // ۱. Slash command
  const slash = SLASH_COMMANDS[userMessage.trim().toLowerCase()];
  if (slash) return { text: slash.text, intent: slash.intent, mood: 'neutral' };

  // ۲. Priority intent
  const priority = detectPriorityIntent(normalized);
  if (priority) return buildFromIntent(priority);

  // ۳. Knowledge base
  if (normalized.length >= 3) {
    const knowledge = searchKnowledge(userMessage);
    if (knowledge) {
      const mappedIntent = CATEGORY_TO_INTENT[knowledge.category] ?? 'ask_faq';
      return { text: knowledge.answer, intent: mappedIntent, actions: knowledge.actions, mood: getMoodForIntent(mappedIntent) };
    }
  }

  // ۴. Intent detection
  const intent = detectIntent(userMessage);

  if (intent === 'unknown') {
    const domain = detectBusinessDomain(userMessage);
    if (domain) return buildDescribeProject(domain);
  }

  if (intent === 'describe_project') {
    const domain = detectBusinessDomain(userMessage) ?? 'کسب‌وکار';
    return buildDescribeProject(domain);
  }

  return buildFromIntent(intent);
}

/* ───────────────────────────────────────────────────────────
   Initial Message
   ─────────────────────────────────────────────────────────── */

const INITIAL_MESSAGE: BotResponse = {
  text: 'سلام! 👋\n\nمن دستیار دیجیتال امیرحسین‌ام. می‌تونم درباره‌ی خدمات، نمونه‌کارها، قیمت‌ها، فرآیند کار یا هر چیز دیگه‌ای راهنماییت کنم.\n\nحتی اگه فقط یه ایده‌ی خام داری، همین‌جا بگو — با هم شکلش می‌دیم.',
  intent: 'greeting',
  mood: 'happy',
  quickReplies: [
    { label: 'خدماتت چیه؟', value: 'خدماتت چیه؟' },
    { label: 'نمونه‌کار نشونم بده', value: 'نمونه کار نشونم بده' },
    { label: 'قیمت‌ها چطوره؟', value: 'قیمت‌ها چطوره؟' },
    { label: 'شروع پروژه', value: 'می‌خوام پروژه سفارش بدم' },
  ],
  actions: [{ label: 'نمونه‌کارها', href: '/work', icon: 'arrow' }],
};

export function getInitialMessage(): BotResponse {
  return INITIAL_MESSAGE;
}