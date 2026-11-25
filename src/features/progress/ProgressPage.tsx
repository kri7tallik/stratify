import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bomb, Clock, Dumbbell, Heart, Swords, RotateCcw } from "lucide-react";
import { Page, PageHeader, Card, CardHeader, ProgressBar, EmptyState, Button, Modal, SideBadge, Badge } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { fmtDate, fmtDuration } from "@/lib/format";
import { useLabels } from "@/lib/labels";
import { useLang, useT } from "@/i18n";
import { Stagger, Rise, CountUp } from "@/components/ui";
import { MAP_BY_ID } from "@/data/maps";
import type { ExerciseCategory } from "@/types/content";

export function ProgressPage() {
  const { maps, grenades, tactics, exercises } = useContent();
  const s = useAppStore();
  const nav = useNavigate();
  const tr = useT();
  const lang = useLang();
  const L = useLabels();
  const [confirm, setConfirm] = useState(false);
  const total = s.sessions.reduce((a, x) => a + x.seconds, 0);
  const lg = grenades.filter((g) => s.learnedGrenades[g.id]);
  const lt = tactics.filter((t) => s.learnedTactics[t.id]);

  const byCategory = useMemo(() => {
    const acc: Partial<Record<ExerciseCategory, number>> = {};
    s.sessions.forEach((sess) =>
      sess.completedExerciseIds.forEach((id) => {
        const e = exercises.find((x) => x.id === id);
        if (e) acc[e.category] = (acc[e.category] ?? 0) + e.minutes;
      }),
    );
    return Object.entries(acc).sort((a, b) => b[1] - a[1]) as [ExerciseCategory, number][];
  }, [s.sessions, exercises]);
  const maxCat = Math.max(1, ...byCategory.map(([, v]) => v));

  const tiles = [
    { icon: Bomb, label: tr("prog.nades"), num: lg.length, sub: tr("prog.of", { n: grenades.length }) },
    { icon: Swords, label: tr("prog.tactics"), num: lt.length, sub: tr("prog.of", { n: tactics.length }) },
    { icon: Dumbbell, label: tr("prog.trainings"), num: s.sessions.length, sub: tr("prog.completed") },
    { icon: Clock, label: tr("prog.time"), value: fmtDuration(total, lang), sub: tr("prog.total") },
    { icon: Heart, label: tr("prog.favorites"), num: s.favorites.length, sub: tr("prog.materials") },
  ];

  return (
    <Page>
      <PageHeader kicker="Stats" title={tr("prog.title")} actions={<Button variant="ghost" onClick={() => setConfirm(true)}><RotateCcw size={14} /> {tr("prog.reset")}</Button>} />

      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {tiles.map((t) => (
          <Rise key={t.label}>
            <Card className="h-full" inner="p-4">
              <div className="tag-label flex items-center gap-1.5 !text-[10px]"><t.icon size={12} className="text-accent" />{t.label}</div>
              <div className="mt-2 font-display text-[30px] font-bold leading-none tabular-nums">{t.num !== undefined ? <CountUp value={t.num} /> : t.value}</div>
              <div className="mt-1 text-[12px] text-ink-faint">{t.sub}</div>
            </Card>
          </Rise>
        ))}
      </Stagger>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7" inner="">
          <CardHeader title={tr("prog.byMap")} />
          <div className="space-y-3 p-5">
            {maps.map((m) => {
              const g = grenades.filter((x) => x.map === m.id);
              const t = tactics.filter((x) => x.map === m.id);
              const gd = g.filter((x) => s.learnedGrenades[x.id]).length;
              const td = t.filter((x) => s.learnedTactics[x.id]).length;
              const tot = g.length + t.length;
              return (
                <button key={m.id} onClick={() => nav(`/maps/${m.id}`)} className="chamfer chamfer-sm flex w-full items-center gap-4 px-2 py-1.5 text-left transition hover:bg-bg-hover">
                  <span className="w-20 font-display text-[12px] font-semibold uppercase tracking-wider">{m.name}</span>
                  <ProgressBar value={tot ? (gd + td) / tot : 0} className="flex-1" />
                  <span className="w-40 text-right font-mono text-[11px] tabular-nums text-ink-faint">{tr("prog.byMapRow", { a: gd, b: g.length, c: td, d: t.length })}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader title={tr("prog.byCat")} />
          <div className="space-y-3 p-5">
            {byCategory.length === 0 ? (
              <EmptyState className="py-8" title={tr("prog.noData")} text={tr("prog.noDataText")} action={<Button size="sm" onClick={() => nav("/training")}>{tr("nav.training")}</Button>} />
            ) : (
              byCategory.map(([c, v]) => (
                <div key={c} className="flex items-center gap-3">
                  <span className="w-32 text-[13px] text-ink-muted">{L.exercise[c]}</span>
                  <ProgressBar value={v / maxCat} tone="ok" className="flex-1" />
                  <span className="w-14 text-right text-[12px] tabular-nums text-ink-faint">{v} {tr("c.min")}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title={tr("prog.learnedNades")} />
          <div className="p-3">
            {lg.length === 0 ? (
              <EmptyState className="py-8" title={tr("prog.none")} action={<Button size="sm" onClick={() => nav("/grenades")}>{tr("nav.grenades")}</Button>} />
            ) : (
              <ul>
                {lg.map((g) => (
                  <li key={g.id} className="chamfer chamfer-sm flex items-center gap-3 px-3 py-2 text-[13px] hover:bg-bg-hover">
                    <button className="flex-1 truncate text-left" onClick={() => nav(`/grenades?id=${g.id}`)}>{g.title}</button>
                    <span className="text-[11px] text-ink-faint">{MAP_BY_ID[g.map]?.name} · {L.nade[g.type]}</span>
                    <SideBadge side={g.side} />
                    <span className="w-24 text-right text-[11px] text-ink-faint">{fmtDate(s.learnedGrenades[g.id], lang)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title={tr("prog.learnedTactics")} />
          <div className="p-3">
            {lt.length === 0 ? (
              <EmptyState className="py-8" title={tr("prog.none")} action={<Button size="sm" onClick={() => nav("/tactics")}>{tr("nav.tactics")}</Button>} />
            ) : (
              <ul>
                {lt.map((t) => (
                  <li key={t.id} className="chamfer chamfer-sm flex items-center gap-3 px-3 py-2 text-[13px] hover:bg-bg-hover">
                    <button className="flex-1 truncate text-left" onClick={() => nav(`/tactics/${t.id}`)}>{t.title}</button>
                    <Badge>{MAP_BY_ID[t.map]?.name}</Badge>
                    <span className="w-24 text-right text-[11px] text-ink-faint">{fmtDate(s.learnedTactics[t.id], lang)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="col-span-12">
          <CardHeader title={tr("prog.sessions")} />
          <div className="p-3">
            {s.sessions.length === 0 ? (
              <EmptyState className="py-8" title={tr("prog.noSessions")} />
            ) : (
              <ul className="divide-y divide-line">
                {s.sessions.map((x) => (
                  <li key={x.id} className="flex items-center gap-4 px-3 py-2.5 text-[13px]">
                    <span className="w-32 text-ink-faint">{fmtDate(x.finishedAt, lang)}</span>
                    <span className="flex-1 font-medium">{x.name}</span>
                    <ProgressBar value={x.completedExerciseIds.length / Math.max(1, x.totalExercises)} tone="ok" className="w-32" />
                    <span className="w-16 text-right text-ink-muted">{x.completedExerciseIds.length}/{x.totalExercises}</span>
                    <span className="w-24 text-right font-mono text-ink-muted">{fmtDuration(x.seconds, lang)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title={tr("prog.resetTitle")}>
        <div className="p-5">
          <p className="text-sm text-ink-muted">{tr("prog.resetText")}</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirm(false)}>{tr("c.cancel")}</Button>
            <Button variant="danger" onClick={() => { s.resetProgress(); setConfirm(false); }}>{tr("c.reset")}</Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
