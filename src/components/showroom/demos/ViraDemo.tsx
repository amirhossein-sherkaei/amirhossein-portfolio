"use client";

import { useState } from "react";
import "./vira-demo.css";

type Palette = {
  id: string;
  name: string;
  colors: { name: string; hex: string }[];
};

const PALETTES: Palette[] = [
  {
    id: "coral",
    name: "Coral Pulse",
    colors: [
      { name: "Primary", hex: "#ff4d6d" },
      { name: "Secondary", hex: "#b537f2" },
      { name: "Accent", hex: "#00d9ff" },
    ],
  },
  {
    id: "forest",
    name: "Forest Deep",
    colors: [
      { name: "Primary", hex: "#059669" },
      { name: "Secondary", hex: "#0d7377" },
      { name: "Accent", hex: "#a3e635" },
    ],
  },
  {
    id: "gold",
    name: "Golden Hour",
    colors: [
      { name: "Primary", hex: "#f59e0b" },
      { name: "Secondary", hex: "#dc2626" },
      { name: "Accent", hex: "#fbbf24" },
    ],
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    colors: [
      { name: "Primary", hex: "#2563eb" },
      { name: "Secondary", hex: "#7c3aed" },
      { name: "Accent", hex: "#06b6d4" },
    ],
  },
];

export default function ViraDemo() {
  const [activePalette, setActivePalette] = useState(0);
  const [showCopied, setShowCopied] = useState<string | null>(null);

  const palette = PALETTES[activePalette];

  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setShowCopied(hex);
    setTimeout(() => setShowCopied(null), 1200);
  };

  const cssVars = {
    "--vira-primary": palette.colors[0].hex,
    "--vira-secondary": palette.colors[1].hex,
    "--vira-accent": palette.colors[2].hex,
  } as React.CSSProperties;

  return (
    <div className="vira-demo" dir="rtl" style={cssVars}>
      {/* Palette selector */}
      <div className="vira-palettes">
        {PALETTES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`vira-palette-btn ${i === activePalette ? "is-active" : ""}`}
            onClick={() => setActivePalette(i)}
            aria-label={`پالت ${p.name}`}
          >
            <span className="vira-palette-swatch" style={{ background: p.colors[0].hex }} />
            <span className="vira-palette-swatch" style={{ background: p.colors[1].hex }} />
            <span className="vira-palette-swatch" style={{ background: p.colors[2].hex }} />
            <span className="vira-palette-name">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Preview area */}
      <div className="vira-preview">
        {/* Brand card */}
        <div className="vira-card vira-card-brand">
          <div className="vira-card-label">Brand Card</div>
          <div className="vira-logo">
            <span className="vira-logo-mark">ویرا</span>
            <span className="vira-logo-text">VIRA STUDIO</span>
          </div>
          <div className="vira-tagline">هویت بصری که نفس می‌کشد</div>
        </div>

        {/* Logo variants */}
        <div className="vira-card vira-card-logos">
          <div className="vira-card-label">Logo Variants</div>
          <div className="vira-logo-grid">
            <div className="vira-logo-tile vira-logo-primary">ویرا</div>
            <div className="vira-logo-tile vira-logo-outline">ویرا</div>
            <div className="vira-logo-tile vira-logo-gradient">ویرا</div>
            <div className="vira-logo-tile vira-logo-inverse">ویرا</div>
          </div>
        </div>

        {/* Color swatches */}
        <div className="vira-card vira-card-colors">
          <div className="vira-card-label">Active Palette</div>
          <div className="vira-swatches">
            {palette.colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                className="vira-swatch"
                style={{ background: c.hex }}
                onClick={() => copyHex(c.hex)}
                aria-label={`کپی ${c.hex}`}
              >
                <span className="vira-swatch-name">{c.name}</span>
                <span className="vira-swatch-hex">
                  {showCopied === c.hex ? "کپی شد ✓" : c.hex}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="vira-hint">
        روی هر پالت کلیک کن تا هویت کامل عوض بشه — روی swatchها بزن تا hex کپی کنی.
      </div>
    </div>
  );
}