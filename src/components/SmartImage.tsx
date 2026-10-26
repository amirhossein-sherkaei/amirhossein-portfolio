"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type SmartImageProps = ImageProps & {
  aspectClassName?: string;
};

export default function SmartImage({
  aspectClassName = "aspect-[16/10]",
  className = "",
  alt,
  onLoad,
  ...props
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`smart-image-wrapper ${aspectClassName}`}>
      {!loaded && (
        <div className="smart-image-skeleton" aria-hidden="true" />
      )}
      <Image
        {...props}
        alt={alt}
        className={`smart-image ${loaded ? "is-loaded" : "is-loading"} ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </div>
  );
}