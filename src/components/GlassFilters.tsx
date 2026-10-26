"use client";

import { useEffect } from "react";

export default function GlassFilters() {
  useEffect(() => {
    const SCRIPT_ID = "shorakaei-liquid-glass-nav-engine";
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "module";
    script.src = "/liquid-glass-nav.js";
    script.async = true;

    script.onerror = () => {
      console.error(
        "Shorakaei Liquid Glass: /liquid-glass-nav.js could not be loaded."
      );
      script.remove();
    };

    document.head.appendChild(script);
  }, []);

  return null;
}