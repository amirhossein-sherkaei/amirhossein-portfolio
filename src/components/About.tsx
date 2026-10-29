import Image from "next/image";
import { projects } from "@/content/projects";
import CountUp from "@/components/CountUp";
import SectionNumber from "@/components/SectionNumber";

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date()).replace(/[^\u06F0-\u06F9]/g, "").slice(0, 4);

const skills = [ "طراحی وب", "توسعه فرانت‌اند", "رابط کاربری", "ریسپانسیو", "خلاقیت هوشمند", "تصویرسازی AI" ];

const principles = [
  { number: "۰۱", title: "طراحی، قبل از کد", text: "قبل از نوشتن یک خط کد، ساختار، جریان کاربر و اولویت‌های بصری را می‌سازم. طراحی خوب، مجموعه‌ای از تصمیم‌های آگاهانه است — نه تزئین." },
  { number: "۰۲", title: "هر عنصر، یک دلیل", text: "هر رنگ، هر فاصله، هر انیمیشن باید در خدمت محتوا و اهداف کسب‌وکار باشد. اگر عنصری دلیل مشخصی برای حضورش نداشته باشد، جایی در طراحی ندارد." },
  { number: "۰۳", title: "سرعت، بخشی از طراحی", text: "سایت کند، حتی اگر زیبا باشد، تجربه‌ی خوبی نمی‌سازد. عملکرد را از ابتدا در معماری لحاظ می‌کنم — نه به‌عنوان یک مرحله‌ی جدا در انتها." },
];

const facts = [
  { label: "نقش", value: "طراح + توسعه‌دهنده" },
  { label: "تمرکز", value: "وب · هوش مصنوعی · برند" },
  { label: "موقعیت", value: "ایران · دورکاری" },
  { label: "وضعیت", value: "آماده همکاری" },
];

const proofPoints = [
  { value: "۹۹", suffix: "/۱۰۰", label: "امتیاز تجربه‌ی کاربر واقعی", hint: "Vercel Speed Insights" },
  { value: "AAA", suffix: "", label: "کنتراست مطابق WCAG 2.2", hint: "استاندارد دسترسی‌پذیری" },
  { value: "۲۴", suffix: "ساعت", label: "زمان پاسخ به درخواست", hint: "تعهد شخصی" },
  { value: "۱۰۰", suffix: "٪", label: "کد اختصاصی به نام شما", hint: "بدون وابستگی به من" },
];

export default function About() {
  return (
    <section id="about" className="about-section section">
      <span className="about-brand-texture" aria-hidden="true">
        <Image src="/brand-texture.webp" alt="" fill sizes="100vw" style={{ objectFit: "cover", opacity: 0.035, pointerEvents: "none" }} />
      </span>

      <div className="container">
        <div className="about-identity reveal">
          <SectionNumber num="۰۴" label="ABOUT" />

          <h2 className="about-identity-title">
            <span>من امیرحسینم.</span>
            <span className="about-identity-em">طراحی می‌کنم. می‌سازم.</span>
            <span>و با هوش مصنوعی مرزها را جابه‌جا می‌کنم.</span>
          </h2>

          <div className="about-identity-rule" aria-hidden="true" />

          <p className="about-identity-sub">طراح رابط · توسعه‌دهنده فرانت‌اند · خلاق دیجیتال</p>

          <ul className="about-facts">
            {facts.map((fact) => (
              <li key={fact.label} className="about-fact">
                <span className="about-fact-label">{fact.label}</span>
                <span className="about-fact-value">{fact.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="about-grid">
          <div className="about-content reveal">
            <h2>
              طراحی برای من،
              <span> فقط ساختن یک ظاهر زیبا </span>
              <em className="ink-word">نیست.</em>
            </h2>

            <h3 id="about-title" className="about-lead">
              هدف من ساخت تجربه‌ای است که هم از نظر بصری متمایز باشد و هم واقعاً برای کاربر و کسب‌وکار کاربرد داشته باشد.
            </h3>

            <p>
              در هر پروژه، بین سه چیز تعادل می‌سازم: طراحی خلاقانه، تجربه‌ی کاربری روان، و عملکرد فنی سریع. اگر یکی از این سه ضعیف باشد، نتیجه هم ضعیف است. ابزارهای هوش مصنوعی برای من جایگزین خلاقیت نیستند — بلکه سرعت رسیدن به ایده‌های متفاوت را چند برابر می‌کنند.
            </p>

            <div className="about-skills" aria-label="مهارت‌ها">
              {skills.map((skill) => (<span key={skill}>{skill}</span>))}
            </div>
          </div>

          <aside className="about-statement reveal" aria-hidden="true">
            <span className="about-statement-mark">&ldquo;</span>
            <p className="about-statement-text">
              طراحی، برای من
              <br />
              ترکیبی از <em>سلیقه</em>،
              <br />
              <em>دقت</em> و <em>کاربرد</em> است.
            </p>
            <div className="about-statement-sign">
              <span className="about-statement-name">امیرحسین شرکائی</span>
              <span className="about-statement-latin">AMIRHOSSEIN SHORAKAEI</span>
            </div>
          </aside>
        </div>

        <div className="about-brand-showcase reveal">
          <div className="about-brand-mark" aria-hidden="true">
            <Image src="/logo.png" alt="" width={220} height={220} priority={false} />
          </div>

          <div className="about-brand-copy">
            <span className="about-brand-eyebrow">نشان برند · {CURRENT_PERSIAN_YEAR}</span>
            <h3 className="about-brand-title">
              هویت برند شما، <em>نقطه‌ی شروع</em> هر پروژه‌ست.
            </h3>
            <p className="about-brand-text">
              این مهر، ترکیبی از حروف اول نامم (AH) با ترکیب فلز و نور فیروزه‌ای است — دقیقاً همون تعادلی که در هر پروژه دنبالش هستم: ساختار محکم، جزئیات دقیق، و یک جرقه‌ی گرم که کار رو زنده می‌کنه.
            </p>
            <div className="about-brand-sig">
              <svg className="about-brand-sig-mark" viewBox="0 0 220 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 34C24 14 46 40 70 22C88 8 106 34 130 22C150 12 172 30 206 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="212" cy="16" r="2.2" fill="currentColor" />
              </svg>
              <div className="about-brand-sig-name">
                <strong>امیرحسین شرکائی</strong>
                <small>AMIRHOSSEIN SHORAKAEI</small>
              </div>
            </div>
          </div>
        </div>

        <div className="about-proof reveal" aria-label="اثبات‌های فنی">
          {proofPoints.map((point) => (
            <div key={point.label} className="about-proof-item">
              <span className="about-proof-value">
                <CountUp value={point.value} className="about-proof-count" />
                {point.suffix && (<span className="about-proof-suffix">{point.suffix}</span>)}
              </span>
              <span className="about-proof-label">{point.label}</span>
              <span className="about-proof-hint">{point.hint}</span>
            </div>
          ))}
        </div>

        <div className="about-principles reveal">
          <div className="about-principles-heading">
            <span className="eyebrow">اصول کاری</span>
          </div>
          <div className="about-principles-grid">
            {principles.map((principle) => (
              <article key={principle.number} className="about-principle">
                <span className="about-principle-number">{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}