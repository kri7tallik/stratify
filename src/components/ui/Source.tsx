import { ExternalLink, Heart } from "lucide-react";
import type { ContentRef, SourceMeta } from "@/types/content";
import { useContent } from "@/services/content";
import { openExternal } from "@/lib/open";
import { fmtDate } from "@/lib/format";
import { StatusBadge } from "./Badge";
import { useAppStore, refKey } from "@/store/useAppStore";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

/** Full provenance block used on detail views. */
export function SourceBlock({ meta }: { meta: SourceMeta }) {
  const { sourceById } = useContent();
  const src = sourceById(meta.sourceId);
  const url = meta.url || src?.url;
  const author = meta.author || src?.author;
  return (
    <div className="rounded-xl border border-line bg-bg p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Источник</span>
        <StatusBadge status={meta.status} />
      </div>
      <div className="mt-2 text-sm font-medium text-ink">{src?.name ?? meta.sourceId}</div>
      <div className="mt-0.5 text-xs text-ink-faint">
        {[src?.publisher, author].filter(Boolean).join(" · ")}
        {src?.publisher || author ? " · " : ""}проверено {fmtDate(meta.checkedAt)}
      </div>
      {meta.note && <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{meta.note}</p>}
      {url && (
        <button onClick={() => openExternal(url)} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-soft">
          Открыть оригинал <ExternalLink size={13} />
        </button>
      )}
    </div>
  );
}

/** One-line provenance used on cards. */
export function SourceLine({ meta }: { meta: SourceMeta }) {
  const { sourceById } = useContent();
  const src = sourceById(meta.sourceId);
  return (
    <div className="flex min-w-0 items-center gap-2 text-[11px] text-ink-faint">
      <StatusBadge status={meta.status} compact />
      <span className="truncate">{meta.author ?? src?.publisher ?? src?.name ?? meta.sourceId}</span>
    </div>
  );
}

export function FavoriteButton({ refItem, className }: { refItem: ContentRef; className?: string }) {
  const fav = useAppStore((s) => s.favorites.includes(refKey(refItem)));
  const toggle = useAppStore((s) => s.toggleFavorite);
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        toggle(refItem);
      }}
      aria-label={fav ? "Убрать из избранного" : "В избранное"}
      className={cn("grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-bg-hover", fav ? "text-accent" : "text-ink-faint hover:text-ink", className)}
    >
      <Heart size={16} fill={fav ? "currentColor" : "none"} />
    </motion.button>
  );
}
