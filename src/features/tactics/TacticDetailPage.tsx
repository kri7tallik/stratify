import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play, CheckCircle2, Circle, ExternalLink, Clock, PlayCircle } from "lucide-react";
import { Page, Badge, Button, Card, SideBadge, DifficultyBadge, SourceBlock, FavoriteButton, Drawer, ErrorNotice } from "@/components/ui";
import { MapSchematic } from "@/components/map/MapSchematic";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { GrenadeDetail, NADE_DRAWER_WIDTH } from "@/features/grenades/GrenadeDetail";
import { NadeDot } from "@/features/grenades/GrenadeCard";
import { openExternal } from "@/lib/open";
import { cn } from "@/lib/cn";

export function TacticDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const tr = useT();
  const L = useLabels();
  const { tactics, grenades, mapById } = useContent();
  const t = tactics.find((x) => x.id === id);
  const learned = useAppStore((s) => (t ? !!s.learnedTactics[t.id] : false));
  const toggle = useAppStore((s) => s.toggleLearnedTactic);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const [nade, setNade] = useState<string | null>(null);

  useEffect(() => {
    if (!auto || !t) return;
    const timer = setTimeout(() => {
      if (step < t.steps.length - 1) setStep(step + 1);
      else setAuto(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [auto, step, t]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!t || (e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, t.steps.length - 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [t]);

  if (!t) return <Page><ErrorNotice title={tr("tactic.notFound")} message={`${id}`} onRetry={() => nav("/tactics")} /></Page>;

  const map = mapById(t.map)!;
  const cur = t.steps[step];
  const tNades = t.grenadeIds.map((gid) => grenades.find((g) => g.id === gid)).filter((g): g is NonNullable<typeof g> => !!g);
  const stepNades = tNades.filter((g) => cur.focus?.includes(g.toId));
  const opened = grenades.find((g) => g.id === nade);

  return (
    <Page className="max-w-[1600px]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={() => nav(-1)}><ArrowLeft size={15} /></Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{L.tactic[t.category]}</Badge>
              <span className="font-display text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{map.name}</span>
              <SideBadge side={t.side} />
              <DifficultyBadge d={t.difficulty} />
            </div>
            <h1 className="mt-3 font-hero text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px]">{t.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-ink-muted">{t.summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton refItem={{ kind: "tactic", id: t.id }} />
          <Button variant={learned ? "secondary" : "primary"} onClick={() => toggle(t.id)}>
            {learned ? <CheckCircle2 size={15} className="text-ok" /> : <Circle size={15} />} {learned ? tr("c.learned") : tr("tactic.markLearned")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-7">
          <div className="sticky top-4 space-y-3">
            <MapSchematic
              map={map}
              highlight={cur.focus ?? []}
              trajectories={tNades.map((g) => ({ id: g.id, from: g.fromId, to: g.toId, type: g.type, active: stepNades.some((s) => s.id === g.id) }))}
              onTrajectoryClick={setNade}
              className="aspect-square max-h-[58vh] w-full"
            />
            {/* Step player */}
            <Card active inner="p-4">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)} aria-label={tr("c.back")}><ChevronLeft size={16} /></Button>
                <Button size="sm" onClick={() => { if (step === t.steps.length - 1) setStep(0); setAuto(!auto); }}>
                  {auto ? <Pause size={14} /> : <Play size={14} />} {auto ? tr("tactic.pause") : tr("tactic.auto")}
                </Button>
                <div className="flex flex-1 gap-1">
                  {t.steps.map((_, i) => (
                    <button key={i} onClick={() => setStep(i)} className="group h-6 flex-1 py-2.5" aria-label={tr("tactic.step", { n: i + 1 })}>
                      <div className={cn("h-1 rounded-full transition-all", i < step ? "bg-accent/60" : i === step ? "bg-accent shadow-[0_0_10px_rgb(var(--accent))]" : "bg-ink/10 group-hover:bg-ink/20")} />
                    </button>
                  ))}
                </div>
                <span className="w-12 text-right font-mono text-[12px] text-ink-faint">{step + 1}/{t.steps.length}</span>
                <Button size="sm" variant="ghost" disabled={step === t.steps.length - 1} onClick={() => setStep(step + 1)} aria-label="Next"><ChevronRight size={16} /></Button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }} className="mt-3">
                  <div className="tag-label !text-accent">{tr("tactic.step", { n: step + 1 })}</div>
                  <div className="mt-1 font-display text-xl font-bold">{cur.label}</div>
                  <p className="mt-1 text-sm text-ink-muted">{cur.detail}</p>
                  {cur.timing && <p className="mt-1 flex items-center gap-1 text-[12px] text-ink-faint"><Clock size={12} /> {cur.timing}</p>}
                  {stepNades.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {stepNades.map((g) => (
                        <button key={g.id} onClick={() => setNade(g.id)} className="chamfer chamfer-sm flex items-center gap-1.5 bg-sunken px-2 py-1 text-[12px] ring-1 ring-inset ring-line hover:ring-accent/50"><NadeDot type={g.type} size={6} />{g.title}</button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-5">
          <Card inner="p-5">
            <div className="tag-label mb-3">{tr("tactic.roles")}</div>
            <div className="space-y-2">
              {t.roles.map((r) => (
                <div key={r.slot} className="chamfer chamfer-sm flex items-start gap-3 bg-sunken p-3 ring-1 ring-inset ring-line">
                  <span className={cn("chamfer chamfer-sm grid h-7 w-7 shrink-0 place-items-center font-display text-[13px] font-bold", t.side === "T" ? "bg-tside/15 text-tside" : "bg-ctside/15 text-ctside")}>{r.slot}</span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold">{r.role}</div>
                    <div className="text-[12px] text-ink-muted">{r.task}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card inner="p-5">
            <div className="tag-label mb-3">{tr("tactic.sequence")}</div>
            <ol className="space-y-1">
              {t.steps.map((s, i) => (
                <li key={i}>
                  <button onClick={() => setStep(i)} className={cn("chamfer chamfer-sm flex w-full gap-3 px-2 py-2 text-left transition", i === step ? "bg-accent/[0.1] ring-1 ring-inset ring-accent/30" : "hover:bg-bg-hover")}>
                    <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full font-display text-[11px] font-bold", i === step ? "bg-accent text-on-accent" : "bg-ink/[0.06] text-ink-muted")}>{i + 1}</span>
                    <span><span className="text-[13px] font-medium">{s.label}</span><span className="block text-[12px] text-ink-faint">{s.detail}</span></span>
                  </button>
                </li>
              ))}
            </ol>
          </Card>

          <Card inner="p-5">
            <div className="tag-label mb-3">{tr("tactic.nades")}</div>
            {tNades.length ? (
              <div className="space-y-1">
                {tNades.map((g) => (
                  <button key={g.id} onClick={() => setNade(g.id)} className="chamfer chamfer-sm flex w-full items-center gap-3 px-2 py-2 text-left transition hover:bg-bg-hover">
                    <NadeDot type={g.type} />
                    <span className="flex-1 text-[13px]">{g.title}</span>
                    <span className="text-[11px] text-ink-faint">{L.nade[g.type]}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-ink-faint">{tr("tactic.noNades")}</p>
            )}
            {t.utilityNotes.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-line pt-3 text-[12px] text-ink-muted">
                {t.utilityNotes.map((n) => <li key={n}>• {n}</li>)}
              </ul>
            )}
          </Card>

          <Card inner="p-5">
            <div className="tag-label mb-2">{tr("tactic.timings")}</div>
            <p className="text-[13px] text-ink-muted">{t.timings ?? tr("tactic.noTimings")}</p>
          </Card>

          {t.videoUrl && (
            <Button className="w-full" onClick={() => openExternal(t.videoUrl!)}><PlayCircle size={15} /> {tr("tactic.video")} <ExternalLink size={13} /></Button>
          )}

          <SourceBlock meta={t.meta} />
        </div>
      </div>

      <Drawer open={!!opened} onClose={() => setNade(null)} title={tr("nade.drawer")} width={NADE_DRAWER_WIDTH}>{opened && <GrenadeDetail g={opened} />}</Drawer>
    </Page>
  );
}
