import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Swords } from "lucide-react";
import { Page, PageHeader, Segmented, Select, EmptyState, Button } from "@/components/ui";
import { useContent } from "@/services/content";
import { TacticCard } from "./TacticCard";
import { TACTIC_LABEL } from "@/lib/labels";
import type { TacticCategory } from "@/types/content";
import { cn } from "@/lib/cn";

const CATS = Object.keys(TACTIC_LABEL) as TacticCategory[];

export function TacticsPage() {
  const { tactics, maps } = useContent();
  const nav = useNavigate();
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
        title="Тактики"
        actions={
          <>
            <Select value={mapId} onChange={(e) => set("map", e.target.value)} className="w-40">
              <option value="all">Все карты</option>
              {maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </Select>
            <Segmented value={side} onChange={(v) => set("side", v)} options={[{ value: "all", label: "T + CT" }, { value: "T", label: "T" }, { value: "CT", label: "CT" }]} />
            <Button onClick={() => nav("/library?add=tactic")}><Plus size={15} /> Добавить</Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {(["all", ...CATS] as const).map((c) => (
          <button
            key={c}
            onClick={() => set("cat", c)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition",
              cat === c ? "border-accent/50 bg-accent/10 text-ink" : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {c === "all" ? "Все" : TACTIC_LABEL[c]}
            <span className="text-[11px] text-ink-faint">{c === "all" ? base.length : counts[c]}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<Swords size={20} />}
          title={cat === "all" ? "Тактик не найдено" : `Пока нет проверенных тактик: ${TACTIC_LABEL[cat as TacticCategory]}`}
          text="Мы не придумываем стратегии сами. Добавьте тактику из разбора матча, гайда или видео — со ссылкой на оригинал."
          action={<Button size="sm" variant="primary" onClick={() => nav("/library?add=tactic")}><Plus size={14} /> Добавить тактику</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => <TacticCard key={t.id} t={t} onOpen={() => nav(`/tactics/${t.id}`)} />)}
        </div>
      )}
    </Page>
  );
}
