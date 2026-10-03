/* ═══════════════════════════════════════════════════════════
   IDEA → REAL — DATA
   ────────────────────────────────────────────────────────────
   دادههای خام موتور تصمیمگیری.
   بدون وابستگی خارجی، بدون API.
   ═══════════════════════════════════════════════════════════ */

export type GoalId =
  | 'sales'
  | 'brand'
  | 'customers'
  | 'credibility'
  | 'product'
  | 'personal';

export type ServiceId = 'website' | 'ai-content' | 'cinematic-video';

export type DomainId =
  | 'restaurant'
  | 'tourism'
  | 'shop'
  | 'education'
  | 'beauty'
  | 'health'
  | 'tech'
  | 'art'
  | 'realestate'
  | 'fashion'
  | 'sport'
  | 'personal'
  | 'general';

export type Goal = {
  readonly id: GoalId;
  readonly label: string;
};

export type Service = {
  readonly id: ServiceId;
  readonly code: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
};

export type Domain = {
  readonly id: DomainId;
  readonly label: string;
  readonly keywords: readonly string[];
  readonly contentHeavy: boolean;
  readonly visualHeavy: boolean;
};

/* ───────────────────────────────────────────────────────────
   اهداف کاربر
   ─────────────────────────────────────────────────────────── */

export const GOALS: readonly Goal[] = [
  { id: 'sales',       label: 'فروش بیشتر' },
  { id: 'brand',       label: 'معرفی برند' },
  { id: 'customers',   label: 'جذب مشتری' },
  { id: 'credibility', label: 'اعتبار حرفهای' },
  { id: 'product',     label: 'معرفی محصول' },
  { id: 'personal',    label: 'برند شخصی' },
];

/* ───────────────────────────────────────────────────────────
   خدمات سهگانه
   ─────────────────────────────────────────────────────────── */

export const SERVICES: Readonly<Record<ServiceId, Service>> = {
  website: {
    id: 'website',
    code: 'WEB',
    label: 'Website',
    title: 'وبسایت اختصاصی',
    description:
      'یک تجربهی سریع، ریسپانسیو و کاملاً اختصاصی که هویت برندت رو در اولین نگاه منتقل میکنه — نه قالب آماده، نه شبیه هیچجای دیگه.',
  },
  'ai-content': {
    id: 'ai-content',
    code: 'AI',
    label: 'AI Content',
    title: 'محتوای هوشمند',
    description:
      'تولید محتوای هدفمند با هوش مصنوعی، متناسب با لحن و مخاطب تو — از متن و تصویر تا المانهای بصری، با نظارت کامل انسانی.',
  },
  'cinematic-video': {
    id: 'cinematic-video',
    code: 'VIDEO',
    label: 'Cinematic Campaign',
    title: 'ویدیوی سینمایی',
    description:
      'یک روایت سینمایی کوتاه که در چند ثانیه اعتماد، تمایز و ماندگاری میسازه — بدون نیاز به تیم فیلمبرداری و بودجهی سنگین.',
  },
};

/* ───────────────────────────────────────────────────────────
   دامنههای کسبوکار
   contentHeavy → محتوا محور (AI Content توصیه میشه)
   visualHeavy  → بصری محور (Cinematic Video توصیه میشه)
   ─────────────────────────────────────────────────────────── */

