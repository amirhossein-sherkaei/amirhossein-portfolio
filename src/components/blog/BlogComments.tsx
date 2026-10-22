"use client";

import React, { useEffect, useRef } from "react";
import { type WalineInstance, type WalineInitOptions, init } from "@waline/client";
import "@waline/client/style";

export type WalineOptions = Omit<WalineInitOptions, "el"> & { path: string };

export default function BlogComments(props: WalineOptions) {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Waline client
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
    });

    // Cleanup on unmount
    return () => {
      walineInstanceRef.current?.destroy();
    };
  }, []); // Empty dependency array means init only once

  // Handle path updates (e.g., navigating between articles)
  useEffect(() => {
    if (walineInstanceRef.current) {
      walineInstanceRef.current.update(props);
    }
  }, [props]);

  return <div ref={containerRef} className="waline-container" style={{ marginTop: "4rem" }} />;
}