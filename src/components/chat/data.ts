/* ═══════════════════════════════════════════════════════════
   CHATBOT — DATA v10 (Legendary)
   ═══════════════════════════════════════════════════════════ */

export type IntentType =
  | 'greeting' | 'ask_about' | 'ask_services' | 'ask_service_web'
  | 'ask_service_ai' | 'ask_service_video' | 'ask_pricing'
  | 'ask_pricing_landing' | 'ask_pricing_corporate' | 'ask_pricing_shop'
  | 'ask_portfolio' | 'ask_portfolio_arka' | 'ask_portfolio_nila'
  | 'ask_portfolio_vira' | 'ask_portfolio_lumen' | 'ask_process'
  | 'ask_timeline' | 'ask_contact' | 'ask_blog' | 'ask_faq'
  | 'ask_about_person' | 'ask_stack' | 'ask_availability'
  | 'ask_testimonials' | 'ask_location' | 'ask_guarantee'
  | 'ask_revision' | 'ask_ownership' | 'start_project' | 'describe_project'
  | 'compliment' | 'complaint' | 'help' | 'thanks' | 'goodbye' | 'unknown';

export type QuickReply = {
  readonly label: string;
  readonly value: string;
};

export type ActionLink = {
  readonly label: string;
  readonly href: string;
  readonly icon?: 'arrow' | 'external' | 'spark' | 'doc' | 'chat';
  readonly primary?: boolean;
  readonly external?: boolean;
};

export type ChatMessage = {
  readonly id: string;
  readonly role: 'user' | 'bot';
  readonly text: string;
  readonly timestamp: number;
  readonly quickReplies?: readonly QuickReply[];
  readonly actions?: readonly ActionLink[];
  readonly state?: 'typing' | 'complete';
  readonly intent?: IntentType;
  readonly reaction?: string;
  readonly bookmarked?: boolean;
};

/* ───────────────────────────────────────────────────────────
   INTENT PATTERNS
   ─────────────────────────────────────────────────────────── */

