import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { NAV_MAIN, NAV_SECONDARY } from "./nav";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";
import { useContent } from "@/services/content";
import { fmtClock } from "@/lib/format";
import { useT } from "@/i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

export function Sidebar() {
  const active = useAppStore((s) => s.active);
  const setRunning = useAppStore((s) => s.setRunning);
  const { programs } = useContent();
  const nav = useNavigate();
  const t = useT();
  const program = active ? programs.find((p) => p.id === active.programId) : null;

  return (
    <aside className="relative z-10 hidden h-full w-[232px] shrink-0 flex-col border-r border-line bg-bg-raised/70 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-3 px-5">
        <Logo />
        <div className="leading-none">
          <div className="font-display text-[16px] font-bold tracking-[0.22em]">STRATIFY</div>
          <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-ink-faint">{t("nav.tagline")}</div>
        </div>
      </div>
      <div className="mx-5 h-px bg-gradient-to-r from-accent/60 via-line to-transparent" />

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-4">
        {NAV_MAIN.map(({ to, key, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="group relative block">
            {({ isActive }) => (
              <div className={cn("relative flex h-10 items-center gap-3 px-3 font-display text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors", isActive ? "text-white" : "text-ink-muted hover:text-ink")}>
                {isActive && (
                  <motion.div layoutId="nav-active" className="chamfer chamfer-sm absolute inset-0 bg-gradient-to-r from-accent/25 via-accent/10 to-transparent ring-1 ring-inset ring-accent/40" transition={{ type: "spring", stiffness: 500, damping: 40 }}>
                    <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] bg-accent shadow-[0_0_12px_#ff6b1a]" />
                  </motion.div>
                )}
                <Icon size={17} className={cn("relative z-10 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-accent" : "text-ink-faint group-hover:text-ink-muted")} />
                <span className="relative z-10 truncate">{t(key)}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {active && program && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="frame frame-hot chamfer mx-3 mb-3">
          <div className="surface chamfer flex items-center gap-2 px-3 py-2.5">
            <span className="h-2 w-2 animate-flicker rounded-full bg-accent shadow-[0_0_10px_#ff6b1a]" />
            <button onClick={() => nav("/training/session")} className="min-w-0 flex-1 text-left">
              <div className="truncate text-[11px] text-ink-muted">{program.name}</div>
              <div className="font-mono text-[16px] tabular-nums text-white">{fmtClock(active.elapsed)}</div>
            </button>
            <button onClick={() => setRunning(!active.running)} className="grid h-8 w-8 place-items-center text-ink-muted hover:text-accent" aria-label="Pause">
              {active.running ? <Pause size={15} /> : <Play size={15} />}
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3 border-t border-line p-3">
        <LangSwitch />
        <div className="flex items-center justify-around">
          {NAV_SECONDARY.map(({ to, key, icon: Icon }) => (
            <NavLink key={to} to={to} title={t(key)} className={({ isActive }) => cn("grid h-9 w-9 place-items-center transition-colors", isActive ? "text-accent" : "text-ink-faint hover:text-ink")}>
              <Icon size={17} />
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}

/** Bottom navigation for narrow screens (site on phones / small windows). */
export function MobileNav() {
  const t = useT();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-bg-raised/95 backdrop-blur-xl lg:hidden">
      {NAV_MAIN.filter((n) => n.mobile).map(({ to, key, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => cn("flex flex-1 flex-col items-center gap-1 py-2.5 font-display text-[9px] font-semibold uppercase tracking-wider", isActive ? "text-accent" : "text-ink-faint")}>
          <Icon size={18} />
          <span className="max-w-full truncate px-1">{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
