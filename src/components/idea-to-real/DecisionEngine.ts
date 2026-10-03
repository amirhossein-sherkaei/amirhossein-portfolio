/* ═══════════════════════════════════════════════════════════
   IDEA → REAL — DECISION ENGINE v2
   ────────────────────────────────────────────────────────────
   ۵ لایه تحلیل:
     1. Tokenization — Intl.Segmenter + ZWNJ
     2. Stemming     — rule-based Persian suffix stripper
     3. Stopword     — filter function words
     4. N-gram       — 1/2/3-gram extraction
     5. Weighted     — fuzzy match + score + trace

   خروجی: services + domain + confidence + trace کامل
   ═══════════════════════════════════════════════════════════ */

import {
  DOMAINS,
  STOPWORDS,
  SUFFIXES,
  type Domain,
  type DomainId,
  type GoalId,
  type ServiceId,
} from './data';

/* ───────────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────────── */

export type TokenTrace = {
  readonly original: string;
  readonly normalized: string;
  readonly stemmed: string;
  readonly isStopword: boolean;
  readonly matchedDomains: readonly DomainId[];
};

export type KeyphraseTrace = {
  readonly phrase: string;
  readonly size: number; // 1, 2, or 3
  readonly score: number;
  readonly domainId: DomainId | null;
};

export type DomainScore = {
  readonly domain: Domain;
  readonly score: number;
  readonly matchedKeywords: readonly string[];
  readonly matchedPhrases: readonly string[];
};

export type DecisionResult = {
  readonly services: readonly ServiceId[];
  readonly domain: Domain;
  readonly domainConfidence: number;
  readonly secondaryDomains: readonly DomainScore[];
  readonly matchedKeywords: readonly string[];
  readonly reasons: Readonly<Record<ServiceId, readonly string[]>>;
  readonly trace: readonly TokenTrace[];
  readonly keyphrases: readonly KeyphraseTrace[];
  readonly serviceConfidence: Readonly<Record<ServiceId, number>>;
};

/* ═══════════════════════════════════════════════════════════
   LAYER 1 — Tokenization
   ───────────────────────────────────────────────────────────
   Uses Intl.Segmenter when available for correct Persian
   word boundary detection. Falls back to ZWNJ + space split.
   ═══════════════════════════════════════════════════════════ */

function tokenize(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (
        Intl as typeof Intl & {
          Segmenter: new (
            locale: string,
            options: { granularity: string },
          ) => {
            segment: (input: string) => Iterable<{
              segment: string;
              isWordLike?: boolean;
            }>;
          };
        }
      ).Segmenter('fa', { granularity: 'word' });

      const tokens: string[] = [];
      for (const seg of segmenter.segment(text)) {
        if (seg.isWordLike && seg.segment.trim().length > 0) {
          tokens.push(seg.segment);
        }
      }
      if (tokens.length > 0) return tokens;
    } catch {
      /* fall through */
    }
  }

  // Fallback: split on ZWNJ + whitespace + punctuation
  return text
    .replace(/[\u200c\u200e\u200f]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

/* ═══════════════════════════════════════════════════════════
   LAYER 2 — Normalization + Stemming
   ═══════════════════════════════════════════════════════════ */

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[يى]/g, 'ی') // Arabic yeh → Persian yeh
    .replace(/ك/g, 'ک') // Arabic kaf → Persian kaf
    .replace(/[أإآٱ]/g, 'ا') // Alef variants
    .replace(/ة/g, 'ه') // Teh marbuta → heh
    .replace(/[\u064B-\u065F]/g, '') // Remove diacritics
    .trim();
}

/**
 * Light rule-based Persian stemmer.
 * Only removes common inflectional suffixes.
 * Conservative — never produces empty string.
 */
function stem(word: string): string {
  const normalized = normalizeWord(word);
  if (normalized.length < 3) return normalized;

  // Sort suffixes by length descending — match longest first
  for (const suffix of SUFFIXES) {
    if (
      normalized.endsWith(suffix) &&
      normalized.length - suffix.length >= 2
    ) {
      return normalized.slice(0, -suffix.length);
    }
  }

  return normalized;
}

/* ═══════════════════════════════════════════════════════════
   LAYER 3 — Stopword filtering
   ═══════════════════════════════════════════════════════════ */

