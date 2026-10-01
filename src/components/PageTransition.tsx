"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }

    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setActive(true);

      const t = window.setTimeout(() => setActive(false), 800);
      return () => window.clearTimeout(t);
    }
  }, [pathname]);

  if (!active) return null;

  return <div className="page-transition" aria-hidden="true" />;
}