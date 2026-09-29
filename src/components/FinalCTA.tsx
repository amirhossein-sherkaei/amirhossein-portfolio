import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";

export default function FinalCTA() {
  const contactEmail = process.env.PROJECT_CONTACT_EMAIL;

  return (
    <section
      className="final-cta-section section"
      aria-labelledby="final-cta-title"
    >
      <div className="container">
        <div className="final-cta reveal">
          <div className="final-cta-content">
            <span className="section-index">09 — START A PROJECT</span>

            <h2 id="final-cta-title">
              ایده‌ای داری؟
              <br />
              <span className="ink-word">بیا بسازیمش.</span>
            </h2>

            <p>
              اگر پروژه‌ات مشخص است، همین حالا جزئیات را برایم بفرست.
              اگر هنوز در مرحله‌ی ایده هستی، همان را هم بنویس — با هم
              به یک طرح روشن می‌رسیم.
            </p>

            <div className="final-cta-actions">
              <MagneticButton strength={0.22} radius={75}>
                <Link
                  href="/order"
                  className="button button-primary button-lg"
                >
                  <span className="ink-word ink-word--on-dark">
                    شروع پروژه
                  </span>
                  <span aria-hidden="true">←</span>
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.15} radius={60}>
                <a
                  href="#portfolio"
                  className="button button-secondary button-lg"
                >
                  <span className="ink-word">دیدن نمونه‌کارها</span>
                </a>
              </MagneticButton>
            </div>

            {contactEmail && (
              <div className="final-cta-contact">
                <span>یا مستقیم ایمیل بزن:</span>
                <a href={`mailto:${contactEmail}`} dir="ltr">
                  {contactEmail}
                </a>
              </div>
            )}
          </div>

          <aside className="final-cta-aside" aria-hidden="true">
            <div className="final-cta-aside-item">
              <span className="final-cta-aside-label">پاسخ</span>
              <strong className="final-cta-aside-value">
                حداکثر ۲۴ ساعت
              </strong>
            </div>

            <div className="final-cta-aside-item">
              <span className="final-cta-aside-label">روش تماس</span>
              <strong className="final-cta-aside-value">
                پیامک · روبیکا · ایتا
              </strong>
            </div>

            <div className="final-cta-aside-item">
              <span className="final-cta-aside-label">حوزه‌ی کار</span>
              <strong className="final-cta-aside-value">
                وب‌سایت · تبلیغات · ویدیو
              </strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}