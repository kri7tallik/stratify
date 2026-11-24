import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function ProgressBar({ value, className, tone = "accent" }: { value: number; className?: string; tone?: "accent" | "ok" | "ct" | "t" }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const colors = { accent: "bg-accent", ok: "bg-ok", ct: "bg-ctside", t: "bg-tside" };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <motion.div className={cn("h-full rounded-full", colors[tone])} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }} />
    </div>
  );
}

export function ProgressRing({ value, size = 88, stroke = 7, label, sub }: { value: number; size?: number; stroke?: number; label?: React.ReactNode; sub?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#ff6a1a"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-semibold tabular-nums">{label}</div>
        {sub && <div className="text-[10px] uppercase tracking-wider text-ink-faint">{sub}</div>}
      </div>
    </div>
  );
}
