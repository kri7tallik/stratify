import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, Pause, Play, Search, X } from "lucide-react";
import { NAV_MAIN, NAV_SECONDARY } from "./nav";
import { cn } from "@/lib/cn";
import { useAppStore, type ThemePref } from "@/store/useAppStore";
import { useContent } from "@/services/content";
import { fmtClock } from "@/lib/format";
import { switchTheme } from "@/lib/theme";
import { useT } from "@/i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo, Wordmark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const THEME_LABEL = { light: "theme.light", dark: "theme.dark", system: "theme.system" } as const;

const pill = "flex h-14 items-center gap-1.5 rounded-full glass px-2 ring-1 ring-inset ring-line shadow-float";

/** Floating "island" header: logo · main nav (lg+) · session timer · search · theme · more. */
export function Header({ onSearch }: { onSearch(): void }) {
  const t = useT();
  const { remote } = useContent();
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      <div className="mx-auto w-full max-w-[1440px] px-3 pt-3 sm:px-6">
        <div className={cn(pill, "pointer-events-auto")}>
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-ink/[0.04]" aria-label="STRATIFY">
            <Logo size={34} />
            <Wordmark className="hidden sm:inline" />
          </NavLink>

          <nav className="mx-auto hidden items-center gap-0.5 lg:flex">
            {NAV_MAIN.map(({ to, key, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} title={t(key)} className="relative">
                {({ isActive }) => (
                  <span className={cn("relative flex h-10 items-center gap-2 rounded-full px-3 text-[13px] font-medium transition-colors xl:px-3.5", isActive ? "text-bg" : "text-ink-muted hover:bg-ink/[0.05] hover:text-ink")}>
                    {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 480, damping: 38 }} />}
                    <Icon size={16} className="relative shrink-0" />
                    <span className="relative hidden xl:inline">{t(key)}</span>
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            {remote.error && <span className="hidden h-2 w-2 rounded-full bg-bad sm:block" title={`${t("c.supabaseDown")}: ${remote.error}`} />}
            <SessionPill />
            <button
              type="button"
              onClick={onSearch}
              className="flex h-9 items-center gap-2 rounded-full px-2.5 text-[13px] text-ink-muted ring-1 ring-inset ring-line transition hover:bg-ink/[0.05] hover:text-ink 2xl:pr-2"
              aria-label={t("c.search")}
              title={`${t("c.search")} · Ctrl K`}
            >
              <Search size={16} />
              <span className="hidden 2xl:inline">{t("c.search")}</span>
              <kbd className="hidden items-center gap-0.5 rounded-full bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-ink-faint 2xl:flex">
                <Command size={10} />K
              </kbd>
            </button>
            <ThemeToggle />
            <MoreMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Running training session, compact. */
function SessionPill() {
  const active = useAppStore((s) => s.active);
  const setRunning = useAppStore((s) => s.setRunning);
  const { programs } = useContent();
  const nav = useNavigate();
  const program = active ? programs.find((p) => p.id === active.programId) : null;
  if (!active || !program) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex h-9 items-center gap-1 rounded-full bg-accent pl-3 pr-1 text-on-accent">
      <button onClick={() => nav("/training/session")} className="flex items-center gap-2 font-mono text-[13px] tabular-nums" title={program.name}>
        <span className={cn("h-1.5 w-1.5 rounded-full bg-on-accent", active.running && "animate-flicker")} />
        {fmtClock(active.elapsed)}
      </button>
      <button onClick={() => setRunning(!active.running)} className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-black/10" aria-label={active.running ? "Pause" : "Play"}>
        {active.running ? <Pause size={13} /> : <Play size={13} />}
      </button>
    </motion.div>
  );
}

/** Popover with secondary pages, language and theme preference. On phones it also lists every page. */
function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const loc = useLocation();
  const t = useT();
  const theme = useAppStore((s) => s.theme);

  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", down);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  const themes: ThemePref[] = ["light", "dark", "system"];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t("nav.menu")}
        className={cn("grid h-9 w-9 place-items-center rounded-full ring-1 ring-inset ring-line transition", open ? "bg-ink text-bg" : "text-ink-muted hover:bg-ink/[0.05] hover:text-ink")}
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 520, damping: 34 }}
            className="absolute right-0 top-12 w-[min(320px,calc(100vw-24px))] bg-bg-raised/95 backdrop-blur-xl origin-top-right rounded-3xl p-2 shadow-float ring-1 ring-inset ring-line"
          >
            <div className="grid grid-cols-2 gap-1 lg:hidden">
              {NAV_MAIN.map(({ to, key, icon: Icon, end }) => (
                <MenuLink key={to} to={to} end={end} icon={Icon} label={t(key)} />
              ))}
            </div>
            <div className="my-1 h-px bg-line lg:hidden" />
            <div className="grid gap-1">
              {NAV_SECONDARY.map(({ to, key, icon: Icon }) => (
                <MenuLink key={to} to={to} icon={Icon} label={t(key)} />
              ))}
            </div>
            <div className="my-1 h-px bg-line" />
            <div className="space-y-2 p-2">
              <LangSwitch className="w-full" />
              <div className="flex rounded-full bg-sunken p-1 ring-1 ring-inset ring-line" role="radiogroup" aria-label={t("theme.title")}>
                {themes.map((th) => (
                  <button
                    key={th}
                    role="radio"
                    aria-checked={theme === th}
                    onClick={() => switchTheme(th)}
                    className={cn("h-7 flex-1 rounded-full text-[12px] font-medium transition-colors", theme === th ? "bg-ink text-bg" : "text-ink-faint hover:text-ink")}
                  >
                    {t(THEME_LABEL[th])}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ to, end, icon: Icon, label }: { to: string; end?: boolean; icon: (typeof NAV_MAIN)[number]["icon"]; label: string }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => cn("flex h-10 items-center gap-2.5 rounded-2xl px-3 text-[13px] font-medium transition-colors", isActive ? "bg-accent text-on-accent" : "text-ink-muted hover:bg-ink/[0.05] hover:text-ink")}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

/** Floating bottom dock for phones / narrow windows. */
export function MobileDock() {
  const t = useT();
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="glass pointer-events-auto mx-auto flex max-w-md items-center justify-between rounded-full p-1.5 shadow-float ring-1 ring-inset ring-line">
        {NAV_MAIN.filter((n) => n.mobile).map(({ to, key, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="relative flex-1" aria-label={t(key)}>
            {({ isActive }) => (
              <span className={cn("relative flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors", isActive ? "text-on-accent" : "text-ink-faint")}>
                {isActive && <motion.span layoutId="dock-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 480, damping: 36 }} />}
                <Icon size={18} className="relative" />
                <span className="relative max-w-full truncate px-1">{t(key)}</span>
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
