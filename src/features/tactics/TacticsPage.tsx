import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Swords } from "lucide-react";
import { Page, PageHeader, Segmented, Select, EmptyState, Button } from "@/components/ui";
import { useContent } from "@/services/content";
import { TacticCard } from "./TacticCard";
import { TACTIC_CATEGORIES, useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { Stagger, Rise } from "@/components/ui";
import type { TacticCategory } from "@/types/content";
import { cn } from "@/lib/cn";

const CATS = TACTIC_CATEGORIES as readonly TacticCategory[];

export function TacticsPage() {
  const { tactics, maps } = useContent();
  const nav = useNavigate();
  const tr = useT();
  const L = useLabels();
  const [params, setParams] = useSearchParams();
  const cat = (params.get("cat") as TacticCategory | "all") || "all";
  const mapId = params.get("map") || "all";
  const side = params.get("side") || "all";
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (v === "all") n.delete(k);
    else n.set(k, v);
    setParams(n, { replace: true });
  };

  const base = tactics.filter((t) => (mapId === "all" || t.map === mapId) && (side === "all" || t.side === side));
  const list = base.filter((t) => cat === "all" || t.category === cat);
  const counts = useMemo(() => Object.fromEntries(CATS.map((c) => [c, base.filter((t) => t.category === c).length])), [base]);

  return (
    <Page>
      <PageHeader
        kicker="Strats"
        title={tr("tactics.title")}
        actions={
          <>
            <Select value={mapId} onChange={(e) => set("map", e.target.value)} className="w-40">
              <option value="all">{tr("c.allMaps")}</option>
              {maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </Select>
            <Segmented value={side} onChange={(v) => set("side", v)} options={[{ value: "all", label: tr("c.bothSides") }, { value: "T", label: "T" }, { value: "CT", label: "CT" }]} />
            <Button onClick={() => nav("/library?add=tactic")}><Plus size={15} /> {tr("c.add")}</Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {(["all", ...CATS] as const).map((c) => (
          <button
            key={c}
            onClick={() => set("cat", c)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-full px-3.5 font-display text-[12.5px] font-medium ring-1 ring-inset transition",
              cat === c ? "bg-ink text-bg ring-ink" : "text-ink-muted ring-line hover:text-ink hover:ring-line-strong",
            )}
          >
            {c === "all" ? tr("c.all") : L.tactic[c]}
            <span className={cn("font-mono text-[10px]", cat === c ? "text-accent" : "text-ink-faint")}>{c === "all" ? base.length : counts[c]}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<Swords size={20} />}
          title={cat === "all" ? tr("tactics.empty") : tr("tactics.emptyCat", { cat: L.tactic[cat as TacticCategory] })}
          text={tr("tactics.emptyHint")}
          action={<Button size="sm" variant="primary" onClick={() => nav("/library?add=tactic")}><Plus size={14} /> {tr("tactics.add")}</Button>}
        />
      ) : (
        <Stagger key={cat + mapId + side} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => <Rise key={t.id}><TacticCard t={t} onOpen={() => nav(`/tactics/${t.id}`)} /></Rise>)}
        </Stagger>
      )}
    </Page>
  );
}
