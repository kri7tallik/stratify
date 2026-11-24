import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play, Swords, Bomb, Dumbbell } from "lucide-react";
import { Page, PageHeader, Card, Button, Badge, SideBadge, ProgressBar, EmptyState } from "@/components/ui";
import { MapSchematic } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { NadeDot } from "@/features/grenades/GrenadeCard";
import { TACTIC_LABEL } from "@/lib/labels";
import { cn } from "@/lib/cn";
import type { Grenade, MapId, Side } from "@/types/content";

const RANK = { verified: 0, partial: 1, unverified: 2 } as const;

function NadeChecklist({ side, nades }: { side: Side; nades: Grenade[] }) {
  const learned = useAppStore((s) => s.learnedGrenades);
  const toggle = useAppStore((s) => s.toggleLearnedGrenade);
  const nav = useNavigate();
  const done = nades.filter((g) => learned[g.id]).length;
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <SideBadge side={side} />
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Гранаты</span>
        </div>
        <span className="text-[12px] tabular-nums text-ink-faint">{done}/{nades.length}</span>
      </div>
      <div className="px-5 pt-3"><ProgressBar value={nades.length ? done / nades.length : 0} tone={side === "T" ? "t" : "ct"} /></div>
      {nades.length === 0 ? (
        <p className="px-5 py-6 text-[13px] text-ink-faint">Для этой стороны в базе пока нет гранат с источником.</p>
      ) : (
        <ul className="mt-2 pb-2">
          {nades.map((g) => (
            <li key={g.id} className="flex items-center gap-2 px-3">
              <button onClick={() => toggle(g.id)} className="grid h-9 w-8 shrink-0 place-items-center" aria-label="Отметить">
                {learned[g.id] ? <CheckCircle2 size={17} className="text-ok" /> : <Circle size={17} className="text-ink-faint" />}
              </button>
              <button onClick={() => nav(`/grenades?id=${g.id}`)} className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-2 pr-2 text-left hover:bg-bg-hover">
                <NadeDot type={g.type} size={7} />
                <span className={cn("flex-1 truncate text-[13px]", learned[g.id] && "text-ink-faint")}>{g.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function MatchPrepPage() {
  const { maps, grenades, tactics, programs } = useContent();
  const lastMap = useAppStore((s) => s.lastMapId);
  const setLast = useAppStore((s) => s.setLastMap);
  const learnedT = useAppStore((s) => s.learnedTactics);
  const active = useAppStore((s) => s.active);
  const start = useAppStore((s) => s.startSession);
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const mapId = (params.get("map") as MapId) || lastMap;
  const map = maps.find((m) => m.id === mapId) ?? maps[0];
  const warmup = programs.find((p) => p.minutes === 30) ?? programs[0];

  const sorted = (side: Side) =>
    grenades.filter((g) => g.map === map.id && g.side === side).sort((a, b) => RANK[a.meta.status] - RANK[b.meta.status] || a.difficulty.localeCompare(b.difficulty));
  const tNades = useMemo(() => sorted("T"), [grenades, map.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const ctNades = useMemo(() => sorted("CT"), [grenades, map.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const mapTactics = tactics.filter((t) => t.map === map.id).sort((a, b) => RANK[a.meta.status] - RANK[b.meta.status]);

  const pick = (id: MapId) => {
    setLast(id);
    setParams({ map: id }, { replace: true });
  };

  return (
    <Page>
      <PageHeader title={<>Перед игрой на {map.name}</>} />

      <div className="mb-5 flex flex-wrap gap-2">
        {maps.map((m) => (
          <button
            key={m.id}
            onClick={() => pick(m.id)}
            className={cn("relative h-9 overflow-hidden rounded-lg border px-4 text-[13px] font-medium transition", m.id === map.id ? "border-accent/60 bg-accent/10 text-ink" : "border-line text-ink-muted hover:border-line-strong hover:text-ink")}
          >
            <span className="absolute inset-x-0 top-0 h-[2px] opacity-70" style={{ background: m.accent }} />
            {m.name}
                      </button>
        ))}
      </div>

      <motion.div key={map.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 flex flex-wrap items-center gap-5 p-5">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30"><Dumbbell size={22} /></div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold">{warmup.name} · {warmup.minutes} мин</div>
          </div>
          <Button variant="primary" onClick={() => { if (!active) start(warmup.id); nav("/training/session"); }}>
            <Play size={14} fill="currentColor" /> {active ? "К сессии" : "Начать разминку"}
          </Button>
        </Card>

        <div className="col-span-12 lg:col-span-4">
          <MapSchematic
            map={map}
            trajectories={[...tNades, ...ctNades].map((g) => ({ id: g.id, from: g.fromId, to: g.toId, type: g.type }))}
            onTrajectoryClick={(id) => nav(`/grenades?id=${id}`)}
            className="aspect-square w-full"
          />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4"><NadeChecklist side="T" nades={tNades} /></div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4"><NadeChecklist side="CT" nades={ctNades} /></div>

        <div className="col-span-12">
          <div className="mb-3 mt-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted"><Swords size={14} /> Тактики карты</div>
          {mapTactics.length === 0 ? (
            <EmptyState icon={<Bomb size={18} />} title={`Нет тактик для ${map.name}`} text="Добавьте тактику с источником в Библиотеке." action={<Button size="sm" onClick={() => nav("/library?add=tactic")}>Добавить</Button>} />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {mapTactics.map((t) => (
                <Card key={t.id} interactive onClick={() => nav(`/tactics/${t.id}`)} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5"><Badge tone="accent">{TACTIC_LABEL[t.category]}</Badge><SideBadge side={t.side} /></div>
                    <div className="mt-1.5 truncate text-[14px] font-medium">{t.title}</div>
                    <div className="text-[12px] text-ink-faint">{t.steps.length} шагов · {t.grenadeIds.length} гранат</div>
                  </div>
                  {learnedT[t.id] && <CheckCircle2 size={18} className="text-ok" />}
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Page>
  );
}
