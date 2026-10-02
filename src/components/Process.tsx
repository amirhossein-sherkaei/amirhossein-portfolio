import SectionNumber from "@/components/SectionNumber";

const steps = [
  {
    num: "01",
    title: "گفت‌وگو و کشف",
    short: "Discovery",
    description:
      "اول از همه حرف می‌زنیم. هدف، مخاطب، رقبا و انتظاراتت را می‌شنوم. بدون این مرحله، طراحی فقط حدس زدنه.",
    details: [
      "جلسه‌ی ۳۰ دقیقه‌ای رایگان",
      "تحلیل نیاز و رقبا",
      "تعیین محدوده و بودجه",
    ],
  },
  {
    num: "02",
    title: "طراحی و ساختار",
    short: "Design",
    description:
      "بر اساس گفت‌وگو، ساختار سایت، جریان کاربر و طراحی بصری را می‌سازم. اینجاست که ایده شکل می‌گیرد.",
    details: [
      "معماری اطلاعات و wireframe",
      "طراحی رابط کاربری اختصاصی",
      "دو مرحله‌ی بازبینی و اصلاح",
    ],
  },
  {
    num: "03",
    title: "توسعه و کد",
    short: "Development",
    description:
      "طراحی تبدیل به کد می‌شود. سرعت، دسترسی‌پذیری و استانداردهای فنی از همون ابتدا رعایت می‌شوند.",
    details: [
      "پیاده‌سازی با Next.js و React",
      "بهینه‌سازی سرعت و سئو",
      "تست روی همه‌ی دستگاه‌ها",
    ],
  },
  {
    num: "04",
    title: "تحویل و پشتیبانی",
    short: "Delivery",
    description:
      "سایت زنده می‌شود — و بعدش هم تنهات نمی‌گذارم. سه ماه پشتیبانی رایگان شامل تمام پروژه‌هاست.",
    details: [
      "انتشار روی هاست و دامنه",
      "آموزش استفاده",
      "۳ ماه پشتیبانی رایگان",
    ],
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="process-section section"
      aria-labelledby="process-title"
    >
      <div className="container">
        <div className="process-masthead reveal">
          <span className="process-masthead-left">
            CHAPTER&nbsp;·&nbsp;02&nbsp;—&nbsp;PROCESS
          </span>
          <span className="process-masthead-center" aria-hidden="true">
            ¶
          </span>
          <span className="process-masthead-right">
            FROM IDEA&nbsp;·&nbsp;TO LAUNCH
          </span>
        </div>

        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۲" label="PROCESS" />
            <h2 id="process-title">
              چهار قدم ساده
              <em className="ink-word"> تا پروژه‌ی تو.</em>
            </h2>
          </div>
          <p>
            فرآیند شفاف از اولین پیام تا تحویل نهایی. در هر مرحله
            می‌دونی کجای کاری، قدم بعدی چیه، و کِی تحویل می‌گیری.
          </p>
        </div>

        <ol className="process-grid">
          {steps.map((step, index) => (
            <li
              key={step.num}
              id={`process-step-${index + 1}`}
              className="process-step reveal"
              style={{ "--step-index": index } as React.CSSProperties}
            >
              <div className="process-step-head">
                <span className="process-step-num">{step.num}</span>
                <span className="process-step-line" aria-hidden="true" />
                <span className="process-step-short">{step.short}</span>
              </div>

              <h3 className="process-step-title">{step.title}</h3>

              <p className="process-step-desc">{step.description}</p>

              <ul className="process-step-list">
                {step.details.map((detail) => (
                  <li key={detail}>
                    <span
                      className="process-step-bullet"
                      aria-hidden="true"
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="process-footer reveal">
          <div className="process-footer-line" aria-hidden="true" />
          <p className="process-footer-text">
            <strong>میانگین زمان اجرا:</strong> لندینگ ۱ تا ۲ هفته،
            سایت شرکتی ۲ تا ۴ هفته، فروشگاه ۴ تا ۸ هفته.
          </p>
        </div>
      </div>
    </section>
  );
}