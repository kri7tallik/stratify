import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
  active?: boolean;
  /** inner className */
  inner?: string;
}

/** Rounded panel: 1px frame + solid surface. Interactive cards lift and get a lime-to-aqua border on hover. */
export function Card({ interactive, active, className, inner, children, ...rest }: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      data-active={active ? "true" : undefined}
      className={cn("frame chamfer group/card", (interactive || active) && "hud", active && "frame-hot", interactive && "cursor-pointer", className)}
      {...rest}
    >
      <div className={cn("surface chamfer relative h-full transition-colors duration-300", interactive && "group-hover/card:bg-bg-hover/60", inner)}>{children as React.ReactNode}</div>
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, action, className }: { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-5 pt-5", className)}>
      <div className="min-w-0">
        <h3 className="font-display text-[16px] font-semibold tracking-tight text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-faint">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
