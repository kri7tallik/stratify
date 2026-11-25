import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play, Swords, Bomb, Dumbbell } from "lucide-react";
import { Page, PageHeader, Card, Button, Badge, SideBadge, ProgressBar, EmptyState } from "@/components/ui";
import { MapSchematic } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { NadeDot } from "@/features/grenades/GrenadeCard";
import { useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { radarUrl } from "@/components/map/MapSchematic";
import { cn } from "@/lib/cn";
import type { Grenade, MapId, Side } from "@/types/content";

const RANK = { verified: 0, partial: 1, unverified: 2 } as const;

function NadeChecklist({ side, nades }: { side: Side; nades: Grenade[] }) {
  const learned = useAppStore((s) => s.learnedGrenades);
  const toggle = useAppStore((s) => s.toggleLearnedGrenade);
  const nav = useNavigate();
  const done = nades.filter((g) => learned[g.id]).length;
  const t = useT();
  return (
    <Card className="h-full" inner="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <SideBadge side={side} />
          <span className="font-display text-[13px] font-semibold uppercase tracking-[0.12em]">{t("nav.grenades")}</span>
        </div>
        <span className="font-mono text-[12px] tabular-nums text-accent">{done}/{nades.length}</span>
      </div>
      <div className="px-5 pt-3"><ProgressBar value={nades.length ? done / nades.length : 0} tone={side === "T" ? "t" : "ct"} /></div>
      {nades.length === 0 ? (
        <p className="px-5 py-6 text-[13px] text-ink-faint">{t("prep.noNades")}</p>
      ) : (
        <ul className="mt-2 pb-2">
          {nades.map((g) => (
            <li key={g.id} className="flex items-center gap-2 px-3">
              <button onClick={() => toggle(g.id)} className="grid h-9 w-8 shrink-0 place-items-center" aria-label={t("c.markLearned")}>
                {learned[g.id] ? <CheckCircle2 size={17} className="text-ok" /> : <Circle size={17} className="text-ink-faint" />}
              </button>
              <button onClick={() => nav(`/grenades?id=${g.id}`)} className="chamfer chamfer-sm flex min-w-0 flex-1 items-center gap-2 py-2 pl-1 pr-2 text-left transition hover:bg-bg-hover">
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
  const t = useT();
  const L = useLabels();
  const [params, setParams] = useSearchParams();
  const mapId = (params.get("map") as MapId) || lastMap;
  const map = maps.find((m) => m.id === mapId) ?? maps[0];
  const warmup = programs.find((p) => p.minutes === 30) ?? programs[0];

  const sorted = (side: Side) =>
    grenades.filter((g) => g.map === map.id && g.side === side).sort((a, b) => RANK[a.meta.status] - RANK[b.meta.status] || a.difficulty.localeCompare(b.difficulty));
  const tNades = useMemo(() => sorted("T"), [grenades, map.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const ctNades = useMemo(() => sorted("CT"), [grenades, map.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const mapTactics = tactics.filter((x) => x.map === map.id).sort((a, b) => RANK[a.meta.status] - RANK[b.meta.status]);

  const pick = (id: MapId) => {
    setLast(id);
    setParams({ map: id }, { replace: true });
  };

  return (
    <Page>
      <PageHeader kicker="Match prep" title={t("prep.title", { map: map.name })} />

      <div className="mb-5 flex flex-wrap gap-2">
        {maps.map((m) => (
          <button
            key={m.id}
            onClick={() => pick(m.id)}
            className={cn("chamfer chamfer-sm group relative flex h-10 items-center gap-2 overflow-hidden pl-1.5 pr-4 font-display text-[12px] font-semibold uppercase tracking-wider ring-1 ring-inset transition", m.id === map.id ? "bg-accent/15 text-white ring-accent/60" : "text-ink-muted ring-line hover:text-ink hover:ring-line-strong")}
          >
            <img src={radarUrl(m.id)} alt="" className={cn("h-7 w-7 object-contain transition", m.id === map.id ? "opacity-100" : "opacity-50 group-hover:opacity-90")} />
            {m.name}
                      </button>
        ))}
      </div>

      <motion.div key={map.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-4">
        <Card active className="col-span-12" inner="flex flex-wrap items-center gap-5 p-5">
          <div className="chamfer grid h-12 w-12 place-items-center bg-accent/10 text-accent ring-1 ring-inset ring-accent/30"><Dumbbell size={22} /></div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-[16px] font-semibold">{warmup.name} · <span className="text-accent">{warmup.minutes} {t("c.min")}</span></div>
          </div>
          <Button variant="primary" onClick={() => { if (!active) start(warmup.id); nav("/training/session"); }}>
            <Play size={14} fill="currentColor" /> {active ? t("prep.toSession") : t("prep.warmup")}
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
          <div className="mb-3 mt-2 flex items-center gap-2 font-display text-[13px] font-semibold uppercase tracking-[0.14em]"><Swords size={14} className="text-accent" /> {t("prep.tactics")}</div>
          {mapTactics.length === 0 ? (
            <EmptyState icon={<Bomb size={18} />} title={t("prep.noTactics", { map: map.name })} text={t("tactics.emptyHint")} action={<Button size="sm" onClick={() => nav("/library?add=tactic")}>{t("c.add")}</Button>} />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {mapTactics.map((x) => (
                <Card key={x.id} interactive onClick={() => nav(`/tactics/${x.id}`)} inner="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5"><Badge tone="accent">{L.tactic[x.category]}</Badge><SideBadge side={x.side} /></div>
                    <div className="mt-1.5 truncate font-display text-[14px] font-semibold transition-colors group-hover/card:text-accent-amber">{x.title}</div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">{t("c.steps", { n: x.steps.length })} · <Bomb size={11} /> {x.grenadeIds.length}</div>
                  </div>
                  {learnedT[x.id] && <CheckCircle2 size={18} className="text-ok" />}
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Page>
  );
}
