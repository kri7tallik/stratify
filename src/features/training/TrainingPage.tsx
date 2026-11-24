import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Clock, Dumbbell, Trash2 } from "lucide-react";
import { Page, PageHeader, Card, Button, Badge, Drawer, SectionTitle, EmptyState, FavoriteButton, Modal } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { EXERCISE_LABEL } from "@/lib/labels";
import { ExerciseDetail } from "./ExerciseDetail";
import { cn } from "@/lib/cn";
import type { ExerciseCategory } from "@/types/content";

const CATS = Object.keys(EXERCISE_LABEL) as ExerciseCategory[];

export function TrainingPage() {
  const { programs, exercises } = useContent();
  const nav = useNavigate();
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
        title="Тренировки"
        actions={active && <Button variant="primary" onClick={() => nav("/training/session")}><Play size={14} fill="currentColor" /> Вернуться к сессии</Button>}
      />

      <SectionTitle>Программы</SectionTitle>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {programs.map((p) => (
          <Card key={p.id} interactive onClick={() => setParam("program", p.id)} className={cn("p-4", p.id === program.id && "border-accent/50 bg-accent/[0.05] shadow-glow")}>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tabular-nums tracking-tight">{p.minutes}</span>
              <span className="text-[12px] text-ink-faint">мин</span>
            </div>
            <div className="mt-1 text-[14px] font-medium">{p.name}</div>
            <div className="text-[12px] text-ink-faint">{p.focus}</div>
          </Card>
        ))}
      </div>

      <motion.div key={program.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
            <div>
              <div className="text-lg font-semibold">{program.name}</div>
              <p className="text-[13px] text-ink-muted">{program.description}</p>
              <p className="mt-1 text-[12px] text-ink-faint">{progEx.length} упражнений · {plannedMin} мин</p>
            </div>
            <Button variant="primary" onClick={() => launch(program.id)}><Play size={14} fill="currentColor" /> {active?.programId === program.id ? "Продолжить" : "Начать"}</Button>
          </div>
          <ol className="divide-y divide-line">
            {progEx.map((e, i) => (
              <li key={e.id}>
                <button onClick={() => setParam("exercise", e.id)} className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-white/[0.02]">
                  <span className="w-5 text-center font-mono text-[12px] text-ink-faint">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">{e.name}</div>
                    <div className="truncate text-[12px] text-ink-faint">{e.goal}</div>
                  </div>
                  <Badge>{EXERCISE_LABEL[e.category]}</Badge>
                  <span className="w-14 text-right font-mono text-[12px] text-ink-muted"><Clock size={11} className="mr-1 inline" />{e.minutes}′</span>
                </button>
              </li>
            ))}
          </ol>
        </Card>
      </motion.div>

      <SectionTitle>Упражнения</SectionTitle>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["all", ...CATS] as const).map((c) => {
          const n = c === "all" ? exercises.length : exercises.filter((e) => e.category === c).length;
          return (
            <button key={c} onClick={() => setCat(c)} className={cn("h-8 rounded-lg border px-3 text-[13px] transition", cat === c ? "border-accent/50 bg-accent/10" : "border-line text-ink-muted hover:text-ink")}>
              {c === "all" ? "Все" : EXERCISE_LABEL[c]} <span className="text-[11px] text-ink-faint">{n}</span>
            </button>
          );
        })}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<Dumbbell size={18} />} title="Нет упражнений в категории" text="Упражнения добавляются только с источником методики." />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((e) => (
            <Card key={e.id} interactive onClick={() => setParam("exercise", e.id)} className="group flex flex-col p-4">
              <div className="flex items-start justify-between">
                <Badge>{EXERCISE_LABEL[e.category]}</Badge>
                <FavoriteButton refItem={{ kind: "exercise", id: e.id }} className="-mr-2 -mt-1.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="mt-2 text-[14px] font-semibold">{e.name}</div>
              <div className="mt-1 line-clamp-2 text-[12px] text-ink-muted">{e.goal}</div>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-faint"><span>{e.minutes} мин</span><span>{e.reps}</span></div>
            </Card>
          ))}
        </div>
      )}



      <Drawer open={!!openedEx} onClose={() => setParam("exercise", null)} title="Упражнение">{openedEx && <ExerciseDetail e={openedEx} />}</Drawer>

      <Modal open={!!confirmSwitch} onClose={() => setConfirmSwitch(null)} title="Активная сессия уже идёт">
        <div className="p-5">
          <p className="text-sm text-ink-muted">Начать новую программу? Текущая сессия будет отменена без сохранения.</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmSwitch(null)}>Отмена</Button>
            <Button variant="danger" onClick={() => { useAppStore.getState().cancelSession(); start(confirmSwitch!); setConfirmSwitch(null); nav("/training/session"); }}><Trash2 size={14} /> Заменить</Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
