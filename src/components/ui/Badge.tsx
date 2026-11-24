import { cn } from "@/lib/cn";
import type { Side, SideOrBoth, VerificationStatus, Difficulty } from "@/types/content";
import { DIFF_LABEL, STATUS_LABEL } from "@/lib/labels";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

export function Badge({ children, className, tone = "neutral" }: { children: React.ReactNode; className?: string; tone?: "neutral" | "accent" | "ok" | "warn" | "bad" | "t" | "ct" }) {
  const tones = {
    neutral: "bg-white/[0.04] text-ink-muted border-line",
    accent: "bg-accent/10 text-accent border-accent/30",
    ok: "bg-ok/10 text-ok border-ok/25",
    warn: "bg-warn/10 text-warn border-warn/25",
    bad: "bg-bad/10 text-bad border-bad/25",
    t: "bg-tside/10 text-tside border-tside/25",
    ct: "bg-ctside/10 text-ctside border-ctside/25",
  } as const;
  return (
    <span className={cn("inline-flex h-[22px] items-center gap-1 rounded-md border px-2 text-[11px] font-medium leading-none", tones[tone], className)}>
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
  const Icon = status === "verified" ? ShieldCheck : status === "partial" ? ShieldAlert : ShieldQuestion;
  const tone = status === "verified" ? "ok" : status === "partial" ? "warn" : "bad";
  return (
    <Badge tone={tone}>
      <Icon size={12} strokeWidth={2.2} />
      {!compact && STATUS_LABEL[status]}
    </Badge>
  );
}

export function DifficultyBadge({ d }: { d: Difficulty }) {
  const bars = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  return (
    <Badge>
      <span className="flex items-end gap-[2px]">
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("w-[3px] rounded-sm", i <= bars ? "bg-accent" : "bg-white/15")} style={{ height: 4 + i * 2 }} />
        ))}
      </span>
      {DIFF_LABEL[d]}
    </Badge>
  );
}
