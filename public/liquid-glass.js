/**
 * Shorakaei — self-hosted Liquid Glass engine
 * ------------------------------------------------------------
 * Zero external runtime dependencies. Exposes a createGlass() API compatible
 * with the options used by the navbar enhancer in this package.
 *
 * In Chromium, mode: "backdrop" uses an SVG feDisplacementMap filter through
 * backdrop-filter:url(#...). Other engines receive the configured CSS blur
 * fallback because arbitrary live DOM backdrops cannot be refracted uniformly
 * with this rendering path.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";
const NEUTRAL = 128;
const MAX_DPR = 2;
let instanceId = 0;

export const DEFAULTS = Object.freeze({
  x: 0,
  y: 0,
  width: 120,
  height: 64,
  radius: 32,
  refraction: 18,
  bezel: 0.68,
  curvature: 4,
  ior: 1.46,
  invert: false,
  chroma: 0.06,
  blur: 0,
  specular: 0.7,
  specularWidth: 1.8,
  lightAngle: -78,
  mapScale: 0,
});

export const engine = detectEngine();

function detectEngine() {
  if (typeof navigator === "undefined") return "unknown";
  const brands = navigator.userAgentData?.brands || [];
  if (brands.some((brand) => /Chromium/i.test(brand.brand))) return "blink";

  const ua = navigator.userAgent || "";
  // iOS browsers all use WebKit even if their user-agent says Chrome/Firefox.
  if (/iPhone|iPad|iPod/i.test(ua)) return "webkit";
  if (/Firefox\//i.test(ua)) return "gecko";
  if (/AppleWebKit\//i.test(ua) && !/Chrome\/|Chromium\/|Edg\//i.test(ua)) return "webkit";
  if (/Chrome\/|Chromium\/|Edg\//i.test(ua)) return "blink";
  return "unknown";
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const signOrOne = (value) => (value < 0 ? -1 : 1);
const profileCache = new Map();

// A small optical profile table makes curvature and IOR change the lens shape
// rather than merely acting as decorative settings.
function getOpticalProfile(curvature, ior) {
  const key = `${curvature}|${ior}`;
  const cached = profileCache.get(key);
  if (cached) return cached;

  const count = 512;
  const table = new Float32Array(count + 1);
  let maximum = 0;
  for (let index = 0; index <= count; index++) {
    const s = Math.min(index / count, 1 - 1e-6);
    const a = Math.pow(1 - s, curvature);
    const slope = Math.pow(1 - s, curvature - 1) * Math.pow(Math.max(1 - a, 1e-9), 1 / curvature - 1);
    const angle = Math.atan(slope);
    const refracted = Math.asin(Math.sin(angle) / Math.max(1.01, ior));
    const bend = Math.tan(angle - refracted);
    table[index] = bend;
    if (bend > maximum) maximum = bend;
  }
  for (let index = 0; index <= count; index++) table[index] /= maximum || 1;
  table[count] = 0;
  if (profileCache.size > 32) profileCache.clear();
  profileCache.set(key, table);
  return table;
}

/**
 * Paint an optical displacement map for one rounded-rectangle/capsule lens.
 * RGB=128 means no displacement; the rim shifts samples toward the lens centre.
 */
