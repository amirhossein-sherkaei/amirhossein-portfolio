import SectionNumber from "@/components/SectionNumber";

const reasons = [
  {
    number: "01",
    title: "طراحی اختصاصی، بدون قالب",
    text: "هر پروژه از صفر طراحی می‌شود. ساختار، رنگ، حرکت و تایپوگرافی — همه بر اساس هدف همان پروژه ساخته می‌شوند، نه بر اساس یک الگوی تکراری. نتیجه: سایتی که شبیه هیچ‌جای دیگری نیست.",
  },
  {
    number: "02",
    title: "دقت در جزئیاتی که دیده نمی‌شوند",
    text: "از فاصله‌ها و وزن فونت‌ها تا تایمینگ انیمیشن‌ها و حالت‌های hover. همان چیزهایی که کاربر آگاهانه نمی‌بیند، اما حس می‌کند — و همین حس، تفاوت بین یک سایت خوب و یک سایت حرفه‌ای است.",
  },
  {
    number: "03",
    title: "طراحی و تکنولوژی، در یک مسیر",
    text: "طراحی خلاقانه و توسعه‌ی مدرن، نه به‌عنوان دو مرحله‌ی جدا، بلکه یکپارچه. سرعت، دسترسی‌پذیری و استانداردهای فنی از روز اول در طراحی لحاظ می‌شوند — نه به‌عنوان وصله‌ای در انتها.",
  },
];

export default function WhyMe() {
  return (
    <section className="why-section section" aria-labelledby="why-title">
      <div className="container">
        <div className="why-header reveal">
          <div>
            <SectionNumber num="۰۵" label="WHY ME" />

            <h2 id="why-title">
              متفاوت فکر می‌کنم،
              <span> دقیق اجرا می‌کنم.</span>
            </h2>
          </div>

          <p>
            سه چیزی که هر پروژه را از یک «سایت معمولی» به یک «تجربه‌ی
            متمایز» تبدیل می‌کند. این‌ها تعارف نیستند — روش کار واقعی من
            هستند.
          </p>
        </div>

        <ul className="why-list reveal">
          {reasons.map((reason) => (
            <li key={reason.number} className="why-item">
              <span className="why-num">{reason.number}</span>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </li>
          ))}
        </ul>

        <div className="why-signature reveal">
          <div className="why-signature-line" aria-hidden="true" />
          <p className="why-signature-text">
            اگر دنبال سایتی هستی که سریع باشد، اختصاصی باشد و قابل‌تشخیص
            از رقبا،
            <a href="/order"> بیا درباره‌ی پروژه‌ات حرف بزنیم</a>.
          </p>
        </div>
      </div>
    </section>
  );
}