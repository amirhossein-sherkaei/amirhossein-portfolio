"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const MORPH_DURATION_MS = 400;

function readThemeFromDOM(): Theme {
  if (typeof document === "undefined") return "light";
  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ── همیشه با light شروع می‌کنیم تا hydration mismatch نداشته باشیم ── */
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  /* ── بعد از mount، مقدار واقعی رو از DOM می‌خونیم ── */
  useEffect(() => {
    setMounted(true);
    const current = readThemeFromDOM();
    setTheme(current);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";

      const root = document.documentElement;
      root.classList.add("is-theme-morphing");
      root.setAttribute("data-theme", next);

      try {
        localStorage.setItem("theme", next);
      } catch {
        /* ignore */
      }

      window.setTimeout(() => {
        root.classList.remove("is-theme-morphing");
      }, MORPH_DURATION_MS);

      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}