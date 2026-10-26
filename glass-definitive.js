(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const pill = document.querySelector('.site-nav .nav-pill');
  if (!pill) { console.error('❌ .nav-pill پیدا نشد'); return; }

  console.log('%c══════════════════════════════════════════', 'color:#0d7377;font-weight:bold;font-size:14px');
  console.log('%c تشخیص قطعی شیشه — گزارش از موتور کروم', 'color:#0d7377;font-weight:bold;font-size:14px');
  console.log('%c══════════════════════════════════════════', 'color:#0d7377;font-weight:bold;font-size:14px');
  console.log('');

  const result = {
    browser: {
      userAgent: navigator.userAgent,
      isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
      isChromium: /Chrome\/|Chromium\/|Edg\//i.test(navigator.userAgent),
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
    },
    computedStyles: {},
    backdropRoot: {},
    svgFilter: {},
    supportChecks: {},
    nestedTest: {},
    verdicts: [],
  };

  // ═══ ۱. وضعیت فعلی pill ═══
  const cs = getComputedStyle(pill);
  result.computedStyles = {
    backdropFilter: cs.backdropFilter || '(خالی)',
    webkitBackdropFilter: cs.webkitBackdropFilter || '(خالی)',
    filter: cs.filter || '(هیچ)',
    isolation: cs.isolation,
    transform: cs.transform,
    contain: cs.contain,
    willChange: cs.willChange,
    zIndex: cs.zIndex,
    opacity: cs.opacity,
    position: cs.position,
    mixBlendMode: cs.mixBlendMode,
  };

  // ═══ ۲. Backdrop Root — آیا والد .nav-inner backdrop-filter دارد؟ ═══
  const navInner = pill.closest('.nav-inner');
  if (navInner) {
    const niCs = getComputedStyle(navInner);
    const niBF = niCs.backdropFilter || niCs.webkitBackdropFilter || 'none';
    const niTransform = niCs.transform;
    const niIsolation = niCs.isolation;

    result.backdropRoot = {
      navInnerExists: true,
      navInnerBackdropFilter: niBF,
      navInnerTransform: niTransform,
      navInnerIsolation: niIsolation,
      navInnerCreatesBackdropRoot: (
        (niBF && niBF !== 'none') ||
        (niTransform && niTransform !== 'none') ||
        (niIsolation && niIsolation !== 'auto')
      ),
    };
  } else {
    result.backdropRoot = { navInnerExists: false };
  }

  // ═══ ۳. SVG Filter — آیا filter واقعاً در DOM هست؟ ═══
  const inlineBF = pill.style.backdropFilter || pill.style.webkitBackdropFilter || '';
  const urlMatch = inlineBF.match(/url\(#([^)]+)\)/);
  if (urlMatch) {
    const filterId = urlMatch[1];
    const filterEl = document.getElementById(filterId);

    result.svgFilter = {
      filterIdInInlineStyle: filterId,
      filterElementExistsInDOM: !!filterEl,
      filterElementChildren: filterEl ? filterEl.children.length : 0,
      filterElementChildTags: filterEl ? Array.from(filterEl.children).map(c => c.tagName).join(',') : '(هیچ)',
      hasFeImage: filterEl ? !!filterEl.querySelector('feImage') : false,
      hasFeDisplacementMap: filterEl ? !!filterEl.querySelector('feDisplacementMap') : false,
      hasFeTurbulence: filterEl ? !!filterEl.querySelector('feTurbulence') : false,
      feImageHrefPrefix: (() => {
        const feImg = filterEl?.querySelector('feImage');
        const href = feImg?.getAttribute('href') || feImg?.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
        return href ? href.slice(0, 60) : '(هیچ)';
      })(),
    };
  } else {
    result.svgFilter = {
      filterIdInInlineStyle: '(هیچ)',
      note: 'در inline style هیچ url(#...) وجود ندارد — یعنی موتور JS اجرا نشده',
    };
  }

  // ═══ ۴. تست پشتیبانی مرورگر ═══
  result.supportChecks = {
    supportsBackdropFilterBlur: CSS.supports('backdrop-filter', 'blur(1px)'),
    supportsBackdropFilterUrl: CSS.supports('backdrop-filter', 'url(#test)'),
    supportsWebkitBackdropFilterUrl: CSS.supports('-webkit-backdrop-filter', 'url(#test)'),
    supportsIsolation: CSS.supports('isolation', 'isolate'),
  };

  // ═══ ۵. تست زنده: حذف backdrop-filter از والد، آیا pill اعوجاج می‌گیرد؟ ═══
  if (navInner) {
    const niCs = getComputedStyle(navInner);
    const hadBF = niCs.backdropFilter && niCs.backdropFilter !== 'none';

    const original = {
      backdropFilter: navInner.style.backdropFilter,
      webkitBackdropFilter: navInner.style.webkitBackdropFilter,
    };

    if (hadBF) {
      navInner.style.backdropFilter = 'none';
      navInner.style.webkitBackdropFilter = 'none';
      await sleep(400);

      result.nestedTest = {
        hadAncestorBackdropFilter: true,
        tempRemovalApplied: true,
        note: '⚠ الان ۳ ثانیه به نوار ناوبری نگاه کن: آیا pill اعوجاج (لنز) پیدا کرد؟ (بله/نه)',
      };

      await sleep(3000);

      // بازگردانی
      if (original.backdropFilter) navInner.style.backdropFilter = original.backdropFilter;
      else navInner.style.removeProperty('backdrop-filter');
      if (original.webkitBackdropFilter) navInner.style.webkitBackdropFilter = original.webkitBackdropFilter;
      else navInner.style.removeProperty('-webkit-backdrop-filter');
    } else {
      result.nestedTest = {
        hadAncestorBackdropFilter: false,
        note: 'والد .nav-inner backdrop-filter نداشت — Backdrop Root علت نیست',
      };
    }
  }

  // ═══ ۶. نتیجه‌گیری خودکار ═══
  if (result.svgFilter.filterIdInInlineStyle === '(هیچ)') {
    result.verdicts.push('❌ موتور JS اصلاً اجرا نشده — inline style خالی است');
  } else if (result.svgFilter.filterElementExistsInDOM === false) {
    result.verdicts.push('❌ SVG filter element در DOM نیست — موتور JS نتوانسته filter را اضافه کند');
  } else if (result.backdropRoot.navInnerCreatesBackdropRoot === true) {
    result.verdicts.push('⚠ والد .nav-inner Backdrop Root می‌سازد — این مانع دیدن pill از محتوای پشت است');
  } else if (result.supportChecks.supportsBackdropFilterUrl === false) {
    result.verdicts.push('❌ این نسخهٔ کروم backdrop-filter: url() را پشتیبانی نمی‌کند');
  } else {
    result.verdicts.push('ℹ هیچ مانع واضحی یافت نشد — احتمالاً مشکل در مسیر رندر GPU/CPU است');
  }

  // ═══ ۷. چاپ ═══
  console.log('');
  console.log('%c📋 JSON کامل — این را کپی کن و برای AI بفرست:', 'color:#22c55e;font-weight:bold;font-size:13px');
  console.log('');
  console.log(JSON.stringify(result, null, 2));
  console.log('');
  console.log('%c📌 نتیجه‌گیری خودکار:', 'color:#f59e0b;font-weight:bold;font-size:13px');
  result.verdicts.forEach(v => console.log('   ' + v));
  console.log('');
  console.log('%c📤 اگر در نتیجه‌گیری نبود، در تست زنده (گام ۵) اعوجاج دیدی؟ بله/نه', 'color:#f59e0b;font-weight:bold');
})();