"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { dispatchSensoryResult } from "@/components/SensoryFeedback";

/* ═══════════════════════════════════════════════════════════
   ORDER FORM — v4 · 2026 Redesign
   ------------------------------------------------------------
   - Mobile: 3-step wizard, non-clickable progress indicators
   - Desktop: single-page with 2-column grids
   - User only advances via "Next" button
   - Clean validation, auto-save draft, full a11y
   ═══════════════════════════════════════════════════════════ */

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  businessName: string;
  personalProject: boolean;
  projectTypes: string[];
  description: string;
  contactPreference: string;
  website: string;
};

type Touched = Partial<Record<keyof FormState, boolean>> & {
  projectTypes?: boolean;
};

type FieldState = "idle" | "error" | "success";

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  businessName: "",
  personalProject: false,
  projectTypes: [],
  description: "",
  contactPreference: "sms",
  website: "",
};

const DRAFT_KEY = "oform-draft-v4";
const MAX_DESC = 5000;
const NEAR_DESC = 4500;

const PROJECT_TYPES = [
  { value: "web-custom", label: "وب‌سایت اختصاصی" },
  { value: "web-ai", label: "وب + AI" },
  { value: "banner-ai", label: "بنر و تصاویر" },
  { value: "video-ai", label: "ویدیوی تبلیغاتی" },
  { value: "combined", label: "چند خدمت با هم" },
  { value: "other", label: "چیز دیگه" },
];

const CONTACT_METHODS = [
  { value: "sms", label: "پیامک" },
  { value: "rubika", label: "روبیکا" },
  { value: "eitaa", label: "ایتا" },
];

const STEPS = [
  {
    id: "contact",
    num: "01",
    title: "درباره‌ی تو",
    subtitle: "چند کلمه از خودت بگو.",
  },
  {
    id: "project",
    num: "02",
    title: "درباره‌ی پروژه",
    subtitle: "می‌خوای چه چیزی بسازیم؟",
  },
  {
    id: "submit",
    num: "03",
    title: "روش تماس",
    subtitle: "چطور جوابت رو بدم؟",
  },
] as const;

/* ─────────── Helpers ─────────── */

