import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

export function ProgressBar({ value, className, tone = "accent" }: { value: number; className?: string; tone?: "accent" | "ok" | "ct" | "t" }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const colors = { accent: "from-accent to-accent-amber", ok: "from-ok to-ok", ct: "from-ctside to-ctside", t: "from-tside to-tside" };
  return (
    <div className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.08]", className)}>
      <motion.div className={cn("h-full rounded-full bg-gradient-to-r", colors[tone])} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }} />
    </div>
  );
}

export function ProgressRing({ value, size = 88, stroke = 6, label, sub }: { value: number; size?: number; stroke?: number; label?: React.ReactNode; sub?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-ink/10" strokeWidth={stroke} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke="url(#ringGrad)" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - v) }} transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }} />
        <defs>
          <linearGradient id="ringGrad" x1="0" x2="1">
            <stop offset="0%" style={{ stopColor: "rgb(var(--accent))" }} />
            <stop offset="100%" style={{ stopColor: "rgb(var(--accent-2))" }} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="font-hero text-lg font-semibold tabular-nums">{label}</div>
        {sub && <div className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">{sub}</div>}
      </div>
    </div>
  );
}

/** Animated number that counts up to `value`. */
export function CountUp({ value, className, format }: { value: number; className?: string; format?(n: number): string }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => (format ? format(v) : String(Math.round(v))));
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.1, ease: [0.2, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [value, mv]);
  return <motion.span className={className}>{text}</motion.span>;
}
