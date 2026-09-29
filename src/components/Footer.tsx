import Link from "next/link";
import Image from "next/image";
import SoundToggle from "@/components/SoundToggle";

const footerNav = [
  { label: "خانه", href: "/" },
  { label: "خدمات", href: "/#services" },
  { label: "نمونه‌کارها", href: "/#portfolio" },
  { label: "بلاگ", href: "/blog" },
  { label: "درباره من", href: "/#about" },
  { label: "شروع پروژه", href: "/order" },
];

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

export default function Footer() {
  const contactEmail = process.env.PROJECT_CONTACT_EMAIL;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <span className="section-index" style={{ marginBottom: 0 }}>
            NEXT — STEP
          </span>

          <h2 className="footer-cta-title">
            ایده‌ای داری؟
            <br />
            <em className="ink-word">بیا بسازیمش.</em>
          </h2>

          <div className="footer-cta-actions">
            <Link href="/order" className="button button-primary button-lg">
              <span className="ink-word ink-word--on-dark">
                شروع پروژه
              </span>
              <span aria-hidden="true">←</span>
            </Link>

            <a
              href="#portfolio"
              className="button button-secondary button-lg"
            >
              <span className="ink-word">دیدن نمونه‌کارها</span>
            </a>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-brand-block">
            <div className="footer-brand">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                className="footer-mark footer-logo"
                aria-hidden="true"
              />

              <div>
                <strong>امیرحسین شرکائی</strong>
                <span>AMIRHOSSEIN SHORAKAEI</span>
              </div>
            </div>

            <p className="footer-tagline">
              طراحی و توسعه وب‌سایت‌های اختصاصی — با تجربه‌های بصری و
              تبلیغاتی متفاوت، به کمک هوش مصنوعی.
            </p>

            <span className="footer-signature" aria-hidden="true">
              <SignatureMark />
            </span>
          </div>

          <div className="footer-nav-block">
            <nav className="footer-nav" aria-label="ناوبری پایین صفحه">
              <span className="footer-nav-label">PAGES</span>

              {footerNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {contactEmail && (
              <div className="footer-contact">
                <span className="footer-nav-label">CONTACT</span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="footer-email"
                  dir="ltr"
                >
                  {contactEmail}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-bottom-item">
            © {CURRENT_PERSIAN_YEAR} — تمامی حقوق محفوظ است.
          </span>

          <span className="footer-bottom-center">
            DESIGN · DEVELOPMENT · AI
          </span>

          <div className="footer-bottom-actions">
            <SoundToggle />

            <a
              href="#home"
              className="footer-back-top"
              aria-label="بازگشت به بالای صفحه"
            >
              بازگشت به بالا ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SignatureMark() {
  return (
    <svg
      viewBox="0 0 220 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      suppressHydrationWarning
    >
      <path
        d="M6 34C24 14 46 40 70 22C88 8 106 34 130 22C150 12 172 30 206 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="212" cy="16" r="2.2" fill="currentColor" />
    </svg>
  );
}