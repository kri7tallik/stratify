import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Pause, Play, Square, X, Trophy, ExternalLink } from "lucide-react";
import { Page, Card, Button, Badge, EmptyState, ProgressBar, Modal } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore, type TrainingSession } from "@/store/useAppStore";
import { fmtClock, fmtDuration } from "@/lib/format";
import { EXERCISE_LABEL } from "@/lib/labels";
import { openExternal } from "@/lib/open";
import { cn } from "@/lib/cn";

export function SessionPage() {
  const nav = useNavigate();
  const { programs, exercises, workshopMaps } = useContent();
  const s = useAppStore();
  const [finished, setFinished] = useState<TrainingSession | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (finished)
    return (
      <Page className="max-w-2xl">
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="noise p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/30"><Trophy size={26} /></div>
            <h1 className="mt-4 text-2xl font-semibold">Тренировка завершена</h1>
            <p className="mt-1 text-ink-muted">{finished.name}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-line bg-bg p-4"><div className="text-2xl font-semibold">{fmtDuration(finished.seconds)}</div><div className="text-[12px] text-ink-faint">время</div></div>
              <div className="rounded-xl border border-line bg-bg p-4"><div className="text-2xl font-semibold">{finished.completedExerciseIds.length}/{finished.totalExercises}</div><div className="text-[12px] text-ink-faint">упражнений</div></div>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <Button onClick={() => nav("/progress")}>Мой прогресс</Button>
              <Button variant="primary" onClick={() => nav("/")}>На главную</Button>
            </div>
          </Card>
        </motion.div>
      </Page>
    );

  const a = s.active;
  if (!a)
    return (
      <Page>
        <EmptyState title="Нет активной тренировки" text="Выберите программу в Training Center и нажмите «Начать»." action={<Button variant="primary" onClick={() => nav("/training")}>Training Center</Button>} />
      </Page>
    );

  const program = programs.find((p) => p.id === a.programId);
  const list = (program?.exerciseIds ?? []).map((id) => exercises.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => !!e);
  if (!program || list.length === 0)
    return (
      <Page>
        <EmptyState title="Программа недоступна" text="Программа была удалена или не содержит упражнений." action={<Button onClick={() => { s.cancelSession(); nav("/training"); }}>Сбросить сессию</Button>} />
      </Page>
    );

  const idx = Math.min(a.index, list.length - 1);
  const cur = list[idx];
  const target = cur.minutes * 60;
  const remaining = target - a.exerciseElapsed;
  const ws = workshopMaps.find((w) => w.id === cur.workshopMapId);
  const isDone = a.completed.includes(cur.id);
  const planned = list.reduce((x, e) => x + e.minutes * 60, 0);

  const finish = () => setFinished(s.finishSession(program.name, list.length));
  const completeAndNext = () => {
    if (!isDone) s.toggleExerciseDone(cur.id);
    if (idx < list.length - 1) s.goToExercise(idx + 1);
  };

  return (
    <Page className="max-w-[1300px]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Сессия · {program.minutes} мин</p>
          <h1 className="text-[24px] font-semibold tracking-tight">{program.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setConfirmCancel(true)}><X size={15} /> Отменить</Button>
          <Button variant="primary" onClick={finish}><Square size={13} fill="currentColor" /> Завершить</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          <Card className="noise overflow-hidden p-8">
            <div className="flex items-center justify-between text-[12px] text-ink-faint">
              <span>Упражнение {idx + 1} из {list.length}</span>
              <Badge tone="accent">{EXERCISE_LABEL[cur.category]}</Badge>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={cur.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <h2 className="mt-3 text-2xl font-semibold">{cur.name}</h2>
                <p className="mt-1 text-ink-muted">{cur.goal}</p>

                <div className="my-8 text-center">
                  <div className={cn("font-mono text-[84px] font-semibold leading-none tabular-nums tracking-tight", remaining < 0 ? "text-ok" : "text-ink")}>
                    {remaining >= 0 ? fmtClock(remaining) : `+${fmtClock(-remaining)}`}
                  </div>
                  <div className="mt-2 text-[12px] uppercase tracking-[0.14em] text-ink-faint">{remaining >= 0 ? `осталось из ${cur.minutes} мин · ${cur.reps}` : "время упражнения вышло"}</div>
                  <ProgressBar value={a.exerciseElapsed / target} tone={remaining < 0 ? "ok" : "accent"} className="mx-auto mt-5 max-w-md" />
                </div>

                <ol className="space-y-2" data-selectable>
                  {cur.instructions.map((x, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-white/[0.06] text-[11px] font-semibold text-ink-muted">{i + 1}</span>
                      <span className="break-words">{x}</span>
                    </li>
                  ))}
                </ol>
                {ws && (
                  <button onClick={() => openExternal(ws.url)} className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-soft">
                    Workshop: {ws.name} <ExternalLink size={12} />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="ghost" disabled={idx === 0} onClick={() => s.goToExercise(idx - 1)}><ChevronLeft size={16} /></Button>
              <Button onClick={() => s.setRunning(!a.running)} className="w-32">
                {a.running ? <Pause size={15} /> : <Play size={15} />} {a.running ? "Пауза" : "Продолжить"}
              </Button>
              <Button variant="primary" onClick={() => (idx === list.length - 1 && isDone ? finish() : completeAndNext())}>
                <CheckCircle2 size={15} /> {idx === list.length - 1 ? (isDone ? "Завершить сессию" : "Выполнено") : "Выполнено → далее"}
              </Button>
              <Button variant="ghost" disabled={idx === list.length - 1} onClick={() => s.goToExercise(idx + 1)}><ChevronRight size={16} /></Button>
            </div>
          </Card>
        </div>

        <div className="col-span-12 space-y-4 lg:col-span-4">
          <Card className="p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Общее время</div>
            <div className="mt-1 font-mono text-4xl font-semibold tabular-nums">{fmtClock(a.elapsed)}</div>
            <div className="mt-1 text-[12px] text-ink-faint">по плану {fmtDuration(planned)} · {a.running ? "идёт" : "на паузе"}</div>
            <ProgressBar value={a.completed.length / list.length} tone="ok" className="mt-4" />
            <div className="mt-1.5 text-[12px] text-ink-muted">{a.completed.length} из {list.length} выполнено</div>
          </Card>
          <Card>
            <div className="px-5 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Чеклист</div>
            <ul className="pb-2">
              {list.map((e, i) => {
                const done = a.completed.includes(e.id);
                return (
                  <li key={e.id} className={cn("flex items-center gap-2 px-3", i === idx && "bg-accent/[0.06]")}>
                    <button onClick={() => s.toggleExerciseDone(e.id)} className="grid h-9 w-8 place-items-center" aria-label="Отметить">
                      {done ? <CheckCircle2 size={17} className="text-ok" /> : <Circle size={17} className="text-ink-faint" />}
                    </button>
                    <button onClick={() => s.goToExercise(i)} className="flex flex-1 items-center gap-2 py-2 text-left">
                      <span className={cn("flex-1 truncate text-[13px]", done ? "text-ink-faint line-through" : i === idx ? "font-medium text-ink" : "text-ink-muted")}>{e.name}</span>
                      <span className="font-mono text-[11px] text-ink-faint">{e.minutes}′</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Отменить сессию?">
        <div className="p-5">
          <p className="text-sm text-ink-muted">Прогресс этой сессии не будет сохранён в историю.</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmCancel(false)}>Назад</Button>
            <Button variant="danger" onClick={() => { s.cancelSession(); nav("/training"); }}>Отменить сессию</Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
