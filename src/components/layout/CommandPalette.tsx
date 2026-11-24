import { AnimatePresence, motion } from "framer-motion";
import { Bomb, Dumbbell, Map as MapIcon, Search, Swords, Trophy, ListChecks, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/services/content";
import { MAP_BY_ID } from "@/data/maps";
import { GRENADE_LABEL, TACTIC_LABEL, EXERCISE_LABEL } from "@/lib/labels";
import { cn } from "@/lib/cn";

interface Hit {
  key: string;
  group: string;
  icon: React.ElementType;
  title: string;
  sub: string;
  to: string;
  hay: string;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose(): void }) {
  const { maps, grenades, tactics, exercises, programs, playbook } = useContent();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo<Hit[]>(() => {
    const out: Hit[] = [];
    maps.forEach((m) => out.push({ key: `map:${m.id}`, group: "Карты", icon: MapIcon, title: m.name, sub: m.codename, to: `/maps/${m.id}`, hay: `${m.name} ${m.codename} ${m.callouts.map((c) => c.name).join(" ")}` }));
    grenades.forEach((g) =>
      out.push({ key: `g:${g.id}`, group: "Гранаты", icon: Bomb, title: g.title, sub: `${MAP_BY_ID[g.map]?.name} · ${GRENADE_LABEL[g.type]} · ${g.side}`, to: `/grenades?id=${g.id}`, hay: `${g.title} ${g.map} ${g.type} ${g.purpose} ${g.tags.join(" ")}` }),
    );
    tactics.forEach((t) =>
      out.push({ key: `t:${t.id}`, group: "Тактики", icon: Swords, title: t.title, sub: `${MAP_BY_ID[t.map]?.name} · ${TACTIC_LABEL[t.category]} · ${t.side}`, to: `/tactics/${t.id}`, hay: `${t.title} ${t.map} ${t.category} ${t.summary}` }),
    );
    programs.forEach((p) => out.push({ key: `p:${p.id}`, group: "Программы", icon: ListChecks, title: `${p.name} · ${p.minutes} мин`, sub: p.focus, to: `/training?program=${p.id}`, hay: `${p.name} ${p.focus} ${p.minutes}` }));
    exercises.forEach((e) => out.push({ key: `e:${e.id}`, group: "Упражнения", icon: Dumbbell, title: e.name, sub: EXERCISE_LABEL[e.category], to: `/training?exercise=${e.id}`, hay: `${e.name} ${e.category} ${e.goal}` }));
    playbook.forEach((p) => out.push({ key: `pb:${p.id}`, group: "Pro Playbook", icon: Trophy, title: p.title, sub: [p.player, p.team].filter(Boolean).join(" · "), to: `/playbook?id=${p.id}`, hay: `${p.title} ${p.player ?? ""} ${p.team ?? ""} ${p.summary}` }));
    return out;
  }, [maps, grenades, tactics, exercises, programs, playbook]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((h) => h.group === "Карты" || h.group === "Программы").slice(0, 14);
    return index.filter((h) => terms.every((t) => h.hay.toLowerCase().includes(t))).slice(0, 40);
  }, [q, index]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);
  useEffect(() => setSel(0), [q]);

  const go = (h?: Hit) => {
    if (!h) return;
    nav(h.to);
    onClose();
  };

  const groups = results.reduce<Record<string, Hit[]>>((acc, h) => ((acc[h.group] ??= []).push(h), acc), {});
  let i = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex justify-center bg-black/60 pt-[12vh] backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ y: -8, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 36 }}
            className="h-fit w-full max-w-[640px] overflow-hidden rounded-2xl border border-line-strong bg-bg-raised shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} className="text-ink-faint" />
              <input
                ref={inputRef}
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") (e.preventDefault(), setSel((s) => Math.min(s + 1, results.length - 1)));
                  if (e.key === "ArrowUp") (e.preventDefault(), setSel((s) => Math.max(s - 1, 0)));
                  if (e.key === "Enter") go(results[sel]);
                  if (e.key === "Escape") onClose();
                }}
                placeholder="Mirage window, execute, spray, s1mple…"
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">ESC</kbd>
            </div>
            <div className="max-h-[56vh] overflow-y-auto p-2">
              {results.length === 0 && <div className="px-3 py-10 text-center text-sm text-ink-faint">Ничего не найдено по запросу «{q}»</div>}
              {Object.entries(groups).map(([g, hits]) => (
                <div key={g} className="mb-1">
                  <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{g}</div>
                  {hits.map((h) => {
                    i++;
                    const idx = i;
                    const Icon = h.icon;
                    return (
                      <button
                        key={h.key}
                        onMouseEnter={() => setSel(idx)}
                        onClick={() => go(h)}
                        className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left", sel === idx ? "bg-bg-hover" : "")}
                      >
                        <Icon size={15} className={sel === idx ? "text-accent" : "text-ink-faint"} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] text-ink">{h.title}</div>
                          <div className="truncate text-[11px] text-ink-faint">{h.sub}</div>
                        </div>
                        {sel === idx && <CornerDownLeft size={13} className="text-ink-faint" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
