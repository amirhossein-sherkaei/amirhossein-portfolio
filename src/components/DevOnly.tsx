"use client";

import { ReactNode } from "react";

/* DEV ONLY - renders children only in development environment */

type Props = {
  children: ReactNode;
};

export default function DevOnly({ children }: Props) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  return <>{children}</>;
}