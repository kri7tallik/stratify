import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useContent } from "@/services/content";
import { useT } from "@/i18n";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { NAV_SECONDARY } from "./nav";

export function Topbar({ onSearch }: { onSearch(): void }) {
  const { remote } = useContent();
  const t = useT();
  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center gap-3 px-4 sm:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <Logo size={26} />
      </div>
      <button onClick={onSearch} className="chamfer chamfer-sm group flex h-10 w-full max-w-md items-center gap-2.5 bg-black/30 px-3.5 text-[13px] text-ink-faint ring-1 ring-inset ring-line transition hover:text-ink-muted hover:ring-accent/40">
        <Search size={15} className="transition group-hover:text-accent" />
        <span>{t("c.search")}</span>
        <span className="ml-auto hidden font-mono text-[10px] sm:inline">Ctrl K</span>
      </button>
      {remote.error && <span className="text-[12px] text-bad" title={remote.error}>{t("c.supabaseDown")}</span>}
      <div className="ml-auto flex items-center gap-2 lg:hidden">
        <LangSwitch className="w-[120px]" />
        {NAV_SECONDARY.slice(0, 1).map(({ to, icon: Icon, key }) => (
          <NavLink key={to} to={to} title={t(key)} className="grid h-9 w-9 place-items-center text-ink-faint hover:text-accent">
            <Icon size={17} />
          </NavLink>
        ))}
      </div>
    </header>
  );
}
