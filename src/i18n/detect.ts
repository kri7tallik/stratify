import type { Lang } from "./index";

export function detectLang(): Lang {
  try {
    const l = (navigator.languages?.[0] ?? navigator.language ?? "en").toLowerCase();
    if (l.startsWith("uk")) return "uk";
    if (l.startsWith("ru") || l.startsWith("be")) return "ru";
  } catch {
    /* ignore */
  }
  return "en";
}
