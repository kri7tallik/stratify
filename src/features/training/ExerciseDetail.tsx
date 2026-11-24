import { ExternalLink, Target, Repeat, Clock } from "lucide-react";
import type { Exercise } from "@/types/content";
import { Badge, Button, SourceBlock } from "@/components/ui";
import { EXERCISE_LABEL } from "@/lib/labels";
import { useContent } from "@/services/content";
import { openExternal } from "@/lib/open";

export function ExerciseDetail({ e }: { e: Exercise }) {
  const { workshopMaps } = useContent();
  const ws = workshopMaps.find((w) => w.id === e.workshopMapId);
  return (
    <div className="space-y-5 p-5">
      <div>
        <Badge tone="accent">{EXERCISE_LABEL[e.category]}</Badge>
        <h2 className="mt-2 text-xl font-semibold">{e.name}</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { i: Clock, l: "Длительность", v: `${e.minutes} мин` },
          { i: Repeat, l: "Повторения", v: e.reps },
          { i: Target, l: "Цель", v: e.goal },
        ].map((x) => (
          <div key={x.l} className="rounded-xl border border-line bg-bg p-3">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-ink-faint"><x.i size={11} />{x.l}</div>
            <div className="mt-1 text-[13px] font-medium leading-snug">{x.v}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Инструкция</div>
        <ol className="space-y-2" data-selectable>
          {e.instructions.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent/10 text-[11px] font-semibold text-accent">{i + 1}</span>
              <span className="break-words">{s}</span>
            </li>
          ))}
        </ol>
      </div>
      {ws ? (
        <div className="rounded-xl border border-line bg-bg p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Рекомендуемая Workshop-карта</div>
          <div className="mt-1 font-medium">{ws.name}</div>
          <div className="text-[12px] text-ink-faint">by {ws.author}</div>
          <p className="mt-1 text-[13px] text-ink-muted">{ws.description}</p>
          <Button size="sm" className="mt-3" onClick={() => openExternal(ws.url)}>Открыть в Steam Workshop <ExternalLink size={13} /></Button>
        </div>
      ) : (
        <p className="text-[12px] text-ink-faint">Workshop-карта не требуется (официальный режим / практика).</p>
      )}
      <SourceBlock meta={e.meta} />
    </div>
  );
}
