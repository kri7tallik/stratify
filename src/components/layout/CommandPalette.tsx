import { AnimatePresence, motion } from "framer-motion";
import { Bomb, Dumbbell, Map as MapIcon, Search, Swords, Trophy, ListChecks, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/services/content";
import { MAP_BY_ID } from "@/data/maps";
import { useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
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
  const L = useLabels();
  const t = useT();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo<Hit[]>(() => {
    const out: Hit[] = [];
    maps.forEach((m) => out.push({ key: `map:${m.id}`, group: t("cmd.maps"), icon: MapIcon, title: m.name, sub: m.codename, to: `/maps/${m.id}`, hay: `${m.name} ${m.codename} ${m.callouts.map((c) => c.name).join(" ")}` }));
    grenades.forEach((g) =>
      out.push({ key: `g:${g.id}`, group: t("cmd.nades"), icon: Bomb, title: g.title, sub: `${MAP_BY_ID[g.map]?.name} · ${L.nade[g.type]} · ${g.side}`, to: `/grenades?id=${g.id}`, hay: `${g.title} ${g.map} ${g.type} ${g.purpose} ${g.tags.join(" ")}` }),
    );
    tactics.forEach((x) =>
      out.push({ key: `t:${x.id}`, group: t("cmd.tactics"), icon: Swords, title: x.title, sub: `${MAP_BY_ID[x.map]?.name} · ${L.tactic[x.category]} · ${x.side}`, to: `/tactics/${x.id}`, hay: `${x.title} ${x.map} ${x.category} ${x.summary}` }),
    );
    programs.forEach((p) => out.push({ key: `p:${p.id}`, group: t("cmd.programs"), icon: ListChecks, title: `${p.name} · ${p.minutes} ${t("c.min")}`, sub: p.focus, to: `/training?program=${p.id}`, hay: `${p.name} ${p.focus} ${p.minutes}` }));
    exercises.forEach((e) => out.push({ key: `e:${e.id}`, group: t("cmd.exercises"), icon: Dumbbell, title: e.name, sub: L.exercise[e.category], to: `/training?exercise=${e.id}`, hay: `${e.name} ${e.category} ${e.goal}` }));
    playbook.forEach((p) => out.push({ key: `pb:${p.id}`, group: t("cmd.playbook"), icon: Trophy, title: p.title, sub: [p.player, p.team].filter(Boolean).join(" · "), to: `/playbook?id=${p.id}`, hay: `${p.title} ${p.player ?? ""} ${p.team ?? ""} ${p.summary}` }));
    return out;
  }, [maps, grenades, tactics, exercises, programs, playbook, L, t]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((h) => h.group === t("cmd.maps") || h.group === t("cmd.programs")).slice(0, 14);
    return index.filter((h) => terms.every((t) => h.hay.toLowerCase().includes(t))).slice(0, 40);
  }, [q, index, t]);

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
        <motion.div className="fixed inset-0 z-[60] flex justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ y: -8, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 36 }}
            className="frame frame-hot chamfer chamfer-lg h-fit w-full max-w-[640px] shadow-2xl"
          >
            <div className="surface chamfer chamfer-lg">
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
                placeholder={t("cmd.placeholder")}
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">ESC</kbd>
            </div>
            <div className="max-h-[56vh] overflow-y-auto p-2">
              {results.length === 0 && <div className="px-3 py-10 text-center text-sm text-ink-faint">{t("cmd.nothing", { q })}</div>}
              {Object.entries(groups).map(([g, hits]) => (
                <div key={g} className="mb-1">
                  <div className="tag-label px-3 pb-1 pt-2 !text-[10px]">{g}</div>
                  {hits.map((h) => {
                    i++;
                    const idx = i;
                    const Icon = h.icon;
                    return (
                      <button
                        key={h.key}
                        onMouseEnter={() => setSel(idx)}
                        onClick={() => go(h)}
                        className={cn("chamfer chamfer-sm flex w-full items-center gap-3 px-3 py-2 text-left transition-colors", sel === idx ? "bg-accent/15 ring-1 ring-inset ring-accent/40" : "")}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
