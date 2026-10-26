import Link from "next/link";
import OrderForm from "@/components/OrderForm";

export const metadata = {
  title: "سفارش پروژه",
  description:
    "برای شروع پروژه طراحی وب‌سایت یا تولید محتوای تبلیغاتی با امیرحسین شرکائی، فرم سفارش پروژه را تکمیل کنید.",
};

export default function OrderPage() {
  return (
    <main id="main" className="order-page">
      <div className="container">
        <div className="order-header">
          <Link href="/" className="order-back">
            <span aria-hidden="true">→</span>
            بازگشت به صفحه اصلی
          </Link>

          <span className="section-index">ORDER — START A PROJECT</span>

          <h1>
            پروژه‌ی بعدی‌ات را
            <span> شروع کنیم.</span>
          </h1>

          <p>
            چند دقیقه برای توضیح پروژه وقت بگذار تا بتوانیم نیازها و
            مسیر مناسب اجرای آن را بهتر بررسی کنیم.
          </p>
        </div>

        <OrderForm />
      </div>
    </main>
  );
}