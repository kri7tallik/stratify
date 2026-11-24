import { CheckCircle2 } from "lucide-react";
import type { Tactic } from "@/types/content";
import { Card, SideBadge, FavoriteButton, Badge } from "@/components/ui";
import { TACTIC_LABEL } from "@/lib/labels";
import { MAP_BY_ID } from "@/data/maps";
import { useAppStore } from "@/store/useAppStore";

export function TacticCard({ t, onOpen }: { t: Tactic; onOpen(): void }) {
  const learned = useAppStore((s) => !!s.learnedTactics[t.id]);
  return (
    <Card interactive onClick={onOpen} className="group flex flex-col p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="accent">{TACTIC_LABEL[t.category]}</Badge>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-faint">{MAP_BY_ID[t.map]?.name}</span>
        </div>
        <FavoriteButton refItem={{ kind: "tactic", id: t.id }} className="-mr-2 -mt-1.5 h-7 w-7 opacity-0 group-hover:opacity-100" />
      </div>
      <h3 className="mt-2 text-[14px] font-semibold leading-snug">{t.title}</h3>
      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-muted">{t.summary}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-faint">
        <SideBadge side={t.side} />
        <span>{t.steps.length} шагов</span>
        {learned && <CheckCircle2 size={13} className="ml-auto text-ok" />}
      </div>
    </Card>
  );
}
