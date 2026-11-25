import { useCallback, useEffect, useRef, useState, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff, Minus, Plus, RotateCcw, X } from "lucide-react";
import type { LineupImage as Img } from "@/types/content";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { openExternal } from "@/lib/open";

/** Lineup shots are always shown in the order you use them: stand → aim → result. */
const KIND_ORDER: Record<Img["kind"], number> = { position: 0, aim: 1, result: 2 };
export const sortShots = (imgs: Img[]) => imgs.map((img, i) => ({ img, i })).sort((a, b) => KIND_ORDER[a.img.kind] - KIND_ORDER[b.img.kind] || a.i - b.i).map((x) => x.img);

export function useShotLabel() {
  const t = useT();
  return (kind: Img["kind"]) => (kind === "position" ? t("nade.where") : kind === "aim" ? t("nade.aim") : t("nade.result"));
}

const MIN = 1;
const MAX = 5;
const SWIPE = 60;

type View = { s: number; x: number; y: number };
const IDENTITY: View = { s: 1, x: 0, y: 0 };

interface Props {
  images: Img[];
  index: number | null;
  onIndex(i: number): void;
  onClose(): void;
  title: string;
  sourceUrl?: string;
}

/**
 * Fullscreen lineup viewer: arrows / swipe / ←→ to switch shots, wheel / pinch / double-click
 * to zoom, drag to pan, Esc to close. Rendered in a portal above drawers.
 */
export function LineupLightbox({ images, index, onIndex, onClose, title, sourceUrl }: Props) {
  const open = index !== null && images.length > 0;
  return createPortal(
    <AnimatePresence>{open && <Viewer images={images} index={Math.min(index!, images.length - 1)} onIndex={onIndex} onClose={onClose} title={title} sourceUrl={sourceUrl} />}</AnimatePresence>,
    document.body,
  );
}

