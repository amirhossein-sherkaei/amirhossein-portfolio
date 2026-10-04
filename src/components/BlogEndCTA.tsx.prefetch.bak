import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";

export default function BlogEndCTA() {
  return (
    <section
      className="blog-funnel"
      aria-labelledby="blog-funnel-title"
    >
      <span className="blog-funnel-eyebrow">END · NEXT STEP</span>

      <h2 id="blog-funnel-title" className="blog-funnel-title">
        اگه این مقاله به کارت اومد،
        <br />
        <em>پروژه‌ت رو با هم بسازیم.</em>
      </h2>

      <p className="blog-funnel-text">
        وب‌سایت اختصاصی، طراحی از صفر، سرعت لود زیر ۲ ثانیه.
        حداکثر ۲۴ ساعت بعد از ارسال درخواست، جواب می‌گیری.
      </p>

      <div className="blog-funnel-actions">
        <MagneticButton strength={0.18} radius={75}>
          <Link
            href="/order"
            className="button button-primary button-lg"
          >
            شروع پروژه
            <span aria-hidden="true">←</span>
          </Link>
        </MagneticButton>

        <MagneticButton strength={0.12} radius={60}>
          <Link
            href="/#portfolio"
            className="button button-secondary button-lg"
          >
            دیدن نمونه‌کارها
          </Link>
        </MagneticButton>
      </div>

      <ul className="blog-funnel-trust" aria-label="تعهدها">
        <li className="blog-funnel-trust-item">
          <span className="blog-funnel-trust-value">۲۴</span>
          <span className="blog-funnel-trust-label">ساعت پاسخ</span>
        </li>
        <li className="blog-funnel-trust-item">
          <span className="blog-funnel-trust-value">۱۰۰٪</span>
          <span className="blog-funnel-trust-label">کد اختصاصی</span>
        </li>
        <li className="blog-funnel-trust-item">
          <span className="blog-funnel-trust-value">۳</span>
          <span className="blog-funnel-trust-label">ماه پشتیبانی</span>
        </li>
      </ul>
    </section>
  );
}