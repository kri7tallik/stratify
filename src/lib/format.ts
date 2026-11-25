import { LOCALE, translate, type Lang } from "@/i18n";

export function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

const HOUR: Record<Lang, string> = { uk: "год", ru: "ч", en: "h" };

export function fmtDuration(totalSeconds: number, lang: Lang = "en"): string {
  const m = Math.round(totalSeconds / 60);
  const min = translate(lang, "c.min");
  if (m < 60) return `${m} ${min}`;
  const h = Math.floor(m / 60);
  return `${h} ${HOUR[lang]} ${m % 60} ${min}`;
}

export function fmtDate(iso: string, lang: Lang = "en"): string {
  try {
    return new Date(iso).toLocaleDateString(LOCALE[lang], { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export const todayKey = (d: Date = new Date()) => d.toISOString().slice(0, 10);

export function greeting(lang: Lang, d = new Date()): string {
  const h = d.getHours();
  const key = h < 5 ? "greet.night" : h < 12 ? "greet.morning" : h < 18 ? "greet.day" : "greet.evening";
  return translate(lang, key);
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
