import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CsMap, Exercise, Grenade, MapId, PlaybookEntry, Source, Tactic, TrainingProgram, WorkshopMap } from "@/types/content";
import { MAPS } from "@/data/maps";
import { GRENADES } from "@/data/grenades";
import { TACTICS } from "@/data/tactics";
import { EXERCISES, PROGRAMS, WORKSHOP_MAPS } from "@/data/training";
import { PLAYBOOK } from "@/data/playbook";
import { SOURCES } from "@/data/sources";
import { SOURCE_DESC } from "@/i18n/content/sources";
import { useAppStore } from "@/store/useAppStore";
import { getSupabase } from "@/lib/supabase";
import { useLang } from "@/i18n";
import { localizer } from "@/i18n/content";

/**
 * Content repository.
 *
 * Merges three layers (later layers override earlier ones by id):
 *   1. Built-in seed (src/data/*)       — shipped with the app
 *   2. Remote catalog (Supabase)        — optional, `content_items` table
 *   3. User content (local store)       — added via Library
 */
export interface ContentState {
  maps: CsMap[];
  grenades: Grenade[];
  tactics: Tactic[];
  exercises: Exercise[];
  programs: TrainingProgram[];
  playbook: PlaybookEntry[];
  sources: Source[];
  workshopMaps: WorkshopMap[];
  remote: { enabled: boolean; loading: boolean; error: string | null; count: number; lastSync: string | null };
  refresh(): Promise<void>;
  sourceById(id: string): Source | undefined;
  mapById(id: MapId): CsMap | undefined;
}

type RemoteKind = "grenade" | "tactic" | "exercise" | "program" | "playbook" | "source";
interface RemoteRow {
  id: string;
  kind: RemoteKind;
  data: Record<string, unknown>;
}

const Ctx = createContext<ContentState | null>(null);

function mergeById<T extends { id: string }>(...layers: T[][]): T[] {
  const map = new Map<string, T>();
  for (const layer of layers) for (const item of layer) map.set(item.id, item);
  return [...map.values()];
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const user = useAppStore((s) => s.user);
  const lang = useLang();
  const [remoteRows, setRemoteRows] = useState<RemoteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const enabled = !!getSupabase();

  const refresh = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setRemoteRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await sb.from("content_items").select("id, kind, data").limit(5000);
      if (err) throw err;
      setRemoteRows((data ?? []) as RemoteRow[]);
      setLastSync(new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<ContentState>(() => {
    const pick = <T,>(kind: RemoteKind) => remoteRows.filter((r) => r.kind === kind).map((r) => ({ ...(r.data as object), id: r.id }) as T);

    const L = localizer(lang);
    const timingsFor = (m: CsMap) => [...m.timings, ...(user.timings[m.id] ?? [])];
    const maps = MAPS.map((m) => L.map({ ...m, timings: timingsFor(m) }));
    const sources = mergeById(SOURCES.map((x) => ({ ...x, description: SOURCE_DESC[x.id]?.[lang] ?? x.description })), pick<Source>("source"), user.sources);

    return {
      maps,
      grenades: mergeById(GRENADES, pick<Grenade>("grenade"), user.grenades).map(L.grenade),
      tactics: mergeById(TACTICS, pick<Tactic>("tactic"), user.tactics).map(L.tactic),
      exercises: mergeById(EXERCISES, pick<Exercise>("exercise")).map(L.exercise),
      programs: mergeById(PROGRAMS, pick<TrainingProgram>("program")).map(L.program),
      playbook: mergeById(PLAYBOOK, pick<PlaybookEntry>("playbook"), user.playbook).map(L.playbook),
      sources,
      workshopMaps: WORKSHOP_MAPS.map(L.workshop),
      remote: { enabled, loading, error, count: remoteRows.length, lastSync },
      refresh,
      sourceById: (id) => sources.find((s) => s.id === id),
      mapById: (id) => maps.find((m) => m.id === id),
    };
  }, [remoteRows, user, enabled, loading, error, lastSync, refresh, lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent(): ContentState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useContent must be used inside <ContentProvider>");
  return v;
}

/** Set of ids that came from the user (for delete buttons / badges) */
export function useUserIds() {
  const user = useAppStore((s) => s.user);
  return useMemo(
    () => new Set([...user.grenades, ...user.tactics, ...user.playbook, ...user.sources].map((x) => x.id)),
    [user],
  );
}
