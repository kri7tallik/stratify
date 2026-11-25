import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Page, PageHeader, EmptyState, SectionTitle, Card, Badge, FavoriteButton } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { GrenadeCard } from "@/features/grenades/GrenadeCard";
import { TacticCard } from "@/features/tactics/TacticCard";
import { useLabels } from "@/lib/labels";
import { useT } from "@/i18n";

export function FavoritesPage() {
  const favs = useAppStore((s) => s.favorites);
  const { grenades, tactics, exercises, playbook } = useContent();
  const nav = useNavigate();
  const tr = useT();
  const L = useLabels();
  const ids = (kind: string) => favs.filter((f) => f.startsWith(kind + ":")).map((f) => f.slice(kind.length + 1));
  const g = ids("grenade").map((id) => grenades.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => !!x);
  const t = ids("tactic").map((id) => tactics.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => !!x);
  const e = ids("exercise").map((id) => exercises.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => !!x);
  const p = ids("playbook").map((id) => playbook.find((x) => x.id === id)).filter((x): x is NonNullable<typeof x> => !!x);
  const empty = !g.length && !t.length && !e.length && !p.length;

  return (
    <Page>
      <PageHeader title={tr("fav.title")} />
      {empty ? (
        <EmptyState icon={<Heart size={20} />} title={tr("fav.empty")} text={tr("fav.emptyText")} />
      ) : (
        <>
          {g.length > 0 && (<><SectionTitle>{tr("fav.nades")} · {g.length}</SectionTitle><div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">{g.map((x) => <GrenadeCard key={x.id} g={x} onOpen={() => nav(`/grenades?id=${x.id}`)} />)}</div></>)}
          {t.length > 0 && (<><SectionTitle>{tr("fav.tactics")} · {t.length}</SectionTitle><div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{t.map((x) => <TacticCard key={x.id} t={x} onOpen={() => nav(`/tactics/${x.id}`)} />)}</div></>)}
          {e.length > 0 && (
            <><SectionTitle>{tr("fav.exercises")} · {e.length}</SectionTitle>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">{e.map((x) => (
                <Card key={x.id} interactive inner="flex items-center gap-3 p-4" onClick={() => nav(`/training?exercise=${x.id}`)}>
                  <div className="flex-1"><Badge>{L.exercise[x.category]}</Badge><div className="mt-1.5 font-display text-[14px] font-semibold">{x.name}</div></div>
                  <FavoriteButton refItem={{ kind: "exercise", id: x.id }} />
                </Card>))}
              </div></>
          )}
          {p.length > 0 && (
            <><SectionTitle>Pro Playbook · {p.length}</SectionTitle>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">{p.map((x) => (
                <Card key={x.id} interactive inner="flex items-center gap-3 p-4" onClick={() => nav(`/playbook?id=${x.id}`)}>
                  <div className="flex-1"><div className="text-[12px] text-ink-faint">{x.player ?? x.team}</div><div className="font-display text-[14px] font-semibold">{x.title}</div></div>
                  <FavoriteButton refItem={{ kind: "playbook", id: x.id }} />
                </Card>))}
              </div></>
          )}
        </>
      )}
    </Page>
  );
}