export function renderLensMap(options = {}, scale = 1) {
  const p = { ...DEFAULTS, ...options };
  const cssWidth = Math.max(2, Number(p.width) || 2);
  const cssHeight = Math.max(2, Number(p.height) || 2);
  const width = Math.max(2, Math.round(cssWidth * Math.max(0.5, scale)));
  const height = Math.max(2, Math.round(cssHeight * Math.max(0.5, scale)));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D is unavailable; Liquid Glass map could not be created.");

  const image = context.createImageData(width, height);
  const data = image.data;
  const halfW = cssWidth / 2;
  const halfH = cssHeight / 2;
  const radius = clamp(Number(p.radius) || 0, 0, Math.min(halfW, halfH));
  const bezelPx = Math.max(0.5, Number(p.bezel) * Math.min(halfW, halfH));
  const rimWidth = Math.max(0.5, Number(p.specularWidth) || 1.8);
  const angle = (Number(p.lightAngle) * Math.PI) / 180;
  const lightX = Math.cos(angle);
  const lightY = Math.sin(angle);
  const direction = p.invert ? -1 : 1;
  const sx = cssWidth / width;
  const sy = cssHeight / height;
  const opticalProfile = getOpticalProfile(
    clamp(Number(p.curvature) || 4, 2, 6),
    clamp(Number(p.ior) || 1.46, 1.3, 2)
  );
  const profileLast = opticalProfile.length - 1;

  for (let py = 0; py < height; py++) {
    const y = (py + 0.5) * sy - halfH;
    for (let px = 0; px < width; px++) {
      const x = (px + 0.5) * sx - halfW;
      const ax = Math.abs(x);
      const ay = Math.abs(y);
      const qx = ax - (halfW - radius);
      const qy = ay - (halfH - radius);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const cornerLength = Math.hypot(ox, oy);
      const distance = cornerLength + Math.min(Math.max(qx, qy), 0) - radius;

      let red = NEUTRAL;
      let green = NEUTRAL;
      let blue = NEUTRAL;

      // Pixels outside the optical silhouette are neutral; CSS border-radius clips them.
      if (distance <= 0) {
        let nx = 0;
        let ny = 0;
        if (qx > 0 && qy > 0 && cornerLength > 0) {
          nx = signOrOne(x) * (ox / cornerLength);
          ny = signOrOne(y) * (oy / cornerLength);
        } else if (qx > qy) {
          nx = signOrOne(x);
        } else {
          ny = signOrOne(y);
        }

        const inset = Math.max(0, -distance);
        const profilePosition = inset / bezelPx;
        const dome = profilePosition >= 1
          ? 0
          : opticalProfile[Math.min(profileLast, Math.round(profilePosition * profileLast))];
        const bend = 127 * dome * direction;

        // Convex lens: the sampled image is pulled inward at the rim.
        red = clamp(Math.round(NEUTRAL - bend * nx), 0, 255);
        green = clamp(Math.round(NEUTRAL - bend * ny), 0, 255);

        const crisp = Math.max(0, 1 - inset / rimWidth);
        const glow = Math.max(0, 1 - inset / (rimWidth * 5));
        const rim = Math.max(0, Number(p.specular) || 0) * (crisp * crisp + 0.3 * glow * glow);
        const facing = -nx * lightX - ny * lightY;
        const shade = 0.12 + 0.88 * (facing > 0 ? facing : -0.4 * facing);
        blue = clamp(NEUTRAL + Math.round(127 * Math.min(1, rim * shade)), 0, 255);
      }

      const offset = (py * width + px) * 4;
      data[offset] = red;
      data[offset + 1] = green;
      data[offset + 2] = blue;
      data[offset + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  return { canvas, width, height, scale };
}

const CHANNELS = [
  "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
];

function svgNode(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

let svgRoot;
function getDefs() {
  if (svgRoot?.isConnected) return svgRoot.firstChild;
  svgRoot = document.createElementNS(SVG_NS, "svg");
  svgRoot.setAttribute("aria-hidden", "true");
  svgRoot.setAttribute("width", "0");
  svgRoot.setAttribute("height", "0");
  // Do not use display:none; some SVG filter implementations stop resolving filters there.
  svgRoot.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  svgRoot.appendChild(document.createElementNS(SVG_NS, "defs"));
  (document.body || document.documentElement).appendChild(svgRoot);
  return svgRoot.firstChild;
}

function append(parent, name, attributes = {}) {
  const child = svgNode(name, attributes);
  parent.appendChild(child);
  return child;
}

function buildFilter(defs, id, p, width, height, mapUrl) {
  const filter = svgNode("filter", {
    id,
    x: 0,
    y: 0,
    width,
    height,
    filterUnits: "userSpaceOnUse",
    primitiveUnits: "userSpaceOnUse",
    "color-interpolation-filters": "sRGB",
  });

  const map = append(filter, "feImage", {
    x: 0,
    y: 0,
    width,
    height,
    preserveAspectRatio: "none",
    result: "lensMap",
  });
  map.setAttribute("href", mapUrl);
  map.setAttributeNS(XLINK_NS, "xlink:href", mapUrl);

  let source = "SourceGraphic";
  if (p.blur > 0) {
    append(filter, "feGaussianBlur", {
      in: "SourceGraphic",
      stdDeviation: p.blur,
      result: "softSource",
    });
    source = "softSource";
  }

  if (p.chroma > 0) {
    CHANNELS.forEach((values, index) => {
      append(filter, "feDisplacementMap", {
        in: source,
        in2: "lensMap",
        scale: 2 * p.refraction,
        xChannelSelector: "R",
        yChannelSelector: "G",
        result: `displaced${index}`,
      });
      append(filter, "feColorMatrix", {
        in: `displaced${index}`,
        type: "matrix",
        values,
        result: `channel${index}`,
      });
    });

    append(filter, "feComposite", {
      in: "channel0",
      in2: "channel1",
      operator: "arithmetic",
      k1: 0,
      k2: 1,
      k3: 1,
      k4: 0,
      result: "redGreen",
    });
    append(filter, "feComposite", {
      in: "redGreen",
      in2: "channel2",
      operator: "arithmetic",
      k1: 0,
      k2: 1,
      k3: 1,
      k4: 0,
      result: "refracted",
    });
  } else {
    append(filter, "feDisplacementMap", {
      in: source,
      in2: "lensMap",
      scale: 2 * p.refraction,
      xChannelSelector: "R",
      yChannelSelector: "G",
      result: "refracted",
    });
  }

  if (p.specular > 0) {
    append(filter, "feColorMatrix", {
      in: "lensMap",
      type: "matrix",
      values: "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 2 0 -1",
      result: "rimHighlight",
    });
    append(filter, "feComposite", {
      in: "rimHighlight",
      in2: "refracted",
      operator: "arithmetic",
      k1: 0,
      k2: 1,
      k3: 1,
      k4: 0,
      result: "lit",
    });
  }

  // Keep the refraction map scoped to the target element's filter region.
  defs.appendChild(filter);
  return filter;
}

/**
 * Apply a liquid-glass lens to an element.
 *
 * mode:"backdrop" bends the pixels behind the element in Chromium. Safari/Firefox
 * use the supplied CSS fallback. fit:true tracks the element's current dimensions.
 */
export function createGlass(target, options = {}) {
  if (!(target instanceof HTMLElement)) {
    throw new TypeError("createGlass(target): target must be an HTMLElement.");
  }

  const idBase = `shorakaei-glass-${++instanceId}`;
  const p = { ...DEFAULTS, ...options };
  const mode = options.mode ?? "content";
  const fit = Boolean(options.fit);
  const fallback = options.fallback ?? "blur(13px) saturate(1.7) brightness(1.04)";
  const initialInline = {
    filter: target.style.filter,
    backdropFilter: target.style.backdropFilter,
    webkitBackdropFilter: target.style.webkitBackdropFilter,
  };

  let destroyed = false;
  let hidden = Boolean(options.hidden);
  let version = 0;
  let currentFilter = null;
  let resizeObserver = null;
  let lastKey = "";
  const canRefractBackdrop = mode === "backdrop" && engine === "blink";
  const active = mode !== "backdrop" || canRefractBackdrop;

  function setFallback() {
    target.style.setProperty("backdrop-filter", fallback, "important");
    target.style.setProperty("-webkit-backdrop-filter", fallback, "important");
  }

  function render() {
    if (destroyed) return;

    if (!active) {
      setFallback();
      return;
    }

    if (hidden) {
      if (mode === "backdrop") {
        target.style.setProperty("backdrop-filter", fallback, "important");
        target.style.setProperty("-webkit-backdrop-filter", fallback, "important");
      } else {
        target.style.filter = initialInline.filter;
      }
      return;
    }

    const rect = target.getBoundingClientRect();
    const width = Math.max(0, Math.round(rect.width));
    const height = Math.max(0, Math.round(rect.height));
    if (width < 2 || height < 2) return;

    const params = { ...p, width: fit ? width : Math.max(2, Number(p.width) || width), height: fit ? height : Math.max(2, Number(p.height) || height) };
    params.radius = clamp(Number(params.radius) || 0, 0, Math.min(params.width, params.height) / 2);
    const dpr = Number(window.devicePixelRatio) || 1;
    const mapScale = params.mapScale > 0 ? params.mapScale : Math.min(dpr, MAX_DPR);
    const mapKey = [params.width, params.height, params.radius, params.bezel, params.curvature, params.ior, params.invert, params.specular, params.specularWidth, params.lightAngle, params.refraction, params.chroma, params.blur, mapScale].join("|");
    if (mapKey === lastKey && currentFilter?.isConnected) return;
    lastKey = mapKey;

    const lensMap = renderLensMap(params, mapScale);
    const mapUrl = lensMap.canvas.toDataURL("image/png");
    const defs = getDefs();
    const builtFilter = buildFilter(defs, `${idBase}-v${++version}`, params, width, height, mapUrl);

    if (currentFilter) currentFilter.remove();
    currentFilter = builtFilter;
    const filterRef = `url(#${currentFilter.id})`;
    if (mode === "backdrop") {
      target.style.setProperty("backdrop-filter", filterRef, "important");
      target.style.setProperty("-webkit-backdrop-filter", filterRef, "important");
    } else {
      target.style.filter = filterRef;
    }
  }

  render();
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      // render() compares the new element dimensions with lastKey; it only
      // rebuilds the displacement map when the geometry/optics truly changed.
      render();
    });
    resizeObserver.observe(target);
  } else {
    window.addEventListener("resize", render, { passive: true });
  }

  return {
    update(next = {}) {
      if (destroyed) return;
      const wasHidden = hidden;
      hidden = next.hidden === undefined ? hidden : Boolean(next.hidden);
      for (const key of Object.keys(DEFAULTS)) {
        if (next[key] !== undefined) p[key] = next[key];
      }
      if (wasHidden !== hidden || Object.keys(next).some((key) => key !== "hidden")) lastKey = "";
      render();
    },
    flush() {
      lastKey = "";
      render();
    },
    get params() {
      return { ...p, hidden };
    },
    get filterId() {
      return currentFilter?.id ?? null;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      resizeObserver?.disconnect();
      if (typeof ResizeObserver === "undefined") window.removeEventListener("resize", render);
      currentFilter?.remove();
      target.style.filter = initialInline.filter;
      target.style.backdropFilter = initialInline.backdropFilter;
      target.style.webkitBackdropFilter = initialInline.webkitBackdropFilter;
    },
  };
}
