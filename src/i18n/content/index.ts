import { useMemo } from "react";
import type { CsMap, Exercise, Grenade, PlaybookEntry, SourceMeta, Tactic, TrainingProgram, WorkshopMap } from "@/types/content";
import { useLang, type Lang } from "@/i18n";
import { RU } from "./ru";
import { UK } from "./uk";

/**
 * Content translations are overlays on the English base data, keyed by
 * "<kind>:<id>". Missing keys fall back to English, so user-added content and
 * new items still render.
 */
export interface Overlay {
  title?: string;
  name?: string;
  position?: string;
  aim?: string;
  purpose?: string;
  instructions?: string[];
  note?: string;
  summary?: string;
  roles?: [string, string][];
  steps?: [string, string][];
  utilityNotes?: string[];
  timings?: string;
  goal?: string;
  reps?: string;
  focus?: string;
  description?: string;
  details?: string[];
  overview?: string;
  positions?: [string, string, string, string][];
  routes?: [string, string, string][];
}

export type OverlayDict = Record<string, Overlay>;

const DICTS: Record<Exclude<Lang, "en">, OverlayDict> = { ru: RU, uk: UK };

const withNote = (meta: SourceMeta, o?: Overlay): SourceMeta => (o?.note && meta.note ? { ...meta, note: o.note } : meta);

export function localizer(lang: Lang) {
  const d = lang === "en" ? undefined : DICTS[lang];
  const get = (k: string) => d?.[k];

  return {
    grenade(g: Grenade): Grenade {
      const o = get(`grenade:${g.id}`);
      if (!o) return g;
      return { ...g, title: o.title ?? g.title, position: o.position ?? g.position, aim: o.aim ?? g.aim, purpose: o.purpose ?? g.purpose, instructions: o.instructions ?? g.instructions, meta: withNote(g.meta, o) };
    },
    tactic(t: Tactic): Tactic {
      const o = get(`tactic:${t.id}`);
      if (!o) return t;
      return {
        ...t,
        title: o.title ?? t.title,
        summary: o.summary ?? t.summary,
        roles: t.roles.map((r, i) => (o.roles?.[i] ? { ...r, role: o.roles[i][0], task: o.roles[i][1] } : r)),
        steps: t.steps.map((s, i) => (o.steps?.[i] ? { ...s, label: o.steps[i][0], detail: o.steps[i][1] } : s)),
        utilityNotes: o.utilityNotes ?? t.utilityNotes,
        timings: o.timings ?? t.timings,
        meta: withNote(t.meta, o),
      };
    },
    exercise(e: Exercise): Exercise {
      const o = get(`exercise:${e.id}`);
      if (!o) return e;
      return { ...e, name: o.name ?? e.name, goal: o.goal ?? e.goal, reps: o.reps ?? e.reps, instructions: o.instructions ?? e.instructions, meta: withNote(e.meta, o) };
    },
    program(p: TrainingProgram): TrainingProgram {
      const o = get(`program:${p.id}`);
      if (!o) return p;
      return { ...p, name: o.name ?? p.name, focus: o.focus ?? p.focus, description: o.description ?? p.description, meta: withNote(p.meta, o) };
    },
    playbook(p: PlaybookEntry): PlaybookEntry {
      const o = get(`playbook:${p.id}`);
      if (!o) return p;
      return { ...p, title: o.title ?? p.title, summary: o.summary ?? p.summary, details: o.details ?? p.details, meta: withNote(p.meta, o) };
    },
    workshop(w: WorkshopMap): WorkshopMap {
      const o = get(`workshop:${w.id}`);
      return o?.description ? { ...w, description: o.description } : w;
    },
    map(m: CsMap): CsMap {
      const o = get(`map:${m.id}`);
      if (!o) return m;
      const pos = new Map((o.positions ?? []).map((p) => [p[0], p]));
      const rt = new Map((o.routes ?? []).map((r) => [r[0], r]));
      return {
        ...m,
        overview: o.overview ?? m.overview,
        positions: m.positions.map((p) => {
          const x = pos.get(p.id);
          return x ? { ...p, name: x[1], role: x[2], description: x[3] } : p;
        }),
        routes: m.routes.map((r) => {
          const x = rt.get(r.id);
          return x ? { ...r, name: x[1], description: x[2] } : r;
        }),
        meta: withNote(m.meta, o),
      };
    },
  };
}

export type Localizer = ReturnType<typeof localizer>;

export function useLocalizer(): Localizer {
  const lang = useLang();
  return useMemo(() => localizer(lang), [lang]);
}
