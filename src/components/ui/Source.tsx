import { ExternalLink, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { ContentRef, SourceMeta } from "@/types/content";
import { useContent } from "@/services/content";
import { openExternal } from "@/lib/open";
import { fmtDate } from "@/lib/format";
import { StatusBadge } from "./Badge";
import { useAppStore, refKey } from "@/store/useAppStore";
import { cn } from "@/lib/cn";
import { useLang, useT } from "@/i18n";

export function SourceBlock({ meta }: { meta: SourceMeta }) {
  const { sourceById } = useContent();
  const t = useT();
  const lang = useLang();
  const src = sourceById(meta.sourceId);
  const url = meta.url || src?.url;
  const author = meta.author || src?.author;
  return (
    <div className="chamfer bg-black/30 p-4 ring-1 ring-inset ring-line">
      <div className="flex items-center justify-between gap-2">
        <span className="tag-label">{t("c.source")}</span>
        <StatusBadge status={meta.status} />
      </div>
      <div className="mt-2 text-sm font-medium text-ink">{src?.name ?? meta.sourceId}</div>
      <div className="mt-0.5 text-xs text-ink-faint">
        {[src?.publisher, author, t("c.checked", { date: fmtDate(meta.checkedAt, lang) })].filter(Boolean).join(" · ")}
      </div>
      {meta.note && <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{meta.note}</p>}
      {url && (
        <button onClick={() => openExternal(url)} className="mt-3 inline-flex items-center gap-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-accent hover:text-accent-amber">
          {t("c.openSource")} <ExternalLink size={12} />
        </button>
      )}
    </div>
  );
}

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
  const t = useT();
  return (
    <motion.button
      whileTap={{ scale: 0.7 }}
      animate={fav ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation();
        toggle(refItem);
      }}
      aria-label={fav ? t("c.removeFromFav") : t("c.addToFav")}
      className={cn("grid h-8 w-8 place-items-center transition-colors", fav ? "text-accent" : "text-ink-faint hover:text-ink", className)}
    >
      <Heart size={16} fill={fav ? "currentColor" : "none"} />
    </motion.button>
  );
}
