import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { LineupImage as Img } from "@/types/content";
import { cn } from "@/lib/cn";

const LABEL = { position: "Где стоять", aim: "Куда целиться", result: "Результат" } as const;

/** Hot-linked screenshot from the source article, with credit and a graceful fallback. */
export function LineupImage({ img, className, caption = true }: { img: Img; className?: string; caption?: boolean }) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  return (
    <figure className={cn("relative overflow-hidden rounded-lg bg-bg", className)}>
      {state !== "error" ? (
        <img
          src={img.src}
          alt={LABEL[img.kind]}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setState("ok")}
          onError={() => setState("error")}
          className={cn("aspect-video w-full object-cover transition-opacity duration-300", state === "ok" ? "opacity-100" : "opacity-0")}
        />
      ) : (
        <div className="grid aspect-video w-full place-items-center text-ink-faint">
          <ImageOff size={18} />
        </div>
      )}
      {state === "loading" && <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />}
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-2.5 pb-1.5 pt-6 text-[11px]">
          <span className="font-medium text-white">{LABEL[img.kind]}</span>
          <span className="text-white/60">{img.credit}</span>
        </figcaption>
      )}
    </figure>
  );
}
