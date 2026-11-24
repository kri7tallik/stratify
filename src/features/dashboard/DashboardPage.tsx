import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Play, Pencil } from "lucide-react";
import { Page, Card, Button, ProgressBar, Segmented, Drawer, Input } from "@/components/ui";
import { radarUrl } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { greeting, todayKey } from "@/lib/format";
import { MAP_BY_ID } from "@/data/maps";
import { NadeDot } from "@/features/grenades/GrenadeCard";
import { GrenadeDetail } from "@/features/grenades/GrenadeDetail";
import { cn } from "@/lib/cn";

export function DashboardPage() {
  const nav = useNavigate();
  const { maps, grenades, programs, exercises } = useContent();
  const s = useAppStore();
  const [openNade, setOpenNade] = useState<string | null>(null);
  const [editName, setEditName] = useState(false);

  const lastMap = MAP_BY_ID[s.lastMapId] ?? maps[0];
  const program = programs.find((p) => p.id === s.todayProgramId) ?? programs[0];
  const plan = program.exerciseIds.map((id) => exercises.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => !!e);
  const checks = s.dailyChecks[todayKey()] ?? [];
  const done = plan.filter((e) => checks.includes(e.id)).length;
  const startTraining = () => {
    if (!s.active) s.startSession(program.id);
    nav("/training/session");
  };

  const recent = Object.entries(s.learnedGrenades)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 6)
    .map(([id]) => grenades.find((g) => g.id === id))
    .filter((g): g is NonNullable<typeof g> => !!g);
  const opened = grenades.find((g) => g.id === openNade);

  return (
    <Page className="max-w-[1200px]">
      <div className="mb-8 mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          {editName ? (
            <Input autoFocus value={s.playerName} onChange={(e) => s.setPlayerName(e.target.value)} onBlur={() => setEditName(false)} onKeyDown={(e) => e.key === "Enter" && setEditName(false)} placeholder="Ваш ник" className="h-10 w-64 text-lg" />
          ) : (
            <h1 className="group flex items-center gap-2 text-[28px] font-semibold tracking-tight">
              {greeting()}, {s.playerName || "игрок"}
              <button onClick={() => setEditName(true)} className="text-ink-faint opacity-0 transition group-hover:opacity-100 hover:text-ink" aria-label="Изменить ник">
                <Pencil size={14} />
              </button>
            </h1>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => nav(`/prep?map=${lastMap.id}`)}>Подготовка к матчу</Button>
          <Button variant="primary" onClick={startTraining}>
            <Play size={14} fill="currentColor" /> {s.active ? "Продолжить тренировку" : "Тренировка"}
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-9">
        {maps.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              s.setLastMap(m.id);
              nav(`/maps/${m.id}`);
            }}
            className={cn("group overflow-hidden rounded-xl border bg-bg-raised text-left transition", m.id === s.lastMapId ? "border-accent/60" : "border-line hover:border-line-strong")}
          >
            <div className="aspect-square overflow-hidden bg-[#0d0e11]">
              <img src={radarUrl(m.id)} alt="" className="h-full w-full object-contain p-1 opacity-75 transition group-hover:opacity-100" />
            </div>
            <div className="px-2.5 py-2 text-[12px] font-medium">{m.name}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <div className="flex items-center justify-between px-5 pt-4">
            <div>
              <div className="text-[15px] font-semibold">План на сегодня</div>
              <div className="text-[12px] text-ink-faint">{program.name} · {done}/{plan.length}</div>
            </div>
            <Segmented size="sm" value={program.id} onChange={(v) => s.setTodayProgram(v)} options={programs.map((p) => ({ value: p.id, label: `${p.minutes}′` }))} />
          </div>
          <div className="px-5 pt-3"><ProgressBar value={plan.length ? done / plan.length : 0} tone="ok" /></div>
          <ul className="mt-2 pb-2">
            {plan.map((e) => {
              const on = checks.includes(e.id);
              return (
                <li key={e.id}>
                  <button onClick={() => s.toggleDailyCheck(e.id)} className="flex w-full items-center gap-3 px-5 py-2 text-left hover:bg-white/[0.02]">
                    {on ? <CheckCircle2 size={17} className="shrink-0 text-ok" /> : <Circle size={17} className="shrink-0 text-ink-faint" />}
                    <span className={cn("flex-1 truncate text-[13px]", on && "text-ink-faint line-through")}>{e.name}</span>
                    <span className="font-mono text-[12px] text-ink-faint">{e.minutes}′</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <div className="px-5 pt-4 text-[15px] font-semibold">Недавно изученные гранаты</div>
          <div className="p-2">
            {recent.length === 0 ? (
              <div className="px-3 py-8 text-center text-[13px] text-ink-faint">
                Пока пусто.{" "}
                <button onClick={() => nav("/grenades")} className="text-accent hover:text-accent-soft">Открыть гранаты</button>
              </div>
            ) : (
              recent.map((g) => (
                <button key={g.id} onClick={() => setOpenNade(g.id)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-bg-hover">
                  <NadeDot type={g.type} />
                  <span className="flex-1 truncate text-[13px]">{g.title}</span>
                  <span className="text-[11px] text-ink-faint">{MAP_BY_ID[g.map]?.name}</span>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      <Drawer open={!!opened} onClose={() => setOpenNade(null)} title="Граната">
        {opened && <GrenadeDetail g={opened} />}
      </Drawer>
    </Page>
  );
}
