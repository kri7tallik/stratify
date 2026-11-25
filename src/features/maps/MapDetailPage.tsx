import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Page, Button, Segmented, Card, EmptyState, Drawer, ErrorNotice } from "@/components/ui";
import { MapSchematic } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { GrenadeCard } from "@/features/grenades/GrenadeCard";
import { GrenadeDetail, NADE_DRAWER_WIDTH } from "@/features/grenades/GrenadeDetail";
import { TacticCard } from "@/features/tactics/TacticCard";
import { CalloutQuizPanel, useCalloutQuiz } from "./CalloutQuiz";
import type { Callout, MapId, Side } from "@/types/content";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n";

type Tab = "grenades" | "tactics" | "positions" | "quiz";

export function MapDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const t = useT();
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
  const mapTactics = useMemo(() => tactics.filter((x) => x.map === map?.id && x.side === side), [tactics, map, side]);

  if (!map) return <Page><ErrorNotice title={t("maps.notFound")} message={`${id}`} onRetry={() => nav("/maps")} /></Page>;

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
          <Button variant="ghost" size="sm" onClick={() => nav("/maps")} aria-label={t("c.back")}><ArrowLeft size={16} /></Button>
          <h1 className="font-hero text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{map.name}</h1>
          {map.activeDuty && <span className="tag-label hidden !text-accent sm:inline">{t("c.activeDuty")}</span>}
        </div>
        <Segmented
          value={side}
          onChange={(v) => { setSide(v); setRoute(null); setCallout(null); }}
          options={[
            { value: "T", label: "T" },
            { value: "CT", label: "CT" },
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
              { value: "grenades", label: <>{t("maps.tabNades")} <span className="font-mono opacity-70">{mapNades.length}</span></> },
              { value: "tactics", label: <>{t("maps.tabTactics")} <span className="font-mono opacity-70">{mapTactics.length}</span></> },
              { value: "positions", label: t("maps.tabPositions") },
              { value: "quiz", label: t("maps.tabQuiz") },
            ]}
          />

          {tab === "grenades" && (
            <>
              {callout && (
                <div className="mb-3 flex items-center justify-between text-[13px]">
                  <span className="text-ink-muted">{t("maps.position")}: <span className="font-display font-semibold text-accent">{callout.name}</span></span>
                  <button onClick={() => setCallout(null)} className="text-ink-faint hover:text-accent">{t("c.reset")}</button>
                </div>
              )}
              {visibleNades.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {visibleNades.map((g) => <GrenadeCard key={g.id} g={g} showMap={false} onOpen={() => setNade(g.id)} />)}
                </div>
              ) : (
                <EmptyState title={callout ? t("maps.noNadesPos") : t("maps.noNadesSide", { side })} action={<Button size="sm" onClick={() => nav("/library?add=grenade")}>{t("c.add")}</Button>} />
              )}
            </>
          )}

          {tab === "tactics" &&
            (mapTactics.length ? (
              <div className="grid gap-3">{mapTactics.map((x) => <TacticCard key={x.id} t={x} onOpen={() => nav(`/tactics/${x.id}`)} />)}</div>
            ) : (
              <EmptyState title={t("maps.noTacticsSide", { side })} action={<Button size="sm" onClick={() => nav("/library?add=tactic")}>{t("c.add")}</Button>} />
            ))}

          {tab === "positions" && (
            <div className="space-y-2">
              {positions.map((p) => (
                <Card key={p.id} interactive inner="px-4 py-3" onClick={() => setCallout(map.callouts.find((c) => c.id === p.calloutId) ?? null)}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-display font-semibold tracking-tight">{p.name}</span>
                    <span className="tag-label !text-[9px]">{p.role}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">{p.description}</p>
                </Card>
              ))}
              {routes.length > 0 && <div className="tag-label pt-4">{t("maps.routes")}</div>}
              {routes.map((r) => (
                <Card key={r.id} interactive active={route === r.id} onClick={() => setRoute(route === r.id ? null : r.id)} inner="px-4 py-3">
                  <div className={cn("font-display text-[14px] font-semibold tracking-tight", route === r.id && "text-accent")}>{r.name}</div>
                  <p className="mt-0.5 text-[12px] text-ink-muted">{r.description}</p>
                </Card>
              ))}
              {!positions.length && !routes.length && <EmptyState title={t("maps.noData")} />}
            </div>
          )}

          {tab === "quiz" && <CalloutQuizPanel quiz={quiz} />}
        </div>
      </div>

      <Drawer open={!!opened} onClose={() => setNade(null)} title={t("nade.drawer")} width={NADE_DRAWER_WIDTH}>{opened && <GrenadeDetail g={opened} />}</Drawer>
    </Page>
  );
}
