// cascade-guardian.js
// ═══════════════════════════════════════════════════════════
// CASCADE GUARDIAN v2 — The Architect
// ───────────────────────────────────────────────────────────
// Automatic, intelligent, transparent CSS layer management.
//
// Features:
//   1. Auto-detects layer from filename patterns
//   2. Config file support (.cascade-guardian.json)
//   3. Per-layer statistics report
//   4. !important usage tracker
//   5. Duplicate selector detector
//   6. Whitelist/Blacklist with regex
//   7. Verbose mode (dev) / Quiet mode (production)
//   8. JSON report generation
// ═══════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

// ───────────────────────────────────────────────────────────
// LAYER ORDER (fixed priority)
// ───────────────────────────────────────────────────────────
const LAYER_ORDER = [
  "reset",
  "tokens",
  "base",
  "layout",
  "components",
  "editorial",
  "overrides",
];

// ───────────────────────────────────────────────────────────
// AUTO-DETECTION PATTERNS
// Match filename → layer (no config needed for common cases)
// ───────────────────────────────────────────────────────────
const PATTERNS = [
  // Overrides (highest priority)
  { match: /^mobile-.*\.css$/i, layer: "overrides" },
  { match: /^performance-.*\.css$/i, layer: "overrides" },
  { match: /^density-.*\.css$/i, layer: "overrides" },
  { match: /.*-fix\.css$/i, layer: "overrides" },
  { match: /.*-polish.*\.css$/i, layer: "overrides" },
  { match: /^enhancements\.css$/i, layer: "overrides" },
  { match: /^adaptive-navigation\.css$/i, layer: "overrides" },
  { match: /^perceived-performance\.css$/i, layer: "overrides" },

  // Editorial
  { match: /^hero-.*\.css$/i, layer: "editorial" },
  { match: /^signature-.*\.css$/i, layer: "editorial" },
  { match: /^manuscript-.*\.css$/i, layer: "editorial" },
  { match: /^brand-.*\.css$/i, layer: "editorial" },
  { match: /^chapter-.*\.css$/i, layer: "editorial" },
  { match: /^testimonials\.css$/i, layer: "editorial" },
  { match: /^count-up\.css$/i, layer: "editorial" },

  // Layout
  { match: /^layout.*\.css$/i, layer: "layout" },
  { match: /^pages\.css$/i, layer: "layout" },
  { match: /^responsive\.css$/i, layer: "layout" },
  { match: /^work-pages\.css$/i, layer: "layout" },

  // Tokens & reset
  { match: /^tokens\.css$/i, layer: "tokens" },
  { match: /^motion\.css$/i, layer: "tokens" },
  { match: /^base\.css$/i, layer: "reset" },

  // Components (fallback for everything else)
  { match: /\.css$/i, layer: "components" },
];

// ───────────────────────────────────────────────────────────
// MANUAL OVERRIDES (highest priority — beats patterns)
// ───────────────────────────────────────────────────────────
const FILE_LAYER_MAP = {
  "footer-v2.css": "overrides",
  "performance-layer.css": "overrides",
  "contact-links.css": "components",
  "newsletter.css": "components",
  "commitments.css": "components",
  "process.css": "components",
  "theme-toggle.css": "components",
  "sensory.css": "components",
  "welcome-onboarding.css": "components",
  "order-form-v2.css": "components",
  "form-progress.css": "components",
  "magnetic.css": "components",
  "reveal.css": "components",
  "footer-effects.css": "components",
  "blog.css": "components",
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
// STATISTICS COLLECTOR (singleton across all files)
// ───────────────────────────────────────────────────────────
const stats = {
  totalFiles: 0,
  totalRules: 0,
  totalDeclarations: 0,
  totalImportant: 0,
  layers: Object.fromEntries(
    LAYER_ORDER.map((l) => [l, { files: 0, rules: 0, declarations: 0, important: 0 }])
  ),
  files: [],
  importantSelectors: [],
  duplicateSelectors: new Map(),
  unknownFiles: [],
};

// ───────────────────────────────────────────────────────────
// CONFIG LOADER
// ───────────────────────────────────────────────────────────
function loadConfig(cwd) {
  const configPaths = [
    path.join(cwd, ".cascade-guardian.json"),
    path.join(cwd, ".cascade-guardianrc"),
  ];

  for (const p of configPaths) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      }
    } catch {
      /* ignore */
    }
  }
  return {};
}