function isStopword(stemmed: string, original: string): boolean {
  const norm = normalizeWord(original);
  if (STOPWORDS.has(norm)) return true;
  if (STOPWORDS.has(stemmed)) return true;
  return false;
}

/* ═══════════════════════════════════════════════════════════
   LAYER 4 — N-gram extraction
   ═══════════════════════════════════════════════════════════
   Builds 1/2/3-grams from *content words only*.
   Stopwords act as boundaries.
   ═══════════════════════════════════════════════════════════ */

type ContentToken = {
  readonly original: string;
  readonly normalized: string;
  readonly stemmed: string;
};

function extractContentTokens(text: string): {
  contentTokens: ContentToken[];
  trace: TokenTrace[];
} {
  const rawTokens = tokenize(text);
  const contentTokens: ContentToken[] = [];
  const trace: TokenTrace[] = [];

  for (const raw of rawTokens) {
    const normalized = normalizeWord(raw);
    const stemmed = stem(raw);
    const stop = isStopword(stemmed, raw);

    const tokenTrace: TokenTrace = {
      original: raw,
      normalized,
      stemmed,
      isStopword: stop,
      matchedDomains: [],
    };

    trace.push(tokenTrace);

    if (!stop && stemmed.length >= 2) {
      contentTokens.push({
        original: raw,
        normalized,
        stemmed,
      });
    }
  }

  return { contentTokens, trace };
}

/**
 * Builds n-grams from *consecutive content tokens in original order*.
 * Stops at sentence boundaries (any punctuation).
 */
function buildNgrams(
  text: string,
  contentTokens: ContentToken[],
): { phrase: string; size: number; stemmed: string }[] {
  const rawTokens = tokenize(text);
  const ngrams: { phrase: string; size: number; stemmed: string }[] = [];

  // Map raw token → isContent
  const contentSet = new Map<string, ContentToken>();
  for (const ct of contentTokens) {
    contentSet.set(ct.original, ct);
  }

  // Iterate over raw tokens to preserve order
  let buffer: ContentToken[] = [];

  const flush = () => {
    if (buffer.length === 0) return;

    // 1-grams
    for (const t of buffer) {
      ngrams.push({
        phrase: t.original,
        size: 1,
        stemmed: t.stemmed,
      });
    }

    // 2-grams
    for (let i = 0; i < buffer.length - 1; i++) {
      ngrams.push({
        phrase: `${buffer[i].original} ${buffer[i + 1].original}`,
        size: 2,
        stemmed: `${buffer[i].stemmed} ${buffer[i + 1].stemmed}`,
      });
    }

    // 3-grams
    for (let i = 0; i < buffer.length - 2; i++) {
      ngrams.push({
        phrase: `${buffer[i].original} ${buffer[i + 1].original} ${
          buffer[i + 2].original
        }`,
        size: 3,
        stemmed: `${buffer[i].stemmed} ${buffer[i + 1].stemmed} ${
          buffer[i + 2].stemmed
        }`,
      });
    }

    buffer = [];
  };

  for (const raw of rawTokens) {
    const ct = contentSet.get(raw);
    if (ct) {
      buffer.push(ct);
    } else {
      flush();
    }
  }
  flush();

  return ngrams;
}

/* ═══════════════════════════════════════════════════════════
   LAYER 5 — Weighted keyword matching
   ═══════════════════════════════════════════════════════════
   Match each domain keyword against all n-grams.
   Score = keyword_length × ngram_size_bonus × exact_bonus
   ═══════════════════════════════════════════════════════════ */

const NGRAM_BONUS: Record<number, number> = {
  1: 1.0,
  2: 2.2,
  3: 3.0,
};

function ngramMatches(
  ngramStemmed: string,
  keywordStemmed: string,
): boolean {
  if (!ngramStemmed || !keywordStemmed) return false;

  const ngramWords = ngramStemmed.split(' ');
  const keywordWords = keywordStemmed.split(' ');

  // Exact match
  if (ngramStemmed === keywordStemmed) return true;

  // Phrase match: keyword appears as substring
  if (ngramStemmed.includes(keywordStemmed)) return true;

  // Stemmed phrase match: all keyword stems appear in ngram stems
  if (
    keywordWords.length > 1 &&
    keywordWords.every((kw) =>
      ngramWords.some((nw) => nw === kw || nw.startsWith(kw)),
    )
  ) {
    return true;
  }

  // Single-word prefix match (for compounds like "رستوران" ← "رستورانها")
  if (keywordWords.length === 1) {
    return ngramWords.some(
      (nw) =>
        nw === keywordStemmed ||
        nw.startsWith(keywordStemmed) ||
        keywordStemmed.startsWith(nw),
    );
  }

  return false;
}

