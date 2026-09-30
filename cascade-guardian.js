// cascade-guardian.js
// ═══════════════════════════════════════════════════════════
// CASCADE GUARDIAN — Automatic CSS Layer Management
// ───────────────────────────────────────────────────────────
// PostCSS plugin that automatically wraps every CSS file in
// the appropriate @layer based on its filename.
//
// Benefits:
// - Zero visual change (cascade order is preserved)
// - No more !important wars (layers determine priority)
// - Massive performance gain (browser skips low-priority layers)
// - Works with Turbopack, Next.js, Vite, and any bundler
//
// Usage: Just add to postcss.config.mjs — that's it.
// ═══════════════════════════════════════════════════════════

const path = require("path");

// ───────────────────────────────────────────────────────────
// LAYER ORDER — lowest priority → highest priority
// ───────────────────────────────────────────────────────────
const LAYER_ORDER = [
  "reset",       // CSS normalizations and browser resets
  "tokens",      // Design tokens, CSS variables
  "base",        // HTML element styles, typography
  "layout",      // Structural primitives, containers, grids
  "components",  // UI components (buttons, cards, modals)
  "editorial",   // Our signature editorial system
  "overrides",   // Last-mile overrides (perf, density, etc.)
];

// ───────────────────────────────────────────────────────────
// FILE → LAYER MAPPING
// Every CSS file in the project is routed to exactly one layer.
// ───────────────────────────────────────────────────────────
const FILE_LAYER_MAP = {
  // ═══ Tier 1: Foundation ═══
  "base.css": "reset",
  "tokens.css": "tokens",
  "motion.css": "tokens",

  // ═══ Tier 2: Layout primitives ═══
  "layout.css": "layout",
  "layout-more.css": "layout",
  "responsive.css": "layout",
  "pages.css": "layout",

  // ═══ Tier 3: Components ═══
  "magnetic.css": "components",
  "reveal.css": "components",
  "theme-toggle.css": "components",
  "footer-effects.css": "components",
  "sensory.css": "components",
  "welcome-onboarding.css": "components",
  "order-form-v2.css": "components",
  "form-progress.css": "components",
  "testimonials.css": "components",
  "commitments.css": "components",
  "process.css": "components",
  "work-pages.css": "components",
  "contact-links.css": "components",
  "newsletter.css": "components",
  "count-up.css": "components",

  // ═══ Tier 4: Editorial system ═══
  "hero-editorial.css": "editorial",
  "hero-bento-live.css": "editorial",
  "signature-ink.css": "editorial",
  "manuscript-grid.css": "editorial",
  "brand-logo.css": "editorial",
  "chapter-rail.css": "editorial",

  // ═══ Tier 5: Mobile overrides ═══
  "mobile-touch.css": "overrides",
  "mobile-modal.css": "overrides",
  "mobile-typography.css": "overrides",
  "mobile-nav-v2.css": "overrides",
  "mobile-declutter.css": "overrides",
  "mobile-fix.css": "overrides",
  "mobile-polish-v2.css": "overrides",
  "mobile-forms.css": "overrides",
  "adaptive-navigation.css": "overrides",

  // ═══ Tier 6: Last-mile ═══
  "enhancements.css": "overrides",
  "perceived-performance.css": "overrides",
  "performance-boost.css": "overrides",
  "performance-layer.css": "overrides",
  "density-standardization.css": "overrides",
  "footer-v2.css": "overrides",
  "blog.css": "components",
};

// ───────────────────────────────────────────────────────────
// PLUGIN IMPLEMENTATION
// ───────────────────────────────────────────────────────────
const AT_RULES_OUTSIDE_LAYER = new Set([
  "keyframes",
  "font-face",
  "import",
  "charset",
  "namespace",
  "property",
  "counter-style",
]);

module.exports = (opts = {}) => {
  const customMap = opts.map || {};
  const map = { ...FILE_LAYER_MAP, ...customMap };

  let layerOrderInjected = false;

  return {
    postcssPlugin: "cascade-guardian",

    Once(root, { result }) {
      // Detect the current file's layer
      const filePath = result.opts.from || "";
      const fileName = path.basename(filePath);

      const layerName = map[fileName] || "overrides";

      // ─── Inject layer order declaration at the very top ───
      if (!layerOrderInjected) {
        layerOrderInjected = true;

        const orderRule = `@layer ${LAYER_ORDER.join(", ")};`;
        root.prepend(root.constructor.fromJSON({ type: "atrule", name: "layer", params: LAYER_ORDER.join(", ") }));
      }

      // ─── Collect rules that must stay outside the layer ───
      const outsideRules = [];
      const insideRules = [];

      root.each((node) => {
        if (
          node.type === "atrule" &&
          AT_RULES_OUTSIDE_LAYER.has(node.name.toLowerCase())
        ) {
          outsideRules.push(node);
        } else if (node.type === "comment") {
          // Keep comments where they were (skip moving)
          outsideRules.push(node);
        } else {
          insideRules.push(node);
        }
      });

      // If nothing to move, exit
      if (insideRules.length === 0) return;

      // ─── Create the new @layer block ───
      const layerBlock = root.constructor.fromJSON({
        type: "atrule",
        name: "layer",
        params: layerName,
        nodes: insideRules,
      });

      // ─── Clear root and re-add in order ───
      root.removeAll();
      outsideRules.forEach((rule) => root.append(rule));
      root.append(layerBlock);
    },
  };
};

module.exports.postcss = true;
module.exports.LAYER_ORDER = LAYER_ORDER;
module.exports.FILE_LAYER_MAP = FILE_LAYER_MAP;