// ───────────────────────────────────────────────────────────
// LAYER DETECTOR
// ───────────────────────────────────────────────────────────
function detectLayer(fileName, config) {
  // 1. Config file has absolute priority
  if (config.layerMap && config.layerMap[fileName]) {
    return { layer: config.layerMap[fileName], source: "config" };
  }

  // 2. Manual overrides
  if (FILE_LAYER_MAP[fileName]) {
    return { layer: FILE_LAYER_MAP[fileName], source: "manual" };
  }

  // 3. Pattern matching
  for (const { match, layer } of PATTERNS) {
    if (match.test(fileName)) {
      return { layer, source: "pattern" };
    }
  }

  return { layer: "overrides", source: "fallback" };
}

// ───────────────────────────────────────────────────────────
// SELECTOR NORMALIZER (for duplicate detection)
// ───────────────────────────────────────────────────────────
function normalizeSelector(sel) {
  return sel
    .replace(/\s+/g, " ")
    .replace(/\s*([>+~,])\s*/g, "$1")
    .trim();
}

// ───────────────────────────────────────────────────────────
// RULE ANALYZER
// ───────────────────────────────────────────────────────────
function analyzeRules(rules, fileName, layer) {
  rules.walkDecls((decl) => {
    stats.totalDeclarations++;
    stats.layers[layer].declarations++;

    if (decl.important) {
      stats.totalImportant++;
      stats.layers[layer].important++;

      if (stats.importantSelectors.length < 100) {
        const selector = decl.parent?.selector || "(unknown)";
        stats.importantSelectors.push({
          file: fileName,
          layer,
          selector: normalizeSelector(selector),
          prop: decl.prop,
        });
      }
    }
  });

  rules.walkRules((rule) => {
    stats.totalRules++;
    stats.layers[layer].rules++;

    const sel = normalizeSelector(rule.selector);
    if (!stats.duplicateSelectors.has(sel)) {
      stats.duplicateSelectors.set(sel, new Set());
    }
    stats.duplicateSelectors.get(sel).add(fileName);
  });
}

// ───────────────────────────────────────────────────────────
// REPORT PRINTER
// ───────────────────────────────────────────────────────────
function printReport(verbose) {
  if (!verbose) return;

  const line = "─".repeat(60);

  console.log("\n" + line);
  console.log("  🛡️  CASCADE GUARDIAN — Build Report");
  console.log(line);

  console.log(`  Files processed:        ${stats.totalFiles}`);
  console.log(`  Total rules:            ${stats.totalRules}`);
  console.log(`  Total declarations:     ${stats.totalDeclarations}`);
  console.log(`  !important usage:       ${stats.totalImportant}` +
    (stats.totalImportant > 50 ? "  ⚠️  high" : stats.totalImportant > 20 ? "  ⚠️  moderate" : "  ✅"));

  console.log("\n  Layer breakdown:");
  const pad = (s, n) => String(s).padEnd(n);
  const padStart = (s, n) => String(s).padStart(n);

  console.log(
    `    ${pad("LAYER", 14)} ${padStart("FILES", 6)} ${padStart("RULES", 7)} ${padStart("DECLS", 7)} ${padStart("!IMP", 6)}`
  );

  for (const layer of LAYER_ORDER) {
    const s = stats.layers[layer];
    if (s.files === 0) continue;
    console.log(
      `    ${pad(layer, 14)} ${padStart(s.files, 6)} ${padStart(s.rules, 7)} ${padStart(s.declarations, 7)} ${padStart(s.important, 6)}`
    );
  }

  // Duplicate selector detection
  const duplicates = Array.from(stats.duplicateSelectors.entries())
    .filter(([, files]) => files.size > 1);

  if (duplicates.length > 0) {
    console.log(`\n  🔁 Duplicate selectors: ${duplicates.length}`);
    const top = duplicates.slice(0, 5);
    for (const [sel, files] of top) {
      const shortFiles = Array.from(files).slice(0, 3).join(", ");
      const more = files.size > 3 ? ` +${files.size - 3}` : "";
      const shortSel = sel.length > 40 ? sel.slice(0, 40) + "…" : sel;
      console.log(`     ${shortSel}`);
      console.log(`       ↳ in: ${shortFiles}${more}`);
    }
  }

  // Warnings
  const warnings = [];
  if (stats.totalImportant > 100) {
    warnings.push(`!important used ${stats.totalImportant} times — consider @layer priorities`);
  }

  if (warnings.length > 0) {
    console.log("\n  ⚠️  Warnings:");
    warnings.forEach((w) => console.log(`     • ${w}`));
  }

  console.log("\n" + line + "\n");
}

