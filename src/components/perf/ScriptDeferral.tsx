"use client";
import { useEffect } from "react";

export default function ScriptDeferral() {
  useEffect(() => {
    const defer = () => {
      // کدهای شخص ثالث (مثل Clarity) اینجا لود می‌شوند تا سرعت اولیه کم نشود
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(defer);
    } else {
      setTimeout(defer, 2000);
    }
  }, []);
  return null;
}
