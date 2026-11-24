import { Search } from "lucide-react";
import { useContent } from "@/services/content";

export function Topbar({ onSearch }: { onSearch(): void }) {
  const { remote } = useContent();
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 px-8">
      <button onClick={onSearch} className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-line bg-bg-raised px-3 text-[13px] text-ink-faint transition hover:border-line-strong hover:text-ink-muted">
        <Search size={15} />
        <span>Поиск</span>
        <span className="ml-auto font-mono text-[10px]">Ctrl K</span>
      </button>
      {remote.error && <span className="ml-auto text-[12px] text-bad" title={remote.error}>Supabase недоступен</span>}
    </header>
  );
}
