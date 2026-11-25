import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { CsMap } from "@/types/content";
import { ProgressBar } from "@/components/ui";
import { radarUrl } from "@/components/map/MapSchematic";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { useMapProgress } from "./useMapProgress";

/** Horizontal padding and gap of the shelf row (px) — must match the classes on the row. */
const PAD = 4;
const GAP = 3;

/** Spine / cover sizes per breakpoint (px). */
function useSizes() {
  const get = () => {
    const w = typeof window === "undefined" ? 1280 : window.innerWidth;
    if (w < 640) return { spine: 46, cover: 268, height: 420 };
    if (w < 1024) return { spine: 56, cover: 330, height: 460 };
    return { spine: 64, cover: 400, height: 520 };
  };
  const [s, setS] = useState(get);
  useEffect(() => {
    const h = () => setS(get());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return s;
}

/**
 * Map pool as a shelf of "cases": every map is a spine, the active one turns in 3D to show its cover.
 * Switch with a click on a spine, ← / → / Home / End, the arrow buttons, a horizontal wheel or the ticker.
 */
export function MapShelf({ maps }: { maps: CsMap[] }) {
  const lastMap = useAppStore((s) => s.lastMapId);
  const [active, setActive] = useState(() => Math.max(0, maps.findIndex((m) => m.id === lastMap)));
  const sizes = useSizes();
  const reduce = useReducedMotion();
  const t = useT();
  const shelfRef = useRef<HTMLDivElement>(null);

  const go = useCallback((i: number) => setActive(Math.max(0, Math.min(maps.length - 1, i))), [maps.length]);

  // keep the active case centred when the shelf scrolls (phones). Computed from the final layout —
  // every case before the active one ends up as a spine — because widths are still animating when
  // this runs; it runs again once the turn animation settles.
  const center = useCallback(() => {
    const box = shelfRef.current;
    if (!box) return;
    const content = PAD * 2 + (maps.length - 1) * (sizes.spine + GAP) + sizes.cover;
    if (content <= box.clientWidth) return;
    const left = PAD + active * (sizes.spine + GAP) - (box.clientWidth - sizes.cover) / 2;
    box.scrollTo({ left: Math.max(0, Math.min(content - box.clientWidth, left)), behavior: reduce ? "auto" : "smooth" });
  }, [active, sizes, reduce, maps.length]);
  useEffect(center, [center]);

  // horizontal wheel / trackpad swipe flips through the shelf (vertical wheel keeps scrolling the page)
  useEffect(() => {
    const box = shelfRef.current;
    if (!box) return;
    let lock = 0;
    const h = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
      e.preventDefault();
      const now = Date.now();
      if (now < lock) return;
      lock = now + 260;
      setActive((a) => Math.max(0, Math.min(maps.length - 1, a + (e.deltaX > 0 ? 1 : -1))));
    };
    box.addEventListener("wheel", h, { passive: false });
    return () => box.removeEventListener("wheel", h);
  }, [maps.length]);

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: maps.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key]);
    }
  };

  return (
    <div className="select-none">
      <Ticker maps={maps} active={active} onPick={go} />

      <div className="relative" onKeyDown={onKey}>
        <div
          ref={shelfRef}
          role="listbox"
          aria-label={t("maps.title")}
          aria-activedescendant={`shelf-${maps[active]?.id}`}
          tabIndex={0}
          className="no-scrollbar overflow-x-auto overflow-y-hidden outline-none focus-visible:ring-1 focus-visible:ring-accent/60"
          style={{ perspective: 1800, overflowAnchor: "none" }}
        >
          <div className="mx-auto flex w-max items-end gap-[3px] px-1 pb-8 pt-4" style={{ height: sizes.height + 48 }}>
            {maps.map((m, i) => (
              <Case
                key={m.id}
                map={m}
                index={i}
                active={i === active}
                sizes={sizes}
                reduce={!!reduce}
                onSelect={() => go(i)}
                onSettled={center}
              />
            ))}
          </div>
        </div>
        {/* shelf board */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
        <div className="pointer-events-none absolute inset-x-[10%] bottom-0 h-6 bg-[radial-gradient(ellipse_at_top,rgb(var(--shadow)/.35),transparent_70%)]" />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="hidden font-mono text-[11px] text-ink-faint sm:inline">{t("maps.shelfHint")}</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[12px] tabular-nums text-ink-muted">
            <span className="text-accent">{String(active + 1).padStart(2, "0")}</span>/{String(maps.length).padStart(2, "0")}
          </span>
          <NavBtn label={t("lb.prev")} disabled={active === 0} onClick={() => go(active - 1)}><ChevronLeft size={18} /></NavBtn>
          <NavBtn label={t("lb.next")} disabled={active === maps.length - 1} onClick={() => go(active + 1)}><ChevronRight size={18} /></NavBtn>
        </div>
      </div>
    </div>
  );
}

