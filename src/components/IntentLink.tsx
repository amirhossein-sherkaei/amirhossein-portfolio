"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   INTENT LINK — Prefetch on user intent
   ------------------------------------------------------------
   - Desktop: prefetch 50ms after hover (avoids wasted bandwidth)
   - Mobile: prefetch immediately on touchstart (finger lands
     ~100ms before lift-off — perfect prefetch window)
   - Falls back to standard Link behavior
   ═══════════════════════════════════════════════════════════ */

type IntentLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  /** Hover delay in ms (desktop only). Default: 50 */
  hoverDelay?: number;
  /** Disable prefetching entirely */
  disablePrefetch?: boolean;
  "aria-label"?: string;
  "aria-current"?: "page" | "location" | "true" | undefined;
};

export default function IntentLink({
  children,
  className,
  hoverDelay = 50,
  disablePrefetch = false,
  onMouseEnter,
  onTouchStart,
  ...props
}: IntentLinkProps) {
  const router = useRouter();
  const prefetched = useRef(false);
  const hoverTimer = useRef<number | null>(null);

  const prefetch = useCallback(() => {
    if (disablePrefetch || prefetched.current) return;
    prefetched.current = true;
    try {
      router.prefetch(props.href as string);
    } catch {
      /* ignore */
    }
  }, [disablePrefetch, router, props.href]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onMouseEnter?.(e);
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      hoverTimer.current = window.setTimeout(prefetch, hoverDelay);
    },
    [hoverDelay, onMouseEnter, prefetch]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
      }
    },
    []
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLAnchorElement>) => {
      onTouchStart?.(e);
      /* Immediate prefetch on touch — finger lands ~100ms before click */
      prefetch();
    },
    [onTouchStart, prefetch]
  );

  return (
    <Link
      {...props}
      className={className}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {children}
    </Link>
  );
}