import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

export function Card({ interactive, className, children, ...rest }: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative rounded-xl border border-line bg-bg-raised shadow-card",
        interactive && "cursor-pointer transition-colors hover:border-line-strong hover:bg-bg-panel",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, action, className }: { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-5 pt-4", className)}>
      <div className="min-w-0">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-faint">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