function normalizeDigits(v: string): string {
  return v.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

function isValidPhone(v: string): boolean {
  const normalized = normalizeDigits(v).replace(/\D/g, "");
  return normalized.length >= 10 && normalized.length <= 15;
}

function isValidEmail(v: string): boolean {
  if (!v.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidName(v: string): boolean {
  return v.trim().length >= 2;
}

function isValidBusiness(v: string): boolean {
  return v.trim().length >= 2;
}

function isValidDescription(v: string): boolean {
  return v.trim().length >= 20;
}

/* ─────────── Icons ─────────── */

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════ */

export default function OrderForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [touched, setTouched] = useState<Touched>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const firstInputRef = useRef<HTMLInputElement>(null);

  /* ─── Detect mobile ─── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 720px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ─── Load draft ─── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setForm({ ...INITIAL, ...parsed });
      setHasDraft(true);
    } catch {
      /* ignore */
    }
  }, []);

  /* ─── Auto-save draft ─── */
  useEffect(() => {
    if (status !== "idle") return;
    try {
      const hasContent = Object.entries(form).some(([k, v]) => {
        if (k === "contactPreference" || k === "website") return false;
        if (k === "personalProject") return v === true;
        if (k === "projectTypes") return (v as string[]).length > 0;
        return typeof v === "string" && v.trim() !== "";
      });
      if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form, status]);

  /* ─── Field state ─── */
  const fieldState = (field: keyof FormState): FieldState => {
    if (!touched[field]) return "idle";
    switch (field) {
      case "firstName":
        return isValidName(form.firstName) ? "success" : "error";
      case "lastName":
        if (!form.lastName.trim()) return "idle";
        return isValidName(form.lastName) ? "success" : "error";
      case "phone":
        return isValidPhone(form.phone) ? "success" : "error";
      case "email":
        return isValidEmail(form.email) ? "success" : "error";
      case "businessName":
        if (form.personalProject) return "idle";
        return isValidBusiness(form.businessName) ? "success" : "error";
      case "description":
        return isValidDescription(form.description) ? "success" : "error";
      default:
        return "idle";
    }
  };

  /* ─── Step validity ─── */
  const isStepValid = (s: number): boolean => {
    if (s === 0) {
      return (
        isValidName(form.firstName) &&
        isValidPhone(form.phone) &&
        isValidEmail(form.email)
      );
    }
    if (s === 1) {
      const bizOk = form.personalProject || isValidBusiness(form.businessName);
      return (
        bizOk &&
        form.projectTypes.length > 0 &&
        isValidDescription(form.description)
      );
    }
    return !!form.contactPreference;
  };

  /* ─── Progress ─── */
  const progress = useMemo(() => {
    let filled = 0;
    const total = 6;
    if (isValidName(form.firstName)) filled += 1;
    if (isValidPhone(form.phone)) filled += 1;
    if (form.personalProject || isValidBusiness(form.businessName)) filled += 1;
    if (form.projectTypes.length > 0) filled += 1;
    if (isValidDescription(form.description)) filled += 1;
    if (form.contactPreference) filled += 1;
    return Math.round((filled / total) * 100);
  }, [form]);

  /* ─── Reset error on change ─── */
  useEffect(() => {
    if (globalError) setGlobalError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  /* ─── Focus first field on step change (mobile) ─── */
  useEffect(() => {
    if (!isMobile) return;
    const t = window.setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>(
        ".oform-step input:not([type='checkbox']):not([type='radio'])"
      );
      if (el) el.focus({ preventScroll: true });
    }, 250);
    return () => window.clearTimeout(t);
  }, [step, isMobile]);

  /* ─── Update ─── */
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((c) => ({ ...c, [k]: v }));
  };

  const markTouched = (k: keyof FormState) => {
    setTouched((c) => ({ ...c, [k]: true }));
  };

  const toggleProjectType = (v: string) => {
    setForm((c) => {
      const exists = c.projectTypes.includes(v);
      return {
        ...c,
        projectTypes: exists
          ? c.projectTypes.filter((x) => x !== v)
          : [...c.projectTypes, v],
      };
    });
    setTouched((c) => ({ ...c, projectTypes: true }));
  };

  /* ─── Step nav — only forward via button ─── */
  const goNext = () => {
    if (!isStepValid(step)) {
      if (step === 0) {
        setTouched((c) => ({
          ...c,
          firstName: true,
          phone: true,
          email: true,
        }));
      } else if (step === 1) {
        setTouched((c) => ({
          ...c,
          businessName: true,
          description: true,
          projectTypes: true,
        }));
      }
      /* Scroll to first error */
      window.setTimeout(() => {
        const errorEl = document.querySelector<HTMLElement>(
          ".oform-field[data-state='error']"
        );
        if (errorEl) {
          const rect = errorEl.getBoundingClientRect();
          window.scrollTo({
            top: window.scrollY + rect.top - 120,
            behavior: "smooth",
          });
          errorEl.querySelector<HTMLElement>("input, textarea")?.focus({
            preventScroll: true,
          });
        }
      }, 60);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  /* ─── Submit ─── */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    setGlobalError("");

    /* Honeypot */
    if (form.website.trim()) {
      finishSuccess();
      return;
    }

    /* Full validation */
    setTouched({
      firstName: true,
      phone: true,
      email: true,
      businessName: true,
      description: true,
      projectTypes: true,
    });

    if (!isValidName(form.firstName)) {
      if (isMobile) setStep(0);
      setGlobalError("اسمت رو بنویس تا بدونم با کی صحبت می‌کنم.");
      return;
    }
    if (!isValidPhone(form.phone)) {
      if (isMobile) setStep(0);
      setGlobalError("شماره موبایل معتبر وارد کن.");
      return;
    }
    if (!isValidEmail(form.email)) {
      if (isMobile) setStep(0);
      setGlobalError("ایمیل معتبر وارد کن یا فیلد رو خالی بگذار.");
      return;
    }
    if (!form.personalProject && !isValidBusiness(form.businessName)) {
      if (isMobile) setStep(1);
      setGlobalError("نام کسب‌وکار رو بنویس یا «پروژه شخصی» رو تیک بزن.");
      return;
    }
    if (form.projectTypes.length === 0) {
      if (isMobile) setStep(1);
      setGlobalError("حداقل یک نوع پروژه انتخاب کن.");
      return;
    }
    if (!isValidDescription(form.description)) {
      if (isMobile) setStep(1);
      setGlobalError("چند خط درباره‌ی پروژه بنویس.");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: normalizeDigits(form.phone.trim()),
          email: form.email.trim(),
          businessName: form.businessName.trim(),
          personalProject: form.personalProject,
          projectTypes: form.projectTypes,
          description: form.description.trim(),
          contactPreference: form.contactPreference,
          website: form.website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setGlobalError(
          data.message || "ارسال نشد. یک بار دیگه امتحان کن."
        );
        dispatchSensoryResult("error");
        return;
      }

      finishSuccess();
    } catch {
      setStatus("error");
      setGlobalError("اتصال برقرار نشد. اینترنتت رو چک کن.");
      dispatchSensoryResult("error");
    }
  };

  const finishSuccess = () => {
    setStatus("success");
    setForm(INITIAL);
    setTouched({});
    setStep(0);
    setHasDraft(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    dispatchSensoryResult("success");
  };

  const clearDraft = () => {
    setForm(INITIAL);
    setTouched({});
    setStep(0);
    setHasDraft(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  };

  /* ═══════════════════════════════════════════════════════
     SUCCESS STATE
     ═══════════════════════════════════════════════════════ */
  if (status === "success") {
    return (
      <div className="oform oform--success" role="status">
        <div className="oform-success-card">
          <div className="oform-success-icon" aria-hidden="true">
            <CheckIcon />
          </div>
          <span className="oform-success-eyebrow">درخواست دریافت شد</span>
          <h2 className="oform-success-title">ممنون — پیامت رسید.</h2>
          <p className="oform-success-text">
            حداکثر ۲۴ ساعت دیگه از طریق روشی که انتخاب کردی باهات تماس
            می‌گیرم.
          </p>
          <div className="oform-success-actions">
            <Link href="/" className="oform-btn oform-btn--primary">
              بازگشت به خانه
              <ArrowLeft />
            </Link>
            <button
              type="button"
              className="oform-btn oform-btn--ghost"
              onClick={() => setStatus("idle")}
            >
              ارسال درخواست جدید
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     FIELD RENDERER
     ═══════════════════════════════════════════════════════ */
  const renderField = (
    name: keyof FormState,
    label: string,
    opts: {
      required?: boolean;
      type?: string;
      placeholder?: string;
      dir?: "ltr" | "rtl";
      inputMode?: "text" | "tel" | "email";
      autoComplete?: string;
      maxLength?: number;
      enterKeyHint?: "next" | "done" | "send";
      optionalHint?: string;
    } = {}
  ) => {
    const state = fieldState(name);
    const value = form[name] as string;
    return (
      <div className="oform-field" data-state={state}>
        <label className="oform-label" htmlFor={`of-${name}`}>
          <span className="oform-label-text">{label}</span>
          {opts.required && (
            <span className="oform-req" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="oform-input-wrap">
          <input
            id={`of-${name}`}
            ref={name === "firstName" ? firstInputRef : undefined}
            type={opts.type || "text"}
            value={value}
            onChange={(e) =>
              set(name, e.target.value as FormState[typeof name])
            }
            onBlur={() => markTouched(name)}
            placeholder={opts.placeholder}
            dir={opts.dir || "rtl"}
            inputMode={opts.inputMode}
            autoComplete={opts.autoComplete}
            maxLength={opts.maxLength}
            enterKeyHint={opts.enterKeyHint}
            aria-invalid={state === "error"}
            aria-required={opts.required}
          />
          {state !== "idle" && (
            <span className="oform-icon" aria-hidden="true">
              {state === "success" ? <CheckIcon /> : <XIcon />}
            </span>
          )}
        </div>
        {opts.optionalHint && state === "idle" && (
          <p className="oform-hint">{opts.optionalHint}</p>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════
     STEP CONTENT
     ═══════════════════════════════════════════════════════ */
  const renderStepContent = (stepIndex: number) => {
    if (stepIndex === 0) {
      return (
        <div className="oform-step-body">
          <div className="oform-fields-2">
            {renderField("firstName", "نام", {
              required: true,
              placeholder: "علی",
              autoComplete: "given-name",
              inputMode: "text",
              enterKeyHint: "next",
              maxLength: 80,
            })}
            {renderField("lastName", "نام خانوادگی", {
              placeholder: "رضایی",
              autoComplete: "family-name",
              inputMode: "text",
              enterKeyHint: "next",
              maxLength: 80,
            })}
            {renderField("phone", "شماره موبایل", {
              required: true,
              type: "tel",
              placeholder: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
              dir: "ltr",
              inputMode: "tel",
              autoComplete: "tel",
              enterKeyHint: "next",
              maxLength: 40,
            })}
            {renderField("email", "ایمیل", {
              type: "email",
              placeholder: "you@example.com",
              dir: "ltr",
              inputMode: "email",
              autoComplete: "email",
              enterKeyHint: "next",
              maxLength: 160,
              optionalHint:
                "اختیاری — اگر ترجیح می‌دی از این راه جواب بگیری.",
            })}
          </div>
        </div>
      );
    }

    if (stepIndex === 1) {
      const bizState = form.personalProject
        ? "idle"
        : fieldState("businessName");
      const descState = fieldState("description");
      const descLen = form.description.length;
      const counterClass =
        descLen > MAX_DESC
          ? "is-over"
          : descLen > NEAR_DESC
          ? "is-near"
          : "";

      return (
        <div className="oform-step-body">
          <div className="oform-field" data-state={bizState}>
            <label className="oform-label" htmlFor="of-businessName">
              <span className="oform-label-text">نام کسب‌وکار</span>
              {!form.personalProject && (
                <span className="oform-req" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            <div className="oform-input-wrap">
              <input
                id="of-businessName"
                type="text"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                onBlur={() => markTouched("businessName")}
                disabled={form.personalProject}
                placeholder="کافه نیلا، آموزشگاه ویرا، ..."
                maxLength={160}
                enterKeyHint="next"
                aria-invalid={bizState === "error"}
              />
              {bizState !== "idle" && (
                <span className="oform-icon" aria-hidden="true">
                  {bizState === "success" ? <CheckIcon /> : <XIcon />}
                </span>
              )}
            </div>
          </div>

          <label className="oform-check">
            <input
              type="checkbox"
              checked={form.personalProject}
              onChange={(e) => set("personalProject", e.target.checked)}
            />
            <span className="oform-check-box" aria-hidden="true">
              <CheckIcon />
            </span>
            <span className="oform-check-label">
              این یک پروژه‌ی شخصیه، نه کسب‌وکار
            </span>
          </label>

          <fieldset className="oform-fieldset">
            <legend className="oform-label">
              <span className="oform-label-text">
                چه نوع پروژه‌ای داری؟
              </span>
              <span className="oform-req" aria-hidden="true">
                *
              </span>
            </legend>
            <p className="oform-hint">می‌تونی چند تا رو با هم انتخاب کنی.</p>
            <div className="oform-options">
              {PROJECT_TYPES.map((t) => {
                const active = form.projectTypes.includes(t.value);
                return (
                  <label
                    key={t.value}
                    className={`oform-option${active ? " is-active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleProjectType(t.value)}
                    />
                    <span className="oform-option-check" aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <span className="oform-option-label">{t.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="oform-field" data-state={descState}>
            <label className="oform-label" htmlFor="of-description">
              <span className="oform-label-text">توضیحات پروژه</span>
              <span className="oform-req" aria-hidden="true">
                *
              </span>
            </label>
            <div className="oform-input-wrap">
              <textarea
                id="of-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                onBlur={() => markTouched("description")}
                rows={6}
                maxLength={MAX_DESC}
                placeholder="مثلاً: می‌خوام یه فروشگاه آنلاین برای لباس زنانه بسازم. حدود ۵۰ محصول دارم، رنگ و سایز مهمه..."
                aria-invalid={descState === "error"}
              />
              {descState !== "idle" && (
                <span
                  className="oform-icon oform-icon--top"
                  aria-hidden="true"
                >
                  {descState === "success" ? <CheckIcon /> : <XIcon />}
                </span>
              )}
            </div>
            <div className="oform-meta-row">
              <span className="oform-hint">
                حتی چند خط کافیه — لازم نیست کامل باشه.
              </span>
              {descLen > 0 && (
                <span className={`oform-counter ${counterClass}`}>
                  {descLen.toLocaleString("fa-IR")} /{" "}
                  {MAX_DESC.toLocaleString("fa-IR")}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    /* Step 3 — contact method */
    return (
      <div className="oform-step-body">
        <fieldset className="oform-fieldset">
          <legend className="oform-label">
            <span className="oform-label-text">روش تماس ترجیحی</span>
          </legend>
          <p className="oform-hint">
            از کدام راه راحت‌تری جواب بگیری؟
          </p>
          <div className="oform-contacts">
            {CONTACT_METHODS.map((m) => {
              const active = form.contactPreference === m.value;
              return (
                <label
                  key={m.value}
                  className={`oform-contact${active ? " is-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="contactPreference"
                    value={m.value}
                    checked={active}
                    onChange={() => set("contactPreference", m.value)}
                  />
                  <span
                    className="oform-contact-radio"
                    aria-hidden="true"
                  />
                  <span className="oform-contact-label">{m.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="oform-summary" aria-hidden="true">
          <span className="oform-summary-title">خلاصه‌ی درخواست</span>
          <ul className="oform-summary-list">
            <li>
              <span>نام</span>
              <strong>
                {form.firstName} {form.lastName}
              </strong>
            </li>
            <li>
              <span>موبایل</span>
              <strong dir="ltr">{form.phone}</strong>
            </li>
            {form.email && (
              <li>
                <span>ایمیل</span>
                <strong dir="ltr">{form.email}</strong>
              </li>
            )}
            <li>
              <span>کسب‌وکار</span>
              <strong>
                {form.personalProject
                  ? "پروژه‌ی شخصی"
                  : form.businessName}
              </strong>
            </li>
            <li>
              <span>نوع پروژه</span>
              <strong>
                {form.projectTypes.length > 0
                  ? `${form.projectTypes.length} مورد`
                  : "—"}
              </strong>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  const isLast = step === STEPS.length - 1;

  return (
    <form
      className="oform"
      data-view={isMobile ? "steps" : "page"}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* ─── Top progress ─── */}
      <div className="oform-progress">
        <div className="oform-progress-track" aria-hidden="true">
          <div
            className="oform-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isMobile ? (
          <div
            className="oform-progress-steps"
            role="list"
            aria-label="مراحل فرم"
          >
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                role="listitem"
                className={`oform-step-pill${
                  i === step ? " is-active" : i < step ? " is-done" : ""
                }`}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="oform-step-pill-num">
                  {i < step ? "✓" : s.num}
                </span>
                <span className="oform-step-pill-title">{s.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="oform-progress-meta">
            <span className="oform-progress-badge">
              {Math.round(progress)}
              <span className="oform-progress-badge-unit">٪</span>
            </span>
            <span className="oform-progress-label">
              {progress >= 100 ? "آماده‌ی ارسال" : "در حال تکمیل"}
            </span>
          </div>
        )}
      </div>

      {/* ─── Draft notice ─── */}
      {hasDraft && status === "idle" && (
        <div className="oform-draft" role="status">
          <span className="oform-draft-text">
            پیش‌نویس قبلی بازیابی شد
          </span>
          <button
            type="button"
            className="oform-draft-clear"
            onClick={clearDraft}
          >
            پاک کن
          </button>
        </div>
      )}

      {/* ─── Content ─── */}
      {isMobile ? (
        <div className="oform-steps">
          <div className="oform-step" key={step}>
            <header className="oform-step-head">
              <span className="oform-step-num">{STEPS[step].num}</span>
              <div className="oform-step-head-text">
                <h2 className="oform-step-title">{STEPS[step].title}</h2>
                <p className="oform-step-subtitle">
                  {STEPS[step].subtitle}
                </p>
              </div>
            </header>

            {renderStepContent(step)}
          </div>
        </div>
      ) : (
        <div className="oform-page">
          {STEPS.map((s, i) => (
            <section className="oform-section" key={s.id}>
              <header className="oform-section-head">
                <span className="oform-step-num">{s.num}</span>
                <div className="oform-step-head-text">
                  <h2 className="oform-step-title">{s.title}</h2>
                  <p className="oform-step-subtitle">{s.subtitle}</p>
                </div>
              </header>
              {renderStepContent(i)}
            </section>
          ))}
        </div>
      )}

      {/* ─── Global error ─── */}
      {globalError && (
        <div className="oform-error" role="alert">
          <span className="oform-error-icon" aria-hidden="true">
            <XIcon />
          </span>
          <span>{globalError}</span>
        </div>
      )}

      {/* ─── Honeypot ─── */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="oform-honeypot"
      />

      {/* ─── Actions ─── */}
      {isMobile ? (
        <div className="oform-actions oform-actions--sticky">
          {step > 0 && (
            <button
              type="button"
              className="oform-btn oform-btn--ghost"
              onClick={goPrev}
              aria-label="مرحله‌ی قبلی"
            >
              <ArrowRight />
              قبلی
            </button>
          )}

          {isLast ? (
            <button
              type="submit"
              className="oform-btn oform-btn--primary"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "داره ارسال می‌شه..."
                : "ارسال درخواست"}
              <ArrowLeft />
            </button>
          ) : (
            <button
              type="button"
              className="oform-btn oform-btn--primary"
              onClick={goNext}
            >
              بعدی
              <ArrowLeft />
            </button>
          )}
        </div>
      ) : (
        <div className="oform-actions oform-actions--desktop">
          <p className="oform-actions-note">
            بعد از ارسال، حداکثر ۲۴ ساعت دیگه جواب می‌گیری.
          </p>
          <button
            type="submit"
            className="oform-btn oform-btn--primary oform-btn--lg"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "داره ارسال می‌شه..."
              : "ارسال درخواست"}
            <ArrowLeft />
          </button>
        </div>
      )}
    </form>
  );
}