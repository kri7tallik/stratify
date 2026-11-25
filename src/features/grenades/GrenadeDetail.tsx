import { CheckCircle2, Circle, ExternalLink, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Grenade } from "@/types/content";
import { Button, SideBadge, SourceBlock, FavoriteButton } from "@/components/ui";
import { MapSchematic } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { openExternal } from "@/lib/open";
import { NadeDot } from "./GrenadeCard";
import { LineupImage } from "./LineupImage";
import { LineupLightbox, sortShots } from "./LineupLightbox";
import { useEffect, useMemo, useState } from "react";

/** Grenade drawers are wide so the lineup screenshots are actually readable. */
export const NADE_DRAWER_WIDTH = 920;

function videoEmbed(url?: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : null;
}

export function GrenadeDetail({ g }: { g: Grenade }) {
  const { mapById, sourceById } = useContent();
  const L = useLabels();
  const t = useT();
  const map = mapById(g.map)!;
  const learned = useAppStore((s) => !!s.learnedGrenades[g.id]);
  const toggle = useAppStore((s) => s.toggleLearnedGrenade);
  const embed = videoEmbed(g.videoUrl);
  const shots = useMemo(() => sortShots(g.images ?? []), [g.images]);
  const [shot, setShot] = useState<number | null>(null);
  const sourceUrl = g.meta.url || sourceById(g.meta.sourceId)?.url || undefined;
  useEffect(() => setShot(null), [g.id]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            <NadeDot type={g.type} /> {L.nade[g.type]} · {map.name} <SideBadge side={g.side} />
          </div>
          <h2 className="mt-2 font-hero text-[26px] font-semibold leading-tight tracking-tight">{g.title}</h2>
          <p className="mt-1 text-[13px] text-ink-muted">{g.purpose}</p>
        </div>
        <FavoriteButton refItem={{ kind: "grenade", id: g.id }} />
      </div>

      {shots.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="tag-label">{t("nade.shots")}</span>
            <span className="hidden text-[11px] text-ink-faint sm:inline">{t("lb.open")}</span>
          </div>
          <div className="grid gap-2.5">
            {shots.map((img, i) => (
              <motion.div
                key={img.src + i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.08 }}
              >
                <LineupImage img={img} step={i + 1} className="chamfer" onOpen={() => setShot(i)} />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <p className="chamfer bg-sunken p-3 text-[12px] text-ink-faint ring-1 ring-inset ring-line">{t("nade.noShots")}</p>
      )}
      <LineupLightbox images={shots} index={shot} onIndex={setShot} onClose={() => setShot(null)} title={g.title} sourceUrl={sourceUrl} />

      {embed && (
        <div className="chamfer aspect-video overflow-hidden">
          <iframe src={embed} className="h-full w-full" allow="encrypted-media; picture-in-picture" allowFullScreen title={g.title} />
        </div>
      )}
      {g.videoUrl && !embed && (
        <Button size="sm" onClick={() => openExternal(g.videoUrl!)}>
          <PlayCircle size={14} /> {t("c.video")} <ExternalLink size={12} />
        </Button>
      )}

      <dl className="chamfer grid grid-cols-[120px_1fr] gap-x-3 gap-y-2.5 bg-sunken p-4 text-[13px] ring-1 ring-inset ring-line">
        <dt className="tag-label !text-[10px] pt-0.5">{t("nade.where")}</dt>
        <dd>{g.position}</dd>
        <dt className="tag-label !text-[10px] pt-0.5">{t("nade.aim")}</dt>
        <dd>{g.aim}</dd>
        <dt className="tag-label !text-[10px] pt-0.5">{t("nade.throw")}</dt>
        <dd className="font-medium text-accent-amber">{L.throw[g.throwType]}</dd>
      </dl>

      <ol className="space-y-2" data-selectable>
        {g.instructions.map((s, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }} className="flex gap-3 text-[13px] leading-relaxed">
            <span className="chamfer chamfer-sm grid h-6 w-6 shrink-0 place-items-center bg-accent/15 font-display text-[11px] font-bold text-accent">{i + 1}</span>
            <span className="pt-0.5">{s}</span>
          </motion.li>
        ))}
      </ol>

      <MapSchematic map={map} highlight={[g.fromId, g.toId]} trajectories={[{ id: g.id, from: g.fromId, to: g.toId, type: g.type, active: true }]} className="aspect-square" />

      <SourceBlock meta={g.meta} />

      <Button variant={learned ? "secondary" : "primary"} size="lg" className="w-full" onClick={() => toggle(g.id)}>
        {learned ? <CheckCircle2 size={17} className="text-ok" /> : <Circle size={17} />}
        {learned ? t("c.learned") : t("nade.markLearned")}
      </Button>
    </motion.div>
  );
}
