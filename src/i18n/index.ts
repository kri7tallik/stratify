import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { UI, type UIKey } from "./ui";

export type Lang = "uk" | "ru" | "en";
export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: "uk", label: "Українська", short: "UA" },
  { id: "ru", label: "Русский", short: "RU" },
  { id: "en", label: "English", short: "EN" },
];

export const LOCALE: Record<Lang, string> = { uk: "uk-UA", ru: "ru-RU", en: "en-GB" };

export type Vars = Record<string, string | number>;

export function translate(lang: Lang, key: UIKey, vars?: Vars): string {
  const entry = UI[key];
  let s: string = entry ? entry[lang] ?? entry.en : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

export function useLang(): Lang {
  return useAppStore((s) => s.lang);
}

/** t("nav.maps"), t("dash.planProgress", { done: 2, total: 5 }) */
export function useT() {
  const lang = useLang();
  return useCallback((key: UIKey, vars?: Vars) => translate(lang, key, vars), [lang]);
}

export type { UIKey };

export { detectLang } from "./detect";
