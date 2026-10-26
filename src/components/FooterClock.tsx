"use client";

import { useEffect, useState } from "react";

export default function FooterClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      });
      const parts = fmt.formatToParts(d);
      const get = (t: string) =>
        parts.find((p) => p.type === t)?.value ?? "00";
      const persian = (v: string) =>
        v.replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[+x]);
      setTime(`${persian(get("hour"))}:${persian(get("minute"))}`);
    };
    update();
    const id = window.setInterval(update, 60000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="footer-brand-clock">
      {mounted ? time : "--:--"}
    </span>
  );
}