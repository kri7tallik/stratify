import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, RotateCcw, Trophy } from "lucide-react";
import type { CsMap } from "@/types/content";
import { Button, Card, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";

const ROUND = 10;

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Highlights a random callout on the schematic; player picks its name from 4 options. */
export function useCalloutQuiz(map: CsMap) {
  const pool = useMemo(() => map.callouts.filter((c) => c.id !== "a" && c.id !== "b"), [map]);
  const make = useCallback(() => {
    const order = shuffle(pool).slice(0, Math.min(ROUND, pool.length));
    return order.map((c) => ({ answer: c, options: shuffle([c, ...shuffle(pool.filter((x) => x.id !== c.id)).slice(0, 3)]) }));
  }, [pool]);
  const [questions, setQuestions] = useState(make);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  useEffect(() => {
    setQuestions(make());
    setI(0);
    setPicked(null);
    setScore(0);
  }, [make]);
  const restart = () => {
    setQuestions(make());
    setI(0);
    setPicked(null);
    setScore(0);
  };
  const q = questions[i];
  const done = i >= questions.length;
  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === q.answer.id) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      setI((x) => x + 1);
    }, 900);
  };
  return { q, i, total: questions.length, picked, score, done, choose, restart, target: done ? null : q?.answer.id };
}

export function CalloutQuizPanel({ quiz }: { quiz: ReturnType<typeof useCalloutQuiz> }) {
  const { q, i, total, picked, score, done, choose, restart } = quiz;
  if (done)
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30"><Trophy size={22} /></div>
        <div className="mt-3 text-2xl font-semibold tabular-nums">{score}/{total}</div>
        <p className="mt-1 text-[13px] text-ink-muted">{score === total ? "Идеально — callouts знаешь." : score >= total * 0.7 ? "Хорошо. Ещё раунд для закрепления?" : "Стоит повторить callouts этой карты."}</p>
        <Button variant="primary" className="mt-4" onClick={restart}><RotateCcw size={14} /> Ещё раунд</Button>
      </Card>
    );
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-[12px] text-ink-faint">
        <span>Вопрос {i + 1} из {total}</span>
        <span className="tabular-nums">Счёт: {score}</span>
      </div>
      <ProgressBar value={i / total} className="mt-2" />
      <p className="mt-4 text-[15px] font-medium">Как называется подсвеченная позиция?</p>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 grid grid-cols-2 gap-2">
          {q.options.map((o) => {
            const correct = o.id === q.answer.id;
            const state = picked ? (correct ? "ok" : picked === o.id ? "bad" : "idle") : "idle";
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                className={cn(
                  "flex h-11 items-center justify-between rounded-lg border px-3 text-left text-[13px] font-medium transition",
                  state === "ok" && "border-ok/60 bg-ok/10 text-ok",
                  state === "bad" && "border-bad/60 bg-bad/10 text-bad",
                  state === "idle" && "border-line bg-bg hover:border-line-strong hover:bg-bg-hover",
                )}
              >
                {o.name}
                {state === "ok" && <Check size={15} />}
                {state === "bad" && <X size={15} />}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