// ───────────────────────────────────────────────────────────
// JSON REPORT WRITER
// ───────────────────────────────────────────────────────────
function writeJsonReport(cwd) {
  try {
    const reportPath = path.join(cwd, ".cascade-guardian-report.json");
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalFiles: stats.totalFiles,
        totalRules: stats.totalRules,
        totalDeclarations: stats.totalDeclarations,
        totalImportant: stats.totalImportant,
      },
      layers: stats.layers,
      duplicates: Array.from(stats.duplicateSelectors.entries())
        .filter(([, files]) => files.size > 1)
        .map(([sel, files]) => ({ selector: sel, files: Array.from(files) })),
      importantTop: stats.importantSelectors.slice(0, 50),
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  } catch {
    /* ignore */
  }
}

// ───────────────────────────────────────────────────────────
// PLUGIN
// ───────────────────────────────────────────────────────────
let _config = null;
let _reported = false;

module.exports = (opts = {}) => {
  return {
    postcssPlugin: "cascade-guardian-v2",

    Once(root, { result }) {
      const filePath = result.opts.from || "";
      const fileName = path.basename(filePath);

      // ─── Load config once ───
      if (!_config) {
        const cwd = opts.cwd || process.cwd();
        _config = {
          ...loadConfig(cwd),
          ...opts,
        };
      }

      // ─── Skip layers.css (the order declaration) ───
      if (fileName === "layers.css") return;

      // ─── Check whitelist/blacklist ───
      if (_config.blacklist) {
        const bl = Array.isArray(_config.blacklist) ? _config.blacklist : [];
        if (bl.some((re) => new RegExp(re).test(fileName))) return;
      }

      if (_config.whitelist) {
        const wl = Array.isArray(_config.whitelist) ? _config.whitelist : [];
        if (!wl.some((re) => new RegExp(re).test(fileName))) return;
      }

      // ─── Detect layer ───
      const { layer: layerName, source } = detectLayer(fileName, _config);

      // ─── Collect movable rules ───
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

      // ─── Wrap in @layer ───
      const layerBlock = postcss.atRule({
        name: "layer",
        params: layerName,
      });

      insideRules.forEach((node) => {
        node.remove();
        layerBlock.append(node);
      });

      root.append(layerBlock);

      // ─── Update stats ───
      stats.totalFiles++;
      stats.layers[layerName].files++;
      stats.files.push({
        file: fileName,
        layer: layerName,
        source,
      });

      analyzeRules(layerBlock, fileName, layerName);
    },

    OnceExit(root, { result }) {
      // Print report once per build (at the last file processed)
      if (_reported) return;
      _reported = true;

      const verbose =
        _config?.verbose ??
        process.env.CASCADE_VERBOSE === "1" ??
        process.env.NODE_ENV !== "production";

      printReport(verbose);

      if (_config?.writeReport !== false) {
        writeJsonReport(_config?.cwd || process.cwd());
      }
    },
  };
};

module.exports.postcss = true;
module.exports.LAYER_ORDER = LAYER_ORDER;