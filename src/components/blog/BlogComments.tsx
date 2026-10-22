"use client";

import React, { useEffect, useRef } from "react";
import { type WalineInstance, type WalineInitOptions, init } from "@waline/client";
import "@waline/client/style";
import "@/styles/waline-custom.css";

export type WalineOptions = Omit<WalineInitOptions, "el"> & { path: string };

export default function BlogComments(props: WalineOptions) {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      lang: "fa", // Force Persian
      // We will use CSS to hide any English that slips through
      requiredMeta: ["nick"],
      login: "disable",
      dark: "html[data-theme='dark']",
    });

    return () => {
      walineInstanceRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (walineInstanceRef.current) {
      walineInstanceRef.current.update(props);
    }
  }, [props]);

  return (
    <section className="waline-wrapper">
      <h2 className="waline-header-title">گفتگو و دیدگاه‌ها</h2>
      <div ref={containerRef} className="waline-custom-container" />
    </section>
  );
}