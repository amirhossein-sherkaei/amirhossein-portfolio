"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   LIQUID VEIL — Lost Garden Phase 1 (v5 · Shangarf + Zar)
   ────────────────────────────────────────────────────────────
   سیال زنده با پالت اصلی:
   - شنگرف (نارنجی) + زر (طلایی) + مرکب (قهوه‌ای تیره)
   - عمق مصنوعی (perspective warp + vignette + sky light)
   - تعامل با موس با کشش و ripple

   v5 CHANGES:
   - Back to shangarf + zar palette (زنده، گرم، آتشین)
   - Kept the perspective warp + sky light + depth vignette
     so the plane still feels three-dimensional
   ═══════════════════════════════════════════════════════════ */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uMouseActive;
  uniform float uIntensity;

  varying vec2 vUv;

  /* ─── Hash ─── */
  vec2 hash2(vec2 p) {
    p = vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  /* ─── Value Noise ─── */
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }

  /* ─── Smooth FBM (3 octaves) ─── */
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    /* ── Radial depth: 1 at center, 0 at edges ── */
    vec2 centered = uv - 0.5;
    centered.x *= aspect;
    float r = length(centered);
    float depth = smoothstep(0.75, 0.05, r);

    /* ── Perspective warp: pull coord toward center by depth ── */
    vec2 coord = vec2(uv.x * aspect, uv.y);
    coord -= centered * depth * 0.18;

    /* ── Slow, breathing time ── */
    float time = uTime * 0.05;

    /* ── Gentle domain warp ── */
    vec2 q = vec2(
      fbm(coord * 0.8 + vec2(0.0, time)),
      fbm(coord * 0.8 + vec2(5.2, 1.3) - vec2(time * 0.7, 0.0))
    );
    vec2 r2 = vec2(
      fbm(coord + 2.0 * q + vec2(1.7, 9.2)),
      fbm(coord + 2.0 * q + vec2(8.3, 2.8))
    );

    /* ── Mouse interaction ── */
    vec2 mouseUV = uMouse;
    mouseUV.x = mouseUV.x * aspect;
    vec2 toMouse = coord - mouseUV;
    float mouseDist = length(toMouse);
    float mouseInfluence = smoothstep(1.2, 0.0, mouseDist) * uMouseActive;

    /* ── Ripple around mouse ── */
    float ripple = sin(mouseDist * 12.0 - uTime * 3.0) *
                   exp(-mouseDist * 4.0) *
                   uMouseActive * 0.15;

    /* ── Warp toward mouse ── */
    coord += mouseInfluence * 0.7 * normalize(toMouse + 0.001);
    coord += ripple;

    /* ── Final flow field ── */
    float f = fbm(coord + 2.5 * r2);

    /* ══════════════════════════════════════════════════════
       SHANGARF + ZAR PALETTE — شنگرف و زر
       ══════════════════════════════════════════════════════ */
    vec3 colorDark   = vec3(0.08, 0.04, 0.03);   /* deep ink — مرکب */
    vec3 colorMid    = vec3(0.28, 0.14, 0.08);   /* warm brown — قهوه */
    vec3 colorAccent = vec3(0.85, 0.35, 0.22);   /* shangarf — شنگرف */
    vec3 colorGold   = vec3(0.82, 0.62, 0.32);   /* zar — زر */
    vec3 colorLight  = vec3(0.98, 0.88, 0.75);   /* soft cream — کرم */

    /* ── Smooth color mixing ── */
    vec3 color = mix(colorDark, colorMid, smoothstep(-0.5, 0.1, f));
    color = mix(color, colorAccent, smoothstep(0.0, 0.4, f + mouseInfluence * 0.3));
    color = mix(color, colorGold, smoothstep(0.25, 0.65, f + mouseInfluence * 0.4));
    color = mix(color, colorLight, smoothstep(0.55, 0.9, f * 0.9 + mouseInfluence * 0.5));

    /* ── Mouse hotspot glow: sunlight through the heat ── */
    color += vec3(0.9, 0.5, 0.3) * mouseInfluence * 0.4;

    /* ── Depth vignette (fake 3D: darker edges) ── */
    color *= smoothstep(1.0, 0.3, r);

    /* ── Sky→ground light (top brighter, bottom darker) ── */
    color *= mix(0.82, 1.08, uv.y);

    /* ── Depth-based saturation boost near center ── */
    color = mix(color * 0.7, color, depth * 0.5 + 0.5);

    /* ── Intensity ── */
    color *= uIntensity;

    /* ── Alpha ── */
    float alpha = smoothstep(-0.2, 0.4, f + mouseInfluence * 0.7) *
                  smoothstep(1.0, 0.35, r) *
                  uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`;

function LiquidPlane({ intensity = 1 }: { intensity?: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetActive = useRef(0);

  /* ── Mouse tracking ── */
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      targetMouse.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
      targetActive.current = 1;
    };

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  const uniformsRef = useRef({
    uTime:        { value: 0 },
    uResolution:  { value: new THREE.Vector2(1, 1) },
    uMouse:       { value: new THREE.Vector2(0.5, 0.5) },
    uMouseActive: { value: 0 },
    uIntensity:   { value: intensity },
  });

  /* ── Sync intensity when prop changes (mobile ↔ desktop) ── */
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uIntensity.value = intensity;
    }
  }, [intensity]);

  /* ── Sync resolution ── */
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(
        size.width,
        size.height
      );
    }
  }, [size.width, size.height]);

  useFrame((state) => {
    if (!materialRef.current) return;

    currentMouse.current.lerp(targetMouse.current, 0.12);

    const u = materialRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.set(currentMouse.current.x, currentMouse.current.y);
    u.uMouseActive.value = THREE.MathUtils.lerp(
      u.uMouseActive.value,
      targetActive.current,
      0.15
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function LiquidVeil() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const m1 = window.matchMedia("(prefers-reduced-motion: reduce)");
    const m2 = window.matchMedia("(max-width: 720px)");

    setReduced(m1.matches);
    setIsMobile(m2.matches);

    const onMotion = () => setReduced(m1.matches);
    const onSize = () => setIsMobile(m2.matches);

    m1.addEventListener("change", onMotion);
    m2.addEventListener("change", onSize);

    return () => {
      m1.removeEventListener("change", onMotion);
      m2.removeEventListener("change", onSize);
    };
  }, []);

  if (!mounted || reduced) return null;

  return (
    <div className="liquid-veil" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <LiquidPlane intensity={isMobile ? 0.75 : 1} />
      </Canvas>
    </div>
  );
}