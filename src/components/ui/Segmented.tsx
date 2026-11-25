import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useId } from "react";

export interface SegOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

export function Segmented<T extends string>({ value, onChange, options, className, size = "md" }: { value: T; onChange(v: NoInfer<T>): void; options: SegOption<NoInfer<T>>[]; className?: string; size?: "sm" | "md" }) {
  const id = useId();
  return (
    <div className={cn("chamfer chamfer-sm inline-flex flex-wrap bg-black/30 p-1 ring-1 ring-inset ring-line", className)} role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative font-display font-semibold uppercase tracking-wider transition-colors",
              size === "sm" ? "h-7 px-2.5 text-[10px]" : "h-8 px-3.5 text-[11px]",
              active ? "text-black" : "text-ink-faint hover:text-ink",
            )}
          >
            {active && <motion.span layoutId={`seg-${id}`} className="chamfer chamfer-sm absolute inset-0 bg-gradient-to-r from-accent to-accent-amber" transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
            <span className="relative z-10 flex items-center gap-1.5">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
