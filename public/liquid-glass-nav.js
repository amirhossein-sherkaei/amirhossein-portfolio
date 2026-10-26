/**
 * Shorakaei — Liquid Glass navbar enhancer (self-hosted)
 * -----------------------------------------------------
 * This module intentionally does not rewrite or wrap navigation markup.
 * It only attaches the local optical engine to existing elements.
 * 
 * Refined optical parameters for a stronger water-drop effect on both
 * desktop (full-width) and mobile navigation.
 */

import { createGlass } from "./liquid-glass.js";

(() => {
  if (window.__shorakaeiLiquidGlassInstalled) return;
  window.__shorakaeiLiquidGlassInstalled = true;

  const SELECTOR = [
    ".site-nav .nav-pill",
    ".mbn",
    ".chat-bubble-inner",
    ".theme-toggle",
    ".back-to-top",
    ".oform-btn--primary",
    ".faq-icon",
    ".hero-btn-primary",
    ".nav-order-button",
    "[data-liquid-glass]",
  ].join(",");

  const instances = new Map();
  const originalActiveAttrs = new WeakMap();

  function radiusFor(element) {
    if (element.matches(".site-nav .nav-pill")) return 9999;
    const computed = getComputedStyle(element);
    const radius = computed.borderTopLeftRadius;
    if (radius?.endsWith("%")) return Math.min(element.offsetWidth, element.offsetHeight) / 2;
    const value = Number.parseFloat(radius);
    return Number.isFinite(value) ? value : Math.min(element.offsetWidth, element.offsetHeight) / 2;
  }

  function optionsFor(element) {
    const isChat = element.matches(".chat-bubble-inner");
    const isMobile = element.matches(".mbn");

    return {
      mode: "backdrop",
      fit: true,
      radius: radiusFor(element),
      
      // ─── تنظیمات مخصوص هر المان ───
      // موبایل: اعوجاج فوق‌العاده قوی (32)
      // دسکتاپ: اعوجاج قوی (28)
      // چت: اعوجاج ملایم (15)
      refraction: isChat ? 15 : isMobile ? 32 : 28, 
      bezel: isChat ? 0.60 : isMobile ? 0.85 : 0.78, 
      curvature: isMobile ? 5.2 : 4.5, 
      ior: 1.52, // ضریب شکست بالاتر برای شیشه غلیظ‌تر
      chroma: isMobile ? 0.095 : 0.075, 
      blur: 0,
      specular: 0.88, 
      specularWidth: isMobile ? 2.4 : 2.0, 
      lightAngle: -78,
      fallback: "blur(14px) saturate(1.8) brightness(1.05)",
    };
  }

  function enhance(element) {
    if (!(element instanceof HTMLElement) || !element.isConnected || instances.has(element)) return;
    try {
      const wasActive = element.getAttribute("data-liquid-glass-active");
      originalActiveAttrs.set(element, wasActive);
      const glass = createGlass(element, optionsFor(element));
      instances.set(element, glass);
      element.setAttribute("data-liquid-glass-active", "true");
    } catch (error) {
      // The old CSS glass remains as a fallback if canvas/SVG filters are unavailable.
      console.warn("Shorakaei Liquid Glass: enhancement failed; keeping CSS fallback.", error);
    }
  }

  function unenhance(element) {
    const glass = instances.get(element);
    if (!glass) return;
    glass.destroy();
    instances.delete(element);
    const previous = originalActiveAttrs.get(element);
    if (previous == null) element.removeAttribute("data-liquid-glass-active");
    else element.setAttribute("data-liquid-glass-active", previous);
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(SELECTOR)) enhance(root);
    root.querySelectorAll?.(SELECTOR).forEach(enhance);
  }

  function cleanupRemoved() {
    for (const [element] of instances) {
      if (!element.isConnected) unenhance(element);
    }
  }

  function boot() {
    scan(document);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "childList") {
          record.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) scan(node);
          });
        } else if (record.type === "attributes") {
          const element = record.target;
          if (element instanceof HTMLElement && element.matches(SELECTOR)) enhance(element);
          else if (element instanceof HTMLElement) unenhance(element);
          scan(element);
        }
      }
      cleanupRemoved();
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "data-liquid-glass"],
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();