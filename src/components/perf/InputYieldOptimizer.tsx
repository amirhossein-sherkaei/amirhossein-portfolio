"use client";
import { useEffect } from "react";

export default function InputYieldOptimizer() {
  useEffect(() => {
    const optimize = async () => {
      if ("scheduler" in window && "yield" in (window as any).scheduler) {
        await (window as any).scheduler.yield();
      }
    };
    optimize();
  }, []);
  return null;
}