export const INTENT_PATTERNS: Record<IntentType, readonly string[]> = {
  greeting: ['سلام', 'درود', 'وقت بخیر', 'روز بخیر', 'شب بخیر', 'hi', 'hello', 'hey', 'خوبی', 'چطوری'],
  ask_about: ['تو کی هستی', 'شما کی هستید', 'کی هستی', 'خودت رو معرفی', 'درباره ات', 'بیشتر بدونم', 'معرفی کن', 'who are you'],
  ask_services: ['خدمات', 'چیکار می‌کنی', 'چیکار میکنی', 'چه کاری', 'سرویس', 'می‌تونی چیکار', 'چه خدماتی', 'services', 'what do you do', 'چه کارها'],
  ask_service_web: ['طراحی سایت', 'وبسایت', 'وب سایت', 'website'],
  ask_service_ai: ['محتوای هوشمند', 'محتوای ai', 'هوش مصنوعی', 'ai content', 'محتوای مصنوعی'],
  ask_service_video: ['ویدیو', 'ویدئو', 'فیلم تبلیغاتی', 'ویدیوی سینمایی', 'video', 'کمپین'],
  ask_pricing: ['قیمت', 'هزینه', 'تعرفه', 'پول', 'گرون', 'ارزون', 'بودجه', 'price', 'cost'],
  ask_pricing_landing: ['قیمت لندینگ', 'لندینگ چقدر', 'قیمت لندینگ پیج'],
  ask_pricing_corporate: ['قیمت سایت شرکتی', 'سایت شرکتی چقدر', 'قیمت شرکت'],
  ask_pricing_shop: ['قیمت فروشگاه', 'فروشگاه چقدر', 'قیمت ای کامرس'],
  ask_portfolio: ['نمونه کار', 'پروژه', 'کارهای قبلی', 'پورتفولیو', 'چیکار کردی', 'نمونه', 'case study', 'portfolio', 'کارهات'],
  ask_portfolio_arka: ['آرکا', 'arka'],
  ask_portfolio_nila: ['نیلا', 'nila', 'فروشگاه پوشاک', 'پوشاک'],
  ask_portfolio_vira: ['ویرا', 'vira', 'برندبوک', 'هویت بصری'],
  ask_portfolio_lumen: ['لومن', 'lumen', 'کمپین سینمایی', 'استوری بورد'],
  ask_process: ['فرآیند', 'مراحل', 'چطور کار می‌کنی', 'روش کار', 'process', 'چطور شروع', 'نحوه ی کار', 'مرحله'],
  ask_timeline: ['چقدر طول', 'چند وقت', 'چه زمانی', 'کِی آماده', 'timeline', 'زمان تحویل', 'چند هفته', 'چند روز'],
  ask_contact: ['تماس', 'ارتباط', 'شماره', 'ایمیل', 'چطور تماس', 'contact', 'راه ارتباطی', 'تلفن'],
  ask_blog: ['بلاگ', 'مقاله', 'مطلب', 'یادداشت', 'بخونم', 'blog', 'post', 'article'],
  ask_faq: ['سوال', 'سؤال', 'پرسش', 'faq', 'ابهام'],
  ask_about_person: ['امیرحسین', 'شرکائی', 'شورکائی', 'چه کسی', 'سازنده'],
  ask_stack: ['تکنولوژی', 'با چی میسازی', 'فریمورک', 'زبان برنامه', 'next', 'react', 'استک'],
  ask_availability: ['آزادی', 'وقت داری', 'مشغولی', 'پذیرش پروژه', 'ظرفیت', 'آماده'],
  ask_testimonials: ['نظر', 'رضایت', 'بازخورد', 'testimonial', 'مشتری‌ها چی میگن'],
  ask_location: ['کجایی', 'کجا هستی', 'ادرس', 'آدرس', 'location', 'تهران', 'ایران'],
  ask_guarantee: ['ضمانت', 'تضمین', 'گارانتی', 'guarantee', 'اگر راضی نبودم'],
  ask_revision: ['بازبینی', 'اصلاح', 'تغییر', 'ریویژن', 'revision'],
  ask_ownership: ['کد مال کی', 'مالکیت', 'صاحب کد', 'ownership'],
  start_project: ['شروع پروژه', 'می‌خوام پروژه', 'سفارش', 'می‌خوام بسازی', 'شروع کنیم', 'بزن بریم', 'start project', 'order', 'سفارش بدم'],
  describe_project: [],
  compliment: ['عالی', 'خوبه', 'قشنگ', 'دوستم داشت', 'لذت بخش', 'awesome', 'great', 'nice'],
  complaint: ['بد', 'مشکل', 'ایراد', 'خرابه', 'کند', 'زشت', 'کار نمی‌کنه', 'bad', 'issue', 'problem'],
  help: ['کمک', 'راهنما', 'چیکار کنم', 'چطور', 'help', 'نمی‌دونم'],
  thanks: ['ممنون', 'مرسی', 'سپاس', 'دستت درد نکنه', 'thanks', 'thank you', 'لطف کردی'],
  goodbye: ['خداحافظ', 'بدرود', 'می‌رم', 'خدانگهدار', 'bye', 'goodbye', 'فعلاً', 'فعلا'],
  unknown: [],
};

/* ───────────────────────────────────────────────────────────
   CATEGORY → INTENT
   ─────────────────────────────────────────────────────────── */