export const DOMAINS: readonly Domain[] = [
  {
    id: 'restaurant',
    label: 'رستوران و کافه',
    keywords: [
      'رستوران', 'کافه', 'کافی شاپ', 'قهوه', 'غذا', 'فست فود',
      'آشپز', 'منو', 'کترینگ', 'شیرینی', 'قنادی', 'نان',
    ],
    contentHeavy: true,
    visualHeavy: true,
  },
  {
    id: 'tourism',
    label: 'گردشگری',
    keywords: [
      'گردشگری', 'تور', 'سفر', 'هتل', 'اقامتگاه', 'طبیعت گردی',
      'زیارت', 'تورلیدر', 'آژانس سفر', 'مسافر',
    ],
    contentHeavy: true,
    visualHeavy: true,
  },
  {
    id: 'shop',
    label: 'فروشگاه',
    keywords: [
      'فروشگاه', 'فروش', 'محصول', 'خرید', 'آنلاین شاپ',
      'ای کامرس', 'بازار', 'مغازه', 'سوپرمارکت', 'لباس',
      'پوشاک', 'کالا',
    ],
    contentHeavy: true,
    visualHeavy: false,
  },
  {
    id: 'education',
    label: 'آموزش',
    keywords: [
      'آموزش', 'دوره', 'کلاس', 'مدرسه', 'دانشگاه', 'آکادمی',
      'تدریس', 'معلم', 'استاد', 'وبینار', 'کارگاه', 'زبان',
    ],
    contentHeavy: true,
    visualHeavy: false,
  },
  {
    id: 'beauty',
    label: 'زیبایی و مراقبت',
    keywords: [
      'آرایش', 'زیبایی', 'سالن', 'پوست', 'مو', 'ناخن',
      'میکاپ', 'آرایشگاه', 'کلینیک زیبایی',
    ],
    contentHeavy: true,
    visualHeavy: true,
  },
  {
    id: 'health',
    label: 'سلامت و پزشکی',
    keywords: [
      'سلامت', 'پزشکی', 'درمان', 'کلینیک', 'بیمارستان',
      'دندانپزشک', 'روانشناس', 'تغذیه', 'مطب', 'دکتر',
      'فیزیوتراپی',
    ],
    contentHeavy: true,
    visualHeavy: false,
  },
  {
    id: 'tech',
    label: 'فناوری و استارتاپ',
    keywords: [
      'استارتاپ', 'اپلیکیشن', 'اپ', 'نرم افزار', 'سامانه',
      'پلتفرم', 'فناوری', 'تکنولوژی', 'سرویس ابری',
      'هوش مصنوعی', 'داده', 'برنامه',
    ],
    contentHeavy: true,
    visualHeavy: false,
  },
  {
    id: 'art',
    label: 'هنر و خلاقیت',
    keywords: [
      'هنر', 'عکس', 'عکاسی', 'فیلم', 'موسیقی', 'طراحی',
      'نقاشی', 'گالری', 'استودیو', 'معمار', 'صنایع دستی',
    ],
    contentHeavy: true,
    visualHeavy: true,
  },
  {
    id: 'realestate',
    label: 'املاک و مسکن',
    keywords: [
      'املاک', 'مسکن', 'خانه', 'آپارتمان', 'ویلا',
      'مشاور املاک', 'ساختمان', 'برج', 'ملک', 'اجاره',
    ],
    contentHeavy: false,
    visualHeavy: true,
  },
  {
    id: 'fashion',
    label: 'مد و پوشاک',
    keywords: [
      'مد', 'پوشاک', 'لباس', 'استایل', 'فشن', 'کالکشن',
      'مانتو', 'شلوار', 'اکسسوری',
    ],
    contentHeavy: true,
    visualHeavy: true,
  },
  {
    id: 'sport',
    label: 'ورزش و تناسب اندام',
    keywords: [
      'ورزش', 'باشگاه', 'تناسب اندام', 'بدنسازی', 'یوگا',
      'مربی', 'فیتنس', 'پیلاتس', 'کراس فیت',
    ],
    contentHeavy: true,
    visualHeavy: true,
  },
  {
    id: 'personal',
    label: 'برند شخصی',
    keywords: [
      'برند شخصی', 'پورتفولیو', 'رزومه', 'فریلنسر', 'مشاور',
      'کوچ', 'اینفلوئنسر', 'خودم',
    ],
    contentHeavy: true,
    visualHeavy: true,
  },
  {
    id: 'general',
    label: 'کسبوکار',
    keywords: [],
    contentHeavy: false,
    visualHeavy: false,
  },
];