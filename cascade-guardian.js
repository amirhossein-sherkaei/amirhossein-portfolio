// cascade-guardian.js
// ═══════════════════════════════════════════════════════════
// CASCADE GUARDIAN v3 — The Architect
// ───────────────────────────────────────────────────────────
// Handles the !important reversal in @layer correctly:
//
//   In @layer:
//     - Normal declarations: LAST layer wins
//     - !important declarations: FIRST layer wins
//
// Strategy:
//   - `critical` layer (FIRST)   ← files with heavy !important
//   - `reset`    layer           ← base.css
//   - `tokens`   layer           ← tokens, motion
//   - `base`     layer           ← (empty, reserved)
//   - `layout`   layer           ← layout, pages, responsive
//   - `components` layer         ← UI components
//   - `editorial` layer          ← editorial system
//   - `overrides` layer (LAST)   ← mobile overrides (no important)
// ═══════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

// ───────────────────────────────────────────────────────────
// LAYER ORDER (fixed)
// ───────────────────────────────────────────────────────────
const LAYER_ORDER = [
  "critical",
  "reset",
  "tokens",
  "base",
  "layout",
  "components",
  "editorial",
  "overrides",
];

// ───────────────────────────────────────────────────────────
// FILE → LAYER MAPPING
// ═══════════════════════════════════════════════════════════
// RULE OF THUMB:
//   - Heavy !important → `critical` (wins via reversal)
//   - No !important → natural layer (wins via order)
// ───────────────────────────────────────────────────────────
const FILE_LAYER_MAP = {
  // ═══ CRITICAL — files with heavy !important ═══
  "density-standardization.css": "critical",
  "hero-editorial.css": "critical",
  "hero-bento-live.css": "critical",
  "theme-toggle.css": "critical",
  "brand-logo.css": "critical",
  "chapter-rail.css": "critical",
  "signature-ink.css": "critical",
  "manuscript-grid.css": "critical",
  "enhancements.css": "critical",
  "mobile-polish-v2.css": "critical",
  "mobile-declutter.css": "critical",
  "mobile-fix.css": "critical",
  "performance-boost.css": "critical",
  "performance-layer.css": "critical",
  "count-up.css": "critical",

  // ═══ RESET ═══
  "base.css": "reset",

  // ═══ TOKENS ═══
  "tokens.css": "tokens",
  "motion.css": "tokens",

  // ═══ LAYOUT ═══
  "layout.css": "layout",
  "layout-more.css": "layout",
  "responsive.css": "layout",
  "pages.css": "layout",
  "work-pages.css": "layout",

  // ═══ COMPONENTS ═══
  "magnetic.css": "components",
  "reveal.css": "components",
  "sensory.css": "components",
  "welcome-onboarding.css": "components",
  "order-form-v2.css": "components",
  "form-progress.css": "components",
  "testimonials.css": "components",
  "commitments.css": "components",
  "process.css": "components",
  "footer-effects.css": "components",
  "footer-v2.css": "components",
  "contact-links.css": "components",
  "newsletter.css": "components",
  "blog.css": "components",

  // ═══ EDITORIAL ═══
  // (all moved to critical)

  // ═══ OVERRIDES (no !important) ═══
  "mobile-touch.css": "overrides",
  "mobile-modal.css": "overrides",
  "mobile-typography.css": "overrides",
  "mobile-nav-v2.css": "overrides",
  "mobile-forms.css": "overrides",
  "adaptive-navigation.css": "overrides",
  "perceived-performance.css": "overrides",
};

// ───────────────────────────────────────────────────────────
// AT-RULES THAT STAY OUTSIDE LAYERS
// ───────────────────────────────────────────────────────────
const AT_RULES_OUTSIDE = new Set([
  "keyframes",
  "font-face",
  "import",
  "charset",
  "namespace",
  "property",
  "counter-style",
  "layer",
]);

// ───────────────────────────────────────────────────────────
// STATS
// ───────────────────────────────────────────────────────────
const stats = {
  totalFiles: 0,
  totalRules: 0,
  totalDeclarations: 0,
  totalImportant: 0,
  layers: Object.fromEntries(
    LAYER_ORDER.map((l) => [
      l,
      { files: 0, rules: 0, declarations: 0, important: 0 },
    ])
  ),
  importantTop: [],
  duplicates: new Map(),
};

// ───────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────
function normalizeSelector(sel) {
  return sel.replace(/\s+/g, " ").replace(/\s*([>+~,])\s*/g, "$1").trim();
}

function detectLayer(fileName, config) {
  if (config.layerMap && config.layerMap[fileName]) {
    return config.layerMap[fileName];
  }
  if (FILE_LAYER_MAP[fileName]) {
    return FILE_LAYER_MAP[fileName];
  }
  // Fallback: unknown files go to components (safest default)
  return "components";
}

