import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bomb, Clock, Dumbbell, Heart, Swords, RotateCcw } from "lucide-react";
import { Page, PageHeader, Card, CardHeader, ProgressBar, EmptyState, Button, Modal, SideBadge, Badge } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { fmtDate, fmtDuration } from "@/lib/format";
import { EXERCISE_LABEL, GRENADE_LABEL } from "@/lib/labels";
import { MAP_BY_ID } from "@/data/maps";
import type { ExerciseCategory } from "@/types/content";

export function ProgressPage() {
  const { maps, grenades, tactics, exercises } = useContent();
  const s = useAppStore();
  const nav = useNavigate();
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
    { icon: Bomb, label: "Изучено гранат", value: `${lg.length}`, sub: `из ${grenades.length}` },
    { icon: Swords, label: "Изучено тактик", value: `${lt.length}`, sub: `из ${tactics.length}` },
    { icon: Dumbbell, label: "Тренировок", value: `${s.sessions.length}`, sub: "завершено" },
    { icon: Clock, label: "Время тренировок", value: fmtDuration(total), sub: "всего" },
    { icon: Heart, label: "Избранное", value: `${s.favorites.length}`, sub: "материалов" },
  ];

  return (
    <Page>
      <PageHeader title="Прогресс" actions={<Button variant="ghost" onClick={() => setConfirm(true)}><RotateCcw size={14} /> Сбросить прогресс</Button>} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {tiles.map((t) => (
          <Card key={t.label} className="p-4">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-faint"><t.icon size={12} />{t.label}</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">{t.value}</div>
            <div className="text-[12px] text-ink-faint">{t.sub}</div>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader title="Прогресс по картам" subtitle="Изученные гранаты и тактики относительно всех материалов карты" />
          <div className="space-y-3 p-5">
            {maps.map((m) => {
              const g = grenades.filter((x) => x.map === m.id);
              const t = tactics.filter((x) => x.map === m.id);
              const gd = g.filter((x) => s.learnedGrenades[x.id]).length;
              const td = t.filter((x) => s.learnedTactics[x.id]).length;
              const tot = g.length + t.length;
              return (
                <button key={m.id} onClick={() => nav(`/maps/${m.id}`)} className="flex w-full items-center gap-4 rounded-lg px-2 py-1.5 text-left hover:bg-bg-hover">
                  <span className="w-20 text-[13px] font-medium">{m.name}</span>
                  <ProgressBar value={tot ? (gd + td) / tot : 0} className="flex-1" />
                  <span className="w-36 text-right text-[12px] tabular-nums text-ink-faint">{gd}/{g.length} гранат · {td}/{t.length} так.</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader title="Время по категориям" subtitle="По выполненным упражнениям (план. минуты)" />
          <div className="space-y-3 p-5">
            {byCategory.length === 0 ? (
              <EmptyState className="py-8" title="Нет данных" text="Завершите тренировку с таймером." action={<Button size="sm" onClick={() => nav("/training")}>Training Center</Button>} />
            ) : (
              byCategory.map(([c, v]) => (
                <div key={c} className="flex items-center gap-3">
                  <span className="w-32 text-[13px] text-ink-muted">{EXERCISE_LABEL[c]}</span>
                  <ProgressBar value={v / maxCat} tone="ok" className="flex-1" />
                  <span className="w-14 text-right text-[12px] tabular-nums text-ink-faint">{v} мин</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Изученные гранаты" />
          <div className="p-3">
            {lg.length === 0 ? (
              <EmptyState className="py-8" title="Пока нет" action={<Button size="sm" onClick={() => nav("/grenades")}>Grenade Lab</Button>} />
            ) : (
              <ul>
                {lg.map((g) => (
                  <li key={g.id} className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] hover:bg-bg-hover">
                    <button className="flex-1 truncate text-left" onClick={() => nav(`/grenades?id=${g.id}`)}>{g.title}</button>
                    <span className="text-[11px] text-ink-faint">{MAP_BY_ID[g.map]?.name} · {GRENADE_LABEL[g.type]}</span>
                    <SideBadge side={g.side} />
                    <span className="w-24 text-right text-[11px] text-ink-faint">{fmtDate(s.learnedGrenades[g.id])}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Изученные тактики" />
          <div className="p-3">
            {lt.length === 0 ? (
              <EmptyState className="py-8" title="Пока нет" action={<Button size="sm" onClick={() => nav("/tactics")}>Tactics</Button>} />
            ) : (
              <ul>
                {lt.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] hover:bg-bg-hover">
                    <button className="flex-1 truncate text-left" onClick={() => nav(`/tactics/${t.id}`)}>{t.title}</button>
                    <Badge>{MAP_BY_ID[t.map]?.name}</Badge>
                    <span className="w-24 text-right text-[11px] text-ink-faint">{fmtDate(s.learnedTactics[t.id])}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="col-span-12">
          <CardHeader title="Выполненные тренировки" />
          <div className="p-3">
            {s.sessions.length === 0 ? (
              <EmptyState className="py-8" title="Тренировок ещё не было" />
            ) : (
              <ul className="divide-y divide-line">
                {s.sessions.map((x) => (
                  <li key={x.id} className="flex items-center gap-4 px-3 py-2.5 text-[13px]">
                    <span className="w-32 text-ink-faint">{fmtDate(x.finishedAt)}</span>
                    <span className="flex-1 font-medium">{x.name}</span>
                    <ProgressBar value={x.completedExerciseIds.length / Math.max(1, x.totalExercises)} tone="ok" className="w-32" />
                    <span className="w-16 text-right text-ink-muted">{x.completedExerciseIds.length}/{x.totalExercises}</span>
                    <span className="w-24 text-right font-mono text-ink-muted">{fmtDuration(x.seconds)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Сбросить прогресс?">
        <div className="p-5">
          <p className="text-sm text-ink-muted">Будут удалены отметки «изучено», история тренировок, избранное и дневные чеклисты. Ваши добавленные материалы останутся.</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirm(false)}>Отмена</Button>
            <Button variant="danger" onClick={() => { s.resetProgress(); setConfirm(false); }}>Сбросить</Button>
          </div>
        </div>
      </Modal>
    </Page>
  );
}
