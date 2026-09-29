import Link from "next/link";
import Image from "next/image";
import SoundToggle from "@/components/SoundToggle";
import FooterClock from "@/components/FooterClock";

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

const navGroups = [
  {
    label: "PAGES",
    links: [
      { label: "خانه", href: "/" },
      { label: "خدمات", href: "/#services" },
      { label: "نمونه‌کارها", href: "/#portfolio" },
      { label: "درباره من", href: "/#about" },
      { label: "بلاگ", href: "/blog" },
    ],
  },
  {
    label: "SERVICES",
    links: [
      { label: "وب‌سایت اختصاصی", href: "/#services" },
      { label: "وب + هوش مصنوعی", href: "/#services" },
      { label: "تبلیغات هوشمند", href: "/#services" },
      { label: "ویدیوی تبلیغاتی", href: "/#services" },
    ],
  },
  {
    label: "CONNECT",
    links: [
      { label: "پیامک", href: "sms:" },
      { label: "روبیکا", href: "#" },
      { label: "ایتا", href: "#" },
      { label: "شروع پروژه", href: "/order", isPrimary: true },
    ],
  },
];

export default function Footer() {
  const contactEmail = process.env.PROJECT_CONTACT_EMAIL;

  return (
    <footer className="site-footer">
      {/* ═══════ Ambient ═══════ */}
      <div className="footer-ambient" aria-hidden="true">
        <span className="footer-ambient-glow" />
        <span className="footer-ambient-grid" />
      </div>

      {/* ═══════ Masthead ═══════ */}
      <div className="footer-masthead">
        <div className="container">
          <div className="footer-masthead-inner">
            <span className="footer-masthead-left">
              CHAPTER&nbsp;·&nbsp;07&nbsp;—&nbsp;END
            </span>
            <span className="footer-masthead-mark" aria-hidden="true">
              ✦
            </span>
            <span className="footer-masthead-right">
              AMIRHOSSEIN&nbsp;SHORAKAEI&nbsp;·&nbsp;{CURRENT_PERSIAN_YEAR}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ Hero CTA ═══════ */}
      <section
        className="footer-hero"
        aria-labelledby="footer-hero-title"
      >
        <div className="container">
          <div className="footer-hero-grid">
            <div className="footer-hero-content">
              <span className="footer-hero-eyebrow">NEXT&nbsp;·&nbsp;STEP</span>

              <h2 id="footer-hero-title" className="footer-hero-title">
                ایده‌ای داری؟
                <br />
                <em className="ink-word">بیا بسازیمش.</em>
              </h2>

              <p className="footer-hero-text">
                اگه پروژه‌ت مشخصه، همون رو بفرست. اگه فقط یه ایده
                داری، با هم به یه طرح روشن می‌رسیم.
              </p>

              <div className="footer-hero-actions">
                <Link
                  href="/order"
                  className="footer-hero-btn footer-hero-btn--primary"
                >
                  <span className="ink-word ink-word--on-dark">
                    شروع پروژه
                  </span>
                  <span aria-hidden="true">←</span>
                </Link>
                <Link
                  href="/#portfolio"
                  className="footer-hero-btn footer-hero-btn--secondary"
                >
                  <span className="ink-word">دیدن نمونه‌کارها</span>
                </Link>
              </div>
            </div>

            <aside className="footer-hero-aside" aria-hidden="true">
              <div className="footer-hero-stat">
                <span className="footer-hero-stat-label">پاسخ</span>
                <strong className="footer-hero-stat-value">
                  حداکثر ۲۴ ساعت
                </strong>
              </div>
              <div className="footer-hero-stat">
                <span className="footer-hero-stat-label">روش تماس</span>
                <strong className="footer-hero-stat-value">
                  پیامک · روبیکا · ایتا
                </strong>
              </div>
              <div className="footer-hero-stat">
                <span className="footer-hero-stat-label">حوزه</span>
                <strong className="footer-hero-stat-value">
                  وب · تبلیغات · ویدیو
                </strong>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══════ Main Grid ═══════ */}
      <div className="footer-grid-wrap">
        <div className="footer-watermark" aria-hidden="true">
          <Image
            src="/logo.png"
            alt=""
            width={480}
            height={480}
            className="footer-watermark-img"
          />
        </div>

        <div className="container">
          <div className="footer-grid">
            {/* Brand column */}
            <div className="footer-col footer-col--brand">
              <Link
                href="/"
                className="footer-brand-link"
                aria-label="امیرحسین شرکائی — بازگشت به خانه"
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={48}
                  height={48}
                  className="footer-brand-logo"
                  aria-hidden="true"
                />
                <div className="footer-brand-copy">
                  <strong>امیرحسین شرکائی</strong>
                  <small>AMIRHOSSEIN SHORAKAEI</small>
                </div>
              </Link>

              <p className="footer-brand-tagline">
                طراحی و توسعه وب‌سایت‌های اختصاصی — با تمرکز بر
                سرعت، جزئیات و تجربه‌ی کاربری.
              </p>

              <div className="footer-brand-meta">
                <span className="footer-brand-status">
                  <span
                    className="footer-brand-status-dot"
                    aria-hidden="true"
                  />
                  آماده همکاری
                </span>
                <span className="footer-brand-location">
                  <FooterClock />
                  <span className="footer-brand-location-sep" aria-hidden="true">
                    ·
                  </span>
                  <span>Tehran</span>
                </span>
              </div>
            </div>

            {/* Nav columns */}
            {navGroups.map((group) => (
              <nav
                key={group.label}
                className="footer-col footer-col--nav"
                aria-label={group.label}
              >
                <span className="footer-col-label">{group.label}</span>
                <ul className="footer-col-list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`footer-link${
                          link.isPrimary ? " footer-link--primary" : ""
                        }`}
                      >
                        <span>{link.label}</span>
                        {link.isPrimary && (
                          <span aria-hidden="true">←</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Email row */}
          {contactEmail && (
            <div className="footer-email-row">
              <span className="footer-email-label">— EMAIL</span>
              <a
                href={`mailto:${contactEmail}`}
                className="footer-email-value"
                dir="ltr"
              >
                {contactEmail}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ Bottom bar ═══════ */}
      <div className="footer-bottom-wrap">
        <div className="container">
          <div className="footer-bottom">
            <span className="footer-copyright">
              ©&nbsp;{CURRENT_PERSIAN_YEAR}&nbsp;— تمامی حقوق محفوظ است.
            </span>
            <span className="footer-signature-line">
              DESIGN&nbsp;·&nbsp;DEVELOPMENT&nbsp;·&nbsp;AI
            </span>
            <div className="footer-bottom-actions">
              <SoundToggle />
              <a
                href="#home"
                className="footer-back-to-top"
                aria-label="بازگشت به بالای صفحه"
              >
                <span className="footer-back-to-top-label">
                  بازگشت به بالا
                </span>
                <span
                  className="footer-back-to-top-arrow"
                  aria-hidden="true"
                >
                  ↑
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}