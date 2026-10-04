/* ═══════════════════════════════════════════════════════════
   CHATBOT — DATA v11 (Legendary · Warm Edition)
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
  readonly replyTo?: {
    readonly id: string;
    readonly text: string;
    readonly role: 'user' | 'bot';
  };
};

/* ───────────────────────────────────────────────────────────
   INTENT PATTERNS
   ─────────────────────────────────────────────────────────── */

export const INTENT_PATTERNS: Record<IntentType, readonly string[]> = {
  greeting: ['سلام', 'درود', 'وقت بخیر', 'روز بخیر', 'شب بخیر', 'hi', 'hello', 'hey', 'خوبی', 'چطوری', 'چه خبر'],
  ask_about: ['تو کی هستی', 'شما کی هستید', 'کی هستی', 'خودت رو معرفی', 'درباره ات', 'بیشتر بدونم', 'معرفی کن', 'who are you'],
  ask_services: ['خدمات', 'چیکار می‌کنی', 'چیکار میکنی', 'چه کاری', 'سرویس', 'می‌تونی چیکار', 'چه خدماتی', 'services', 'what do you do', 'چه کارها'],
  ask_service_web: ['طراحی سایت', 'وبسایت', 'وب سایت', 'website'],
  ask_service_ai: ['محتوای هوشمند', 'محتوای ai', 'هوش مصنوعی', 'ai content', 'محتوای مصنوعی'],
  ask_service_video: ['ویدیو', 'ویدئو', 'فیلم تبلیغاتی', 'ویدیوی سینمایی', 'video', 'کمپین'],
  ask_pricing: ['قیمت', 'هزینه', 'تعرفه', 'پول', 'گرون', 'ارزون', 'بودجه', 'price', 'cost', 'چند در میاد'],
  ask_pricing_landing: ['قیمت لندینگ', 'لندینگ چقدر', 'قیمت لندینگ پیج'],
  ask_pricing_corporate: ['قیمت سایت شرکتی', 'سایت شرکتی چقدر', 'قیمت شرکت'],
  ask_pricing_shop: ['قیمت فروشگاه', 'فروشگاه چقدر', 'قیمت ای کامرس'],
  ask_portfolio: ['نمونه کار', 'پروژه', 'کارهای قبلی', 'پورتفولیو', 'چیکار کردی', 'نمونه', 'case study', 'portfolio', 'کارهات'],
  ask_portfolio_arka: ['آرکا', 'arka'],
  ask_portfolio_nila: ['نیلا', 'nila'],
  ask_portfolio_vira: ['ویرا', 'vira'],
  ask_portfolio_lumen: ['لومن', 'lumen'],
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
  compliment: ['عالی', 'خوبه', 'قشنگ', 'دوستم داشت', 'لذت بخش', 'awesome', 'great', 'nice', 'ایول', 'دمت گرم'],
  complaint: ['بد', 'مشکل', 'ایراد', 'خرابه', 'کند', 'زشت', 'کار نمی‌کنه', 'bad', 'issue', 'problem', 'ناراضی'],
  help: ['کمک', 'راهنما', 'چیکار کنم', 'چطور', 'help', 'نمی‌دونم'],
  thanks: ['ممنون', 'مرسی', 'سپاس', 'دستت درد نکنه', 'thanks', 'thank you', 'لطف کردی', 'دستت درد نکنه'],
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
   RESPONSES — با تنوع و لحن گرم
   ─────────────────────────────────────────────────────────── */

type ResponseTemplate = {
  readonly text: string;
  readonly actions?: readonly ActionLink[];
  readonly quickReplies?: readonly QuickReply[];
};

export const RESPONSES: Record<IntentType, readonly ResponseTemplate[]> = {
  greeting: [
    {
      text: 'سلاااام! 👋\n\nخوش اومدی. من دستیار امیرحسینم.\n\nچی تو ذهنته؟',
      quickReplies: [
        { label: 'چیکار می‌کنید؟', value: 'خدماتت چیه؟' },
        { label: 'یه نمونه ببینم', value: 'نمونه کار نشونم بده' },
        { label: 'قیمت چطوره؟', value: 'قیمت‌ها چطوره؟' },
      ],
    },
    {
      text: 'سلاااام! 😊\n\nچقدر خوب که اومدی.\n\nبگو ببینم چی می‌خوای بدونی؟',
      quickReplies: [
        { label: 'خدماتتون چیه؟', value: 'خدماتت چیه؟' },
        { label: 'کاراتون رو ببینم', value: 'نمونه کار نشونم بده' },
      ],
    },
    {
      text: 'سلام! 👋\n\nمن اینجام تا هر چی لازم داری رو جواب بدم.\n\nشروع کن!',
      quickReplies: [
        { label: 'قیمت', value: 'قیمت‌ها چطوره؟' },
        { label: 'نمونه‌کارها', value: 'نمونه کار نشونم بده' },
        { label: 'فرآیند کار', value: 'فرآیند کار چطوره؟' },
      ],
    },
    {
      text: 'سلااااام! 😄\n\nخب... از کجا شروع کنیم؟\n\nیه ایده داری یا فقط می‌خوای گشتی بزنی؟',
      quickReplies: [
        { label: 'ایده دارم', value: 'می‌خوام پروژه سفارش بدم' },
        { label: 'اول بگردم', value: 'خدماتت چیه؟' },
      ],
    },
  ],

  ask_about: [
    {
      text: 'من دستیار دیجیتال **امیرحسین شرکائی**‌ام 👋\n\nطراح و توسعه‌دهنده‌ی وب. اینجام تا سؤالاتت رو جواب بدم و اگه خواستی، پروژه‌ات رو بشنوم.',
      actions: [
        { label: 'کی هست امیرحسین؟', href: '/#about', icon: 'arrow' },
        { label: 'کاراش رو ببین', href: '/work', icon: 'arrow', primary: true },
      ],
    },
    {
      text: 'یه دستیارم — ساخته‌ی **امیرحسین شرکائی** ✨\n\nماموریت من: جواب دادن به سؤالاتت و راهنمایی تو به بهترین مسیر.',
      actions: [
        { label: 'بیشتر درباره‌ش بدون', href: '/#about', icon: 'arrow', primary: true },
      ],
    },
  ],

  ask_services: [
    {
      text: 'سه چیز اصلی بلدیم:\n\n🎨 **۱. وب‌سایت اختصاصی** — از صفر، بدون قالب آماده\n\n✨ **۲. محتوای هوشمند** — متن، تصویر، المان بصری با AI\n\n🎬 **۳. ویدیوی سینمایی** — روایت کوتاه تبلیغاتی\n\nکدومش برات جالب‌تره؟',
      actions: [
        { label: 'همه رو ببین', href: '/#services', icon: 'arrow', primary: true },
      ],
      quickReplies: [
        { label: 'درباره‌ی سایت', value: 'درباره‌ی وب‌سایت بیشتر بگو' },
        { label: 'درباره‌ی AI', value: 'درباره‌ی محتوای هوشمند بگو' },
        { label: 'درباره‌ی ویدیو', value: 'درباره‌ی ویدیو بگو' },
      ],
    },
  ],

  ask_service_web: [
    {
      text: '**وب‌سایت اختصاصی** — از صفر، بدون قالب 🎨\n\nطراحی UI/UX، پیاده‌سازی با Next.js، بهینه برای موبایل، سرعت لود زیر ۲ ثانیه. کد کامل هم به اسم خودت ثبت می‌شه.',
      actions: [{ label: 'بریم بسازیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_service_ai: [
    {
      text: '**محتوای هوشمند با AI** ✨\n\nمتن، تصویر، المان بصری — همه با نظارت کامل انسانی. یعنی سرعت AI بدون از دست دادن کیفیت.',
      actions: [{ label: 'بریم شروع کنیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_service_video: [
    {
      text: '**ویدیوی سینمایی** 🎬\n\nاز ایده و استوری‌بورد تا صداگذاری و نسخه‌ی نهایی. بدون نیاز به تیم فیلم‌برداری و بودجه‌ی سنگین.',
      actions: [{ label: 'بریم بسازیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_pricing: [
    {
      text: 'بذار راحت بگم 💰\n\n• **لندینگ:** از ۸ میلیون\n• **سایت شرکتی:** از ۱۵ میلیون\n• **فروشگاه:** از ۳۰ میلیون\n\nقیمت دقیق بعد از بررسی — **هیچ هزینه‌ی پنهانی نداریم**.',
      actions: [{ label: 'تخمین دقیق‌تر بگیر', href: '/order', icon: 'spark', primary: true }],
      quickReplies: [
        { label: 'لندینگ چقدر؟', value: 'قیمت لندینگ چقدره؟' },
        { label: 'شرکتی چقدر؟', value: 'قیمت سایت شرکتی چقدره؟' },
        { label: 'فروشگاه چقدر؟', value: 'قیمت فروشگاه چقدره؟' },
      ],
    },
    {
      text: 'تعرفه‌ها رو شفاف می‌گم 👇\n\n**لندینگ** — از ۸ میلیون\n**شرکتی** — از ۱۵ میلیون\n**فروشگاه** — از ۳۰ میلیون\n\nاگه پروژه‌ت خاصه یا نمی‌دونی کدومه، فرم سفارش رو پر کن — دقیق تخمین می‌زنم.',
      actions: [{ label: 'یه تخمین دقیق بگیر', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_pricing_landing: [
    {
      text: '**لندینگ:** از ۸ میلیون تومان.\n\nمدت: ۳ تا ۷ روز.\n\nشامل: طراحی اختصاصی، موبایل‌فرندلی، سرعت زیر ۲ ثانیه.',
      actions: [{ label: 'سفارش لندینگ', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_pricing_corporate: [
    {
      text: '**سایت شرکتی:** از ۱۵ میلیون تومان.\n\nمدت: ۲ تا ۴ هفته.\n\nشامل: طراحی چند صفحه، وبلاگ، فرم تماس، پنل ساده.',
      actions: [{ label: 'سفارش سایت شرکتی', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_pricing_shop: [
    {
      text: '**فروشگاه آنلاین:** از ۳۰ میلیون تومان.\n\nمدت: ۴ تا ۸ هفته.\n\nشامل: سبد خرید، درگاه پرداخت، پنل مدیریت محصولات.',
      actions: [{ label: 'سفارش فروشگاه', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_portfolio: [
    {
      text: 'چهار تا پروژه‌ی منتخب داریم که هر کدوم یه داستان داره 👇\n\n🚀 **آرکا** — پلتفرم SaaS\n👗 **نیلا** — فروشگاه پوشاک\n🎨 **ویرا** — برندبوک\n🎬 **لومن** — کمپین سینمایی\n\nکدوم رو ببینیم؟',
      actions: [{ label: 'همه رو ببین', href: '/work', icon: 'arrow', primary: true }],
      quickReplies: [
        { label: 'آرکا', value: 'درباره‌ی آرکا بگو' },
        { label: 'نیلا', value: 'درباره‌ی نیلا بگو' },
        { label: 'ویرا', value: 'درباره‌ی ویرا بگو' },
        { label: 'لومن', value: 'درباره‌ی لومن بگو' },
      ],
    },
  ],

  ask_portfolio_arka: [
    {
      text: '**آرکا** 🚀 — پلتفرم SaaS.\n\nچالش: انتقال ارزش محصول در ۳ ثانیه.\nراه‌حل: معماری مینیمال، دیزاین سیستم تمیز، تست سه نسخه از Hero.',
      actions: [{ label: 'آرکا رو ببین', href: '/work/arka', icon: 'external', primary: true }],
    },
  ],
  ask_portfolio_nila: [
    {
      text: '**نیلا** 👗 — فروشگاه پوشاک آنلاین.\n\nچالش: کاهش سبدهای رهاشده.\nراه‌حل: مسیر خرید ۴ مرحله‌ای، سبد خرید drawer، Quick View modal.',
      actions: [{ label: 'نیلا رو ببین', href: '/work/nila', icon: 'external', primary: true }],
    },
  ],
  ask_portfolio_vira: [
    {
      text: '**ویرا** 🎨 — برندبوک استودیو با AI.\n\nچالش: هویت بصری کامل در زمان کم.\nراه‌حل: پالت تعاملی، ۶ واریاسیون لوگو، ۲۴۰+ asset.',
      actions: [{ label: 'ویرا رو ببین', href: '/work/vira', icon: 'external', primary: true }],
    },
  ],
  ask_portfolio_lumen: [
    {
      text: '**لومن** 🎬 — کمپین سینمایی.\n\nچالش: روایت بدون دیالوگ — فقط تصویر، نور، ریتم.\nنتیجه: ۴۸ ثانیه، کاهش ۸۰٪ هزینه تولید.',
      actions: [{ label: 'لومن رو ببین', href: '/work/lumen', icon: 'external', primary: true }],
    },
  ],

  ask_process: [
    {
      text: 'کار با ما چهار قدمه 👇\n\n**۰۱. کشف** — یه گفت‌وگوی ۳۰ دقیقه‌ای رایگان\n**۰۲. طراحی** — wireframe و UI اختصاصی\n**۰۳. توسعه** — پیاده‌سازی با Next.js\n**۰۴. تحویل** — انتشار + ۳ ماه پشتیبانی رایگان\n\nکدوم قدم برات مهم‌تره بدونی؟',
      actions: [{ label: 'بریم قدم اول', href: '/order', icon: 'spark', primary: true }],
      quickReplies: [
        { label: 'زمان‌بندی؟', value: 'چقدر طول می‌کشه؟' },
        { label: 'هزینه؟', value: 'قیمت‌ها چطوره؟' },
      ],
    },
  ],

  ask_timeline: [
    {
      text: 'زمان‌بندی معمولمون 👇\n\n• **لندینگ:** ۳ تا ۷ روز\n• **شرکتی:** ۲ تا ۴ هفته\n• **فروشگاه:** ۴ تا ۸ هفته\n\nتاریخ دقیق توی قرارداد نوشته می‌شه — به تأخیر پایبند نیستیم.',
      actions: [{ label: 'شروع کنیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_contact: [
    {
      text: 'راحت‌ترین راه، فرم سفارشه — چون جزئیات پروژه رو هم می‌تونی بنویسی 👇\n\nاگه ترجیح می‌دی:\n📱 **پیامک:** ۰۹۳۷ ۱۹۳ ۲۵۴۹\n💬 **روبیکا:** @Amirhosein2076\n📨 **ایتا:** @AmirHosseinsherakaei',
      actions: [
        { label: 'فرم سفارش', href: '/order', icon: 'spark', primary: true },
        { label: 'پیامک بزن', href: 'sms:+989371932549', icon: 'chat', external: true },
      ],
    },
  ],

  ask_blog: [
    {
      text: 'بلاگ پر از یادداشت‌های عملیه 📚\n\nدرباره‌ی طراحی، سئو، UX، AI — همه چی که برای رشد کسب‌وکارت لازمه.',
      actions: [{ label: 'یه گشتی بزن', href: '/blog', icon: 'arrow', primary: true }],
    },
  ],

  ask_faq: [
    {
      text: 'سؤالات پرتکرار درباره‌ی قیمت، زمان، تکنولوژی و پشتیبانی 👇\n\nچه چیزی می‌خوای بدونی؟',
      quickReplies: [
        { label: 'قیمت', value: 'قیمت‌ها چطوره؟' },
        { label: 'زمان', value: 'چقدر طول می‌کشه؟' },
        { label: 'پشتیبانی', value: 'پشتیبانی چطوره؟' },
      ],
    },
  ],

  ask_about_person: [
    {
      text: '**امیرحسین شرکائی** — طراح و توسعه‌دهنده‌ی وب 🧑‍💻\n\nسه اصل کاری:\n• طراحی قبل از کد\n• جزئیات کوچک، اثر بزرگ\n• سرعت، بخشی از طراحی',
      actions: [{ label: 'بیشتر بدون', href: '/#about', icon: 'arrow', primary: true }],
    },
  ],

  ask_stack: [
    {
      text: 'استک فنی ما 🛠\n\n• **Next.js 16** + **React 19**\n• **TypeScript** (strict)\n• **CSS Variables** — بدون Tailwind\n• **Vercel** برای میزبانی\n\nتمرکز روی سرعت، دسترسی‌پذیری، استانداردهای وب.',
      actions: [{ label: 'کارامون رو ببین', href: '/work', icon: 'arrow', primary: true }],
    },
  ],

  ask_availability: [
    {
      text: 'آره! الان چند تا اسلات خالیه 🚀\n\nفرم سفارش رو پر کن، ۲۴ ساعت بعد باهات تماس می‌گیرم.',
      actions: [{ label: 'شروع کنیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_testimonials: [
    {
      text: 'مشتری‌ها چی گفتن 👇\n\n> «دقیق گوش داد، سؤال‌های درست پرسید.»\n\n> «توجهش به جزئیات ریز من رو متعجب کرد.»\n\n> «روند کار کاملاً شفاف بود.»',
      actions: [{ label: 'همه‌ی نظرها', href: '/#testimonials', icon: 'arrow', primary: true }],
    },
  ],

  ask_location: [
    {
      text: 'من تهرونم، ولی با کل ایران و حتی مشتری‌های خارج از کشور کار می‌کنم 🌍\n\nارتباط آنلاین — پیامک، روبیکا، ایتا.',
      actions: [{ label: 'فرم تماس', href: '/order', icon: 'arrow', primary: true }],
    },
  ],

  ask_guarantee: [
    {
      text: 'سه تعهد اصلی 👇\n\n• **۳ ماه پشتیبانی رایگان** — رفع باگ، آپدیت، سؤالات\n• **دو مرحله بازبینی** — بدون هزینه‌ی اضافه\n• **تحویل در تاریخ توافق** — با جریمه‌ی تأخیر',
      actions: [{ label: 'شروع کنیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_revision: [
    {
      text: 'دو بار می‌تونی بگی «اینو عوض کن» 🎨\n\nبعد از طراحی، و بعد از توسعه. هر دو مرحله رایگانه — بدون هزینه‌ی اضافه.',
      actions: [{ label: 'شروع کنیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  ask_ownership: [
    {
      text: 'کد کامل مال خودته ✅\n\nبعد از تحویل، کد روی گیت‌هاب خودت، دامنه و هاست به اسم خودت. **هیچ وابستگی‌ای به من نداری.**',
      actions: [{ label: 'شروع کنیم', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  start_project: [
    {
      text: 'خب، بزن بریم! 🚀\n\nفرم سفارش رو پر کن — چند دقیقه وقت بذار و جزئیات رو بنویس، حتی اگه کامل نیست. حداکثر ۲۴ ساعت بعد باهات تماس می‌گیرم.',
      actions: [{ label: 'بازکردن فرم سفارش', href: '/order', icon: 'spark', primary: true }],
    },
  ],

  describe_project: [],

  compliment: [
    {
      text: 'وای، ممنون! 😊\n\nاین حرفا انرژی می‌ده. چیز دیگه‌ای هست که بخوای بدونی؟',
      quickReplies: [
        { label: 'خدمات', value: 'خدماتت چیه؟' },
        { label: 'نمونه‌کار', value: 'نمونه کار نشونم بده' },
      ],
    },
    {
      text: 'مرسی! 🙏\n\nخوشحالم که به‌کار اومد. اگه سؤال دیگه‌ای داری، همین‌جام.',
      quickReplies: [
        { label: 'قیمت‌ها؟', value: 'قیمت‌ها چطوره؟' },
        { label: 'شروع کنیم؟', value: 'می‌خوام پروژه سفارش بدم' },
      ],
    },
  ],

  complaint: [
    {
      text: 'اوف، اینو شنیدن ناراحتم کرد 😔\n\nبذار درستش کنیم. هر چی هست، بگو — من اینجام تا کمک کنم، نه دفاع کنم.',
      quickReplies: [{ label: 'راه تماس', value: 'چطور تماس بگیرم؟' }],
    },
  ],

  help: [
    {
      text: 'می‌تونم توی این موضوعات کمکت کنم 👇\n\n• خدمات و قیمت‌ها\n• نمونه‌کارها و پروژه‌ها\n• فرآیند و زمان‌بندی\n• مشاوره‌ی پروژه\n\nیا اگه ایده‌ات رو بگی، مسیرش رو برات می‌چینم.',
      actions: [
        { label: 'خدمات', href: '/#services', icon: 'arrow' },
        { label: 'نمونه‌کارها', href: '/work', icon: 'arrow' },
        { label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true },
      ],
    },
  ],

  thanks: [
    {
      text: 'خواهش می‌کنم! 😊\n\nهر وقت سؤالی داشتی، همین‌جام.',
      quickReplies: [{ label: 'شروع کنیم', value: 'می‌خوام پروژه سفارش بدم' }],
    },
    {
      text: 'کاری نکردم که! 🙏\n\nچیز دیگه‌ای هست که کمکت کنم؟',
    },
    {
      text: 'قربانت 🌟\n\nموفق باشی!',
    },
  ],

  goodbye: [
    {
      text: 'خدانگهدار! 👋\n\nروز خوبی داشته باشی.',
      quickReplies: [{ label: 'دوباره سلام', value: 'سلام' }],
    },
    {
      text: 'فعلاً! ✨\n\nهر وقت خواستی برگرد — من اینجام.',
    },
  ],

  unknown: [
    {
      text: 'هوم، مطمئن نیستم درست متوجه شدم 🤔\n\nمنظورت یکی از اینا بود؟',
      actions: [
        { label: 'خدمات', href: '/#services', icon: 'arrow' },
        { label: 'نمونه‌کارها', href: '/work', icon: 'arrow' },
        { label: 'شروع پروژه', href: '/order', icon: 'spark', primary: true },
      ],
      quickReplies: [
        { label: 'قیمت‌ها', value: 'قیمت‌ها چطوره؟' },
        { label: 'فرآیند کار', value: 'فرآیند کار چطوره؟' },
        { label: 'درباره‌ات', value: 'درباره ات بگو' },
      ],
    },
    {
      text: 'ببخشید، درست نگرفتم 😅\n\nمی‌تونی یه جور دیگه بگی؟ یا از اینا انتخاب کن:',
      quickReplies: [
        { label: 'خدمات', value: 'خدماتت چیه؟' },
        { label: 'قیمت', value: 'قیمت‌ها چطوره؟' },
        { label: 'تماس', value: 'چطور تماس بگیرم؟' },
      ],
    },
  ],
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
  'پزشک': 'مطب پزشکی', 'دکتر': 'مطب پزشکی', 'موبایل': 'فروشگاه موبایل',
  'طلا': 'طلا و جواهر', 'جواهری': 'طلا و جواهر', 'بیمه': 'بیمه',
  'حسابداری': 'حسابداری', 'قنادی': 'قنادی', 'نانوایی': 'نانوایی',
  'گل': 'گل‌فروشی', 'کتاب': 'فروشگاه کتاب', 'ورزشی': 'فروشگاه ورزشی',
};

/* ───────────────────────────────────────────────────────────
   SITE SECTIONS
   ─────────────────────────────────────────────────────────── */

export const SITE_SECTIONS = [
  { id: 'home', label: 'خانه', href: '/', keywords: ['خانه', 'صفحه اصلی'] },
  { id: 'services', label: 'خدمات', href: '/#services', keywords: ['خدمات', 'سرویس'] },
  { id: 'process', label: 'فرآیند', href: '/#process', keywords: ['فرآیند', 'مراحل'] },
  { id: 'portfolio', label: 'نمونه‌کارها', href: '/work', keywords: ['نمونه کار', 'پروژه'] },
  { id: 'about', label: 'درباره‌ی من', href: '/#about', keywords: ['درباره', 'امیرحسین'] },
  { id: 'blog', label: 'بلاگ', href: '/blog', keywords: ['بلاگ', 'مقاله'] },
  { id: 'faq', label: 'سؤالات', href: '/#faq', keywords: ['سؤال', 'پرسش'] },
  { id: 'order', label: 'سفارش', href: '/order', keywords: ['سفارش', 'فرم'] },
];