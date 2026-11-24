import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Page, Button, Segmented, Card, EmptyState, Drawer, ErrorNotice } from "@/components/ui";
import { MapSchematic } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { GrenadeCard } from "@/features/grenades/GrenadeCard";
import { GrenadeDetail } from "@/features/grenades/GrenadeDetail";
import { TacticCard } from "@/features/tactics/TacticCard";
import { CalloutQuizPanel, useCalloutQuiz } from "./CalloutQuiz";
import type { Callout, MapId, Side } from "@/types/content";
import { cn } from "@/lib/cn";

type Tab = "grenades" | "tactics" | "positions" | "quiz";

export function MapDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [qp] = useSearchParams();
  const { mapById, grenades, tactics } = useContent();
  const setLast = useAppStore((s) => s.setLastMap);
  const map = mapById(id as MapId);
  const [side, setSide] = useState<Side>("T");
  const [tab, setTab] = useState<Tab>((qp.get("tab") as Tab) || "grenades");
  const [route, setRoute] = useState<string | null>(null);
  const [callout, setCallout] = useState<Callout | null>(null);
  const [nade, setNade] = useState<string | null>(null);
  const quiz = useCalloutQuiz(map ?? mapById("mirage")!);

  useEffect(() => {
    if (map) setLast(map.id);
  }, [map, setLast]);

  const mapNades = useMemo(() => grenades.filter((g) => g.map === map?.id && g.side === side), [grenades, map, side]);
  const mapTactics = useMemo(() => tactics.filter((t) => t.map === map?.id && t.side === side), [tactics, map, side]);

  if (!map) return <Page><ErrorNotice title="Карта не найдена" message={`Нет карты «${id}».`} onRetry={() => nav("/maps")} /></Page>;

  const isQuiz = tab === "quiz";
  const routes = map.routes.filter((r) => r.side === side);
  const positions = map.positions.filter((p) => p.side === side);
  const activeRoute = routes.find((r) => r.id === route);
  const visibleNades = callout ? mapNades.filter((g) => g.fromId === callout.id || g.toId === callout.id) : mapNades;
  const highlight = isQuiz ? (quiz.target ? [quiz.target] : []) : callout ? [callout.id] : tab === "positions" ? (activeRoute?.path ?? positions.map((p) => p.calloutId)) : [];
  const opened = grenades.find((g) => g.id === nade);

  return (
    <Page className="max-w-[1600px]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => nav("/maps")} aria-label="Назад"><ArrowLeft size={16} /></Button>
          <h1 className="text-2xl font-semibold tracking-tight">{map.name}</h1>
        </div>
        <Segmented
          value={side}
          onChange={(v) => { setSide(v); setRoute(null); setCallout(null); }}
          options={[
            { value: "T", label: <span className={side === "T" ? "text-tside" : ""}>T</span> },
            { value: "CT", label: <span className={side === "CT" ? "text-ctside" : ""}>CT</span> },
          ]}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <div className="sticky top-4">
            <MapSchematic
              map={map}
              highlight={highlight}
              selectedCallout={callout?.id}
              routePath={isQuiz ? undefined : activeRoute?.path}
              routeColor={side === "T" ? "#e8b04a" : "#5b9cf5"}
              trajectories={tab === "grenades" ? visibleNades.map((g) => ({ id: g.id, from: g.fromId, to: g.toId, type: g.type, active: nade ? g.id === nade : true })) : []}
              onCalloutClick={isQuiz ? undefined : (c) => { setTab("grenades"); setCallout((cur) => (cur?.id === c.id ? null : c)); }}
              onTrajectoryClick={setNade}
              labels={isQuiz ? "none" : "focus"}
              className="aspect-square max-h-[80vh] w-full"
            />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <Segmented
            size="sm"
            className="mb-4"
            value={tab}
            onChange={(v) => { setTab(v); setCallout(null); setRoute(null); }}
            options={[
              { value: "grenades", label: `Гранаты ${mapNades.length}` },
              { value: "tactics", label: `Тактики ${mapTactics.length}` },
              { value: "positions", label: "Позиции" },
              { value: "quiz", label: "Квиз" },
            ]}
          />

          {tab === "grenades" && (
            <>
              {callout && (
                <div className="mb-3 flex items-center justify-between text-[13px]">
                  <span className="text-ink-muted">Позиция: <span className="text-ink">{callout.name}</span></span>
                  <button onClick={() => setCallout(null)} className="text-ink-faint hover:text-ink">Сбросить</button>
                </div>
              )}
              {visibleNades.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {visibleNades.map((g) => <GrenadeCard key={g.id} g={g} showMap={false} onOpen={() => setNade(g.id)} />)}
                </div>
              ) : (
                <EmptyState title={callout ? "Нет гранат для этой позиции" : `Нет гранат за ${side}`} action={<Button size="sm" onClick={() => nav("/library?add=grenade")}>Добавить</Button>} />
              )}
            </>
          )}

          {tab === "tactics" &&
            (mapTactics.length ? (
              <div className="grid gap-3">{mapTactics.map((t) => <TacticCard key={t.id} t={t} onOpen={() => nav(`/tactics/${t.id}`)} />)}</div>
            ) : (
              <EmptyState title={`Нет тактик за ${side}`} action={<Button size="sm" onClick={() => nav("/library?add=tactic")}>Добавить</Button>} />
            ))}

          {tab === "positions" && (
            <div className="space-y-2">
              {positions.map((p) => (
                <Card key={p.id} interactive className="px-4 py-3" onClick={() => setCallout(map.callouts.find((c) => c.id === p.calloutId) ?? null)}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-ink-faint">{p.role}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">{p.description}</p>
                </Card>
              ))}
              {routes.length > 0 && <div className="pt-3 text-[12px] font-medium text-ink-faint">Маршруты</div>}
              {routes.map((r) => (
                <Card key={r.id} interactive onClick={() => setRoute(route === r.id ? null : r.id)} className={cn("px-4 py-3", route === r.id && "border-accent/50")}>
                  <div className="text-[13px] font-medium">{r.name}</div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">{r.description}</p>
                </Card>
              ))}
              {!positions.length && !routes.length && <EmptyState title="Нет данных для этой стороны" />}
            </div>
          )}

          {tab === "quiz" && <CalloutQuizPanel quiz={quiz} />}
        </div>
      </div>

      <Drawer open={!!opened} onClose={() => setNade(null)} title="Граната">{opened && <GrenadeDetail g={opened} />}</Drawer>
    </Page>
  );
}