/** Running line of map names above the shelf; the active name slides to the centre. */
function Ticker({ maps, active, onPick }: { maps: CsMap[]; active: number; onPick(i: number): void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const [x, setX] = useState(0);
  const reduce = useReducedMotion();

  const measure = useCallback(() => {
    const w = wrap.current;
    const it = items.current[active];
    if (!w || !it) return;
    setX(w.clientWidth / 2 - (it.offsetLeft + it.offsetWidth / 2));
  }, [active]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div ref={wrap} className="relative mb-2 overflow-hidden border-y border-line py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div className="flex w-max items-baseline gap-8 whitespace-nowrap" animate={{ x }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 30 }}>
        {maps.map((m, i) => (
          <button
            key={m.id}
            ref={(n) => (items.current[i] = n)}
            tabIndex={-1}
            onClick={() => onPick(i)}
            className={cn(
              "font-hero text-2xl font-semibold tracking-[-0.03em] transition-colors duration-300 sm:text-5xl",
              i === active ? "text-ink" : "text-ink-faint/40 hover:text-ink-muted",
            )}
          >
            {i === active && <span className="mr-3 align-middle font-mono text-[11px] font-normal text-accent sm:text-xs">{String(i + 1).padStart(2, "0")}</span>}
            {m.name}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

type CaseProps = { map: CsMap; index: number; active: boolean; sizes: ReturnType<typeof useSizes>; reduce: boolean; onSelect(): void; onSettled(): void };

function Case({ map, index, active, sizes, reduce, onSelect, onSettled }: CaseProps) {
  const nav = useNavigate();
  const t = useT();
  const setLast = useAppStore((s) => s.setLastMap);
  const p = useMapProgress(map.id);
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 170, damping: 26 };
  const open = () => {
    setLast(map.id);
    nav(`/maps/${map.id}`);
  };

  return (
    <motion.div
      id={`shelf-${map.id}`}
      role="option"
      aria-selected={active}
      aria-label={map.name}
      className="relative shrink-0"
      style={{ height: sizes.height, transformStyle: "preserve-3d" }}
      initial={false}
      animate={{ width: active ? sizes.cover : sizes.spine, y: active ? -6 : 0 }}
      onAnimationComplete={() => active && onSettled()}
      whileHover={active || reduce ? undefined : { y: -10 }}
      transition={spring}
    >
      {/* ── spine */}
      <motion.button
        type="button"
        tabIndex={-1}
        onClick={onSelect}
        aria-hidden={active}
        className="group absolute inset-y-0 left-0 overflow-hidden text-left"
        style={{
          width: sizes.spine,
          transformOrigin: "right center",
          backfaceVisibility: "hidden",
          background: `linear-gradient(90deg, ${map.accent}55, ${map.accent}22 45%, rgb(var(--bg-panel)) 100%), rgb(var(--bg-panel))`,
          boxShadow: `inset 3px 0 0 ${map.accent}, inset -1px 0 0 rgb(var(--line)), inset 0 0 0 1px rgb(var(--line))`,
          borderRadius: 14,
        }}
        initial={false}
        animate={{ rotateY: active ? -90 : 0, opacity: active ? 0 : 1, filter: active ? "brightness(.5)" : "brightness(1)" }}
        transition={spring}
      >
        <span className="absolute left-1/2 top-3 -translate-x-1/2 font-mono text-[10px] text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-hero text-lg font-semibold uppercase tracking-[0.08em] text-ink-muted transition-colors group-hover:text-ink sm:text-xl"
          style={{ writingMode: "vertical-rl", transform: "translate(-50%,-50%) rotate(180deg)" }}
        >
          {map.name}
        </span>
        <span className="absolute bottom-10 left-1/2 h-8 w-[2px] -translate-x-1/2" style={{ background: map.activeDuty ? map.accent : "rgb(var(--line-strong))" }} />
        <span className={cn("absolute bottom-3 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45", map.activeDuty ? "bg-accent" : "bg-line-strong")} />
        <span className="pointer-events-none absolute inset-0 rounded-[14px] bg-ink/0 transition group-hover:bg-ink/[0.04]" />
      </motion.button>

      {/* ── cover */}
      <motion.div
        aria-hidden={!active}
        className="frame frame-hot chamfer chamfer-lg absolute inset-y-0 left-0 shadow-float"
        style={{ width: sizes.cover, transformOrigin: "left center", backfaceVisibility: "hidden", pointerEvents: active ? "auto" : "none" }}
        initial={false}
        animate={{ rotateY: active ? 0 : 90, opacity: active ? 1 : 0 }}
        transition={spring}
      >
        <div className="chamfer chamfer-lg relative flex h-full flex-col overflow-hidden bg-bg-raised">
          {/* radar art */}
          <button type="button" onClick={open} tabIndex={active ? 0 : -1} className="group relative m-2 mb-0 min-h-0 flex-1 overflow-hidden rounded-[22px] text-left text-white" aria-label={`${t("maps.open")}: ${map.name}`}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 45%, ${map.accent}40, #08090a 72%)` }} />
            <img src={radarUrl(map.id)} alt="" draggable={false} className="absolute inset-0 h-full w-full scale-[1.08] object-contain opacity-80 transition duration-700 group-hover:rotate-[-2deg] group-hover:scale-[1.14] group-hover:opacity-100" />
            {!reduce && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 animate-sweep rounded-full bg-[conic-gradient(from_0deg,rgb(var(--accent)/.28),transparent_12%,transparent)] [mask-image:radial-gradient(circle,#000_30%,transparent_66%)]" />
            )}
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/55">
              <span>{map.codename}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-5 pb-4 pt-16">
              <div className="flex items-end justify-between gap-3">
                <span className="font-hero text-3xl font-semibold leading-none tracking-[-0.03em] sm:text-4xl">{map.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider", map.activeDuty ? "bg-accent text-on-accent" : "bg-white/10 text-white/70")}>{map.activeDuty ? t("c.activeDuty") : t("c.reserve")}</span>
              </div>
            </div>
          </button>

          {/* info */}
          <div className="shrink-0 space-y-3 px-5 pb-5 pt-2">
            <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-muted sm:line-clamp-3">{map.overview}</p>
            <div className="flex justify-between text-[12px] text-ink-faint">
              <span>{t("c.nadesTactics", { g: p.grenades, t: p.tactics })}</span>
              <span className="font-mono tabular-nums text-ink-muted">{p.done}/{p.total}</span>
            </div>
            <ProgressBar value={p.ratio} />
            <button
              type="button"
              onClick={open}
              tabIndex={active ? 0 : -1}
              className="shine flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-display text-[13px] font-semibold text-on-accent transition hover:bg-accent-soft"
            >
              {t("maps.open")} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavBtn({ children, label, disabled, onClick }: { children: ReactNode; label: string; disabled?: boolean; onClick(): void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-bg-raised text-ink-muted ring-1 ring-inset ring-line transition hover:bg-ink hover:text-bg disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
