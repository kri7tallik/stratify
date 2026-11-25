import { CheckCircle2 } from "lucide-react";
import type { Tactic } from "@/types/content";
import { Card, SideBadge, FavoriteButton, Badge } from "@/components/ui";
import { useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { MAP_BY_ID } from "@/data/maps";
import { useAppStore } from "@/store/useAppStore";

export function TacticCard({ t, onOpen }: { t: Tactic; onOpen(): void }) {
  const learned = useAppStore((s) => !!s.learnedTactics[t.id]);
  const L = useLabels();
  const tr = useT();
  return (
    <Card interactive onClick={onOpen} inner="flex flex-col p-4">
      <span className={`absolute left-0 top-4 h-8 w-[3px] ${t.side === "T" ? "bg-tside" : "bg-ctside"}`} />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="accent">{L.tactic[t.category]}</Badge>
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{MAP_BY_ID[t.map]?.name}</span>
        </div>
        <FavoriteButton refItem={{ kind: "tactic", id: t.id }} className="-mr-2 -mt-1.5 h-7 w-7 opacity-0 transition group-hover/card:opacity-100" />
      </div>
      <h3 className="mt-2.5 font-display text-[15px] font-semibold leading-snug transition-colors group-hover/card:text-accent-amber">{t.title}</h3>
      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-muted">{t.summary}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-faint">
        <SideBadge side={t.side} />
        <span className="font-mono">{tr("c.steps", { n: t.steps.length })}</span>
        {learned && <CheckCircle2 size={13} className="ml-auto text-ok" />}
      </div>
    </Card>
  );
}
