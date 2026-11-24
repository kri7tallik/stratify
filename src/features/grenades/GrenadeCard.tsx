import { CheckCircle2 } from "lucide-react";
import type { Grenade } from "@/types/content";
import { Card, SideBadge, FavoriteButton } from "@/components/ui";
import { GRENADE_LABEL } from "@/lib/labels";
import { calloutName, MAP_BY_ID } from "@/data/maps";
import { NADE_COLOR } from "@/components/map/MapSchematic";
import { useAppStore } from "@/store/useAppStore";
import { LineupImage } from "./LineupImage";

export function NadeDot({ type, size = 8 }: { type: Grenade["type"]; size?: number }) {
  return <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: NADE_COLOR[type] }} />;
}

export function GrenadeCard({ g, onOpen, showMap = true }: { g: Grenade; onOpen(): void; showMap?: boolean }) {
  const learned = useAppStore((s) => !!s.learnedGrenades[g.id]);
  const thumb = g.images?.find((i) => i.kind === "aim") ?? g.images?.[0];
  return (
    <Card interactive onClick={onOpen} className="group overflow-hidden">
      {thumb && <LineupImage img={thumb} caption={false} className="rounded-none" />}
      <div className="p-3.5">
        <div className="flex items-center gap-2 text-[11px] text-ink-faint">
          <NadeDot type={g.type} size={7} />
          {GRENADE_LABEL[g.type]}
          {showMap && <span>· {MAP_BY_ID[g.map]?.name}</span>}
          <span className="ml-auto flex items-center gap-1">
            {learned && <CheckCircle2 size={13} className="text-ok" />}
            <SideBadge side={g.side} />
          </span>
        </div>
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold leading-snug">{g.title}</h3>
          <FavoriteButton refItem={{ kind: "grenade", id: g.id }} className="-mr-1.5 -mt-1 h-7 w-7 opacity-0 group-hover:opacity-100" />
        </div>
        <div className="mt-0.5 text-[12px] text-ink-faint">
          {calloutName(g.map, g.fromId)} → {calloutName(g.map, g.toId)}
        </div>
      </div>
    </Card>
  );
}
