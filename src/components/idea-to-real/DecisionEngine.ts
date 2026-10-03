/* ═══════════════════════════════════════════════════════════
   IDEA → REAL — DECISION ENGINE
   ────────────────────────────────────────────────────────────
   موتور تصمیم‌گیری محلی، deterministic، بدون API.
   خروجی شامل خدمات + دلایل انتخاب (Why This Recommendation).
   ═══════════════════════════════════════════════════════════ */

import {
  DOMAINS,
  type Domain,
  type GoalId,
  type ServiceId,
} from './data';

/* ───────────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────────── */

export type DecisionResult = {
  readonly services: readonly ServiceId[];
  readonly domain: Domain;
  readonly matchedKeywords: readonly string[];
  readonly reasons: Readonly<Record<ServiceId, readonly string[]>>;
};

/* ───────────────────────────────────────────────────────────
   Normalization
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
   ─────────────────────────────────────────────────────────── */

function detectDomain(
  idea: string,
): { domain: Domain; matched: readonly string[] } {
  const text = normalize(idea);
  const fallback = DOMAINS[DOMAINS.length - 1];

  if (!text) return { domain: fallback, matched: [] };

  let bestDomain: Domain = fallback;
  let bestScore = 0;
  let bestMatched: string[] = [];

  for (const domain of DOMAINS) {
    if (domain.keywords.length === 0) continue;

    let score = 0;
    const matched: string[] = [];

    for (const keyword of domain.keywords) {
      const k = normalize(keyword);
      if (k.length > 0 && text.includes(k)) {
        score += k.length;
        matched.push(keyword);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
      bestMatched = matched;
    }
  }

  return { domain: bestDomain, matched: bestMatched };
}

/* ───────────────────────────────────────────────────────────
   انتخاب خدمات
   ─────────────────────────────────────────────────────────── */

function selectServices(
  domain: Domain,
  goals: readonly GoalId[],
): readonly ServiceId[] {
  const set = new Set<ServiceId>([ 'website' ]);

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
   ساخت دلایل («چرا این؟»)
   ─────────────────────────────────────────────────────────── */

function buildReasons(
  domain: Domain,
  goals: readonly GoalId[],
  services: readonly ServiceId[],
): Record<ServiceId, readonly string[]> {
  const has = (g: GoalId): boolean => goals.includes(g);

  const reasons: Record<ServiceId, string[]> = {
    website: [],
    'ai-content': [],
    'cinematic-video': [],
  };

  if (services.includes('website')) {
    reasons.website.push('پایه‌ی هر حضور دیجیتال');
    reasons.website.push('سرعت و تجربه‌ی کاربری بهتر از قالب آماده');
    if (has('credibility')) {
      reasons.website.push('چون اعتبار حرفه‌ای برات مهمه');
    }
  }

  if (services.includes('ai-content')) {
    if (domain.contentHeavy) {
      reasons['ai-content'].push(
        `چون کارت محتوا‌محوره (حوزه‌ی ${domain.label})`,
      );
    }
    if (has('customers')) {
      reasons['ai-content'].push('چون می‌خوای مشتری جذب کنی');
    }
    if (has('brand')) {
      reasons['ai-content'].push('چون برندت باید دیده بشه');
    }
    if (has('product')) {
      reasons['ai-content'].push('چون می‌خوای محصولت معرفی بشه');
    }
  }

  if (services.includes('cinematic-video')) {
    if (domain.visualHeavy) {
      reasons['cinematic-video'].push(
        `چون کارت بصری و حسی‌ه (حوزه‌ی ${domain.label})`,
      );
    }
    if (has('brand')) {
      reasons['cinematic-video'].push(
        'چون می‌خوای برندت متمایز و ماندگار باشه',
      );
    }
    if (has('credibility')) {
      reasons['cinematic-video'].push(
        'چون اعتماد و ماندگاری مهمه',
      );
    }
  }

  // Cap at 3 reasons
  return {
    website: reasons.website.slice(0, 3),
    'ai-content': reasons['ai-content'].slice(0, 3),
    'cinematic-video': reasons['cinematic-video'].slice(0, 3),
  };
}

/* ───────────────────────────────────────────────────────────
   API
   ─────────────────────────────────────────────────────────── */

export function decide(
  idea: string,
  goals: readonly GoalId[],
): DecisionResult {
  const { domain, matched } = detectDomain(idea);
  const services = selectServices(domain, goals);
  const reasons = buildReasons(domain, goals, services);

  return {
    services,
    domain,
    matchedKeywords: matched,
    reasons,
  };
}