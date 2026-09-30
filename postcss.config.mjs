import cascadeGuardian from "./cascade-guardian.js";

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [cascadeGuardian()],
};

export default config;