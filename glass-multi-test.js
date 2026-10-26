/* ═══════════════════════════════════════════════════════════
   LIQUID GLASS — MULTI-HYPOTHESIS TEST (7 tests × 3s)
   ═══════════════════════════════════════════════════════════ */
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const pill = document.querySelector('.site-nav .nav-pill');
  if (!pill) { console.error('❌ .nav-pill پیدا نشد'); return; }

  console.log('%c════ LIQUID GLASS — 7 TESTS ════', 'color:#0d7377;font-weight:bold;font-size:14px');
  console.log('%cبه مدت ~25 ثانیه، به نوار ناوبری بالای صفحه نگاه کن', 'color:#666;font-size:12px');
  console.log('%cدر کدام تست، شیشه «اعوجاج لنز/ذره‌بین» پیدا می‌کند؟', 'color:#666;font-size:12px');

  const initialFilter = pill.style.filter;
  let injected = [];

  function inject(id, css) {
    const ex = document.getElementById(id);
    if (ex) ex.remove();
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
    injected.push(id);
  }

  function cleanup() {
    injected.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    injected = [];
    if (initialFilter) pill.style.filter = initialFilter;
    else pill.style.removeProperty('filter');
  }

  const tests = [
    {
      name: '① Baseline (بدون تغییر)',
      desc: 'وضعیت فعلی — بعد از rollback H1',
      setup: () => {},
    },
    {
      name: '② filter: none (H1 فقط)',
      desc: 'حذف filter نامعتبر از pill',
      setup: () => pill.style.setProperty('filter', 'none', 'important'),
    },
    {
      name: '③ حذف backdrop-filter از ::before (H5)',
      desc: 'موتور JS تنها — شیشه از موتور JS فقط',
      setup: () => inject('t-h5',
        '.site-nav .nav-pill::before, .site-nav .nav-pill::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }'),
    },
    {
      name: '④ H1 + H5 (ترکیب)',
      desc: 'حذف filter + حذف blur ::before',
      setup: () => {
        pill.style.setProperty('filter', 'none', 'important');
        inject('t-h1h5',
          '.site-nav .nav-pill::before, .site-nav .nav-pill::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }');
      },
    },
    {
      name: '⑤ حذف isolation از والدها (H3)',
      desc: 'حذف stacking context از pill و والدینش',
      setup: () => inject('t-h3',
        '.site-nav, .site-nav .nav-inner, .site-nav .nav-pill, .site-nav .desktop-nav, .site-nav .container, .site-nav .nav-inner > * { isolation: auto !important; }'),
    },
    {
      name: '⑥ حذف transform از والدها (H3b)',
      desc: 'حذف هر transform که stacking context می‌سازد',
      setup: () => inject('t-h3b',
        '.site-nav, .site-nav .nav-inner, .site-nav .nav-pill, .site-nav .desktop-nav, .site-nav .container { transform: none !important; }'),
    },
    {
      name: '⑦ حذف backdrop-filter از .nav-inner والد (H6)',
      desc: 'والد خودش شیشه‌ای است و ممکن است pill را مات کند',
      setup: () => inject('t-h6',
        '.site-nav .nav-inner, .site-nav.is-scrolled .nav-inner { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }'),
    },
    {
      name: '⑧ همه با هم (H1+H5+H3+H3b+H6)',
      desc: 'ترکیب کامل — همه stacking contexts حذف',
      setup: () => {
        pill.style.setProperty('filter', 'none', 'important');
        inject('t-all',
          '.site-nav, .site-nav .nav-inner, .site-nav .nav-pill, .site-nav .desktop-nav, .site-nav .container { isolation: auto !important; transform: none !important; }' +
          '.site-nav .nav-pill::before, .site-nav .nav-pill::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }' +
          '.site-nav .nav-inner, .site-nav.is-scrolled .nav-inner { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }');
      },
    },
  ];

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    console.log('');
    console.log(`%c▶ تست ${t.name}`, 'color:#f59e0b;font-weight:bold;font-size:13px');
    console.log(`   ${t.desc}`);
    console.log('%c   ⏱ الان ۳ ثانیه به نوار ناوبری نگاه کن...', 'color:#888;font-style:italic');
    try { t.setup(); } catch (e) { console.error('setup error:', e); }
    await sleep(3000);
    console.log('%c   ✓ تمام', 'color:#22c55e;font-size:11px');
    try { cleanup(); } catch (e) { console.error('cleanup error:', e); }
    await sleep(500);
  }

  console.log('');
  console.log('%c═══════════════════════════════════════════════════', 'color:#22c55e;font-weight:bold');
  console.log('%c✅ تمام ۷ تست اجرا شد — صفحه به حالت عادی برگشت', 'color:#22c55e;font-weight:bold;font-size:14px');
  console.log('%c═══════════════════════════════════════════════════', 'color:#22c55e;font-weight:bold');
  console.log('');
  console.log('%c📋 لطفاً به AI بگو:', 'color:#0d7377;font-weight:bold;font-size:13px');
  console.log('   «در تست X اعوجاج ظاهر شد» (اگر چند تست، همه را بگو)');
  console.log('   یا «هیچ کدام» اگر در هیچ تستی اعوجاج ندیدی');
  console.log('');
  console.log('   اگر تفاوت واضح بود، توضیح کوتاه هم بده:');
  console.log('   مثلاً «در تست ۴ لبه‌های لنز واضح شد ولی در تست ۳ فقط شیشه شفاف‌تر بود»');
  console.log('');
})();