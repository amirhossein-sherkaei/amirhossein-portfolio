import Link from "next/link";
import BackButton from "@/components/BackButton";

const CURRENT_PERSIAN_YEAR = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
})
  .format(new Date())
  .replace(/[^\u06F0-\u06F9]/g, "")
  .slice(0, 4);

const suggestions = [
  { label: "خانه", href: "/", description: "برگرد به شروع" },
  {
    label: "خدمات",
    href: "/#services",
    description: "چهار مسیر برای همکاری",
  },
  {
    label: "نمونه‌کارها",
    href: "/#portfolio",
    description: "پروژه‌های واقعی",
  },
  {
    label: "شروع پروژه",
    href: "/order",
    description: "ایده‌ات رو بفرست",
  },
];

export default function NotFound() {
  return (
    <main id="main" className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-top">
            <span>AMIRHOSSEIN SHORAKAEI</span>
            <span>ERROR / 404</span>
          </div>

          <div className="not-found-center">
            <div className="not-found-number" aria-hidden="true">
              <span>4</span>
              <div className="not-found-zero">
                <div className="not-found-zero-core">
                  <span>?</span>
                </div>
              </div>
              <span>4</span>
            </div>

            <span
              className="section-index"
              style={{ justifyContent: "center" }}
            >
              PAGE NOT FOUND
            </span>

            <h1>
              این صفحه
              <span> در مسیر نیست.</span>
            </h1>

            <p>
              احتمالاً آدرس اشتباه تایپ شده یا این صفحه جابه‌جا شده.
              از مسیرهای زیر می‌تونی ادامه بدی.
            </p>

            <div className="not-found-actions">
              <Link href="/" className="button button-primary">
                برگشت به صفحه اصلی
                <span aria-hidden="true">←</span>
              </Link>

              <BackButton />
            </div>

            <div className="not-found-suggestions">
              <span className="not-found-suggestions-label">
                یا از این‌ها شروع کن
              </span>

              <div className="not-found-suggestions-grid">
                {suggestions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="not-found-suggestion"
                  >
                    <span className="not-found-suggestion-label">
                      {item.label}
                    </span>
                    <span className="not-found-suggestion-desc">
                      {item.description}
                    </span>
                    <span
                      className="not-found-suggestion-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="not-found-bottom">
            <span>DESIGN / DEVELOPMENT / AI</span>
            <span>© {CURRENT_PERSIAN_YEAR}</span>
          </div>
        </div>
      </div>
    </main>
  );
}