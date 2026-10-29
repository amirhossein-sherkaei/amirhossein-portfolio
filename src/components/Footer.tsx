import Link from "next/link";
import Image from "next/image";
import SoundToggle from "@/components/SoundToggle";
import FooterClock from "@/components/FooterClock";
import ContactLinks from "@/components/ContactLinks";

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date()).replace(/[^\u06F0-\u06F9]/g, "").slice(0, 4);

const navGroups = [
  { label: "PAGES", links: [ { label: "خانه", href: "/" }, { label: "خدمات", href: "/services" }, { label: "نمونه‌کارها", href: "/#portfolio" }, { label: "درباره من", href: "/#about" }, { label: "بلاگ", href: "/blog" }, ], },
  { label: "SERVICES", links: [ { label: "وب‌سایت اختصاصی", href: "/services/web-design" }, { label: "وب + هوش مصنوعی", href: "/services/ai-website" }, { label: "تبلیغات هوشمند", href: "/services/ai-banner" }, { label: "ویدیوی تبلیغاتی", href: "/services/ai-video" }, ], },
];

export default function Footer() {
  const contactEmail = process.env.PROJECT_CONTACT_EMAIL;

  return (
    <footer className="site-footer">
      <div className="footer-ambient" aria-hidden="true"><span className="footer-ambient-glow" /><span className="footer-ambient-grid" /></div>

      <div className="footer-masthead">
        <div className="container">
          <div className="footer-masthead-inner">
            <span className="footer-masthead-left">CHAPTER&nbsp;·&nbsp;07&nbsp;—&nbsp;END</span>
            <span className="footer-masthead-mark" aria-hidden="true">✦</span>
            <span className="footer-masthead-right">AMIRHOSSEIN&nbsp;SHORAKAEI&nbsp;·&nbsp;{CURRENT_PERSIAN_YEAR}</span>
          </div>
        </div>
      </div>

      <div className="footer-grid-wrap">
        <div className="footer-watermark" aria-hidden="true"><Image src="/logo.png" alt="" width={480} height={480} className="footer-watermark-img" /></div>

        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-col--brand">
              <Link href="/" className="footer-brand-link" aria-label="امیرحسین شرکائی — بازگشت به خانه">
                <Image src="/logo.png" alt="" width={48} height={48} className="footer-brand-logo" aria-hidden="true" />
                <div className="footer-brand-copy"><strong>امیرحسین شرکائی</strong><small>AMIRHOSSEIN SHORAKAEI</small></div>
              </Link>
              <p className="footer-brand-tagline">طراحی و توسعه وب‌سایت‌های اختصاصی — با تمرکز بر سرعت، جزئیات و تجربه‌ی کاربری.</p>
              <div className="footer-brand-meta">
                <span className="footer-brand-status"><span className="footer-brand-status-dot" aria-hidden="true" />آماده همکاری</span>
                <span className="footer-brand-location"><FooterClock /><span className="footer-brand-location-sep" aria-hidden="true">·</span><span>Tehran</span></span>
              </div>
            </div>

            {navGroups.map((group) => (
              <nav key={group.label} className="footer-col footer-col--nav" aria-label={group.label}>
                <span className="footer-col-label">{group.label}</span>
                <ul className="footer-col-list">
                  {group.links.map((link) => (<li key={link.label}><Link href={link.href} className="footer-link"><span>{link.label}</span></Link></li>))}
                </ul>
              </nav>
            ))}

            <div className="footer-col footer-col--nav footer-col--contact">
              <span className="footer-col-label">CONNECT</span>
              <ContactLinks variant="card" />
            </div>
          </div>

          {contactEmail && (
            <div className="footer-email-row">
              <span className="footer-email-label">— EMAIL</span>
              <a href={`mailto:${contactEmail}`} className="footer-email-value" dir="ltr">{contactEmail}</a>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom-wrap">
        <div className="container">
          <div className="footer-bottom">
            <span className="footer-copyright">©&nbsp;{CURRENT_PERSIAN_YEAR}&nbsp;— تمامی حقوق محفوظ است.</span>
            <span className="footer-signature-line">DESIGN&nbsp;·&nbsp;DEVELOPMENT&nbsp;·&nbsp;AI</span>
            <div className="footer-bottom-actions">
              <SoundToggle />
              <a href="#home" className="footer-back-to-top" aria-label="بازگشت به بالای صفحه"><span className="footer-back-to-top-label">بازگشت به بالا</span><span className="footer-back-to-top-arrow" aria-hidden="true">↑</span></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}