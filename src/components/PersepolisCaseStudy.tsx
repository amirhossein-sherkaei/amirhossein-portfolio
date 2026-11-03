import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import styles from "./PersepolisCaseStudy.module.css";

type Props = {
  project: Project;
};

const conceptPillars = [
  {
    number: "۰۱",
    title: "هویت باشگاه",
    text: "رنگ، تصویر و لحن بصری در خدمت شخصیت مستقل پرسپولیس قرار می‌گیرند.",
  },
  {
    number: "۰۲",
    title: "اطلاعات در دسترس",
    text: "مسابقه، خبر و محتوای مهم باید سریع پیدا شوند؛ بدون اینکه کاربر میان بخش‌ها گم شود.",
  },
  {
    number: "۰۳",
    title: "تجربه یکپارچه",
    text: "ساختار و تعامل‌ها در نمایشگرهای بزرگ و کوچک، یک زبان مشترک دارند.",
  },
];

export default function PersepolisCaseStudy({ project }: Props) {
  const caseStudy = project.caseStudy;
  const demoUrl = project.liveDemoUrl || "/projects/persepolis.html";

  if (!caseStudy) return null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: "بازطراحی مفهومی تجربه دیجیتال باشگاه پرسپولیس",
        alternateName: "PERSEPOLIS — THE NEXT DIGITAL ERA",
        description: project.fullDescription,
        image: "https://shorakaei.ir/projects/persepolis-cover.svg",
        author: {
          "@type": "Person",
          name: "امیرحسین شرکائی",
          url: "https://shorakaei.ir",
        },
        url: "https://shorakaei.ir/work/persepolis",
        genre: "Independent website redesign concept",
        inLanguage: "fa-IR",
        keywords: [
          "بازطراحی وب‌سایت پرسپولیس",
          "طراحی تجربه کاربری ورزشی",
          "طراحی وب‌سایت فوتبال",
          "امیرحسین شرکائی",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "خانه", item: "https://shorakaei.ir" },
          { "@type": "ListItem", position: 2, name: "نمونه‌کارها", item: "https://shorakaei.ir/work" },
          { "@type": "ListItem", position: 3, name: "پرسپولیس", item: "https://shorakaei.ir/work/persepolis" },
        ],
      },
    ],
  };

  return (
    <main id="main" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className={styles.ambient} aria-hidden="true" />

      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="مسیر">
          <Link href="/">خانه</Link>
          <span aria-hidden="true">/</span>
          <Link href="/work">نمونه‌کارها</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">پرسپولیس</span>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>
              <span className={styles.kickerDot} />
              INDEPENDENT REDESIGN CONCEPT
            </div>

            <p className={styles.eyebrow}>یک پیشنهاد برای آینده تجربه دیجیتال</p>
            <h1 className={styles.title}>
              پرسپولیس؛
              <span>فراتر از نود دقیقه.</span>
            </h1>
            <p className={styles.lead}>
              بازتعریف حضور دیجیتال یکی از پرهوادارترین باشگاه‌های ایران؛
              با تمرکز بر هویت، محتوا و تجربه‌ای که در تمام لحظات همراه هوادار
              بماند.
            </p>

            <div className={styles.actions}>
              <a
                className={styles.primaryAction}
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                مشاهده نسخه تعاملی
                <span aria-hidden="true">↗</span>
              </a>
              <Link className={styles.secondaryAction} href="/work">
                بازگشت به نمونه‌کارها
              </Link>
            </div>

            <div className={styles.disclaimer}>
              <span className={styles.disclaimerMark} aria-hidden="true">i</span>
              <p>
                این اثر یک طرح مفهومی و پیشنهاد مستقل است؛ نه پروژه رسمی، نه
                همکاری و نه مورد تأیید باشگاه پرسپولیس.
              </p>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualTopline}>
              <span>SHORKAEI® / CASE 05</span>
              <span>1405</span>
            </div>
            <div className={styles.coverFrame}>
              <Image
                src={project.coverImage || "/projects/persepolis-cover.svg"}
                alt="تصویر مفهومی پروژه بازطراحی دیجیتال پرسپولیس"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 54vw"
                className={styles.coverImage}
              />
              <div className={styles.coverOverlay}>
                <span className={styles.coverOverline}>THE NEXT DIGITAL ERA</span>
                <strong>PERSEPOLIS</strong>
                <span className={styles.coverSlogan}>فراتر از نود دقیقه</span>
              </div>
            </div>
            <div className={styles.visualCaption}>
              <span>یک تجربه دیجیتال با هویت مستقل</span>
              <span>CONCEPT / 01</span>
            </div>
          </div>
        </header>

        <section className={styles.facts} aria-label="اطلاعات پروژه">
          <div className={styles.fact}>
            <span>نوع پروژه</span>
            <strong>بازطراحی مفهومی</strong>
          </div>
          <div className={styles.fact}>
            <span>حوزه</span>
            <strong>تجربه دیجیتال ورزشی</strong>
          </div>
          <div className={styles.fact}>
            <span>نقش</span>
            <strong>طراحی و توسعه</strong>
          </div>
          <div className={styles.fact}>
            <span>وضعیت</span>
            <strong>پیشنهاد مستقل</strong>
          </div>
        </section>

        <section className={styles.introSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>۰۱ / THE IDEA</span>
            <h2>یک باشگاه بزرگ، به تجربه‌ای در اندازه نامش نیاز دارد.</h2>
          </div>
          <div className={styles.introBody}>
            <p>{caseStudy.overview}</p>
            <p>{caseStudy.challenge}</p>
          </div>
        </section>

        <section className={styles.pillarsSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>۰۲ / DESIGN PRINCIPLES</span>
            <h2>سه اصل برای ساختن یک تجربه منسجم</h2>
          </div>
          <div className={styles.pillarsGrid}>
            {conceptPillars.map((pillar) => (
              <article className={styles.pillar} key={pillar.number}>
                <span className={styles.pillarNumber}>{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.highlightsSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>۰۳ / EXPERIENCE</span>
            <h2>از خبر مسابقه تا روایت باشگاه</h2>
          </div>
          <div className={styles.highlightsLayout}>
            <div className={styles.highlightsLead}>
              <span>DESIGNED AROUND THE FAN</span>
              <h3>محتوا باید به‌اندازه هویت باشگاه، واضح و قدرتمند باشد.</h3>
              <p>
                ساختار صفحه به‌گونه‌ای در نظر گرفته شده که نقاط تماس اصلی هوادار
                با باشگاه، در دسترس و قابل تشخیص باشند؛ بدون شلوغی غیرضروری و
                بدون قربانی‌کردن خوانایی برای جلوه‌های بصری.
              </p>
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                ورود به تجربه کامل <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className={styles.highlightList}>
              {caseStudy.highlights.map((item, index) => (
                <div className={styles.highlightItem} key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                  <span className={styles.highlightArrow} aria-hidden="true">↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>۰۴ / APPROACH</span>
            <h2>از مسئله تا جزئیات اجرا</h2>
          </div>
          <ol className={styles.processList}>
            {caseStudy.approach.map((item, index) => (
              <li key={item}>
                <span className={styles.processIndex}>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        {caseStudy.learnings && (
          <section className={styles.quoteSection}>
            <span className={styles.sectionNumber}>A DESIGN NOTE</span>
            <blockquote>«{caseStudy.learnings}»</blockquote>
          </section>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <section className={styles.stackSection}>
            <div>
              <span className={styles.sectionNumber}>BUILD / STACK</span>
              <h2>ابزارها و فناوری‌ها</h2>
            </div>
            <ul className={styles.stackList}>
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.finalCta}>
          <div className={styles.finalCtaCopy}>
            <span className={styles.sectionNumber}>NEXT STEP / 05</span>
            <h2>این پیشنهاد را در تجربه واقعی ببینید.</h2>
            <p>
              نسخه تعاملی بازطراحی را بررسی کنید و جزئیات طراحی را از نزدیک
              ببینید.
            </p>
          </div>
          <a
            className={styles.primaryAction}
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            مشاهده نسخه تعاملی
            <span aria-hidden="true">↗</span>
          </a>
        </section>

        <div className={styles.projectSignature}>
          <span>DESIGN & DEVELOPMENT</span>
          <strong>امیرحسین شرکائی</strong>
          <a href="https://shorakaei.ir/" target="_blank" rel="noopener noreferrer">
            SHORKAEI.IR
          </a>
        </div>
      </div>
    </main>
  );
}
