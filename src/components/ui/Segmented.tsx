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
    <div className={cn("inline-flex rounded-lg border border-line bg-bg p-0.5", className)} role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative rounded-md font-medium transition-colors",
              size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3.5 text-[13px]",
              active ? "text-ink" : "text-ink-faint hover:text-ink-muted",
            )}
          >
            {active && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-md bg-bg-hover ring-1 ring-line-strong" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative z-10 flex items-center gap-1.5">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
