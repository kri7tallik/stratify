import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, RotateCcw, Trophy } from "lucide-react";
import type { CsMap } from "@/types/content";
import { Button, Card, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n";

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
  const t = useT();
  if (done)
    return (
      <Card inner="p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center chamfer bg-accent/10 text-accent ring-1 ring-inset ring-accent/30"><Trophy size={22} /></div>
        <div className="mt-3 font-display text-4xl font-bold tabular-nums text-gradient">{score}/{total}</div>
        <p className="mt-1 text-[13px] text-ink-muted">{score === total ? t("quiz.perfect") : score >= total * 0.7 ? t("quiz.good") : t("quiz.repeat")}</p>
        <Button variant="primary" className="mt-4" onClick={restart}><RotateCcw size={14} /> {t("quiz.again")}</Button>
      </Card>
    );
  return (
    <Card inner="p-5">
      <div className="flex items-center justify-between text-[12px] text-ink-faint">
        <span className="tag-label !text-[10px]">{t("quiz.qOf", { i: i + 1, n: total })}</span>
        <span className="font-mono tabular-nums text-accent">{t("quiz.score", { n: score })}</span>
      </div>
      <ProgressBar value={i / total} className="mt-2" />
      <p className="mt-4 font-display text-[15px] font-semibold">{t("quiz.question")}</p>
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
                  "chamfer chamfer-sm flex h-11 items-center justify-between border px-3 text-left text-[13px] font-medium transition",
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
