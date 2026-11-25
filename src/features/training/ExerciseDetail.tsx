import { ExternalLink, Target, Repeat, Clock } from "lucide-react";
import type { Exercise } from "@/types/content";
import { Badge, Button, SourceBlock } from "@/components/ui";
import { useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { useContent } from "@/services/content";
import { openExternal } from "@/lib/open";

export function ExerciseDetail({ e }: { e: Exercise }) {
  const { workshopMaps } = useContent();
  const t = useT();
  const L = useLabels();
  const ws = workshopMaps.find((w) => w.id === e.workshopMapId);
  return (
    <div className="space-y-5 p-5">
      <div>
        <Badge tone="accent">{L.exercise[e.category]}</Badge>
        <h2 className="mt-2 font-hero text-[26px] font-semibold tracking-tight">{e.name}</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { i: Clock, l: t("ex.duration"), v: `${e.minutes} ${t("c.min")}` },
          { i: Repeat, l: t("ex.reps"), v: e.reps },
          { i: Target, l: t("ex.goal"), v: e.goal },
        ].map((x) => (
          <div key={x.l} className="chamfer chamfer-sm bg-sunken p-3 ring-1 ring-inset ring-line">
            <div className="tag-label flex items-center gap-1 !text-[9px]"><x.i size={11} className="text-accent" />{x.l}</div>
            <div className="mt-1 text-[13px] font-medium leading-snug">{x.v}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="tag-label mb-2">{t("ex.instructions")}</div>
        <ol className="space-y-2" data-selectable>
          {e.instructions.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="chamfer chamfer-sm grid h-6 w-6 shrink-0 place-items-center bg-accent/15 font-display text-[11px] font-bold text-accent">{i + 1}</span>
              <span className="break-words">{s}</span>
            </li>
          ))}
        </ol>
      </div>
      {ws ? (
        <div className="chamfer bg-sunken p-4 ring-1 ring-inset ring-line">
          <div className="tag-label">{t("ex.workshop")}</div>
          <div className="mt-1 font-medium">{ws.name}</div>
          <div className="text-[12px] text-ink-faint">by {ws.author}</div>
          <p className="mt-1 text-[13px] text-ink-muted">{ws.description}</p>
          <Button size="sm" className="mt-3" onClick={() => openExternal(ws.url)}>{t("ex.openWorkshop")} <ExternalLink size={13} /></Button>
        </div>
      ) : (
        <p className="text-[12px] text-ink-faint">{t("ex.noWorkshop")}</p>
      )}
      <SourceBlock meta={e.meta} />
    </div>
  );
}
