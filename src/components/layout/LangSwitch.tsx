import { motion } from "framer-motion";
import { useId } from "react";
import { LANGS } from "@/i18n";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/cn";

export function LangSwitch({ className }: { className?: string }) {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const id = useId();
  return (
    <div className={cn("flex rounded-full bg-sunken p-1 ring-1 ring-inset ring-line", className)} role="radiogroup">
      {LANGS.map((l) => (
        <button
          key={l.id}
          role="radio"
          aria-checked={lang === l.id}
          title={l.label}
          onClick={() => setLang(l.id)}
          className={cn("relative h-7 flex-1 rounded-full px-3 font-mono text-[11px] font-medium transition-colors", lang === l.id ? "text-bg" : "text-ink-faint hover:text-ink")}
        >
          {lang === l.id && <motion.span layoutId={`lang-${id}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
          <span className="relative">{l.short}</span>
        </button>
      ))}
    </div>
  );
}
