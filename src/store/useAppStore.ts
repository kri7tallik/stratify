import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ContentRef, Grenade, MapId, MapTiming, PlaybookEntry, Source, Tactic } from "@/types/content";
import { todayKey, uid } from "@/lib/format";

export interface TrainingSession {
  id: string;
  programId?: string;
  name: string;
  startedAt: string;
  finishedAt: string;
  seconds: number;
  completedExerciseIds: string[];
  totalExercises: number;
}

export interface ActiveSession {
  programId: string;
  index: number;
  completed: string[];
  elapsed: number;
  running: boolean;
  startedAt: string;
  /** seconds spent on the current exercise */
  exerciseElapsed: number;
}

export interface UserContent {
  sources: Source[];
  grenades: Grenade[];
  tactics: Tactic[];
  playbook: PlaybookEntry[];
  timings: Partial<Record<MapId, MapTiming[]>>;
}

interface State {
  playerName: string;
  lastMapId: MapId;
  learnedGrenades: Record<string, string>;
  learnedTactics: Record<string, string>;
  favorites: string[];
  sessions: TrainingSession[];
  active: ActiveSession | null;
  todayProgramId: string;
  /** Daily plan: date → exercise ids ticked off from the dashboard */
  dailyChecks: Record<string, string[]>;
  user: UserContent;
}

interface Actions {
  setPlayerName(name: string): void;
  setLastMap(id: MapId): void;
  toggleLearnedGrenade(id: string): void;
  toggleLearnedTactic(id: string): void;
  toggleFavorite(ref: ContentRef): void;
  isFavorite(ref: ContentRef): boolean;
  setTodayProgram(id: string): void;
  toggleDailyCheck(exerciseId: string): void;

  startSession(programId: string): void;
  tick(seconds: number): void;
  setRunning(running: boolean): void;
  toggleExerciseDone(exerciseId: string): void;
  goToExercise(index: number): void;
  finishSession(name: string, totalExercises: number): TrainingSession | null;
  cancelSession(): void;

  addSource(s: Source): void;
  addGrenade(g: Grenade): void;
  addTactic(t: Tactic): void;
  addPlaybook(p: PlaybookEntry): void;
  addTiming(map: MapId, t: MapTiming): void;
  removeUserItem(kind: "grenades" | "tactics" | "playbook" | "sources", id: string): void;
  removeTiming(map: MapId, id: string): void;

  importSnapshot(data: Partial<State>): void;
  resetProgress(): void;
}

export const refKey = (r: ContentRef) => `${r.kind}:${r.id}`;

const toggleRecord = (rec: Record<string, string>, id: string) => {
  const next = { ...rec };
  if (next[id]) delete next[id];
  else next[id] = new Date().toISOString();
  return next;
};

const initial: State = {
  playerName: "",
  lastMapId: "mirage",
  learnedGrenades: {},
  learnedTactics: {},
  favorites: [],
  sessions: [],
  active: null,
  todayProgramId: "pg-30",
  dailyChecks: {},
  user: { sources: [], grenades: [], tactics: [], playbook: [], timings: {} },
};

