export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number; // 1-5
  avatar?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "رضا کاشانی",
    role: "مدیر برند",
    company: "فروشگاه نیلا",
    text: "همکاری با امیرحسین تجربه‌ای حرفه‌ای و لذت‌بخش بود. دقتش در جزئیات و تعهدش به زمان‌بندی واقعاً تحسین‌برانگیز است. سایت ما بعد از طراحی جدید، ۴۰٪ افزایش فروش داشت.",
    rating: 5,
    avatar: "/testimonials/reza.webp",
  },
  {
    id: "2",
    name: "سارا احمدی",
    role: "مدیر محصول",
    company: "استارتاپ آرکا",
    text: "طراحی سایت ما رو کاملاً متحول کرد. امیرحسین نه تنها یک طراح خوب، بلکه یک مشاور واقعی است. همیشه راهکارهای بهتر و خلاقانه‌تری پیشنهاد می‌ده.",
    rating: 5,
    avatar: "/testimonials/sara.webp",
  },
  {
    id: "3",
    name: "علی محمدی",
    role: "مدیرعامل",
    company: "استودیو ویرا",
    text: "دقت و سرعت در کارش عالیه. پروژه ما با کیفیت بسیار بالا و دقیقاً طبق برنامه تحویل داده شد. قطعاً برای پروژه‌های بعدی هم با ایشون همکاری می‌کنیم.",
    rating: 5,
    avatar: "/testimonials/ali.webp",
  },
];