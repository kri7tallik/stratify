import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";

/** Grenades + tactics on a map and how many of them are marked learned. */
export function useMapProgress(mapId: string) {
  const { grenades, tactics } = useContent();
  const lg = useAppStore((s) => s.learnedGrenades);
  const lt = useAppStore((s) => s.learnedTactics);
  const g = grenades.filter((x) => x.map === mapId);
  const t = tactics.filter((x) => x.map === mapId);
  const total = g.length + t.length;
  const done = g.filter((x) => lg[x.id]).length + t.filter((x) => lt[x.id]).length;
  return { grenades: g.length, tactics: t.length, done, total, ratio: total ? done / total : 0 };
}