function loadConfig(cwd) {
  const p = path.join(cwd, ".cascade-guardian.json");
  try {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    }
  } catch {
    /* ignore */
  }
  return {};
}

function analyzeRules(rules, fileName, layer) {
  rules.walkDecls((decl) => {
    stats.totalDeclarations++;
    stats.layers[layer].declarations++;

    if (decl.important) {
      stats.totalImportant++;
      stats.layers[layer].important++;

      if (stats.importantTop.length < 30) {
        const selector = decl.parent?.selector || "(unknown)";
        stats.importantTop.push({
          file: fileName,
          layer,
          selector: normalizeSelector(selector).slice(0, 60),
          prop: decl.prop,
        });
      }
    }
  });

  rules.walkRules((rule) => {
    stats.totalRules++;
    stats.layers[layer].rules++;

    const sel = normalizeSelector(rule.selector);
    if (!stats.duplicates.has(sel)) {
      stats.duplicates.set(sel, new Set());
    }
    stats.duplicates.get(sel).add(fileName);
  });
}

function printReport() {
  const line = "─".repeat(64);
  const pad = (s, n) => String(s).padEnd(n);
  const padStart = (s, n) => String(s).padStart(n);

  console.log("\n" + line);
  console.log("  🛡️  CASCADE GUARDIAN v3 — Build Report");
  console.log(line);

  console.log(`  Files processed:     ${stats.totalFiles}`);
  console.log(`  Total rules:         ${stats.totalRules}`);
  console.log(`  Total declarations:  ${stats.totalDeclarations}`);
  console.log(
    `  !important usage:    ${stats.totalImportant}` +
      (stats.totalImportant > 100
        ? "  ⚠️  high"
        : stats.totalImportant > 40
        ? "  ⚠️  moderate"
        : "  ✅")
  );

  console.log("\n  Layer breakdown (bottom = highest priority for normal rules):");
  console.log(
    `    ${pad("LAYER", 14)} ${padStart("FILES", 6)} ${padStart("RULES", 7)} ${padStart("DECLS", 7)} ${padStart("!IMP", 6)}`
  );

  for (const layer of LAYER_ORDER) {
    const s = stats.layers[layer];
    if (s.files === 0) continue;
    const marker = layer === "critical" ? " ⚡" : "";
    console.log(
      `    ${pad(layer, 14)} ${padStart(s.files, 6)} ${padStart(s.rules, 7)} ${padStart(s.declarations, 7)} ${padStart(s.important, 6)}${marker}`
    );
  }

  const duplicates = Array.from(stats.duplicates.entries()).filter(
    ([, files]) => files.size > 1
  );

  if (duplicates.length > 0) {
    console.log(`\n  🔁 Duplicate selectors: ${duplicates.length}`);
  }

  console.log("\n" + line + "\n");
}

// ───────────────────────────────────────────────────────────
// PLUGIN
// ───────────────────────────────────────────────────────────
let _config = null;
let _reported = false;

module.exports = (opts = {}) => {
  return {
    postcssPlugin: "cascade-guardian-v3",

    Once(root, { result }) {
      const filePath = result.opts.from || "";
      const fileName = path.basename(filePath);

      if (!_config) {
        const cwd = opts.cwd || process.cwd();
        _config = { ...loadConfig(cwd), ...opts };
      }

      // Skip the layer order declaration file
      if (fileName === "layers.css") return;

      // Whitelist / blacklist
      if (_config.blacklist) {
        const bl = Array.isArray(_config.blacklist) ? _config.blacklist : [];
        if (bl.some((re) => new RegExp(re).test(fileName))) return;
      }

      const layerName = detectLayer(fileName, _config);

      const insideRules = [];
      root.nodes.slice().forEach((node) => {
        if (
          node.type === "atrule" &&
          AT_RULES_OUTSIDE.has(node.name.toLowerCase())
        ) {
          return;
        }
        insideRules.push(node);
      });

      if (insideRules.length === 0) return;

      const layerBlock = postcss.atRule({
        name: "layer",
        params: layerName,
      });

      insideRules.forEach((node) => {
        node.remove();
        layerBlock.append(node);
      });

      root.append(layerBlock);

      stats.totalFiles++;
      stats.layers[layerName].files++;
      analyzeRules(layerBlock, fileName, layerName);
    },

    OnceExit() {
      if (_reported) return;
      _reported = true;
      if (_config?.verbose !== false) printReport();
    },
  };
};

module.exports.postcss = true;
module.exports.LAYER_ORDER = LAYER_ORDER;
module.exports.FILE_LAYER_MAP = FILE_LAYER_MAP;