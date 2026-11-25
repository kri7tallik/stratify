import { useState } from "react";
import { ImageOff, Maximize2 } from "lucide-react";
import type { LineupImage as Img } from "@/types/content";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n";
import { useShotLabel } from "./LineupLightbox";

/**
 * Hot-linked screenshot from the source article, with credit and a graceful fallback.
 * With `onOpen` it becomes a button that opens the fullscreen viewer.
 */
export function LineupImage({ img, className, caption = true, step, onOpen }: { img: Img; className?: string; caption?: boolean; step?: number; onOpen?(): void }) {
  const t = useT();
  const shotLabel = useShotLabel();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const label = shotLabel(img.kind);
  const Wrapper = onOpen ? "button" : "figure";
  return (
    <Wrapper
      {...(onOpen ? { type: "button" as const, onClick: onOpen, "aria-label": `${label} — ${t("lb.open")}`, title: t("lb.open") } : {})}
      className={cn("group/img relative block w-full overflow-hidden bg-black/40 text-left", onOpen && "cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", className)}
    >
      {state !== "error" ? (
        <img
          src={img.src}
          alt={label}
          referrerPolicy="no-referrer"
          loading="lazy"
          draggable={false}
          onLoad={() => setState("ok")}
          onError={() => setState("error")}
          className={cn("aspect-video w-full object-cover transition duration-500 group-hover/img:scale-[1.04]", state === "ok" ? "opacity-100" : "opacity-0")}
        />
      ) : (
        <div className="grid aspect-video w-full place-items-center text-ink-faint">
          <ImageOff size={18} />
        </div>
      )}
      {state === "loading" && <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />}
      {/* crosshair overlay on aim shots */}
      {state === "ok" && img.kind === "aim" && caption && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition group-hover/img:opacity-100">
          <div className="relative h-8 w-8">
            <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-ok" />
            <span className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-ok" />
            <span className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-ok" />
            <span className="absolute right-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-ok" />
          </div>
        </div>
      )}
      {onOpen && state !== "error" && (
        <span className="pointer-events-none absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center bg-black/60 text-white opacity-0 ring-1 ring-inset ring-white/20 backdrop-blur transition group-hover/img:opacity-100 group-focus-visible/img:opacity-100">
          <Maximize2 size={15} />
        </span>
      )}
      {caption && (
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent px-3 pb-2 pt-8">
          <span className="flex items-center gap-2 font-display text-[12px] font-semibold uppercase tracking-wider text-white">
            {step !== undefined ? <span className="grid h-5 w-5 place-items-center bg-accent text-[11px] text-black">{step}</span> : <span className="h-2 w-2 bg-accent" />}
            {label}
          </span>
          <span className="text-[10px] text-white/55">{img.credit}</span>
        </span>
      )}
    </Wrapper>
  );
}
