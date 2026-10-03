"use client";

/* ═══════════════════════════════════════════════════════════
   IDEA → REAL
   ────────────────────────────────────────────────────────────
   بازدیدکننده یک ایدهی خام مینویسد و هدفش را انتخاب میکند.
   سایت در چند ثانیه نشان میدهد که آن ایده چطور میتواند به
   یک محصول دیجیتال واقعی تبدیل شود.

   سه فاز:
     1. input       — فرم ورودی
     2. analyzing   — ۹۰۰ms، نشانگر ظریف
     3. result      — مسیر پیشنهادی + CTA

   کل قابلیت با حذف این کامپوننت + پوشه، به طور کامل برمیگردد.
   ═══════════════════════════════════════════════════════════ */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

import {
  GOALS,
  SERVICES,
  type GoalId,
  type ServiceId,
} from './data';
import { decide } from './DecisionEngine';
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

const STORAGE_KEY = 'i2r-state-v1';
const ANALYZE_MS = 900;
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
  const [services, setServices] = useState<readonly ServiceId[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  /* ─── Mount guard ─── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ─── Restore from sessionStorage ─── */
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;

      const data = parsed as { idea?: unknown; goals?: unknown };

      if (typeof data.idea === 'string') {
        setIdea(data.idea.slice(0, MAX_IDEA_LENGTH));
      }

      if (Array.isArray(data.goals)) {
        const valid = data.goals.filter(
          (g): g is GoalId =>
            typeof g === 'string' &&
            GOALS.some((goal) => goal.id === g),
        );
        setGoals(valid);
      }
    } catch {
      /* ignore */
    }
  }, [mounted]);

  /* ─── Persist to sessionStorage ─── */
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ idea, goals }),
      );
    } catch {
      /* ignore */
    }
  }, [mounted, idea, goals]);

  /* ─── Cleanup pending timeout ─── */
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  /* ─── Derived ─── */
  const canSubmit =
    idea.trim().length >= MIN_IDEA_LENGTH && goals.length > 0;

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

    timeoutRef.current = window.setTimeout(() => {
      const result = decide(idea, goals);
      setServices(result);
      setPhase('result');
      timeoutRef.current = null;
    }, ANALYZE_MS);
  }, [canSubmit, idea, goals]);

  const reset = useCallback(() => {
    setIdea('');
    setGoals([]);
    setServices([]);
    setPhase('input');

    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, []);

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
          <span className="i2r-eyebrow">IDEA → REAL</span>

          <h2 id="i2r-title" className="i2r-title">
            یک ایده داری؟{' '}
            <em>بذار مسیرش رو نشونت بدم.</em>
          </h2>

          <p className="i2r-lead">
            چند خط از ایدهات بنویس و هدفش رو انتخاب کن. بر اساس
            اون، مسیر پیشنهادی رو میبینی.
          </p>
        </div>

        {/* ═══ Card ═══ */}
        <div
          className="i2r-card reveal"
          data-phase={phase}
        >
          {/* ── Phase 1: Input ── */}
          {phase === 'input' && (
            <div className="i2r-panel i2r-panel--input" key="input">
              {/* Idea field */}
              <div className="i2r-field">
                <label className="i2r-label" htmlFor="i2r-idea">
                  ایدهات را بنویس
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
                    setIdea(e.target.value.slice(0, MAX_IDEA_LENGTH))
                  }
                  placeholder="مثلاً: یک سایت حرفهای برای رستوران خانوادگیمون میخوام که مشتریها بتونن آنلاین منو ببینن و رزرو کنن..."
                  dir="rtl"
                  rows={5}
                  maxLength={MAX_IDEA_LENGTH}
                />

                {/* Examples */}
                <div className="i2r-examples">
                  <span className="i2r-examples-label">مثال:</span>

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

              {/* Goals */}
              <fieldset className="i2r-field i2r-fieldset">
                <legend className="i2r-label">
                  هدف اصلیات چیست؟
                  <span className="i2r-required" aria-hidden="true">
                    *
                  </span>
                  <span className="i2r-hint">
                    (چند تا هم میتونی انتخاب کنی)
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

              {/* Submit */}
              <div className="i2r-actions">
                <button
                  type="button"
                  className="i2r-submit"
                  onClick={submit}
                  disabled={!canSubmit}
                >
                  <span>ادامه</span>
                  <span aria-hidden="true">←</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Phase 2: Analyzing ── */}
          {phase === 'analyzing' && (
            <div
              className="i2r-panel i2r-panel--analyzing"
              key="analyzing"
              role="status"
              aria-live="polite"
            >
              <div className="i2r-analyzing">
                <span className="i2r-analyzing-label">
                  در حال تحلیل ایدهات
                </span>

                <span
                  className="i2r-analyzing-dots"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          )}

          {/* ── Phase 3: Result ── */}
          {phase === 'result' && (
            <div className="i2r-panel i2r-panel--result" key="result">
              <div className="i2r-result-head">
                <span className="i2r-result-eyebrow">
                  PROPOSED PATH
                </span>
                <h3 className="i2r-result-title">
                  برای چنین پروژهای، این مسیر را پیشنهاد میکنم.
                </h3>
              </div>

              <ol className="i2r-result-list">
                {services.map((id, index) => {
                  const service = SERVICES[id];

                  return (
                    <li
                      key={id}
                      className="i2r-result-item"
                      style={{ '--i2r-i': index } as CSSProperties}
                    >
                      <span className="i2r-result-num">
                        {toPersian(
                          String(index + 1).padStart(2, '0'),
                        )}
                      </span>

                      <span
                        className="i2r-result-code"
                        dir="ltr"
                      >
                        {service.code}
                      </span>

                      <div className="i2r-result-body">
                        <h4 className="i2r-result-item-title">
                          {service.title}
                        </h4>
                        <p className="i2r-result-desc">
                          {service.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="i2r-result-actions">
                <a
                  href="/order"
                  className="i2r-cta-primary"
                >
                  <span>شروع پروژه</span>
                  <span aria-hidden="true">←</span>
                </a>

                <button
                  type="button"
                  className="i2r-cta-secondary"
                  onClick={reset}
                >
                  ایدهی دیگری امتحان کن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}