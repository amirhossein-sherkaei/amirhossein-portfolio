/* ═══════════════════════════════════════════════════════════
   IDEA → REAL — DECISION ENGINE
   ────────────────────────────────────────────────────────────
   موتور تصمیمگیری کاملاً محلی و deterministic.
   بدون API، بدون LLM — فقط منطق شفاف و قابل پیشبینی.
   ═══════════════════════════════════════════════════════════ */

import {
  DOMAINS,
  type Domain,
  type GoalId,
  type ServiceId,
} from './data';

/* ───────────────────────────────────────────────────────────
   Normalization
   ZWNJ، LRM، RLM و نشانهها به فاصله تبدیل میشن.
   ─────────────────────────────────────────────────────────── */

function normalize(input: string): string {
  return input
    .replace(/[\u200c\u200e\u200f]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/* ───────────────────────────────────────────────────────────
   تشخیص دامنه
   امتیاز = مجموع طول کلیدواژههای مطبوق
   (کلیدواژههای بلندتر وزن بیشتری دارند)
   ─────────────────────────────────────────────────────────── */

function detectDomain(idea: string): Domain {
  const text = normalize(idea);
  const fallback = DOMAINS[DOMAINS.length - 1];

  if (!text) return fallback;

  let bestDomain: Domain = fallback;
  let bestScore = 0;

  for (const domain of DOMAINS) {
    if (domain.keywords.length === 0) continue;

    let score = 0;
    for (const keyword of domain.keywords) {
      const k = normalize(keyword);
      if (k.length > 0 && text.includes(k)) {
        score += k.length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return bestDomain;
}

/* ───────────────────────────────────────────────────────────
   انتخاب خدمات
   ─────────────────────────────────────────────────────────── */

function selectServices(
  domain: Domain,
  goals: readonly GoalId[],
): readonly ServiceId[] {
  const set = new Set<ServiceId>();

  // پایه — همیشه
  set.add('website');

  const has = (g: GoalId): boolean => goals.includes(g);

  const wantsBrand =
    has('brand') || has('personal') || has('credibility');

  const wantsReach =
    has('customers') || has('product') || has('sales');

  if (domain.contentHeavy || wantsReach || wantsBrand) {
    set.add('ai-content');
  }

  if (domain.visualHeavy || wantsBrand) {
    set.add('cinematic-video');
  }

  const order: readonly ServiceId[] = [
    'website',
    'ai-content',
    'cinematic-video',
  ];

  return order.filter((s) => set.has(s));
}

/* ───────────────────────────────────────────────────────────
   API عمومی
   ─────────────────────────────────────────────────────────── */

export function decide(
  idea: string,
  goals: readonly GoalId[],
): readonly ServiceId[] {
  const domain = detectDomain(idea);
  return selectServices(domain, goals);
}