type ScoredNgram = {
  phrase: string;
  size: number;
  stemmed: string;
  matchedKeyword: string;
  domainId: DomainId;
  score: number;
};

function scoreAllDomains(
  ngrams: { phrase: string; size: number; stemmed: string }[],
): { scores: Map<DomainId, DomainScore>; scoredNgrams: ScoredNgram[] } {
  const scores = new Map<DomainId, DomainScore>();
  const scoredNgrams: ScoredNgram[] = [];

  for (const domain of DOMAINS) {
    if (domain.keywords.length === 0) continue;

    let domainScore = 0;
    const matchedKeywords = new Set<string>();
    const matchedPhrases = new Set<string>();

    for (const ngram of ngrams) {
      // Skip unigrams that are too short
      if (ngram.size === 1 && ngram.stemmed.length < 3) continue;

      for (const keyword of domain.keywords) {
        const kwStemmed = stem(keyword);

        if (ngramMatches(ngram.stemmed, kwStemmed)) {
          const kwLen = kwStemmed.length;
          const bonus = NGRAM_BONUS[ngram.size] ?? 1;
          const ngramWeight = ngram.stemmed.length;

          // Score = keyword length × ngram specificity × ngram bonus
          const score = kwLen * ngramWeight * bonus;

          domainScore += score;
          matchedKeywords.add(keyword);
          matchedPhrases.add(ngram.phrase);

          scoredNgrams.push({
            phrase: ngram.phrase,
            size: ngram.size,
            stemmed: ngram.stemmed,
            matchedKeyword: keyword,
            domainId: domain.id,
            score,
          });
        }
      }
    }

    if (domainScore > 0) {
      scores.set(domain.id, {
        domain,
        score: domainScore,
        matchedKeywords: [...matchedKeywords],
        matchedPhrases: [...matchedPhrases],
      });
    }
  }

  return { scores, scoredNgrams };
}

/* ═══════════════════════════════════════════════════════════
   Service selection
   ═══════════════════════════════════════════════════════════ */

