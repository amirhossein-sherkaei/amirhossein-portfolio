import Link from "next/link";

export default function BlogAuthorBox() {
  return (
    <aside className="blog-author" aria-label="درباره نویسنده">
      <div className="blog-author-head">
        <span className="blog-author-mark" aria-hidden="true">
          ا
        </span>
        <div className="blog-author-meta">
          <span className="blog-author-name">امیرحسین شرکائی</span>
          <span className="blog-author-role">
            طراح و توسعه‌دهنده‌ی وب
          </span>
        </div>
      </div>

      <p className="blog-author-bio">
        روی طراحی سایت‌های اختصاصی تمرکز دارم — با تأکید بر سرعت،
        جزئیات و تجربه‌ی کاربر. اگه سؤالی درباره‌ی این مقاله داری،
        خوشحال می‌شم بشنوم.
      </p>

      <div className="blog-author-actions">
        <Link href="/order" className="blog-author-btn blog-author-btn--primary">
          شروع پروژه
          <span aria-hidden="true">←</span>
        </Link>
        <Link href="/#about" className="blog-author-btn">
          درباره من
        </Link>
      </div>
    </aside>
  );
}