export const CATEGORY_TO_INTENT: Record<string, IntentType> = {
  'before-start': 'ask_faq', 'process': 'ask_process', 'pricing': 'ask_pricing',
  'timeline': 'ask_timeline', 'design': 'ask_faq', 'tech': 'ask_stack',
  'content': 'ask_faq', 'seo': 'ask_faq', 'hosting': 'ask_faq',
  'maintenance': 'ask_guarantee', 'ownership': 'ask_ownership',
  'marketing': 'ask_faq', 'ecommerce': 'ask_faq', 'ai': 'ask_service_ai',
  'mobile': 'ask_faq', 'accessibility': 'ask_faq', 'branding': 'ask_faq',
  'video': 'ask_service_video', 'photography': 'ask_faq',
  'security': 'ask_guarantee', 'legal': 'ask_ownership', 'social': 'ask_faq',
  'email-marketing': 'ask_faq', 'automation': 'ask_faq', 'tools': 'ask_stack',
  'career': 'ask_about_person', 'industry-food': 'describe_project',
  'industry-shop': 'describe_project', 'industry-edu': 'describe_project',
  'industry-health': 'describe_project', 'industry-service': 'describe_project',
  'analytics': 'ask_faq', 'performance': 'ask_stack',
  'ux-writing': 'ask_faq', 'conversion': 'ask_faq', 'customer': 'ask_faq',
};

/* ───────────────────────────────────────────────────────────
   RESPONSES
   ─────────────────────────────────────────────────────────── */

type ResponseTemplate = {
  readonly text: string;
  readonly actions?: readonly ActionLink[];
  readonly quickReplies?: readonly QuickReply[];
};

