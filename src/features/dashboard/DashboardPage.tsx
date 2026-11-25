import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play, Pencil, Target, Bomb, Swords, Clock, Flame } from "lucide-react";
import { Page, Card, Button, ProgressBar, Segmented, Drawer, Input, CountUp, Stagger, Rise, SectionTitle } from "@/components/ui";
import { radarUrl } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { greeting, todayKey } from "@/lib/format";
import { MAP_BY_ID } from "@/data/maps";
import { NadeDot } from "@/features/grenades/GrenadeCard";
import { GrenadeDetail } from "@/features/grenades/GrenadeDetail";
import { cn } from "@/lib/cn";
import { useLang, useT } from "@/i18n";

/** Consecutive days (ending today or yesterday) with a finished session or a ticked daily check. */
function useStreak() {
  const sessions = useAppStore((s) => s.sessions);
  const checks = useAppStore((s) => s.dailyChecks);
  return useMemo(() => {
    const days = new Set<string>();
    sessions.forEach((x) => days.add(todayKey(new Date(x.finishedAt))));
    Object.entries(checks).forEach(([k, v]) => v.length && days.add(k));
    const d = new Date();
    if (!days.has(todayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (days.has(todayKey(d))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }, [sessions, checks]);
}

function Stat({ icon: Icon, label, value, suffix, tone = "text-accent" }: { icon: typeof Bomb; label: string; value: number; suffix?: string; tone?: string }) {
  return (
    <Rise>
      <Card className="h-full" inner="p-4">
        <div className="flex items-center justify-between">
          <span className="tag-label !text-[10px]">{label}</span>
          <Icon size={16} className={tone} />
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <CountUp value={value} className="font-display text-[34px] font-bold leading-none tabular-nums text-white" />
          {suffix && <span className="font-display text-sm text-ink-faint">{suffix}</span>}
        </div>
      </Card>
    </Rise>
  );
}

export function DashboardPage() {
  const nav = useNavigate();
  const t = useT();
  const lang = useLang();
  const { maps, grenades, programs, exercises } = useContent();
  const s = useAppStore();
  const streak = useStreak();
  const [openNade, setOpenNade] = useState<string | null>(null);
  const [editName, setEditName] = useState(false);

  const lastMap = MAP_BY_ID[s.lastMapId] ?? maps[0];
  const lastMapLocal = maps.find((m) => m.id === lastMap.id) ?? lastMap;
  const program = programs.find((p) => p.id === s.todayProgramId) ?? programs[0];
  const plan = program.exerciseIds.map((id) => exercises.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => !!e);
  const checks = s.dailyChecks[todayKey()] ?? [];
  const done = plan.filter((e) => checks.includes(e.id)).length;
  const startTraining = () => {
    if (!s.active) s.startSession(program.id);
    nav("/training/session");
  };
  const minutes = Math.round(s.sessions.reduce((a, x) => a + x.seconds, 0) / 60);

  const recent = Object.entries(s.learnedGrenades)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 6)
    .map(([id]) => grenades.find((g) => g.id === id))
    .filter((g): g is NonNullable<typeof g> => !!g);
  const opened = grenades.find((g) => g.id === openNade);

  return (
    <Page>
      {/* HERO */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }} className="frame frame-hot chamfer chamfer-lg relative mb-6">
        <div className="surface chamfer chamfer-lg relative overflow-hidden">
          {/* radar of the last map, sweeping */}
          <div className="pointer-events-none absolute -right-24 top-1/2 hidden aspect-square w-[560px] -translate-y-1/2 md:block">
            <img src={radarUrl(lastMap.id)} alt="" className="h-full w-full object-contain opacity-30 [mask-image:radial-gradient(circle,#000_40%,transparent_70%)]" />
            <div className="absolute inset-[12%] animate-sweep rounded-full bg-[conic-gradient(from_0deg,rgba(255,107,26,0.28),transparent_22%,transparent)] [mask-image:radial-gradient(circle,#000_60%,transparent_71%)]" />
            <div className="absolute inset-[12%] rounded-full border border-accent/20" />
            <div className="absolute inset-[30%] rounded-full border border-accent/10" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-bg-panel via-bg-panel/90 to-transparent" />
          <div className="scanline absolute inset-0 opacity-40" />

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="tag-label flex items-center gap-2 !text-accent">
              <span className="h-1.5 w-1.5 animate-flicker bg-accent" />
              {greeting(lang)}
            </div>
            {editName ? (
              <Input autoFocus value={s.playerName} onChange={(e) => s.setPlayerName(e.target.value)} onBlur={() => setEditName(false)} onKeyDown={(e) => e.key === "Enter" && setEditName(false)} placeholder={t("c.yourNick")} className="mt-3 h-12 w-72 text-xl" />
            ) : (
              <h1 className="group mt-2 flex items-center gap-3 font-display text-[40px] font-bold uppercase leading-none tracking-wide sm:text-[56px]">
                <span className="text-gradient">{s.playerName || t("c.player")}</span>
                <button onClick={() => setEditName(true)} className="text-ink-faint opacity-0 transition group-hover:opacity-100 hover:text-accent" aria-label={t("c.editNick")}>
                  <Pencil size={18} />
                </button>
              </h1>
            )}
            <p className="mt-3 max-w-md text-[13px] text-ink-muted">
              {lastMapLocal.name} · {program.name}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="primary" size="lg" onClick={startTraining}>
                <Play size={15} fill="currentColor" /> {s.active ? t("dash.continue") : t("dash.train")}
              </Button>
              <Button size="lg" onClick={() => nav(`/prep?map=${lastMap.id}`)}>
                <Target size={15} /> {t("dash.prep")}
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* STATS */}
      <Stagger className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Bomb} label={t("dash.stats.nades")} value={Object.keys(s.learnedGrenades).length} suffix={`/ ${grenades.length}`} />
        <Stat icon={Swords} label={t("dash.stats.tactics")} value={Object.keys(s.learnedTactics).length} tone="text-ctside" />
        <Stat icon={Clock} label={t("dash.stats.time")} value={minutes} suffix={t("c.min")} tone="text-ok" />
        <Stat icon={Flame} label={t("dash.stats.streak")} value={streak} tone="text-tside" />
      </Stagger>

      {/* MAP POOL */}
      <SectionTitle>{t("nav.maps")}</SectionTitle>
      <Stagger className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
        {maps.map((m) => {
          const on = m.id === s.lastMapId;
          return (
            <Rise key={m.id}>
              <button
                onClick={() => {
                  s.setLastMap(m.id);
                  nav(`/maps/${m.id}`);
                }}
                data-active={on ? "true" : undefined}
                className={cn("hud chamfer group relative block w-full overflow-hidden bg-black/40 text-left ring-1 ring-inset transition", on ? "ring-accent/60" : "ring-line hover:ring-line-strong")}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={radarUrl(m.id)} alt="" className={cn("h-full w-full object-contain p-1 transition duration-500 group-hover:scale-110", on ? "opacity-100" : "opacity-60 group-hover:opacity-100")} />
                </div>
                <div className={cn("px-2.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider", on ? "text-accent" : "text-ink-muted")}>{m.name}</div>
              </button>
            </Rise>
          );
        })}
      </Stagger>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
            <div>
              <div className="font-display text-[14px] font-semibold uppercase tracking-[0.12em]">{t("dash.todayPlan")}</div>
              <div className="text-[12px] text-ink-faint">
                {program.name} · <span className="font-mono text-accent">{done}/{plan.length}</span>
              </div>
            </div>
            <Segmented size="sm" value={program.id} onChange={(v) => s.setTodayProgram(v)} options={programs.map((p) => ({ value: p.id, label: `${p.minutes}′` }))} />
          </div>
          <div className="px-5 pt-3">
            <ProgressBar value={plan.length ? done / plan.length : 0} tone="ok" />
          </div>
          <ul className="mt-2 pb-2">
            {plan.map((e, i) => {
              const on = checks.includes(e.id);
              return (
                <motion.li key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                  <button onClick={() => s.toggleDailyCheck(e.id)} className="group flex w-full items-center gap-3 px-5 py-2.5 text-left transition hover:bg-white/[0.03]">
                    <motion.span animate={on ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                      {on ? <CheckCircle2 size={17} className="shrink-0 text-ok" /> : <Circle size={17} className="shrink-0 text-ink-faint group-hover:text-accent" />}
                    </motion.span>
                    <span className={cn("flex-1 truncate text-[13px] transition", on && "text-ink-faint line-through")}>{e.name}</span>
                    <span className="font-mono text-[12px] text-ink-faint">{e.minutes}′</span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <div className="px-5 pt-4 font-display text-[14px] font-semibold uppercase tracking-[0.12em]">{t("dash.recent")}</div>
          <div className="p-2">
            {recent.length === 0 ? (
              <div className="px-3 py-10 text-center text-[13px] text-ink-faint">
                {t("dash.recentEmpty")}{" "}
                <button onClick={() => nav("/grenades")} className="font-semibold text-accent hover:text-accent-amber">
                  {t("dash.openNades")} →
                </button>
              </div>
            ) : (
              recent.map((g) => (
                <button key={g.id} onClick={() => setOpenNade(g.id)} className="chamfer chamfer-sm flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-bg-hover">
                  <NadeDot type={g.type} />
                  <span className="flex-1 truncate text-[13px]">{g.title}</span>
                  <span className="font-display text-[10px] uppercase tracking-wider text-ink-faint">{MAP_BY_ID[g.map]?.name}</span>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      <Drawer open={!!opened} onClose={() => setOpenNade(null)} title={t("nade.drawer")}>
        {opened && <GrenadeDetail g={opened} />}
      </Drawer>
    </Page>
  );
}
