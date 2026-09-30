// postcss.config.mjs
// ═══════════════════════════════════════════════════════════
// POSTCSS CONFIG — Cascade Guardian Enabled
// ═══════════════════════════════════════════════════════════

import cascadeGuardian from "./cascade-guardian.js";

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    cascadeGuardian({
      // Optional: override any file mapping
      // map: { "custom-file.css": "editorial" }
    }),
  ],
};

export default config;