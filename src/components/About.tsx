import { projects } from "@/content/projects";

/* سال شمسی جاری — خودکار از تاریخ سیستم محاسبه می‌شود */
const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

const skills = [
  "Web Design",
  "Frontend",
  "UI / UX",
  "Responsive",
  "AI Creative",
  "AI Visual",
];

const principles = [
  {
    number: "01",
    title: "طراحی، قبل از کد",
    text: "قبل از نوشتن یک خط کد، ساختار، جریان کاربر و اولویت‌های بصری را می‌سازم. طراحی خوب، مجموعه‌ای از تصمیم‌های آگاهانه است — نه تزئین.",
  },
  {
    number: "02",
    title: "جزئیات کوچک، اثر بزرگ",
    text: "فاصله‌ها، تایمینگ انیمیشن‌ها، وزن فونت‌ها — همین ریز‌جزئیات هستند که یک سایت را از «خوب» به «حرفه‌ای» می‌برند. جایی که بقیه رد می‌شوند، من دقیق می‌شوم.",
  },
  {
    number: "03",
    title: "سرعت، بخشی از طراحی",
    text: "سایت کند، حتی اگر زیبا باشد، تجربه‌ی خوبی نمی‌سازد. عملکرد را از ابتدا در معماری لحاظ می‌کنم — نه به‌عنوان یک مرحله‌ی جدا در انتها.",
  },
];

const facts = [
  { label: "ROLE", value: "Designer + Developer" },
  { label: "FOCUS", value: "Web · AI · Brand" },
  { label: "BASE", value: "Iran · Remote" },
  { label: "STATUS", value: "آماده همکاری" },
];

const proofPoints = [
  {
    value: "۹۹",
    suffix: "/۱۰۰",
    label: "امتیاز تجربه‌ی کاربر واقعی",
    hint: "Vercel Speed Insights",
  },
  {
    value: "AAA",
    suffix: "",
    label: "کنتراست مطابق WCAG 2.2",
    hint: "استاندارد دسترسی‌پذیری",
  },
  {
    value: "۲۴",
    suffix: "ساعت",
    label: "زمان پاسخ به درخواست",
    hint: "تعهد شخصی",
  },
  {
    value: "۱۰۰",
    suffix: "٪",
    label: "کد اختصاصی به نام شما",
    hint: "بدون وابستگی به من",
  },
];

export default function About() {
  const projectCount = String(projects.length).padStart(2, "0");

  return (
    <section id="about" className="about-section section">
      <div className="container">
        <div className="about-identity reveal">
          <span className="section-index">03 — ABOUT</span>

          <h2 className="about-identity-title">
            <span>I&apos;m Amirhossein.</span>
            <span className="about-identity-em">I design. I build.</span>
            <span>I experiment with AI.</span>
          </h2>

          <div className="about-identity-rule" aria-hidden="true" />

          <p className="about-identity-sub">
            طراح رابط · توسعه‌دهنده فرانت‌اند · خلاق دیجیتال
          </p>

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
              هدف من ساخت تجربه‌ای است که هم از نظر بصری متمایز باشد
              و هم واقعاً برای کاربر و کسب‌وکار کاربرد داشته باشد.
            </h3>

            <p>
              در هر پروژه، بین سه چیز تعادل می‌سازم: طراحی خلاقانه،
              تجربه‌ی کاربری روان، و عملکرد فنی سریع. اگر یکی از این
              سه ضعیف باشد، نتیجه هم ضعیف است. ابزارهای هوش مصنوعی
              برای من جایگزین خلاقیت نیستند — بلکه سرعت رسیدن به
              ایده‌های متفاوت را چند برابر می‌کنند.
            </p>

            <div className="about-skills" aria-label="مهارت‌ها">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
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
              <span className="about-statement-latin">
                AMIRHOSSEIN SHORAKAEI
              </span>
            </div>
          </aside>
        </div>

        <div className="about-proof reveal" aria-label="اثبات‌های فنی">
          {proofPoints.map((point) => (
            <div key={point.label} className="about-proof-item">
              <span className="about-proof-value">
                {point.value}
                {point.suffix && (
                  <span className="about-proof-suffix">{point.suffix}</span>
                )}
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
                <span className="about-principle-number">
                  {principle.number}
                </span>
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