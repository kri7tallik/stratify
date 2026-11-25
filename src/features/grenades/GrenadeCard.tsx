import { CheckCircle2 } from "lucide-react";
import type { Grenade } from "@/types/content";
import { Card, SideBadge, FavoriteButton } from "@/components/ui";
import { calloutName, MAP_BY_ID } from "@/data/maps";
import { NADE_COLOR } from "@/components/map/MapSchematic";
import { useAppStore } from "@/store/useAppStore";
import { useLabels } from "@/lib/labels";
import { LineupImage } from "./LineupImage";

export function NadeDot({ type, size = 8 }: { type: Grenade["type"]; size?: number }) {
  return <span className="inline-block shrink-0 rotate-45" style={{ width: size, height: size, background: NADE_COLOR[type], boxShadow: `0 0 10px ${NADE_COLOR[type]}88` }} />;
}

export function GrenadeCard({ g, onOpen, showMap = true }: { g: Grenade; onOpen(): void; showMap?: boolean }) {
  const learned = useAppStore((s) => !!s.learnedGrenades[g.id]);
  const L = useLabels();
  const thumb = g.images?.find((i) => i.kind === "aim") ?? g.images?.[0];
  return (
    <Card interactive onClick={onOpen} inner="overflow-hidden">
      {thumb ? (
        <div className="relative">
          <LineupImage img={thumb} caption={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-panel via-transparent to-transparent" />
          <div className="absolute left-3 top-3"><SideBadge side={g.side} /></div>
          {learned && <CheckCircle2 size={18} className="absolute right-3 top-3 text-ok drop-shadow" />}
        </div>
      ) : (
        <div className="flex items-center justify-between px-3.5 pt-3.5">
          <SideBadge side={g.side} />
          {learned && <CheckCircle2 size={16} className="text-ok" />}
        </div>
      )}
      <div className="relative p-3.5 pt-2">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          <NadeDot type={g.type} size={7} />
          {L.nade[g.type]}
          {showMap && <span>· {MAP_BY_ID[g.map]?.name}</span>}
        </div>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] font-semibold leading-snug transition-colors group-hover/card:text-accent-amber">{g.title}</h3>
          <FavoriteButton refItem={{ kind: "grenade", id: g.id }} className="-mr-1.5 -mt-1 h-7 w-7 opacity-0 transition group-hover/card:opacity-100" />
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-ink-faint">
          {calloutName(g.map, g.fromId)} <span className="text-accent">→</span> {calloutName(g.map, g.toId)}
        </div>
      </div>
    </Card>
  );
}
