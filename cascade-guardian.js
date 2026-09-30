// cascade-guardian.js
// ═══════════════════════════════════════════════════════════
// CASCADE GUARDIAN — Automatic CSS Layer Management
// ───────────────────────────────────────────────────────────
// Wraps every CSS file in the appropriate @layer based on
// its filename. The layer ORDER is declared separately in
// src/styles/layers.css (imported first in layout.tsx).
// ═══════════════════════════════════════════════════════════

const path = require("path");
const postcss = require("postcss");

// ───────────────────────────────────────────────────────────
// FILE → LAYER MAPPING
// ───────────────────────────────────────────────────────────
const FILE_LAYER_MAP = {
  // Foundation
  "base.css": "reset",
  "tokens.css": "tokens",
  "motion.css": "tokens",

  // Layout primitives
  "layout.css": "layout",
  "layout-more.css": "layout",
  "responsive.css": "layout",
  "pages.css": "layout",

  // Components
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
  "blog.css": "components",

  // Editorial system
  "hero-editorial.css": "editorial",
  "hero-bento-live.css": "editorial",
  "signature-ink.css": "editorial",
  "manuscript-grid.css": "editorial",
  "brand-logo.css": "editorial",
  "chapter-rail.css": "editorial",

  // Overrides
  "mobile-touch.css": "overrides",
  "mobile-modal.css": "overrides",
  "mobile-typography.css": "overrides",
  "mobile-nav-v2.css": "overrides",
  "mobile-declutter.css": "overrides",
  "mobile-fix.css": "overrides",
  "mobile-polish-v2.css": "overrides",
  "mobile-forms.css": "overrides",
  "adaptive-navigation.css": "overrides",
  "enhancements.css": "overrides",
  "perceived-performance.css": "overrides",
  "performance-boost.css": "overrides",
  "performance-layer.css": "overrides",
  "density-standardization.css": "overrides",
  "footer-v2.css": "overrides",
};

// ───────────────────────────────────────────────────────────
// AT-RULES THAT MUST STAY OUTSIDE LAYERS
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

// ───────────────────────────────────────────────────────────
// PLUGIN
// ───────────────────────────────────────────────────────────
module.exports = (opts = {}) => {
  const customMap = opts.map || {};
  const map = { ...FILE_LAYER_MAP, ...customMap };

  return {
    postcssPlugin: "cascade-guardian",

    Once(root, { result }) {
      const filePath = result.opts.from || "";
      const fileName = path.basename(filePath);

      // Skip our layer-order declaration file
      if (fileName === "layers.css") return;

      const layerName = map[fileName] || "overrides";

      // ─── Collect rules ───
      const insideRules = [];

      root.nodes.slice().forEach((node) => {
        if (
          node.type === "atrule" &&
          AT_RULES_OUTSIDE_LAYER.has(node.name.toLowerCase())
        ) {
          // Keep outside the layer — leave as-is
          return;
        }
        insideRules.push(node);
      });

      if (insideRules.length === 0) return;

      // ─── Build the @layer block ───
      const layerBlock = postcss.atRule({
        name: "layer",
        params: layerName,
      });

      insideRules.forEach((node) => {
        node.remove();
        layerBlock.append(node);
      });

      root.append(layerBlock);
    },
  };
};

module.exports.postcss = true;
module.exports.FILE_LAYER_MAP = FILE_LAYER_MAP;