export const useAppStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      setPlayerName: (playerName) => set({ playerName }),
      setLastMap: (lastMapId) => set({ lastMapId }),
      toggleLearnedGrenade: (id) => set((s) => ({ learnedGrenades: toggleRecord(s.learnedGrenades, id) })),
      toggleLearnedTactic: (id) => set((s) => ({ learnedTactics: toggleRecord(s.learnedTactics, id) })),
      toggleFavorite: (ref) =>
        set((s) => {
          const k = refKey(ref);
          return { favorites: s.favorites.includes(k) ? s.favorites.filter((f) => f !== k) : [k, ...s.favorites] };
        }),
      isFavorite: (ref) => get().favorites.includes(refKey(ref)),
      setTodayProgram: (todayProgramId) => set({ todayProgramId }),
      toggleDailyCheck: (exerciseId) =>
        set((s) => {
          const k = todayKey();
          const cur = s.dailyChecks[k] ?? [];
          const next = cur.includes(exerciseId) ? cur.filter((e) => e !== exerciseId) : [...cur, exerciseId];
          // keep only the last 14 days
          const keys = Object.keys(s.dailyChecks).sort().slice(-13);
          const kept = Object.fromEntries(keys.map((key) => [key, s.dailyChecks[key]]));
          return { dailyChecks: { ...kept, [k]: next } };
        }),

      startSession: (programId) =>
        set({
          active: { programId, index: 0, completed: [], elapsed: 0, running: true, startedAt: new Date().toISOString(), exerciseElapsed: 0 },
        }),
      tick: (seconds) =>
        set((s) =>
          s.active && s.active.running
            ? { active: { ...s.active, elapsed: s.active.elapsed + seconds, exerciseElapsed: s.active.exerciseElapsed + seconds } }
            : {},
        ),
      setRunning: (running) => set((s) => (s.active ? { active: { ...s.active, running } } : {})),
      toggleExerciseDone: (id) =>
        set((s) => {
          if (!s.active) return {};
          const done = s.active.completed.includes(id);
          return { active: { ...s.active, completed: done ? s.active.completed.filter((c) => c !== id) : [...s.active.completed, id] } };
        }),
      goToExercise: (index) => set((s) => (s.active ? { active: { ...s.active, index, exerciseElapsed: 0 } } : {})),
      finishSession: (name, totalExercises) => {
        const a = get().active;
        if (!a) return null;
        const session: TrainingSession = {
          id: uid(),
          programId: a.programId,
          name,
          startedAt: a.startedAt,
          finishedAt: new Date().toISOString(),
          seconds: a.elapsed,
          completedExerciseIds: a.completed,
          totalExercises,
        };
        set((s) => ({ sessions: [session, ...s.sessions], active: null }));
        return session;
      },
      cancelSession: () => set({ active: null }),

      addSource: (src) => set((s) => ({ user: { ...s.user, sources: [src, ...s.user.sources] } })),
      addGrenade: (g) => set((s) => ({ user: { ...s.user, grenades: [g, ...s.user.grenades] } })),
      addTactic: (t) => set((s) => ({ user: { ...s.user, tactics: [t, ...s.user.tactics] } })),
      addPlaybook: (p) => set((s) => ({ user: { ...s.user, playbook: [p, ...s.user.playbook] } })),
      addTiming: (map, t) =>
        set((s) => ({ user: { ...s.user, timings: { ...s.user.timings, [map]: [...(s.user.timings[map] ?? []), t] } } })),
      removeUserItem: (kind, id) =>
        set((s) => ({ user: { ...s.user, [kind]: (s.user[kind] as { id: string }[]).filter((x) => x.id !== id) } })),
      removeTiming: (map, id) =>
        set((s) => ({ user: { ...s.user, timings: { ...s.user.timings, [map]: (s.user.timings[map] ?? []).filter((t) => t.id !== id) } } })),

      importSnapshot: (data) => set((s) => ({ ...s, ...data, active: null })),
      resetProgress: () => set({ learnedGrenades: {}, learnedTactics: {}, sessions: [], active: null, dailyChecks: {}, favorites: [] }),
    }),
    {
      name: "stratify.state",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        // functions are not persisted; everything else is
        const { active, ...rest } = s;
        return { ...rest, active: active ? { ...active, running: false } : null } as unknown as State & Actions;
      },
    },
  ),
);

/** Fields that are synced to the cloud backup. */
export function progressSnapshot() {
  const s = useAppStore.getState();
  return {
    playerName: s.playerName,
    lastMapId: s.lastMapId,
    learnedGrenades: s.learnedGrenades,
    learnedTactics: s.learnedTactics,
    favorites: s.favorites,
    sessions: s.sessions,
    todayProgramId: s.todayProgramId,
    dailyChecks: s.dailyChecks,
    user: s.user,
  };
}
