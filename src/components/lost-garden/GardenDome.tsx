"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   GARDEN DOME — Lost Garden Phase 2
   ────────────────────────────────────────────────────────────
   گنبد سه‌بعدی icosahedral با tessellation یکنواخت.
   - displacement در vertex shader (FBM 3D + تنفس + واکنش به موس)
   - دو نور مجازی (بالا-راست گرم، پایین-چپ سرد)
   - fresnel rim (لبه‌ها فیروزه‌ای)
   - wireframe overlay از همون geometry (گره‌چینی)
   - چرخش آروم گنبد
   ═══════════════════════════════════════════════════════════ */

/* ─── Shared vertex shader (solid + wireframe) ─── */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMouseActive;
  uniform float uDisplacement;

  varying vec3  vNormal;
  varying vec3  vPosition;
  varying float vDisplacement;
  varying vec2  vUv;

  /* ─── 3D Hash ─── */
  vec3 hash3(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  /* ─── 3D Value Noise ─── */
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(dot(hash3(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
            dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
        mix(dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
            dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x),
        u.y
      ),
      mix(
        mix(dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
            dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
        mix(dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
            dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x),
        u.y
      ),
      u.z
    );
  }

  /* ─── FBM 3D (3 octaves) ─── */
  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vUv = uv;

    vec3 pos = position;
    vec3 nrm = normalize(normal);

    /* ── Breathing: dome pulses slowly ── */
    float breath = (sin(uTime * 0.55) * 0.5 + 0.5) * 0.06;

    /* ── Organic displacement ── */
    float n = fbm(pos * 2.2 + vec3(0.0, uTime * 0.12, 0.0));
    n = (n + 1.0) * 0.5;

    /* ── Mouse in 3D space (approximation) ── */
    vec3 mousePos = vec3(
      (uMouse.x - 0.5) * 2.6,
      (uMouse.y - 0.5) * 2.6,
      1.1
    );
    float mouseDist = length(pos - mousePos);
    float mouseInfluence = smoothstep(1.3, 0.0, mouseDist) * uMouseActive;

    /* ── Final displacement ── */
    float displacement =
      (n - 0.5) * uDisplacement
      + breath
      + mouseInfluence * 0.38;

    pos += nrm * displacement;

    vDisplacement = displacement;
    vNormal = normalize(normalMatrix * nrm);
    vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ─── Solid fragment shader ─── */
const fragmentShaderSolid = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uMouseActive;

  varying vec3  vNormal;
  varying vec3  vPosition;
  varying float vDisplacement;
  varying vec2  vUv;

  void main() {
    vec3 normal  = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);

    /* ── Two virtual lights ── */
    vec3 lightDir1 = normalize(vec3(0.8, 1.0, 0.6));   /* warm, top-right */
    vec3 lightDir2 = normalize(vec3(-0.6, -0.3, 0.5)); /* cool, bottom-left */

    float diff1   = max(dot(normal, lightDir1), 0.0);
    float diff2   = max(dot(normal, lightDir2), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

    /* ── Shangarf + Zar palette ── */
    vec3 colorDark   = vec3(0.08, 0.04, 0.03);   /* مرکب */
    vec3 colorMid    = vec3(0.28, 0.14, 0.08);   /* قهوه */
    vec3 colorAccent = vec3(0.85, 0.35, 0.22);   /* شنگرف */
    vec3 colorGold   = vec3(0.82, 0.62, 0.32);   /* زر */
    vec3 colorLight  = vec3(0.98, 0.88, 0.75);   /* کرم */
    vec3 colorTurq   = vec3(0.15, 0.65, 0.70);   /* فیروزه (rim) */

    /* ── Color from displacement ── */
    float d = clamp(vDisplacement * 2.0 + 0.5, 0.0, 1.0);

    vec3 color = mix(colorDark, colorMid, smoothstep(0.0, 0.3, d));
    color = mix(color, colorAccent, smoothstep(0.30, 0.55, d));
    color = mix(color, colorGold,   smoothstep(0.50, 0.75, d));
    color = mix(color, colorLight,  smoothstep(0.75, 1.00, d));

    /* ── Lighting ── */
    color *= (0.55 + diff1 * 0.7 + diff2 * 0.3);

    /* ── Fresnel rim ── */
    color += colorTurq * fresnel * 0.28;

    /* ── Mouse hotspot ── */
    color += vec3(0.9, 0.5, 0.3) * uMouseActive * 0.15;

    /* ── Ambient occlusion at silhouette edges ── */
    float edge = smoothstep(0.0, 0.4, dot(normal, viewDir));
    color *= mix(0.75, 1.0, edge);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ─── Wireframe fragment shader (girih lines) ─── */
const fragmentShaderWire = /* glsl */ `
  precision highp float;

  varying vec3  vNormal;
  varying vec3  vPosition;
  varying float vDisplacement;
  varying vec2  vUv;

  void main() {
    vec3 normal  = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);

    vec3 colorGold = vec3(0.82, 0.62, 0.32);   /* زر */
    vec3 colorTurq = vec3(0.15, 0.65, 0.70);   /* فیروزه */

    /* ── Color shifts with displacement ── */
    float d = clamp(vDisplacement * 2.0 + 0.5, 0.0, 1.0);
    vec3 color = mix(colorTurq, colorGold, d);

    /* ── Alpha: thicker where dome bulges + rim glow ── */
    float alpha = 0.055 + d * 0.08 + fresnel * 0.14;

    gl_FragColor = vec4(color, alpha);
  }
`;

function GardenDomeScene({ intensity = 1 }: { intensity?: number }) {
  const solidRef = useRef<THREE.Mesh>(null);
  const wireRef  = useRef<THREE.Mesh>(null);
  const solidMatRef = useRef<THREE.ShaderMaterial>(null);
  const wireMatRef  = useRef<THREE.ShaderMaterial>(null);

  const targetMouse   = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse  = useRef(new THREE.Vector2(0.5, 0.5));
  const targetActive  = useRef(0);

  /* ── Icosahedron subdivision 3 → 1280 faces ── */
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 3), []);

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
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  const solidUniforms = useRef({
    uTime:         { value: 0 },
    uMouse:        { value: new THREE.Vector2(0.5, 0.5) },
    uMouseActive:  { value: 0 },
    uDisplacement: { value: 0.18 },
  });

  const wireUniforms = useRef({
    uTime:         { value: 0 },
    uMouse:        { value: new THREE.Vector2(0.5, 0.5) },
    uMouseActive:  { value: 0 },
    uDisplacement: { value: 0.18 },
  });

  /* ── Sync intensity ── */
  useEffect(() => {
    const disp = 0.18 * intensity;
    if (solidMatRef.current) {
      solidMatRef.current.uniforms.uDisplacement.value = disp;
    }
    if (wireMatRef.current) {
      wireMatRef.current.uniforms.uDisplacement.value = disp;
    }
  }, [intensity]);

  useFrame((state) => {
    currentMouse.current.lerp(targetMouse.current, 0.08);
    const t = state.clock.elapsedTime;

    const updateMat = (mat: THREE.ShaderMaterial | null) => {
      if (!mat) return;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.set(
        currentMouse.current.x,
        currentMouse.current.y
      );
      mat.uniforms.uMouseActive.value = THREE.MathUtils.lerp(
        mat.uniforms.uMouseActive.value,
        targetActive.current,
        0.12
      );
    };

    updateMat(solidMatRef.current);
    updateMat(wireMatRef.current);

    const rotY = t * 0.08;
    const rotX = Math.sin(t * 0.15) * 0.12;

    if (solidRef.current) {
      solidRef.current.rotation.y = rotY;
      solidRef.current.rotation.x = rotX;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = rotY;
      wireRef.current.rotation.x = rotX;
    }
  });

  return (
    <group>
      {/* Solid dome */}
      <mesh ref={solidRef}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial
          ref={solidMatRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderSolid}
          uniforms={solidUniforms.current}
        />
      </mesh>

      {/* Wireframe overlay (same geometry, same displacement) */}
      <mesh ref={wireRef} renderOrder={1}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial
          ref={wireMatRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderWire}
          uniforms={wireUniforms.current}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function GardenDome() {
  const [reduced, setReduced]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);

    const m1 = window.matchMedia("(prefers-reduced-motion: reduce)");
    const m2 = window.matchMedia("(max-width: 720px)");

    setReduced(m1.matches);
    setIsMobile(m2.matches);

    const onMotion = () => setReduced(m1.matches);
    const onSize   = () => setIsMobile(m2.matches);

    m1.addEventListener("change", onMotion);
    m2.addEventListener("change", onSize);

    return () => {
      m1.removeEventListener("change", onMotion);
      m2.removeEventListener("change", onSize);
    };
  }, []);

  if (!mounted || reduced) return null;

  return (
    <div className="garden-dome" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 2.6], fov: 50 }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <GardenDomeScene intensity={isMobile ? 0.65 : 1} />
      </Canvas>
    </div>
  );
}