import { useNavigate } from "react-router-dom";
import type { CsMap } from "@/types/content";
import { Card, ProgressBar } from "@/components/ui";
import { radarUrl } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";

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
  const setLast = useAppStore((s) => s.setLastMap);
  const p = useMapProgress(map.id);
  return (
    <Card
      interactive
      onClick={() => {
        setLast(map.id);
        nav(`/maps/${map.id}`);
      }}
      className="group overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0e11]">
        <img src={radarUrl(map.id)} alt="" className="absolute inset-0 h-full w-full scale-110 object-contain opacity-80 transition duration-500 group-hover:scale-[1.16] group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-raised to-transparent px-4 pb-3 pt-10">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-semibold">{map.name}</span>
            {!map.activeDuty && <span className="text-[11px] text-ink-faint">резерв</span>}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-1">
        <div className="mb-2 flex justify-between text-[12px] text-ink-faint">
          <span>{p.grenades} гранат · {p.tactics} тактик</span>
          <span className="tabular-nums">{p.done}/{p.total}</span>
        </div>
        <ProgressBar value={p.ratio} />
      </div>
    </Card>
  );
}
