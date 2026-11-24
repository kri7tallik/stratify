import { CheckCircle2, Circle, ExternalLink, PlayCircle } from "lucide-react";
import type { Grenade } from "@/types/content";
import { Button, SideBadge, SourceBlock, FavoriteButton } from "@/components/ui";
import { MapSchematic } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { GRENADE_LABEL, THROW_LABEL } from "@/lib/labels";
import { openExternal } from "@/lib/open";
import { NadeDot } from "./GrenadeCard";
import { LineupImage } from "./LineupImage";

function videoEmbed(url?: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : null;
}

export function GrenadeDetail({ g }: { g: Grenade }) {
  const { mapById } = useContent();
  const map = mapById(g.map)!;
  const learned = useAppStore((s) => !!s.learnedGrenades[g.id]);
  const toggle = useAppStore((s) => s.toggleLearnedGrenade);
  const embed = videoEmbed(g.videoUrl);

  return (
    <div className="space-y-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[12px] text-ink-faint">
            <NadeDot type={g.type} /> {GRENADE_LABEL[g.type]} · {map.name} <SideBadge side={g.side} />
          </div>
          <h2 className="mt-1 text-xl font-semibold leading-tight">{g.title}</h2>
          <p className="mt-1 text-[13px] text-ink-muted">{g.purpose}</p>
        </div>
        <FavoriteButton refItem={{ kind: "grenade", id: g.id }} />
      </div>

      {g.images && g.images.length > 0 && (
        <div className="space-y-2">
          {g.images.map((img) => (
            <LineupImage key={img.src} img={img} />
          ))}
        </div>
      )}

      {embed && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <iframe src={embed} className="h-full w-full" allow="encrypted-media; picture-in-picture" allowFullScreen title={g.title} />
        </div>
      )}
      {g.videoUrl && !embed && (
        <Button size="sm" onClick={() => openExternal(g.videoUrl!)}>
          <PlayCircle size={14} /> Видео <ExternalLink size={12} />
        </Button>
      )}

      <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-[13px]">
        <dt className="text-ink-faint">Где стоять</dt>
        <dd>{g.position}</dd>
        <dt className="text-ink-faint">Куда целиться</dt>
        <dd>{g.aim}</dd>
        <dt className="text-ink-faint">Бросок</dt>
        <dd>{THROW_LABEL[g.throwType]}</dd>
      </dl>

      <ol className="space-y-1.5" data-selectable>
        {g.instructions.map((s, i) => (
          <li key={i} className="flex gap-3 text-[13px] leading-relaxed">
            <span className="w-4 shrink-0 text-right font-mono text-ink-faint">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <MapSchematic map={map} highlight={[g.fromId, g.toId]} trajectories={[{ id: g.id, from: g.fromId, to: g.toId, type: g.type, active: true }]} className="aspect-square" />

      <SourceBlock meta={g.meta} />

      <Button variant={learned ? "secondary" : "primary"} className="w-full" onClick={() => toggle(g.id)}>
        {learned ? <CheckCircle2 size={16} className="text-ok" /> : <Circle size={16} />}
        {learned ? "Изучено" : "Отметить как изученную"}
      </Button>
    </div>
  );
}
