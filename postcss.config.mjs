// postcss.config.mjs
// ═══════════════════════════════════════════════════════════
// POSTCSS CONFIG — Cascade Guardian v2 Enabled
// ═══════════════════════════════════════════════════════════

import cascadeGuardian from "./cascade-guardian.js";

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    cascadeGuardian({
      // Options can go here, OR in .cascade-guardian.json
      // verbose: true,
      // blacklist: ["_dev-.*\\.css$"],
      // whitelist: [".*\\.css$"],
      // writeReport: true,
    }),
  ],
};

export default config;