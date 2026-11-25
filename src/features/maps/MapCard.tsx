import { useNavigate } from "react-router-dom";
import type { CsMap } from "@/types/content";
import { Card, ProgressBar } from "@/components/ui";
import { radarUrl } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/i18n";

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

export function MapCard({ map }: { map: CsMap }) {
  const nav = useNavigate();
  const t = useT();
  const setLast = useAppStore((s) => s.setLastMap);
  const p = useMapProgress(map.id);
  return (
    <Card
      interactive
      onClick={() => {
        setLast(map.id);
        nav(`/maps/${map.id}`);
      }}
      inner="overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle,#121a24,#07090c_70%)]">
        <img src={radarUrl(map.id)} alt="" className="absolute inset-0 h-full w-full scale-110 object-contain opacity-70 transition duration-700 group-hover/card:rotate-[-3deg] group-hover/card:scale-[1.2] group-hover/card:opacity-100" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover/card:opacity-100">
          <div className="absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 animate-sweep rounded-full bg-[conic-gradient(from_0deg,rgba(255,107,26,0.2),transparent_12%,transparent)] [mask-image:radial-gradient(circle,#000_35%,transparent_68%)]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-panel via-bg-panel/70 to-transparent px-4 pb-3 pt-14">
          <div className="flex items-end justify-between">
            <span className="font-display text-2xl font-bold uppercase tracking-wider transition-colors group-hover/card:text-accent-amber">{map.name}</span>
            <span className="tag-label !text-[9px]">{map.activeDuty ? t("c.activeDuty") : t("c.reserve")}</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-1">
        <div className="mb-2 flex justify-between text-[12px] text-ink-faint">
          <span>{t("c.nadesTactics", { g: p.grenades, t: p.tactics })}</span>
          <span className="font-mono tabular-nums text-ink-muted">
            {p.done}/{p.total}
          </span>
        </div>
        <ProgressBar value={p.ratio} />
      </div>
    </Card>
  );
}
