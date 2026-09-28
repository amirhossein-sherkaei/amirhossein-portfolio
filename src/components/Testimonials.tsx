const testimonials = [
  {
    num: "01",
    name: "آرتین",
    role: "مشتری",
    quote:
      "از همون جلسه‌ی اول متفاوت بود. دقیق گوش داد، سؤال‌های درست پرسید، و چیزی تحویل داد که واقعاً همون چیزی بود که می‌خواستم.",
  },
  {
    num: "02",
    name: "معصومه",
    role: "مشتری",
    quote:
      "توجهش به جزئیات ریز چیزی بود که من رو واقعاً متعجب کرد — چیزهایی که حتی خودم نمی‌دونستم مهمن. نتیجه از انتظارم بالاتر بود.",
  },
  {
    num: "03",
    name: "امیرمحمد",
    role: "مشتری",
    quote:
      "روند کار کاملاً شفاف بود؛ هر مرحله می‌دونستم کجای کاریم. و در پایان حس کردم یه شریک واقعی داشتم، نه فقط یه مجری.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="testimonials-section section"
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        {/* ═══════ Masthead ═══════ */}
        <div className="testimonials-masthead reveal">
          <span className="testimonials-masthead-left">
            CHAPTER&nbsp;·&nbsp;05&nbsp;—&nbsp;TESTIMONIALS
          </span>
          <span className="testimonials-masthead-center" aria-hidden="true">
            ✦
          </span>
          <span className="testimonials-masthead-right">
            FROM&nbsp;·&nbsp;CLIENTS
          </span>
        </div>

        {/* ═══════ Heading ═══════ */}
        <div className="section-heading reveal">
          <div>
            <span className="section-index">05 — TESTIMONIALS</span>
            <h2 id="testimonials-title">
              از زبان
              <em className="ink-word"> کسانی که تجربه کردن</em>
            </h2>
          </div>
          <p>
            اینا حرف کسانی‌ست که روند کار رو از نزدیک دیدن. بدون
            دست‌کاری، بدون تعارف.
          </p>
        </div>

        {/* ═══════ Grid ═══════ */}
        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <figure
              key={item.num}
              className="testimonial-card reveal"
              style={{ "--t-index": index } as React.CSSProperties}
            >
              <span className="testimonial-card-num" aria-hidden="true">
                {item.num}
              </span>

              <span className="testimonial-card-mark" aria-hidden="true">
                &ldquo;
              </span>

              <blockquote className="testimonial-card-quote">
                <p>{item.quote}</p>
              </blockquote>

              <figcaption className="testimonial-card-caption">
                <cite className="testimonial-card-name">{item.name}</cite>
                <span className="testimonial-card-role">{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* ═══════ Footer note ═══════ */}
        <div className="testimonials-footer reveal">
          <div className="testimonials-footer-line" aria-hidden="true" />
          <p className="testimonials-footer-text">
            <strong>پروژه‌ی بعدی می‌تونه مال تو باشه</strong> — اگه
            دوست داری نتیجه‌ی مشابهی بگیری،{" "}
            <a href="/order">ایده‌ات رو بفرست</a>.
          </p>
        </div>
      </div>
    </section>
  );
}