import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/cn";

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("relative mx-auto w-full max-w-[1440px] px-4 pb-24 pt-2 sm:px-8 lg:pb-16", className)}>{children}</div>;
}

export function PageHeader({ title, description, actions, kicker }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; kicker?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
      <div className="min-w-0">
        {kicker && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-bg-raised/80 py-1 pl-1.5 pr-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted ring-1 ring-inset ring-line">
            <span className="h-4 w-4 rounded-full bg-accent shadow-[0_0_0_4px_rgb(var(--accent)/.2)]" />
            {kicker}
          </div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-hero text-[40px] font-semibold leading-[0.95] tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        {description && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 mt-12 flex items-center gap-3 first:mt-0">
      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
      <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink">{children}</h2>
      <span className="h-px flex-1 bg-line" />
      {action}
    </div>
  );
}

/** Staggered reveal container + item */
export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } };
export const rise: Variants = { hidden: { opacity: 0, y: 14, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.2, 0.7, 0.2, 1] } } };

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={rise} className={className}>
      {children}
    </motion.div>
  );
}
