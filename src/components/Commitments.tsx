import SectionNumber from "@/components/SectionNumber";

const commitments = [
  {
    num: "01",
    icon: "clock" as const,
    title: "پاسخ حداکثر ۲۴ ساعته",
    description:
      "هر درخواست پروژه‌ای که می‌فرستی، حداکثر تا ۲۴ ساعت بعد جواب می‌گیری — نه چند روز بعد.",
  },
  {
    num: "02",
    icon: "code" as const,
    title: "کد کامل به اسم تو",
    description:
      "بعد از تحویل، تمام کد و دارایی‌ها به نام خودت است. هیچ وابستگی به من نداری.",
  },
  {
    num: "03",
    icon: "shield" as const,
    title: "۳ ماه پشتیبانی رایگان",
    description:
      "شامل رفع باگ، به‌روزرسانی‌های جزئی و پاسخ به سؤالات فنی — بدون هزینه‌ی اضافه.",
  },
  {
    num: "04",
    icon: "eye" as const,
    title: "قیمت شفاف از اول",
    description:
      "قبل از شروع، پیش‌فاکتور کامل با همه‌ی موارد می‌گیری. بدون هزینه‌ی پنهان.",
  },
  {
    num: "05",
    icon: "refresh" as const,
    title: "دو مرحله بازبینی",
    description:
      "در طول پروژه دو فرصت داری که تغییرات را درخواست کنی — بدون هزینه‌ی اضافه.",
  },
  {
    num: "06",
    icon: "calendar" as const,
    title: "تحویل در تاریخ توافق",
    description:
      "تاریخ دقیق تحویل، در قرارداد نوشته می‌شود و به آن پایبندم.",
  },
];

export default function Commitments() {
  return (
    <section
      id="commitments"
      className="commitments-section section"
      aria-labelledby="commitments-title"
    >
      <div className="container">
        {/* ═══════ Masthead ═══════ */}
        <div className="commitments-masthead reveal">
          <span className="commitments-masthead-left">
            CHAPTER&nbsp;·&nbsp;03&nbsp;—&nbsp;COMMITMENTS
          </span>
          <span className="commitments-masthead-center" aria-hidden="true">
            ✦
          </span>
          <span className="commitments-masthead-right">
            GUARANTEED&nbsp;·&nbsp;1405
          </span>
        </div>

        {/* ═══════ Heading ═══════ */}
        <div className="section-heading reveal">
          <div>
            <SectionNumber num="۰۷" label="COMMITMENTS" />
            <h2 id="commitments-title">
              چیزهایی که
              <em> تضمین می‌کنم.</em>
            </h2>
          </div>
          <p>
            این‌ها شعار نیستند — بخشی از فرآیند کار من هستند. اگر
            هر کدام از این‌ها رعایت نشد، همین‌جا بگو تا درستش کنیم.
          </p>
        </div>

        {/* ═══════ Grid ═══════ */}
        <div className="commitments-grid">
          {commitments.map((item, index) => (
            <article
              key={item.num}
              className="commitment-card reveal"
              style={{ "--c-index": index } as React.CSSProperties}
            >
              <div className="commitment-card-head">
                <span className="commitment-card-icon" aria-hidden="true">
                  <CommitmentIcon type={item.icon} />
                </span>
                <span className="commitment-card-num">{item.num}</span>
              </div>

              <h3 className="commitment-card-title">{item.title}</h3>
              <p className="commitment-card-desc">{item.description}</p>
            </article>
          ))}
        </div>

        {/* ═══════ Footer note ═══════ */}
        <div className="commitments-footer reveal">
          <div className="commitments-footer-line" aria-hidden="true" />
          <p className="commitments-footer-text">
            <strong>اگه سؤالی داری</strong> — حتی اگه فقط می‌خوای
            بدونی پروژه‌ات چقدر زمان یا هزینه داره،{" "}
            <a href="/order">فرم مشاوره‌ی رایگان</a> را پر کن.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════ */
function CommitmentIcon({
  type,
}: {
  type: "clock" | "code" | "shield" | "eye" | "refresh" | "calendar";
}) {
  switch (type) {
    case "clock":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      );
    case "code":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case "shield":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "eye":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "refresh":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <polyline points="21 3 21 9 15 9" />
        </svg>
      );
    case "calendar":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
          <polyline points="9 15 11 17 15 13" />
        </svg>
      );
  }
}