function Viewer({ images, index, onIndex, onClose, title, sourceUrl }: Omit<Props, "index"> & { index: number }) {
  const t = useT();
  const label = useShotLabel();
  const reduce = useReducedMotion();
  const count = images.length;
  const img = images[index];

  const [view, setView] = useState<View>(IDENTITY);
  const [dir, setDir] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const go = useCallback(
    (to: number) => {
      if (count < 2) return;
      const next = (to + count) % count;
      setDir(to > index ? 1 : -1);
      onIndex(next);
    },
    [count, index, onIndex],
  );

  // reset zoom when switching shots
  useEffect(() => {
    setView(IDENTITY);
    setDrag({ x: 0, y: 0 });
  }, [index]);

  // preload neighbours so switching is instant
  useEffect(() => {
    for (const d of [1, -1]) {
      const n = images[(index + d + count) % count];
      if (!n) continue;
      const pre = new Image();
      pre.referrerPolicy = "no-referrer";
      pre.src = n.src;
    }
  }, [images, index, count]);

  // focus trap entry + restore, scroll lock
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  /** Clamp pan so the zoomed image never leaves the stage. */
  const clamp = useCallback((v: View): View => {
    const el = imgRef.current;
    const s = Math.min(MAX, Math.max(MIN, v.s));
    if (!el || s <= 1.001) return IDENTITY;
    const mx = ((s - 1) * el.offsetWidth) / 2;
    const my = ((s - 1) * el.offsetHeight) / 2;
    return { s, x: Math.max(-mx, Math.min(mx, v.x)), y: Math.max(-my, Math.min(my, v.y)) };
  }, []);

  /** Zoom to `s`, keeping the point (px, py) — relative to the stage centre — fixed on screen. */
  const zoomAt = useCallback(
    (s: number, px = 0, py = 0) => {
      const v = viewRef.current;
      const ns = Math.min(MAX, Math.max(MIN, s));
      const k = ns / v.s;
      setView(clamp({ s: ns, x: px - (px - v.x) * k, y: py - (py - v.y) * k }));
    },
    [clamp],
  );

  const centreOffset = (clientX: number, clientY: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    return [clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2)] as const;
  };

  // keyboard — capture phase so Esc doesn't also close the drawer underneath
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      let handled = true;
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          go(index - 1);
          break;
        case "ArrowRight":
          go(index + 1);
          break;
        case "Home":
          go(0);
          break;
        case "End":
          go(count - 1);
          break;
        case "+":
        case "=":
          zoomAt(viewRef.current.s * 1.5);
          break;
        case "-":
        case "_":
          zoomAt(viewRef.current.s / 1.5);
          break;
        case "0":
          setView(IDENTITY);
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [go, index, count, onClose, zoomAt]);

  // wheel zoom (native listener: React's wheel handler is passive and can't preventDefault)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      const [px, py] = centreOffset(e.clientX, e.clientY);
      zoomAt(viewRef.current.s * Math.exp(-e.deltaY * 0.0022), px, py);
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, [zoomAt]);

  // pointer gestures: 1 finger = pan (zoomed) or swipe (not zoomed), 2 fingers = pinch
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startX: number; startY: number; moved: boolean; pinch?: { d: number; s: number } }>({ startX: 0, startY: 0, moved: false });

  const dist = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const mid = () => {
    const [a, b] = [...pointers.current.values()];
    return [(a.x + b.x) / 2, (a.y + b.y) / 2] as const;
  };

  const onPointerDown = (e: RPointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* pointer already gone — gestures still work without capture */
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) gesture.current = { startX: e.clientX, startY: e.clientY, moved: false };
    if (pointers.current.size === 2) {
      gesture.current.pinch = { d: dist(), s: viewRef.current.s };
      gesture.current.moved = true;
      setDrag({ x: 0, y: 0 });
    }
  };

  const onPointerMove = (e: RPointerEvent) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > 6) g.moved = true;

    if (pointers.current.size >= 2 && g.pinch) {
      const [mx, my] = mid();
      const [px, py] = centreOffset(mx, my);
      zoomAt((g.pinch.s * dist()) / g.pinch.d, px, py);
      return;
    }
    if (viewRef.current.s > 1) setView((v) => clamp({ ...v, x: v.x + dx, y: v.y + dy }));
    else setDrag({ x: e.clientX - g.startX, y: Math.max(0, e.clientY - g.startY) });
  };

  const onPointerUp = (e: RPointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size === 1) {
      // pinch ended with one finger still down — restart a pan from here
      const [rest] = [...pointers.current.values()];
      gesture.current = { startX: rest.x, startY: rest.y, moved: true };
      return;
    }
    if (pointers.current.size > 0) return;
    if (viewRef.current.s <= 1 && !g.pinch) {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
      else if (dy > 120 && Math.abs(dy) > Math.abs(dx) * 1.5) onClose();
    }
    setDrag({ x: 0, y: 0 });
  };

  const onDoubleClick = (e: RMouseEvent) => {
    const [px, py] = centreOffset(e.clientX, e.clientY);
    if (viewRef.current.s > 1) setView(IDENTITY);
    else zoomAt(2.5, px, py);
  };

  /** Click on the dark area around the image closes; clicks that were drags don't. */
  const onStageClick = (e: RMouseEvent) => {
    if (gesture.current.moved) return;
    if (e.target === e.currentTarget) onClose();
  };

  const zoomed = view.s > 1.001;
  const isFailed = failed[img.src];
  const slide = reduce ? 0 : 60;

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${label(img.kind)}`}
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col bg-black/95 outline-none backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
    >
      {/* top bar */}
      <div className="relative z-10 flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-black/60 px-3 sm:px-5">
        <span className="font-mono text-[12px] tabular-nums text-accent">
          {String(index + 1).padStart(2, "0")}<span className="text-white/35">/{String(count).padStart(2, "0")}</span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[13px] font-bold uppercase tracking-wider text-white">{title}</div>
          <div className="truncate text-[11px] text-white/50">{label(img.kind)}</div>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <IconBtn label={t("lb.zoomOut")} onClick={() => zoomAt(view.s / 1.5)} disabled={!zoomed}><Minus size={16} /></IconBtn>
          <span className="w-12 text-center font-mono text-[11px] tabular-nums text-white/60">{Math.round(view.s * 100)}%</span>
          <IconBtn label={t("lb.zoomIn")} onClick={() => zoomAt(view.s * 1.5)} disabled={view.s >= MAX}><Plus size={16} /></IconBtn>
          <IconBtn label={t("lb.zoomReset")} onClick={() => setView(IDENTITY)} disabled={!zoomed}><RotateCcw size={15} /></IconBtn>
        </div>
        <IconBtn label={t("c.close")} onClick={onClose} className="hover:rotate-90"><X size={20} /></IconBtn>
      </div>

      {/* stage */}
      <div
        ref={stageRef}
        className={cn("relative flex-1 touch-none select-none overflow-hidden", zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        onClick={onStageClick}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={img.src}
            custom={dir}
            className="pointer-events-none absolute inset-0 grid place-items-center p-2 sm:p-6"
            initial={{ opacity: 0, x: dir * slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dir * slide }}
            transition={{ duration: reduce ? 0 : 0.22, ease: "easeOut" }}
          >
            {isFailed ? (
              <div className="pointer-events-auto flex flex-col items-center gap-3 text-center text-white/60">
                <ImageOff size={32} />
                <p className="text-sm">{t("lb.failed")}</p>
                {sourceUrl && (
                  <button onClick={() => openExternal(sourceUrl)} className="inline-flex items-center gap-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-accent hover:text-accent-amber">
                    {t("c.openSource")} <ExternalLink size={12} />
                  </button>
                )}
              </div>
            ) : (
              <img
                // keep the latest image: the exiting slide unmounting later must not clear it
                ref={(n) => {
                  if (n) imgRef.current = n;
                }}
                src={img.src}
                alt={`${title} — ${label(img.kind)}`}
                referrerPolicy="no-referrer"
                draggable={false}
                onError={() => setFailed((f) => ({ ...f, [img.src]: true }))}
                className="pointer-events-auto max-h-full max-w-full object-contain shadow-2xl ring-1 ring-white/10 will-change-transform"
                style={{
                  transform: `translate3d(${view.x + drag.x}px, ${view.y + drag.y}px, 0) scale(${view.s})`,
                  transition: pointers.current.size > 0 || reduce ? "none" : "transform 160ms ease-out",
                  opacity: drag.y > 0 ? Math.max(0.4, 1 - drag.y / 400) : 1,
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <NavBtn side="left" label={t("lb.prev")} onClick={() => go(index - 1)} />
            <NavBtn side="right" label={t("lb.next")} onClick={() => go(index + 1)} />
          </>
        )}
      </div>

      {/* bottom: step strip + credit */}
      <div className="relative z-10 shrink-0 border-t border-white/10 bg-black/60 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
        {count > 1 && (
          <div className="mx-auto flex max-w-3xl justify-center gap-2 overflow-x-auto pb-2">
            {images.map((im, i) => (
              <button
                key={im.src + i}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  onIndex(i);
                }}
                aria-label={`${i + 1}. ${label(im.kind)}`}
                aria-current={i === index}
                className={cn(
                  "group relative w-28 shrink-0 overflow-hidden text-left ring-1 transition sm:w-36",
                  i === index ? "ring-2 ring-accent" : "opacity-55 ring-white/15 hover:opacity-100",
                )}
              >
                <img src={im.src} alt="" referrerPolicy="no-referrer" loading="lazy" className="aspect-video w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/90 to-transparent px-1.5 pb-1 pt-4 font-display text-[10px] font-semibold uppercase tracking-wider text-white">
                  <span className={cn("grid h-4 w-4 place-items-center text-[9px]", i === index ? "bg-accent text-black" : "bg-white/20")}>{i + 1}</span>
                  <span className="truncate">{label(im.kind)}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] text-white/45">
          <span className="hidden md:inline">{t("lb.hint")}</span>
          <span className="flex items-center gap-3">
            <span>© {img.credit}</span>
            {sourceUrl && (
              <button onClick={() => openExternal(sourceUrl)} className="inline-flex items-center gap-1 font-display font-semibold uppercase tracking-wider text-accent hover:text-accent-amber">
                {t("c.openSource")} <ExternalLink size={11} />
              </button>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function IconBtn({ children, label, onClick, disabled, className }: { children: ReactNode; label: string; onClick(): void; disabled?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn("grid h-9 w-9 place-items-center text-white/70 transition hover:text-accent disabled:pointer-events-none disabled:opacity-30", className)}
    >
      {children}
    </button>
  );
}

function NavBtn({ side, label, onClick }: { side: "left" | "right"; label: string; onClick(): void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      aria-label={label}
      title={label}
      className={cn(
        "absolute top-1/2 z-10 grid h-12 w-12 rounded-full -translate-y-1/2 place-items-center bg-black/55 text-white ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-accent hover:text-black sm:h-14 sm:w-14",
        side === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4",
      )}
    >
      <Icon size={26} />
    </button>
  );
}
