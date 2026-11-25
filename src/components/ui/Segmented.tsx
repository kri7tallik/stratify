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
    <div className={cn("inline-flex flex-wrap rounded-full bg-sunken p-1 ring-1 ring-inset ring-line", className)} role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative rounded-full font-display font-medium tracking-tight transition-colors",
              size === "sm" ? "h-7 px-3 text-[11.5px]" : "h-8 px-4 text-[12.5px]",
              active ? "text-bg" : "text-ink-muted hover:text-ink",
            )}
          >
            {active && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
            <span className="relative z-10 flex items-center gap-1.5">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
