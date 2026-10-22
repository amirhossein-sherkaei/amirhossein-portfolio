"use client";

import { useEffect, useState } from "react";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function toPersian(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[+d]);
}

export default function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Tehran",
      });
      setTime(fmt.format(now));
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return mounted ? <>{toPersian(time)}</> : <>{time}</>;
}