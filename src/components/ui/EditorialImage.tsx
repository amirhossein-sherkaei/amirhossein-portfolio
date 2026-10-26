"use client";

import Image from "next/image";
import { useState } from "react";

type Overlay = "none" | "bottom" | "top" | "all" | "editorial-fade";
type Radius = "sm" | "md" | "lg" | "xl" | "none";

type EditorialImageProps = {
  src: string;
  alt: string;
  aspectRatio?: string;
  radius?: Radius;
  overlay?: Overlay;
  priority?: boolean;
  className?: string;
  sizes?: string;
  objectPosition?: string;
};

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGMEVDRTUiLz48L3N2Zz4=";

const RADIUS_MAP: Record<Radius, string> = {
  none: "0",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
};

const OVERLAY_BG: Record<Overlay, string | undefined> = {
  none: undefined,
  bottom:
    "linear-gradient(to top, rgba(10,9,8,0.62) 0%, rgba(10,9,8,0.18) 32%, transparent 62%)",
  top: "linear-gradient(to bottom, rgba(10,9,8,0.5) 0%, transparent 40%)",
  all: "linear-gradient(135deg, rgba(13,115,119,0.12) 0%, transparent 45%, rgba(125,41,63,0.1) 100%)",
  "editorial-fade":
    "linear-gradient(to bottom, transparent 55%, var(--paper) 100%)",
};

export default function EditorialImage({
  src,
  alt,
  aspectRatio = "16 / 10",
  radius = "lg",
  overlay = "none",
  priority = false,
  className = "",
  sizes = "(max-width: 720px) 100vw, (max-width: 1080px) 55vw, 720px",
  objectPosition = "center",
}: EditorialImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`editorial-image ${className}`}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        borderRadius: RADIUS_MAP[radius],
        background: "var(--paper-2)",
        isolation: "isolate",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={92}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onLoad={() => setLoaded(true)}
        style={{
          objectFit: "cover",
          objectPosition,
          transition:
            "transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease",
          opacity: loaded ? 1 : 0,
          transform: "scale(1.02)",
        }}
      />

      {overlay !== "none" && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: OVERLAY_BG[overlay],
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}