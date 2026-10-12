import { useSyncExternalStore } from "react";

/* ————————————————————————————————————————————————
   Two settings, one instrument.

   The site is drawn in ink and paper; the toggle swaps which of the two
   is the page and which is the mark. Surfaces that are inverted in the
   dark set stay inverted in the light set, so contrast relationships hold
   everywhere without a second stylesheet.

   The stored choice wins; with no stored choice the system preference
   decides, and dark is the fallback.
   ———————————————————————————————————————————————— */

export type Theme = "dark" | "light";

export const THEME_KEY = "atomic-models-theme";

const THEME_COLOR: Record<Theme, string> = {
  dark: "#0c0c0f",
  light: "#efeade",
};

/** Drawing colours for the schematic SVGs — line work that must contrast with
    the stage, not with the page. */
export interface VizColors {
  /** The mark: orbits, shell circles, annotation text. */
  line: string;
  /** The same mark, muted. */
  fog: string;
  /** The stage the drawing sits on. */
  bg: string;
}

const VIZ: Record<Theme, VizColors> = {
  dark: { line: "rgba(233,228,214,1)", fog: "rgba(233,228,214,0.55)", bg: "#0c0c0f" },
  light: { line: "rgba(20,20,15,1)", fog: "rgba(20,20,15,0.6)", bg: "#efeade" },
};

const listeners = new Set<() => void>();
let current: Theme = "dark";

const emit = () => listeners.forEach((l) => l());

function systemPrefers(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function paint(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

/** Sync module state with the attribute the inline boot script already set. */
export function initTheme(): Theme {
  const stored = storedTheme();
  current = stored ?? (document.documentElement.dataset.theme === "light" ? "light" : systemPrefers());
  paint(current);

  if (!stored && typeof window !== "undefined" && window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", () => {
      if (storedTheme()) return;
      current = systemPrefers();
      paint(current);
      emit();
    });
  }
  return current;
}

export function getTheme(): Theme {
  return current;
}

export function setTheme(theme: Theme) {
  current = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — the session still works, it just forgets */
  }
  paint(theme);
  emit();
}

export function toggleTheme() {
  setTheme(current === "dark" ? "light" : "dark");
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useTheme = (): Theme => useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

export const useVizColors = (): VizColors => VIZ[useTheme()];
