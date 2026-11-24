import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trophy, User, Users } from "lucide-react";
import { Page, PageHeader, Card, Select, Field, Badge, SideBadge, SourceLine, SourceBlock, Drawer, EmptyState, Button, FavoriteButton } from "@/components/ui";
import { useContent } from "@/services/content";
import { MAP_BY_ID } from "@/data/maps";
import { ROUND_LABEL } from "@/lib/labels";
import type { RoundType } from "@/types/content";

const KIND_LABEL = { strategy: "Стратегия", utility: "Гранаты", routine: "Рутина", setup: "Расстановка" } as const;

export function PlaybookPage() {
  const { playbook, maps } = useContent();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const f = { team: params.get("team") || "all", player: params.get("player") || "all", map: params.get("map") || "all", side: params.get("side") || "all", round: params.get("round") || "all" };
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (v === "all") n.delete(k);
    else n.set(k, v);
    setParams(n, { replace: true });
  };
  const teams = useMemo(() => [...new Set(playbook.map((p) => p.team).filter(Boolean))] as string[], [playbook]);
  const players = useMemo(() => [...new Set(playbook.map((p) => p.player).filter(Boolean))] as string[], [playbook]);
  const list = playbook.filter(
    (p) =>
      (f.team === "all" || p.team === f.team) &&
      (f.player === "all" || p.player === f.player) &&
      (f.map === "all" || p.map === f.map) &&
      (f.side === "all" || p.side === f.side || p.side === "both") &&
      (f.round === "all" || p.roundType === f.round || p.roundType === "any"),
  );
  const opened = playbook.find((p) => p.id === params.get("id"));

  return (
    <Page>
      <PageHeader
        title="Pro Playbook"
        actions={<Button onClick={() => nav("/library?add=playbook")}><Plus size={15} /> Добавить из матча</Button>}
      />

      <Card className="mb-5 grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
        <Field label="Команда">
          <Select value={f.team} onChange={(e) => set("team", e.target.value)} disabled={!teams.length}>
            <option value="all">{teams.length ? "Все команды" : "Нет записей"}</option>
            {teams.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Игрок">
          <Select value={f.player} onChange={(e) => set("player", e.target.value)}>
            <option value="all">Все игроки</option>
            {players.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Карта">
          <Select value={f.map} onChange={(e) => set("map", e.target.value)}>
            <option value="all">Все карты</option>
            {maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </Select>
        </Field>
        <Field label="Сторона">
          <Select value={f.side} onChange={(e) => set("side", e.target.value)}><option value="all">T и CT</option><option value="T">T</option><option value="CT">CT</option></Select>
        </Field>
        <Field label="Тип раунда">
          <Select value={f.round} onChange={(e) => set("round", e.target.value)}>
            <option value="all">Любой</option>
            {(Object.keys(ROUND_LABEL) as RoundType[]).filter((r) => r !== "any").map((r) => <option key={r} value={r}>{ROUND_LABEL[r]}</option>)}
          </Select>
        </Field>
      </Card>


      {list.length === 0 ? (
        <EmptyState icon={<Trophy size={20} />} title="Ничего не найдено" text="Измените фильтры или добавьте запись с источником." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <Card key={p.id} interactive onClick={() => set("id", p.id)} className="group flex flex-col p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="accent">{KIND_LABEL[p.kind]}</Badge>
                  {p.map && <span className="text-[11px] uppercase tracking-[0.1em] text-ink-faint">{MAP_BY_ID[p.map]?.name}</span>}
                </div>
                <FavoriteButton refItem={{ kind: "playbook", id: p.id }} className="-mr-2 -mt-1.5 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="mt-2 flex items-center gap-2 text-[13px] text-ink-muted">
                {p.player && <span className="flex items-center gap-1"><User size={12} />{p.player}</span>}
                {p.team && <span className="flex items-center gap-1"><Users size={12} />{p.team}</span>}
              </div>
              <h3 className="mt-1 text-[15px] font-semibold">{p.title}</h3>
              <p className="mt-1 line-clamp-3 text-[13px] text-ink-muted">{p.summary}</p>
              <div className="mt-auto flex items-center justify-between border-t border-line pt-3 [margin-top:14px]">
                <SourceLine meta={p.meta} />
                {p.side && <SideBadge side={p.side} />}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer open={!!opened} onClose={() => set("id", "all")} title="Pro Playbook">
        {opened && (
          <div className="space-y-5 p-5">
            <div>
              <Badge tone="accent">{KIND_LABEL[opened.kind]}</Badge>
              <h2 className="mt-2 text-xl font-semibold">{opened.title}</h2>
              <p className="mt-1 text-[13px] text-ink-muted">{[opened.player, opened.team, opened.map && MAP_BY_ID[opened.map]?.name, opened.event].filter(Boolean).join(" · ")}</p>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">{opened.summary}</p>
            <ul className="space-y-2">
              {opened.details.map((d, i) => (
                <li key={i} className="flex gap-3 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{d}</li>
              ))}
            </ul>
            <SourceBlock meta={opened.meta} />
          </div>
        )}
      </Drawer>
    </Page>
  );
}
