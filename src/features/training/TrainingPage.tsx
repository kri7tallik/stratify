import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Clock, Dumbbell, Trash2 } from "lucide-react";
import { Page, PageHeader, Card, Button, Badge, Drawer, SectionTitle, EmptyState, FavoriteButton, Modal } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { EXERCISE_CATEGORIES, useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { ExerciseDetail } from "./ExerciseDetail";
import { cn } from "@/lib/cn";
import type { ExerciseCategory } from "@/types/content";

const CATS = EXERCISE_CATEGORIES as readonly ExerciseCategory[];

export function TrainingPage() {
  const { programs, exercises } = useContent();
  const nav = useNavigate();
  const t = useT();
  const L = useLabels();
  const [params, setParams] = useSearchParams();
  const active = useAppStore((s) => s.active);
  const start = useAppStore((s) => s.startSession);
  const [cat, setCat] = useState<ExerciseCategory | "all">("all");
  const [confirmSwitch, setConfirmSwitch] = useState<string | null>(null);
  const selectedId = params.get("program") ?? programs[0].id;
  const program = programs.find((p) => p.id === selectedId) ?? programs[0];
  const exId = params.get("exercise");
  const openedEx = exercises.find((e) => e.id === exId);
  const progEx = program.exerciseIds.map((id) => exercises.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => !!e);
  const plannedMin = progEx.reduce((a, e) => a + e.minutes, 0);
  const list = useMemo(() => exercises.filter((e) => cat === "all" || e.category === cat), [exercises, cat]);

  const setParam = (k: string, v: string | null) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v);
    else n.delete(k);
    setParams(n, { replace: true });
  };

  const launch = (pid: string) => {
    if (active && active.programId !== pid) return setConfirmSwitch(pid);
    if (!active) start(pid);
    nav("/training/session");
  };

  return (
    <Page>
      <PageHeader
        kicker="Training Center"
        title={t("train.title")}
        actions={active && <Button variant="primary" onClick={() => nav("/training/session")}><Play size={14} fill="currentColor" /> {t("train.backToSession")}</Button>}
      />

      <SectionTitle>{t("train.programs")}</SectionTitle>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {programs.map((p) => (
          <Card key={p.id} interactive active={p.id === program.id} onClick={() => setParam("program", p.id)} inner="p-4">
            <div className="flex items-baseline gap-1">
              <span className={cn("font-display text-[40px] font-bold leading-none tabular-nums", p.id === program.id ? "text-gradient" : "text-ink")}>{p.minutes}</span>
              <span className="font-display text-[12px] uppercase text-ink-faint">{t("c.min")}</span>
            </div>
            <div className="mt-2 font-display text-[14px] font-semibold">{p.name}</div>
            <div className="text-[12px] text-ink-faint">{p.focus}</div>
          </Card>
        ))}
      </div>

      <motion.div key={program.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mt-4" inner="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
            <div>
              <div className="font-display text-xl font-semibold tracking-tight">{program.name}</div>
              <p className="text-[13px] text-ink-muted">{program.description}</p>
              <p className="mt-1 font-mono text-[12px] text-ink-faint">{t("train.exCount", { n: progEx.length, m: plannedMin })}</p>
            </div>
            <Button variant="primary" onClick={() => launch(program.id)}><Play size={14} fill="currentColor" /> {active?.programId === program.id ? t("train.continue") : t("train.start")}</Button>
          </div>
          <ol className="divide-y divide-line">
            {progEx.map((e, i) => (
              <li key={e.id}>
                <button onClick={() => setParam("exercise", e.id)} className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-ink/[0.02]">
                  <span className="w-5 text-center font-mono text-[12px] text-ink-faint">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">{e.name}</div>
                    <div className="truncate text-[12px] text-ink-faint">{e.goal}</div>
                  </div>
                  <Badge>{L.exercise[e.category]}</Badge>
                  <span className="w-14 text-right font-mono text-[12px] text-ink-muted"><Clock size={11} className="mr-1 inline" />{e.minutes}′</span>
                </button>
              </li>
            ))}
          </ol>
        </Card>
      </motion.div>

      <SectionTitle>{t("train.exercises")}</SectionTitle>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["all", ...CATS] as const).map((c) => {
          const n = c === "all" ? exercises.length : exercises.filter((e) => e.category === c).length;
          return (
            <button key={c} onClick={() => setCat(c)} className={cn("h-8 rounded-full px-3.5 font-display text-[12.5px] font-medium ring-1 ring-inset transition", cat === c ? "bg-ink text-bg ring-ink" : "text-ink-muted ring-line hover:text-ink hover:ring-line-strong")}>
              {c === "all" ? t("c.all") : L.exercise[c]} <span className={cn("font-mono text-[10px]", cat === c ? "text-accent" : "text-ink-faint")}>{n}</span>
            </button>
          );
        })}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<Dumbbell size={18} />} title={t("train.noExCat")} />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((e) => (
            <Card key={e.id} interactive onClick={() => setParam("exercise", e.id)} inner="flex flex-col p-4">
              <div className="flex items-start justify-between">
                <Badge>{L.exercise[e.category]}</Badge>
                <FavoriteButton refItem={{ kind: "exercise", id: e.id }} className="-mr-2 -mt-1.5 opacity-60 transition group-hover/card:opacity-100" />
              </div>
              <div className="mt-2 font-display text-[15px] font-semibold transition-colors group-hover/card:text-accent-amber">{e.name}</div>
              <div className="mt-1 line-clamp-2 text-[12px] text-ink-muted">{e.goal}</div>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-faint"><span className="font-mono text-accent">{e.minutes} {t("c.min")}</span><span>{e.reps}</span></div>
            </Card>
          ))}
        </div>
      )}



      <Drawer open={!!openedEx} onClose={() => setParam("exercise", null)} title={t("ex.drawer")}>{openedEx && <ExerciseDetail e={openedEx} />}</Drawer>

      <Modal open={!!confirmSwitch} onClose={() => setConfirmSwitch(null)} title={t("train.activeTitle")}>
        <div className="p-5">
          <p className="text-sm text-ink-muted">{t("train.activeText")}</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmSwitch(null)}>{t("c.cancel")}</Button>
            <Button variant="danger" onClick={() => { useAppStore.getState().cancelSession(); start(confirmSwitch!); setConfirmSwitch(null); nav("/training/session"); }}><Trash2 size={14} /> {t("train.replace")}</Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
