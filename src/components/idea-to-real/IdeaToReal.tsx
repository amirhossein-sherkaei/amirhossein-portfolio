"use client";

/* ═══════════════════════════════════════════════════════════
   IDEA → REAL — v2
   ────────────────────────────────────────────────────────────
   • Progressive analysis with rotating phrases
   • Path visualization (metro-line style)
   • Progressive station reveal
   • Expandable details per station
   • "چرا این؟" reasons
   • URL state sync
   • Keyboard-first
   ═══════════════════════════════════════════════════════════ */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  GOALS,
  LOADING_PHRASES,
  SERVICES,
  type GoalId,
  type ServiceId,
} from './data';
import { decide, type DecisionResult } from './DecisionEngine';
import './idea-to-real.css';

/* ───────────────────────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────────────────────── */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersian(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/* ───────────────────────────────────────────────────────────
   Constants
   ─────────────────────────────────────────────────────────── */

type Phase = 'input' | 'analyzing' | 'result';

const ANALYZE_MS = 1200;
const PHRASE_INTERVAL_MS = 400;
const MIN_IDEA_LENGTH = 4;
const MAX_IDEA_LENGTH = 600;

const EXAMPLES: readonly string[] = [
  'رستوران خانوادگی',
  'کلینیک پوست',
  'آموزشگاه زبان',
];

/* ───────────────────────────────────────────────────────────
   Component
   ─────────────────────────────────────────────────────────── */

export function IdeaToReal() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('input');
  const [idea, setIdea] = useState('');
  const [goals, setGoals] = useState<readonly GoalId[]>([]);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const analyzeTimeout = useRef<number | null>(null);
  const phraseInterval = useRef<number | null>(null);

  /* ─── Mount guard ─── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ─── Restore from URL ─── */
  useEffect(() => {
    if (!mounted) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const urlIdea = params.get('idea');
      const urlGoals = params.get('goals');

      if (!urlIdea) return;

      setIdea(urlIdea.slice(0, MAX_IDEA_LENGTH));

      if (urlGoals) {
        const validGoals = urlGoals
          .split(',')
          .filter(
            (g): g is GoalId =>
              GOALS.some((goal) => goal.id === g),
          );
        if (validGoals.length > 0) {
          setGoals(validGoals);

          // Auto-advance to result
          const r = decide(urlIdea, validGoals);
          setResult(r);
          setPhase('result');
          setActiveIndex(0);
        }
      }
    } catch {
      /* ignore */
    }
  }, [mounted]);

  /* ─── Sync to URL ─── */
  useEffect(() => {
    if (!mounted) return;

    try {
      const params = new URLSearchParams(window.location.search);

      if (idea.trim()) {
        params.set('idea', idea.trim());
      } else {
        params.delete('idea');
      }

      if (goals.length > 0) {
        params.set('goals', goals.join(','));
      } else {
        params.delete('goals');
      }

      const qs = params.toString();
      const url = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;

      window.history.replaceState(null, '', url);
    } catch {
      /* ignore */
    }
  }, [mounted, idea, goals]);

  /* ─── Cleanup ─── */
  useEffect(() => {
    return () => {
      if (analyzeTimeout.current !== null) {
        window.clearTimeout(analyzeTimeout.current);
      }
      if (phraseInterval.current !== null) {
        window.clearInterval(phraseInterval.current);
      }
    };
  }, []);

  /* ─── Derived ─── */
  const canSubmit =
    idea.trim().length >= MIN_IDEA_LENGTH && goals.length > 0;

  const progressPercent = useMemo(() => {
    if (phase !== 'result' || !result) return 0;
    const total = result.services.length;
    if (total <= 1) return 100;
    return (activeIndex / (total - 1)) * 100;
  }, [phase, result, activeIndex]);

  /* ─── Actions ─── */

  const toggleGoal = useCallback((id: GoalId) => {
    setGoals((prev) =>
      prev.includes(id)
        ? prev.filter((g) => g !== id)
        : [...prev, id],
    );
  }, []);

  const useExample = useCallback((text: string) => {
    setIdea(text);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, []);

  const submit = useCallback(() => {
    if (!canSubmit) return;

    setPhase('analyzing');
    setLoadingPhraseIndex(0);

    // Cycle loading phrases
    phraseInterval.current = window.setInterval(() => {
      setLoadingPhraseIndex((prev) =>
        (prev + 1) % LOADING_PHRASES.length,
      );
    }, PHRASE_INTERVAL_MS);

    // After analysis, transition to result
    analyzeTimeout.current = window.setTimeout(() => {
      if (phraseInterval.current !== null) {
        window.clearInterval(phraseInterval.current);
        phraseInterval.current = null;
      }

      const r = decide(idea, goals);
      setResult(r);
      setPhase('result');
      setActiveIndex(0);
      analyzeTimeout.current = null;
    }, ANALYZE_MS);
  }, [canSubmit, idea, goals]);

  const reset = useCallback(() => {
    if (analyzeTimeout.current !== null) {
      window.clearTimeout(analyzeTimeout.current);
      analyzeTimeout.current = null;
    }
    if (phraseInterval.current !== null) {
      window.clearInterval(phraseInterval.current);
      phraseInterval.current = null;
    }

    setIdea('');
    setGoals([]);
    setResult(null);
    setActiveIndex(0);
    setPhase('input');

    try {
      window.history.replaceState(
        null,
        '',
        window.location.pathname,
      );
    } catch {
      /* ignore */
    }

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl/Cmd + Enter → submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  /* ───────────────────────────────────────────────────────
     Render
     ─────────────────────────────────────────────────────── */

  return (
    <section
      id="idea-to-real"
      className="i2r section"
      aria-labelledby="i2r-title"
    >
      <div className="container">
        {/* ═══ Head ═══ */}
        <div className="i2r-head reveal">
          <span className="i2r-eyebrow">
            IDEA <span aria-hidden="true">→</span> REAL
          </span>

          <h2 id="i2r-title" className="i2r-title">
            یک ایده داری؟{' '}
            <em>بذار مسیرش رو نشونت بدم.</em>
          </h2>

          <p className="i2r-lead">
            چند خط از ایده‌ات بنویس، هدفش رو انتخاب کن، و
            در چند ثانیه مسیر پیشنهادی رو ببین.
          </p>
        </div>

        {/* ═══ Card ═══ */}
        <div className="i2r-card reveal" data-phase={phase}>
          {/* ── INPUT ── */}
          {phase === 'input' && (
            <div className="i2r-panel" key="input">
              <div className="i2r-field">
                <label className="i2r-label" htmlFor="i2r-idea">
                  ایده‌ات را بنویس
                  <span className="i2r-required" aria-hidden="true">
                    *
                  </span>
                </label>

                <textarea
                  id="i2r-idea"
                  ref={textareaRef}
                  className="i2r-textarea"
                  value={idea}
                  onChange={(e) =>
                    setIdea(
                      e.target.value.slice(0, MAX_IDEA_LENGTH),
                    )
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="مثلاً: می‌خوام یه رستوران خانوادگی داشته باشم که بتونه آنلاین سفارش بگیره و مشتری‌ها منو رو ببینن..."
                  dir="rtl"
                  rows={5}
                  maxLength={MAX_IDEA_LENGTH}
                />

                <div className="i2r-examples">
                  <span className="i2r-examples-label">
                    یا یکی از این‌ها:
                  </span>
                  {EXAMPLES.map((example) => (
                    <button
                      key={example}
                      type="button"
                      className="i2r-example-chip"
                      onClick={() => useExample(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <fieldset className="i2r-field i2r-fieldset">
                <legend className="i2r-label">
                  هدف اصلی‌ات چیه؟
                  <span className="i2r-required" aria-hidden="true">
                    *
                  </span>
                  <span className="i2r-hint">
                    (چند تا هم می‌تونی انتخاب کنی)
                  </span>
                </legend>

                <div className="i2r-goals">
                  {GOALS.map((goal) => {
                    const active = goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        className={`i2r-goal-chip${
                          active ? ' is-active' : ''
                        }`}
                        onClick={() => toggleGoal(goal.id)}
                        aria-pressed={active}
                      >
                        <span
                          className="i2r-goal-dot"
                          aria-hidden="true"
                        />
                        {goal.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="i2r-actions">
                <p className="i2r-actions-hint">
                  <kbd>Ctrl</kbd> + <kbd>Enter</kbd> برای ارسال
                </p>
                <button
                  type="button"
                  className="i2r-submit"
                  onClick={submit}
                  disabled={!canSubmit}
                >
                  <span>ببین مسیر چیه</span>
                  <span aria-hidden="true">←</span>
                </button>
              </div>
            </div>
          )}

          {/* ── ANALYZING ── */}
          {phase === 'analyzing' && (
            <div
              className="i2r-panel i2r-panel--analyzing"
              key="analyzing"
              role="status"
              aria-live="polite"
            >
              {/* Skeleton path */}
              <div className="i2r-skeleton-path" aria-hidden="true">
                <span className="i2r-skeleton-station" />
                <span className="i2r-skeleton-line" />
                <span className="i2r-skeleton-station" />
                <span className="i2r-skeleton-line" />
                <span className="i2r-skeleton-station" />
              </div>

              <div className="i2r-analyzing">
                <span
                  className="i2r-analyzing-text"
                  key={loadingPhraseIndex}
                >
                  {LOADING_PHRASES[loadingPhraseIndex]}
                </span>
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && result && (
            <div className="i2r-panel" key="result">
              {/* Result head */}
              <div className="i2r-result-head">
                <span className="i2r-result-eyebrow">
                  PROPOSED PATH
                </span>

                <h3 className="i2r-result-title">
                  {result.domain.id !== 'general' ? (
                    <>
                      ایده‌ات رو در حوزه‌ی{' '}
                      <em>«{result.domain.label}»</em>{' '}
                      تشخیص دادم. این مسیر رو پیشنهاد
                      می‌کنم:
                    </>
                  ) : (
                    <>این مسیر رو برات پیشنهاد می‌کنم:</>
                  )}
                </h3>

                {result.matchedKeywords.length > 0 && (
                  <p className="i2r-result-meta">
                    {toPersian(result.matchedKeywords.length)}{' '}
                    کلمه‌ی کلیدی مطبوق:{' '}
                    <span dir="rtl">
                      {result.matchedKeywords
                        .slice(0, 3)
                        .join(' · ')}
                    </span>
                  </p>
                )}
              </div>

              {/* Path */}
              <ol
                className="i2r-path"
                role="list"
                style={
                  {
                    '--i2r-progress': `${progressPercent}%`,
                    '--i2r-count': result.services.length,
                  } as React.CSSProperties
                }
              >
                {/* Fill line */}
                <span
                  className="i2r-path-fill"
                  aria-hidden="true"
                />

                {result.services.map((serviceId, index) => {
                  const service = SERVICES[serviceId];
                  const isActive = activeIndex === index;

                  return (
                    <li
                      key={serviceId}
                      className={`i2r-station${
                        isActive ? ' is-active' : ''
                      }`}
                      style={
                        {
                          '--i2r-i': index,
                        } as React.CSSProperties
                      }
                    >
                      <button
                        type="button"
                        className="i2r-station-btn"
                        onClick={() => setActiveIndex(index)}
                        aria-pressed={isActive}
                        aria-label={`${service.title} — ${
                          isActive ? 'فعال' : 'انتخاب'
                        }`}
                      >
                        <span
                          className="i2r-station-num"
                          aria-hidden="true"
                        >
                          {toPersian(
                            String(index + 1).padStart(2, '0'),
                          )}
                        </span>
                        <span
                          className="i2r-station-dot"
                          aria-hidden="true"
                        />
                        <span
                          className="i2r-station-code"
                          dir="ltr"
                        >
                          {service.code}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* Detail panel */}
              <div
                className="i2r-detail"
                aria-live="polite"
              >
                <DetailPanel
                  key={result.services[activeIndex]}
                  serviceId={result.services[activeIndex]}
                  reasons={
                    result.reasons[result.services[activeIndex]]
                  }
                />
              </div>

              {/* Actions */}
              <div className="i2r-result-actions">
                <a href="/order" className="i2r-cta-primary">
                  <span>شروع پروژه</span>
                  <span aria-hidden="true">←</span>
                </a>
                <button
                  type="button"
                  className="i2r-cta-secondary"
                  onClick={reset}
                >
                  ایده‌ی دیگری امتحان کن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────
   DetailPanel — shows the active station's details
   ─────────────────────────────────────────────────────────── */

type DetailPanelProps = {
  serviceId: ServiceId;
  reasons: readonly string[];
};

function DetailPanel({ serviceId, reasons }: DetailPanelProps) {
  const service = SERVICES[serviceId];

  return (
    <div className="i2r-detail-inner">
      <span className="i2r-detail-code" dir="ltr">
        {service.code}
      </span>

      <h4 className="i2r-detail-title">{service.title}</h4>

      <p className="i2r-detail-desc">{service.description}</p>

      {reasons.length > 0 && (
        <div className="i2r-detail-reasons">
          <span className="i2r-detail-reasons-label">
            چرا این؟
          </span>
          <ul className="i2r-detail-reasons-list">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}