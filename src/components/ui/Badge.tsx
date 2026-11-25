import { cn } from "@/lib/cn";
import type { Side, SideOrBoth, VerificationStatus, Difficulty } from "@/types/content";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { useLabels } from "@/lib/labels";

type Tone = "neutral" | "accent" | "ok" | "warn" | "bad" | "t" | "ct";
const tones: Record<Tone, string> = {
  neutral: "bg-white/[0.04] text-ink-muted ring-line-strong",
  accent: "bg-accent/10 text-accent-soft ring-accent/40",
  ok: "bg-ok/10 text-ok ring-ok/30",
  warn: "bg-warn/10 text-warn ring-warn/30",
  bad: "bg-bad/10 text-bad ring-bad/30",
  t: "bg-tside/15 text-tside ring-tside/40",
  ct: "bg-ctside/15 text-ctside ring-ctside/40",
};

export function Badge({ children, className, tone = "neutral" }: { children: React.ReactNode; className?: string; tone?: Tone }) {
  return (
    <span className={cn("chamfer chamfer-sm inline-flex h-[22px] items-center gap-1 px-2 font-display text-[10px] font-semibold uppercase leading-none tracking-wider ring-1 ring-inset", tones[tone], className)}>
      {children}
    </span>
  );
}

export function SideBadge({ side }: { side: SideOrBoth }) {
  if (side === "both") return <Badge>T / CT</Badge>;
  return <Badge tone={side === "T" ? "t" : "ct"}>{side}</Badge>;
}

export function sideColor(side: Side) {
  return side === "T" ? "text-tside" : "text-ctside";
}

export function StatusBadge({ status, compact }: { status: VerificationStatus; compact?: boolean }) {
  const L = useLabels();
  const Icon = status === "verified" ? ShieldCheck : status === "partial" ? ShieldAlert : ShieldQuestion;
  const tone = status === "verified" ? "ok" : status === "partial" ? "warn" : "bad";
  return (
    <Badge tone={tone}>
      <Icon size={12} strokeWidth={2.2} />
      {!compact && L.status[status]}
    </Badge>
  );
}

export function DifficultyBadge({ d }: { d: Difficulty }) {
  const L = useLabels();
  const bars = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <Badge>
      <span className="flex items-end gap-[2px]">
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("w-[3px]", i <= bars ? "bg-accent" : "bg-white/15")} style={{ height: 4 + i * 2 }} />
        ))}
      </span>
      {L.diff[d]}
    </Badge>
  );
}
