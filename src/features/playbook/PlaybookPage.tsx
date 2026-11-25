import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trophy, User, Users } from "lucide-react";
import { Page, PageHeader, Card, Select, Field, Badge, SideBadge, SourceLine, SourceBlock, Drawer, EmptyState, Button, FavoriteButton } from "@/components/ui";
import { useContent } from "@/services/content";
import { MAP_BY_ID } from "@/data/maps";
import { ROUND_TYPES, useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { Stagger, Rise } from "@/components/ui";
import type { RoundType } from "@/types/content";


export function PlaybookPage() {
  const { playbook, maps } = useContent();
  const nav = useNavigate();
  const t = useT();
  const L = useLabels();
  const kind = (k: string) => t(`pb.kind.${k}` as "pb.kind.strategy");
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
        kicker="Pro scene"
        title={t("pb.title")}
        actions={<Button onClick={() => nav("/library?add=playbook")}><Plus size={15} /> {t("pb.add")}</Button>}
      />

      <Card className="mb-5" inner="grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
        <Field label={t("pb.team")}>
          <Select value={f.team} onChange={(e) => set("team", e.target.value)} disabled={!teams.length}>
            <option value="all">{teams.length ? t("pb.allTeams") : t("pb.noRecords")}</option>
            {teams.map((x) => <option key={x}>{x}</option>)}
          </Select>
        </Field>
        <Field label={t("pb.player")}>
          <Select value={f.player} onChange={(e) => set("player", e.target.value)}>
            <option value="all">{t("pb.allPlayers")}</option>
            {players.map((x) => <option key={x}>{x}</option>)}
          </Select>
        </Field>
        <Field label={t("pb.map")}>
          <Select value={f.map} onChange={(e) => set("map", e.target.value)}>
            <option value="all">{t("c.allMaps")}</option>
            {maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </Select>
        </Field>
        <Field label={t("pb.side")}>
          <Select value={f.side} onChange={(e) => set("side", e.target.value)}><option value="all">{t("c.bothSides")}</option><option value="T">T</option><option value="CT">CT</option></Select>
        </Field>
        <Field label={t("pb.round")}>
          <Select value={f.round} onChange={(e) => set("round", e.target.value)}>
            <option value="all">{L.round.any}</option>
            {(ROUND_TYPES as readonly RoundType[]).filter((r) => r !== "any").map((r) => <option key={r} value={r}>{L.round[r]}</option>)}
          </Select>
        </Field>
      </Card>


      {list.length === 0 ? (
        <EmptyState icon={<Trophy size={20} />} title={t("c.nothingFound")} text={t("pb.emptyText")} />
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <Rise key={p.id}>
            <Card interactive onClick={() => set("id", p.id)} className="h-full" inner="flex flex-col p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="accent">{kind(p.kind)}</Badge>
                  {p.map && <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{MAP_BY_ID[p.map]?.name}</span>}
                </div>
                <FavoriteButton refItem={{ kind: "playbook", id: p.id }} className="-mr-2 -mt-1.5 opacity-60 transition group-hover/card:opacity-100" />
              </div>
              <div className="mt-2 flex items-center gap-3 font-display text-[12px] font-semibold uppercase tracking-wider text-accent-amber">
                {p.player && <span className="flex items-center gap-1"><User size={12} />{p.player}</span>}
                {p.team && <span className="flex items-center gap-1"><Users size={12} />{p.team}</span>}
              </div>
              <h3 className="mt-1 font-display text-[16px] font-semibold leading-snug">{p.title}</h3>
              <p className="mt-1 line-clamp-3 text-[13px] text-ink-muted">{p.summary}</p>
              <div className="mt-auto flex items-center justify-between border-t border-line pt-3 [margin-top:14px]">
                <SourceLine meta={p.meta} />
                {p.side && <SideBadge side={p.side} />}
              </div>
            </Card>
            </Rise>
          ))}
        </Stagger>
      )}

      <Drawer open={!!opened} onClose={() => set("id", "all")} title={t("pb.title")}>
        {opened && (
          <div className="space-y-5 p-5">
            <div>
              <Badge tone="accent">{kind(opened.kind)}</Badge>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight">{opened.title}</h2>
              <p className="mt-1 text-[13px] text-ink-muted">{[opened.player, opened.team, opened.map && MAP_BY_ID[opened.map]?.name, opened.event].filter(Boolean).join(" · ")}</p>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">{opened.summary}</p>
            <ul className="space-y-2">
              {opened.details.map((d, i) => (
                <li key={i} className="flex gap-3 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />{d}</li>
              ))}
            </ul>
            <SourceBlock meta={opened.meta} />
          </div>
        )}
      </Drawer>
    </Page>
  );
}
