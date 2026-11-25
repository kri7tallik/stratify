import { useEffect, useState } from "react";
import { useAppStore, type ThemePref } from "@/store/useAppStore";

export type Theme = "light" | "dark";

const media = () => (typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null);

export function resolveTheme(pref: ThemePref): Theme {
  if (pref === "system") return media()?.matches ? "dark" : "light";
  return pref;
}

/** The theme actually on screen (follows the OS when the preference is "system"). */
export function useResolvedTheme(): Theme {
  const pref = useAppStore((s) => s.theme);
  const [system, setSystem] = useState<Theme>(() => resolveTheme("system"));
  useEffect(() => {
    const m = media();
    if (!m) return;
    const h = () => setSystem(m.matches ? "dark" : "light");
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);
  return pref === "system" ? system : pref;
}

/** Puts the resolved theme on <html data-theme> (index.html sets it before first paint too). */
export function useApplyTheme() {
  const theme = useResolvedTheme();
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#09090b" : "#f4f3ee");
  }, [theme]);
}

/** Switch theme with a short colour cross-fade (skipped for reduced motion). */
export function switchTheme(next: ThemePref) {
  const root = document.documentElement;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 420);
  }
  useAppStore.getState().setTheme(next);
}
