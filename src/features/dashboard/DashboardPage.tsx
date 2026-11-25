import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Play, Pencil, Target, Bomb, Swords, Clock, Flame } from "lucide-react";
import { Page, Card, ProgressBar, Segmented, Drawer, Input, CountUp, Stagger, Rise, SectionTitle } from "@/components/ui";
import { radarUrl } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { greeting, todayKey } from "@/lib/format";
import { MAP_BY_ID } from "@/data/maps";
import { NadeDot } from "@/features/grenades/GrenadeCard";
import { GrenadeDetail, NADE_DRAWER_WIDTH } from "@/features/grenades/GrenadeDetail";
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
      <Card className="h-full" inner="p-5">
        <div className="flex items-center justify-between">
          <span className="tag-label">{label}</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/[0.05]"><Icon size={15} className={tone} /></span>
        </div>
        <div className="mt-6 flex items-baseline gap-1.5">
          <CountUp value={value} className="font-hero text-[40px] font-semibold leading-none tracking-tight tabular-nums text-ink" />
          {suffix && <span className="font-mono text-sm text-ink-faint">{suffix}</span>}
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
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }} className="relative mb-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* lime hero card */}
        <div className="relative overflow-hidden rounded-[32px] bg-accent text-on-accent shadow-[0_30px_80px_-40px_rgb(var(--accent)/.9)]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent-2/60 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#000_1px,transparent_1.2px)] [background-size:18px_18px]" />
          <div className="relative flex h-full flex-col px-6 py-7 sm:px-10 sm:py-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-black/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-on-accent" />
              {greeting(lang)}
            </div>
            {editName ? (
              <Input autoFocus value={s.playerName} onChange={(e) => s.setPlayerName(e.target.value)} onBlur={() => setEditName(false)} onKeyDown={(e) => e.key === "Enter" && setEditName(false)} placeholder={t("c.yourNick")} className="mt-4 h-12 w-72 text-xl" />
            ) : (
              <h1 className="group mt-5 flex items-center gap-3 font-hero text-[44px] font-semibold leading-[0.9] tracking-[-0.04em] sm:text-[76px]">
                <span className="min-w-0 break-words">{s.playerName || t("c.player")}</span>
                <button onClick={() => setEditName(true)} className="opacity-40 transition group-hover:opacity-100 hover:opacity-70" aria-label={t("c.editNick")}>
                  <Pencil size={18} />
                </button>
              </h1>
            )}
            <p className="mt-4 max-w-md text-[14px] font-medium opacity-70">
              {lastMapLocal.name} · {program.name}
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-8">
              <button onClick={startTraining} className="inline-flex h-12 items-center gap-2.5 rounded-full bg-on-accent px-7 font-display text-[14px] font-semibold text-accent transition hover:scale-[1.03] active:scale-[0.98]">
                <Play size={15} fill="currentColor" /> {s.active ? t("dash.continue") : t("dash.train")}
              </button>
              <button onClick={() => nav(`/prep?map=${lastMap.id}`)} className="inline-flex h-12 items-center gap-2.5 rounded-full bg-black/10 px-6 font-display text-[14px] font-semibold ring-1 ring-inset ring-black/15 transition hover:bg-black/15">
                <Target size={15} /> {t("dash.prep")}
              </button>
            </div>
          </div>
        </div>

        {/* radar screen of the last map */}
        <button onClick={() => nav(`/maps/${lastMap.id}`)} className="screen group relative hidden min-h-[300px] overflow-hidden rounded-[32px] text-left text-white ring-1 ring-inset ring-white/10 lg:block">
          <img src={radarUrl(lastMap.id)} alt="" className="absolute inset-0 h-full w-full scale-[1.05] object-contain p-6 opacity-85 transition duration-700 group-hover:scale-[1.12] group-hover:opacity-100" />
          <div className="absolute left-1/2 top-1/2 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2 animate-sweep rounded-full bg-[conic-gradient(from_0deg,rgb(var(--accent)/.35),transparent_18%,transparent)] [mask-image:radial-gradient(circle,#000_35%,transparent_68%)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
            <span className="font-hero text-3xl font-semibold tracking-tight">{lastMapLocal.name}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">{lastMap.codename}</span>
          </div>
        </button>
      </motion.section>

      {/* STATS */}
      <Stagger className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                className={cn("screen group relative block w-full overflow-hidden rounded-3xl text-left ring-inset transition hover:-translate-y-1", on ? "ring-2 ring-accent" : "ring-1 ring-white/10")}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={radarUrl(m.id)} alt="" className={cn("h-full w-full object-contain p-2 transition duration-500 group-hover:scale-110", on ? "opacity-100" : "opacity-70 group-hover:opacity-100")} />
                </div>
                <div className="flex items-center justify-between px-3 pb-2.5 text-[12px] font-semibold text-white">
                  {m.name}
                  {on && <span className="h-2 w-2 rounded-full bg-accent" />}
                </div>
              </button>
            </Rise>
          );
        })}
      </Stagger>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
            <div>
              <div className="font-display text-[18px] font-semibold tracking-tight">{t("dash.todayPlan")}</div>
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
                  <button onClick={() => s.toggleDailyCheck(e.id)} className="group flex w-full items-center gap-3 px-5 py-2.5 text-left transition hover:bg-ink/[0.03]">
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
          <div className="px-5 pt-5 font-display text-[18px] font-semibold tracking-tight">{t("dash.recent")}</div>
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
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">{MAP_BY_ID[g.map]?.name}</span>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      <Drawer open={!!opened} onClose={() => setOpenNade(null)} title={t("nade.drawer")} width={NADE_DRAWER_WIDTH}>
        {opened && <GrenadeDetail g={opened} />}
      </Drawer>
    </Page>
  );
}
