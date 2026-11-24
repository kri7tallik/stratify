import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { NAV_MAIN, NAV_SECONDARY } from "./nav";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";
import { useContent } from "@/services/content";
import { fmtClock } from "@/lib/format";

export function Sidebar() {
  const active = useAppStore((s) => s.active);
  const setRunning = useAppStore((s) => s.setRunning);
  const { programs } = useContent();
  const nav = useNavigate();
  const program = active ? programs.find((p) => p.id === active.programId) : null;

  return (
    <aside className="flex h-full w-[208px] shrink-0 flex-col border-r border-line bg-bg-raised/40">
      <div className="flex h-14 items-center gap-2.5 px-5">
        <svg viewBox="0 0 64 64" className="h-5 w-5"><path d="M18 40 L32 16 L46 40 Z" fill="none" stroke="#ff6a1a" strokeWidth="6" strokeLinejoin="round" /><path d="M24 50 H40" stroke="#ff6a1a" strokeWidth="6" strokeLinecap="round" /></svg>
        <span className="text-[13px] font-bold tracking-[0.2em]">STRATIFY</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pt-2">
        {NAV_MAIN.map(({ to, label, icon: Icon, ...rest }) => (
          <NavLink key={to} to={to} end={"end" in rest ? rest.end : undefined} className="group relative block">
            {({ isActive }) => (
              <div className={cn("relative flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors", isActive ? "text-ink" : "text-ink-muted hover:text-ink")}>
                {isActive && <motion.div layoutId="nav-active" className="absolute inset-0 rounded-lg bg-bg-hover" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                <Icon size={16} className={cn("relative z-10 shrink-0", isActive ? "text-accent" : "text-ink-faint group-hover:text-ink-muted")} />
                <span className="relative z-10 truncate">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {active && program && (
        <div className="mx-3 mb-2 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/[0.06] px-3 py-2">
          <button onClick={() => nav("/training/session")} className="min-w-0 flex-1 text-left">
            <div className="truncate text-[11px] text-ink-muted">{program.name}</div>
            <div className="font-mono text-[15px] tabular-nums">{fmtClock(active.elapsed)}</div>
          </button>
          <button onClick={() => setRunning(!active.running)} className="grid h-7 w-7 place-items-center rounded-md text-ink-muted hover:bg-white/5 hover:text-ink" aria-label="Пауза">
            {active.running ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      )}

      <div className="flex items-center justify-around border-t border-line px-3 py-2">
        {NAV_SECONDARY.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} title={label} className={({ isActive }) => cn("grid h-8 w-8 place-items-center rounded-lg transition-colors", isActive ? "bg-bg-hover text-accent" : "text-ink-faint hover:text-ink")}>
            <Icon size={16} />
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
