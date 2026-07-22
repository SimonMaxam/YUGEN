"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getTimeOfDay,
  msUntilNextPhase,
  type TimeOfDay,
} from "@/lib/time-of-day";

interface ThemeContextValue {
  theme: TimeOfDay;
  /** true when the theme is following the visitor's local clock. */
  auto: boolean;
  /** Manually pick a theme (disables auto). */
  setTheme: (t: TimeOfDay) => void;
  /** Cycle morning → evening → night → auto. */
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: TimeOfDay) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<TimeOfDay>("evening");
  const [auto, setAuto] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with the local clock on mount and re-check at each phase boundary.
  useEffect(() => {
    if (!auto) return;

    function sync() {
      const next = getTimeOfDay();
      setThemeState(next);
      applyTheme(next);
      timer.current = setTimeout(sync, msUntilNextPhase() + 500);
    }
    sync();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [auto]);

  const setTheme = (t: TimeOfDay) => {
    setAuto(false);
    setThemeState(t);
    applyTheme(t);
  };

  const cycle = () => {
    const order: (TimeOfDay | "auto")[] = ["morning", "evening", "night", "auto"];
    const current = auto ? "auto" : theme;
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length];
    if (next === "auto") {
      setAuto(true);
    } else {
      setTheme(next);
    }
  };

  const value = useMemo(
    () => ({ theme, auto, setTheme, cycle }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, auto],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