export const RESPONSES: Record<IntentType, readonly ResponseTemplate[]> = {
  greeting: [{
    text: 'سلام! 👋 خوشحالم که اینجایی.\n\nمی‌تونم درباره‌ی خدمات، نمونه‌کارها، قیمت‌ها، فرآیند کار یا هر چیز دیگه‌ای راهنماییت کنم.',
    quickReplies: [
      { label: 'خدماتت چیه؟', value: 'خدماتت چیه؟' },
      { label: 'نمونه‌کار نشونم بده', value: 'نمونه کار نشونم بده' },
      { label: 'قیمت‌ها چطوره؟', value: 'قیمت‌ها چطوره؟' },
    ],
  }],

  ask_about: [{
    text: 'من دستیار دیجیتال **امیرحسین شرکائی**‌ام — طراح و توسعه‌دهنده‌ی وب.\n\nاینجام تا سؤالاتت رو جواب بدم و پروژه‌ات رو بشنوم.',
    actions: [
      { label: 'درباره‌ی امیرحسین', href: '/#about', icon: 'arrow' },
      { label: 'نمونه‌کارها', href: '/work', icon: 'arrow', primary: true },
    ],
  }],

  ask_services: [{
    text: 'سه خدمت اصلی داریم:\n\n**۱. وب‌سایت اختصاصی** — از طراحی UI/UX تا توسعه با Next.js.\n\n**۲. محتوای هوشمند** — متن، تصویر، المان بصری با AI.\n\n**۳. ویدیوی سینمایی** — روایت کوتاه تبلیغاتی.\n\nکدومش برات جالب‌تره؟',
    actions: [
      { label: 'دیدن همه‌ی خدمات', href: '/#services', icon: 'arrow', primary: true },
      { label: 'نمونه‌کارها', href: '/work', icon: 'arrow' },
    ],
    quickReplies: [
      { label: 'درباره‌ی وب‌سایت', value: 'درباره‌ی وب‌سایت بیشتر بگو' },
      { label: 'درباره‌ی AI', value: 'درباره‌ی محتوای هوشمند بگو' },
      { label: 'درباره‌ی ویدیو', value: 'درباره‌ی ویدیو بگو' },
      { label: 'قیمت‌ها', value: 'قیمت‌ها چطوره؟' },
    ],
  }],

  ask_service_web: [{
    text: '**وب‌سایت اختصاصی** — از صفر، بدون قالب.\n\nطراحی UI/UX، پیاده‌سازی با Next.js، بهینه برای موبایل، سرعت لود زیر ۲ ثانیه.',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_service_ai: [{
    text: '**محتوای هوشمند با AI** — متن، تصویر، المان بصری.\n\nتولید محتوای هدفمند با نظارت کامل انسانی.',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_service_video: [{
    text: '**ویدیوی سینمایی** — روایت کوتاه تبلیغاتی.\n\nاز ایده و استوری‌بورد تا صداگذاری و نسخه‌ی نهایی.',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_pricing: [{
    text: 'تعرفه‌ها:\n\n• **لندینگ:** از ۸ میلیون\n• **سایت شرکتی:** از ۱۵ میلیون\n• **فروشگاه:** از ۳۰ میلیون\n\nقیمت دقیق بعد از بررسی — بدون هزینه‌ی پنهان.',
    actions: [{ label: 'دریافت پیش‌فاکتور', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_pricing_landing: [{
    text: '**لندینگ:** از ۸ میلیون تومان.\n\nمدت: ۳ تا ۷ روز.',
    actions: [{ label: 'سفارش لندینگ', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_pricing_corporate: [{
    text: '**سایت شرکتی:** از ۱۵ میلیون تومان.\n\nمدت: ۲ تا ۴ هفته.',
    actions: [{ label: 'سفارش سایت شرکتی', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_pricing_shop: [{
    text: '**فروشگاه آنلاین:** از ۳۰ میلیون تومان.\n\nمدت: ۴ تا ۸ هفته.',
    actions: [{ label: 'سفارش فروشگاه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_portfolio: [{
    text: 'چهار پروژه‌ی منتخب:\n\n• **آرکا** — SaaS\n• **نیلا** — فروشگاه پوشاک\n• **ویرا** — برندبوک\n• **لومن** — کمپین سینمایی',
    actions: [{ label: 'دیدن همه', href: '/work', icon: 'arrow', primary: true }],
  }],

  ask_portfolio_arka: [{
    text: '**آرکا** — پلتفرم SaaS با معماری مینیمال.',
    actions: [{ label: 'دیدن آرکا', href: '/work/arka', icon: 'external', primary: true }],
  }],
  ask_portfolio_nila: [{
    text: '**نیلا** — فروشگاه پوشاک با مسیر خرید ۴ مرحله‌ای.',
    actions: [{ label: 'دیدن نیلا', href: '/work/nila', icon: 'external', primary: true }],
  }],
  ask_portfolio_vira: [{
    text: '**ویرا** — برندبوک با پالت تعاملی و ۲۴۰+ asset.',
    actions: [{ label: 'دیدن ویرا', href: '/work/vira', icon: 'external', primary: true }],
  }],
  ask_portfolio_lumen: [{
    text: '**لومن** — کمپین سینمایی ۴۸ ثانیه‌ای بدون دیالوگ.',
    actions: [{ label: 'دیدن لومن', href: '/work/lumen', icon: 'external', primary: true }],
  }],

  ask_process: [{
    text: 'فرآیند در چهار قدم:\n\n**۰۱. کشف** (۱ هفته)\n**۰۲. طراحی** (۱-۲ هفته)\n**۰۳. توسعه** (۱-۲ هفته)\n**۰۴. تحویل و پشتیبانی** (۳ ماه رایگان)',
    actions: [{ label: 'شروع گفت‌وگو', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_timeline: [{
    text: 'زمان‌بندی:\n\n• **لندینگ:** ۳-۷ روز\n• **شرکتی:** ۲-۴ هفته\n• **فروشگاه:** ۴-۸ هفته',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_contact: [{
    text: 'راه‌های تماس:\n\n• فرم سفارش (توصیه می‌شه)\n• پیامک: ۰۹۳۷ ۱۹۳ ۲۵۴۹\n• روبیکا: @Amirhosein2076',
    actions: [
      { label: 'فرم سفارش', href: '/order', icon: 'spark', primary: true },
      { label: 'پیامک', href: 'sms:+989371932549', icon: 'chat', external: true },
    ],
  }],

  ask_blog: [{
    text: 'بلاگ پر از یادداشت‌های عملی درباره طراحی، سئو، UX و AI.',
    actions: [{ label: 'دیدن مقالات', href: '/blog', icon: 'arrow', primary: true }],
  }],

  ask_faq: [{
    text: 'سؤالات پرتکرار درباره‌ی قیمت، زمان، تکنولوژی و پشتیبانی.\n\nچه چیزی می‌خوای بدونی؟',
    quickReplies: [
      { label: 'قیمت', value: 'قیمت‌ها چطوره؟' },
      { label: 'زمان', value: 'چقدر طول می‌کشه؟' },
      { label: 'پشتیبانی', value: 'پشتیبانی چطوره؟' },
    ],
  }],

  ask_about_person: [{
    text: '**امیرحسین شرکائی** — طراح و توسعه‌دهنده‌ی وب.\n\nسه اصل: طراحی قبل از کد، جزئیات کوچک اثر بزرگ، سرعت بخشی از طراحی.',
    actions: [{ label: 'بیشتر بدون', href: '/#about', icon: 'arrow', primary: true }],
  }],

  ask_stack: [{
    text: 'استک فنی:\n\n• **Next.js 16** + **React 19**\n• **TypeScript** (strict)\n• **CSS Variables**\n• **Vercel**',
    actions: [{ label: 'دیدن نمونه‌کارها', href: '/work', icon: 'arrow', primary: true }],
  }],

  ask_availability: [{
    text: 'بله، آماده‌ی پذیرش پروژه‌های جدیدم. ✨',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_testimonials: [{
    text: 'بازخورد مشتری‌ها:\n\n> «دقیق گوش داد، سؤال‌های درست پرسید.»\n\n> «توجهش به جزئیات ریز من رو متعجب کرد.»',
    actions: [{ label: 'دیدن نظرها', href: '/#testimonials', icon: 'arrow', primary: true }],
  }],

  ask_location: [{
    text: 'ایران — از راه دور.',
    actions: [{ label: 'فرم تماس', href: '/order', icon: 'arrow', primary: true }],
  }],

  ask_guarantee: [{
    text: 'سه تعهد:\n\n• ۳ ماه پشتیبانی رایگان\n• دو مرحله بازبینی\n• تحویل در تاریخ توافق',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_revision: [{
    text: 'دو مرحله بازبینی رایگان: بعد از طراحی و بعد از توسعه.',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  ask_ownership: [{
    text: '**کد کامل به نام خودت.**\n\nبدون وابستگی به من — می‌تونی هر کسی رو برای توسعه استخدام کنی.',
    actions: [{ label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true }],
  }],

  start_project: [{
    text: 'عالی! برای شروع، فرم سفارش رو پر کن.\n\nحداکثر ۲۴ ساعت بعد باهات تماس می‌گیرم.',
    actions: [{ label: 'بازکردن فرم سفارش', href: '/order', icon: 'spark', primary: true }],
  }],

  describe_project: [],

  compliment: [{
    text: 'ممنون! 🙏 اگه سؤال دیگه‌ای داری، بپرس.',
    quickReplies: [
      { label: 'خدمات', value: 'خدماتت چیه؟' },
      { label: 'نمونه‌کار', value: 'نمونه کار نشونم بده' },
    ],
  }],

  complaint: [{
    text: 'متأسفم که تجربه‌ی خوبی نداشتی. می‌تونی دقیق‌تر بگی مشکل کجاست؟',
    quickReplies: [{ label: 'تماس با پشتیبانی', value: 'چطور تماس بگیرم؟' }],
  }],

  help: [{
    text: 'می‌تونم درباره‌ی این موضوعات کمکت کنم:\n\n• خدمات و قیمت‌ها\n• نمونه‌کارها\n• فرآیند و زمان‌بندی\n• مشاوره‌ی پروژه',
    actions: [
      { label: 'خدمات', href: '/#services', icon: 'arrow' },
      { label: 'نمونه‌کارها', href: '/work', icon: 'arrow' },
      { label: 'فرم سفارش', href: '/order', icon: 'spark', primary: true },
    ],
  }],

  thanks: [{
    text: 'خواهش می‌کنم! 😊',
    quickReplies: [{ label: 'فرم سفارش', value: 'می‌خوام پروژه سفارش بدم' }],
  }],

  goodbye: [{
    text: 'خدانگهدار! 👋',
    quickReplies: [{ label: 'دوباره سلام', value: 'سلام' }],
  }],

  unknown: [{
    text: 'سؤالت رو دقیق متوجه نشدم. یه نقشه از همه‌چیز هست:',
    actions: [
      { label: 'خدمات', href: '/#services', icon: 'arrow' },
      { label: 'نمونه‌کارها', href: '/work', icon: 'arrow' },
      { label: 'بلاگ', href: '/blog', icon: 'arrow' },
      { label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true },
    ],
    quickReplies: [
      { label: 'قیمت‌ها', value: 'قیمت‌ها چطوره؟' },
      { label: 'فرآیند کار', value: 'فرآیند کار چطوره؟' },
      { label: 'درباره‌ی من', value: 'درباره ات بگو' },
    ],
  }],
};

/* ───────────────────────────────────────────────────────────
   BUSINESS KEYWORDS
   ─────────────────────────────────────────────────────────── */

export const BUSINESS_KEYWORDS: Record<string, string> = {
  'رستوران': 'رستوران', 'کافه': 'کافه', 'کافی شاپ': 'کافه',
  'فروشگاه': 'فروشگاه', 'کفش': 'فروشگاه کفش', 'پوشاک': 'فروشگاه پوشاک',
  'لباس': 'فروشگاه پوشاک', 'آموزشگاه': 'آموزشگاه', 'زبان': 'آموزشگاه زبان',
  'کلینیک': 'کلینیک', 'پوست': 'کلینیک پوست', 'دندانپزشک': 'دندانپزشکی',
  'آرایشگاه': 'سالن زیبایی', 'باشگاه': 'باشگاه ورزشی', 'هتل': 'هتل',
  'تور': 'آژانس گردشگری', 'استارتاپ': 'استارتاپ', 'پلتفرم': 'پلتفرم',
  'شرکت': 'شرکت', 'عکاسی': 'عکاسی', 'مشاور': 'مشاور', 'وکیل': 'دفتر وکالت',
  'پزشک': 'مطب پزشکی', 'دکتر': 'مطب پزشکی', 'لوازم خانگی': 'فروشگاه لوازم خانگی',
  'موبایل': 'فروشگاه موبایل', 'لوازم یدکی': 'فروشگاه لوازم یدکی',
  'گل': 'گل‌فروشی', 'کتاب': 'فروشگاه کتاب', 'ابزار': 'فروشگاه ابزار',
  'ورزشی': 'فروشگاه ورزشی', 'آرایشی': 'فروشگاه آرایشی',
  'سوپرمارکت': 'سوپرمارکت', 'نانوایی': 'نانوایی', 'قنادی': 'قنادی',
  'آتلیه': 'آتلیه', 'بیمه': 'بیمه', 'حسابداری': 'حسابداری',
  'طلا': 'طلا و جواهر', 'جواهری': 'طلا و جواهر',
};

/* ───────────────────────────────────────────────────────────
   SITE SECTIONS
   ─────────────────────────────────────────────────────────── */

export const SITE_SECTIONS = [
  { id: 'home', label: 'خانه', href: '/', keywords: ['خانه', 'صفحه اصلی', 'شروع سایت'] },
  { id: 'services', label: 'خدمات', href: '/#services', keywords: ['خدمات', 'سرویس'] },
  { id: 'process', label: 'فرآیند', href: '/#process', keywords: ['فرآیند', 'مراحل', 'روش کار'] },
  { id: 'portfolio', label: 'نمونه‌کارها', href: '/work', keywords: ['نمونه کار', 'پروژه', 'پورتفولیو'] },
  { id: 'about', label: 'درباره‌ی من', href: '/#about', keywords: ['درباره', 'امیرحسین'] },
  { id: 'blog', label: 'بلاگ', href: '/blog', keywords: ['بلاگ', 'مقاله', 'یادداشت'] },
  { id: 'faq', label: 'سؤالات', href: '/#faq', keywords: ['سؤال', 'سوال', 'پرسش'] },
  { id: 'order', label: 'سفارش', href: '/order', keywords: ['سفارش', 'فرم', 'شروع'] },
];