function selectServices(
  domain: Domain,
  goals: readonly GoalId[],
): readonly ServiceId[] {
  const set = new Set<ServiceId>(['website']);

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

/* ═══════════════════════════════════════════════════════════
   Confidence computation
   ═══════════════════════════════════════════════════════════ */

function computeConfidence(
  domainScore: number,
  allScores: number[],
): number {
  if (allScores.length === 0) return 0;
  const total = allScores.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return Math.min(1, domainScore / total);
}

function computeServiceConfidence(
  serviceId: ServiceId,
  domain: Domain,
  goals: readonly GoalId[],
): number {
  const has = (g: GoalId): boolean => goals.includes(g);
  let score = 0.5; // baseline

  if (serviceId === 'website') {
    score = 1.0; // always present
  }

  if (serviceId === 'ai-content') {
    if (domain.contentHeavy) score += 0.3;
    if (has('customers') || has('product')) score += 0.2;
    if (has('brand')) score += 0.15;
  }

  if (serviceId === 'cinematic-video') {
    if (domain.visualHeavy) score += 0.3;
    if (has('brand') || has('credibility')) score += 0.2;
  }

  return Math.min(1, score);
}

/* ═══════════════════════════════════════════════════════════
   Reasons
   ═══════════════════════════════════════════════════════════ */

function buildReasons(
  domain: Domain,
  goals: readonly GoalId[],
  matchedKeywords: readonly string[],
): Record<ServiceId, readonly string[]> {
  const has = (g: GoalId): boolean => goals.includes(g);

  const reasons: Record<ServiceId, string[]> = {
    website: [],
    'ai-content': [],
    'cinematic-video': [],
  };

  // Website reasons
  reasons.website.push('پایه‌ی هر حضور دیجیتال');
  if (has('credibility')) {
    reasons.website.push('چون اعتبار حرفه‌ای برات مهمه');
  }
  if (domain.id !== 'general') {
    reasons.website.push(
      `چون در حوزه‌ی «${domain.label}» هستی`,
    );
  }

  // AI Content reasons
  if (domain.contentHeavy) {
    reasons['ai-content'].push(
      `چون کارت محتوا‌محوره (${domain.label})`,
    );
  }
  if (has('customers')) {
    reasons['ai-content'].push('چون می‌خوای مشتری جذب کنی');
  }
  if (has('product')) {
    reasons['ai-content'].push('چون می‌خوای محصولت معرفی بشه');
  }
  if (has('sales')) {
    reasons['ai-content'].push('چون فروش بیشتر برات مهمه');
  }
  if (matchedKeywords.length > 0) {
    reasons['ai-content'].push(
      `چون کلمات «${matchedKeywords
        .slice(0, 2)
        .join('، ')}» دیده شد`,
    );
  }

  // Cinematic Video reasons
  if (domain.visualHeavy) {
    reasons['cinematic-video'].push(
      `چون کارت بصری‌ه (${domain.label})`,
    );
  }
  if (has('brand')) {
    reasons['cinematic-video'].push(
      'چون می‌خوای برندت متمایز و ماندگار باشه',
    );
  }
  if (has('credibility')) {
    reasons['cinematic-video'].push('چون اعتماد مهمه');
  }

  return {
    website: reasons.website.slice(0, 3),
    'ai-content': reasons['ai-content'].slice(0, 3),
    'cinematic-video': reasons['cinematic-video'].slice(0, 3),
  };
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════════ */

export function decide(
  idea: string,
  goals: readonly GoalId[],
): DecisionResult {
  // Layer 1-3: tokenize + stem + filter
  const { contentTokens, trace } = extractContentTokens(idea);

  // Layer 4: n-grams
  const ngrams = buildNgrams(idea, contentTokens);

  // Layer 5: score
  const { scores, scoredNgrams } = scoreAllDomains(ngrams);

  // Sort domains by score descending
  const sortedDomains = [...scores.values()].sort(
    (a, b) => b.score - a.score,
  );

  // Pick best domain (or general fallback)
  const fallback = DOMAINS[DOMAINS.length - 1];
  const best = sortedDomains[0] ?? null;
  const domain = best?.domain ?? fallback;

  // Confidence
  const allScores = sortedDomains.map((d) => d.score);
  const domainConfidence = computeConfidence(
    best?.score ?? 0,
    allScores,
  );

  const secondaryDomains = sortedDomains.slice(1, 4);

  // Services
  const services = selectServices(domain, goals);

  // Service confidence
  const serviceConfidence: Record<ServiceId, number> = {
    website: computeServiceConfidence('website', domain, goals),
    'ai-content': computeServiceConfidence(
      'ai-content',
      domain,
      goals,
    ),
    'cinematic-video': computeServiceConfidence(
      'cinematic-video',
      domain,
      goals,
    ),
  };

  // Reasons
  const matchedKeywords = best?.matchedKeywords ?? [];
  const reasons = buildReasons(domain, goals, matchedKeywords);

  // Build keyphrase trace (top-scored, unique phrases)
  const phraseMap = new Map<string, KeyphraseTrace>();
  for (const sn of scoredNgrams) {
    const existing = phraseMap.get(sn.phrase);
    if (!existing || existing.score < sn.score) {
      phraseMap.set(sn.phrase, {
        phrase: sn.phrase,
        size: sn.size,
        score: sn.score,
        domainId: sn.domainId,
      });
    }
  }
  const keyphrases = [...phraseMap.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // Enrich token trace with domain matches
  const enrichedTrace: TokenTrace[] = trace.map((t) => {
    if (t.isStopword) return t;
    const matchedDomains: DomainId[] = [];
    for (const ngram of scoredNgrams) {
      if (
        ngram.stemmed.split(' ').includes(t.stemmed) &&
        !matchedDomains.includes(ngram.domainId)
      ) {
        matchedDomains.push(ngram.domainId);
      }
    }
    return { ...t, matchedDomains };
  });

  return {
    services,
    domain,
    domainConfidence,
    secondaryDomains,
    matchedKeywords,
    reasons,
    trace: enrichedTrace,
    keyphrases,
    serviceConfidence,
  };
}