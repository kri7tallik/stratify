import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Plus, SlidersHorizontal } from "lucide-react";
import { Page, PageHeader, Segmented, Select, EmptyState, Button, Drawer } from "@/components/ui";
import { MapSchematic, NADE_COLOR } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { GrenadeCard } from "./GrenadeCard";
import { GrenadeDetail } from "./GrenadeDetail";
import { DIFF_LABEL } from "@/lib/labels";
import type { Difficulty, GrenadeType, MapId, Side } from "@/types/content";
import { cn } from "@/lib/cn";

type TypeFilter = "all" | GrenadeType;
const TYPES: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "smoke", label: "Smokes" },
  { value: "flash", label: "Flashes" },
  { value: "molotov", label: "Molotovs" },
  { value: "he", label: "HE" },
];

export function GrenadeLabPage() {
  const { grenades, maps } = useContent();
  const learned = useAppStore((s) => s.learnedGrenades);
  const lastMap = useAppStore((s) => s.lastMapId);
  const [params, setParams] = useSearchParams();
  const [more, setMore] = useState(false);
  const nav = useNavigate();

  const type = (params.get("type") as TypeFilter) || "all";
  const mapId = (params.get("map") as MapId | "all") || (params.get("id") ? "all" : lastMap);
  const side = (params.get("side") as Side | "all") || "all";
  const position = params.get("pos") || "all";
  const diff = (params.get("diff") as Difficulty | "all") || "all";
  const purpose = params.get("purpose") || "all";
  const learnedF = params.get("learned") || "all";
  const openId = params.get("id");

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || (v === "all" && k !== "map")) next.delete(k);
    else next.set(k, v);
    if (k === "map") next.delete("pos");
    setParams(next, { replace: true });
  };

  const map = mapId !== "all" ? maps.find((m) => m.id === mapId) : undefined;
  const allTags = useMemo(() => [...new Set(grenades.flatMap((g) => g.tags))].sort(), [grenades]);
  const extra = [position, diff, purpose, learnedF].filter((x) => x !== "all").length;

  const filtered = useMemo(
    () =>
      grenades.filter(
        (g) =>
          (type === "all" || g.type === type) &&
          (mapId === "all" || g.map === mapId) &&
          (side === "all" || g.side === side) &&
          (position === "all" || g.fromId === position || g.toId === position) &&
          (diff === "all" || g.difficulty === diff) &&
          (purpose === "all" || g.tags.includes(purpose)) &&
          (learnedF === "all" || (learnedF === "yes" ? !!learned[g.id] : !learned[g.id])),
      ),
    [grenades, type, mapId, side, position, diff, purpose, learnedF, learned],
  );

  const opened = grenades.find((g) => g.id === openId);

  return (
    <Page className="max-w-[1600px]">
      <PageHeader title="Гранаты" actions={<Button variant="ghost" onClick={() => nav("/library?add=grenade")}><Plus size={15} /> Добавить</Button>} />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Select value={mapId} onChange={(e) => set("map", e.target.value)} className="w-36">
          <option value="all">Все карты</option>
          {maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </Select>
        <Segmented value={side} onChange={(v) => set("side", v)} options={[{ value: "all", label: "T + CT" }, { value: "T", label: "T" }, { value: "CT", label: "CT" }]} />
        <Segmented
          value={type}
          onChange={(v) => set("type", v)}
          options={TYPES.map((t) => ({ value: t.value, label: <>{t.value !== "all" && <span className="h-1.5 w-1.5 rounded-full" style={{ background: NADE_COLOR[t.value as GrenadeType] }} />}{t.label}</> }))}
        />
        <Button variant="ghost" size="sm" onClick={() => setMore((x) => !x)} className={cn(extra > 0 && "text-accent")}>
          <SlidersHorizontal size={14} /> Ещё{extra > 0 && ` · ${extra}`}
        </Button>
      </div>

      {more && (
        <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Select value={position} disabled={!map} onChange={(e) => set("pos", e.target.value)}>
            <option value="all">{map ? "Любая позиция" : "Позиция: выберите карту"}</option>
            {map?.callouts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={diff} onChange={(e) => set("diff", e.target.value)}>
            <option value="all">Любая сложность</option>
            {(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => <option key={d} value={d}>{DIFF_LABEL[d]}</option>)}
          </Select>
          <Select value={purpose} onChange={(e) => set("purpose", e.target.value)}>
            <option value="all">Любое назначение</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={learnedF} onChange={(e) => set("learned", e.target.value)}>
            <option value="all">Изученные и нет</option>
            <option value="no">Не изученные</option>
            <option value="yes">Изученные</option>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {map && (
          <div className="col-span-12 xl:col-span-5">
            <div className="sticky top-4">
              <MapSchematic
                map={map}
                highlight={position !== "all" ? [position] : []}
                trajectories={filtered.map((g) => ({ id: g.id, from: g.fromId, to: g.toId, type: g.type }))}
                onTrajectoryClick={(id) => set("id", id)}
                onCalloutClick={(c) => set("pos", position === c.id ? "all" : c.id)}
                className="aspect-square w-full"
              />
            </div>
          </div>
        )}
        <div className={map ? "col-span-12 xl:col-span-7" : "col-span-12"}>
          {filtered.length === 0 ? (
            <EmptyState title="Ничего не найдено" action={<Button size="sm" onClick={() => setParams({ map: String(mapId) }, { replace: true })}>Сбросить фильтры</Button>} />
          ) : (
            <div className={map ? "grid grid-cols-1 gap-3 md:grid-cols-2" : "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"}>
              {filtered.map((g) => <GrenadeCard key={g.id} g={g} showMap={!map} onOpen={() => set("id", g.id)} />)}
            </div>
          )}
        </div>
      </div>

      <Drawer open={!!opened} onClose={() => set("id", "")} title="Граната">
        {opened && <GrenadeDetail g={opened} />}
      </Drawer>
    </Page>
  );
}
