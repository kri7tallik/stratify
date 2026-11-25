import { useMemo } from "react";
import type { Difficulty, ExerciseCategory, GrenadeType, TacticCategory, ThrowType, VerificationStatus, RoundType } from "@/types/content";
import { useT, type UIKey } from "@/i18n";

const GRENADE_TYPES: GrenadeType[] = ["smoke", "flash", "molotov", "he"];
const THROWS: ThrowType[] = ["left-click", "right-click", "jump-throw", "run-jump-throw", "run-throw", "both-click", "walk-throw", "crouch-throw", "unknown"];
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];
const TCATS: TacticCategory[] = ["execute", "default", "split", "fake", "retake", "pistol", "eco", "force"];
const ECATS: ExerciseCategory[] = ["aim", "spray", "movement", "counter-strafe", "prefire", "deathmatch", "utility", "game-sense", "positioning"];
const STATUSES: VerificationStatus[] = ["verified", "partial", "unverified"];
const ROUNDS: RoundType[] = ["pistol", "eco", "force", "full-buy", "any"];

export const TACTIC_CATEGORIES = TCATS;
export const EXERCISE_CATEGORIES = ECATS;
export const DIFFICULTIES = DIFFS;
export const THROW_TYPES = THROWS;
export const GRENADE_TYPES_LIST = GRENADE_TYPES;
export const STATUS_LIST = STATUSES;
export const ROUND_TYPES = ROUNDS;

/** Localized label maps, recomputed when the language changes. */
export function useLabels() {
  const t = useT();
  return useMemo(() => {
    const rec = <K extends string>(keys: K[], prefix: string) => Object.fromEntries(keys.map((k) => [k, t(`${prefix}${k}` as UIKey)])) as Record<K, string>;
    return {
      nade: rec(GRENADE_TYPES, "nade."),
      nades: rec(GRENADE_TYPES, "nades."),
      throw: rec(THROWS, "throw."),
      diff: rec(DIFFS, "diff."),
      tactic: rec(TCATS, "tcat."),
      exercise: rec(ECATS, "ecat."),
      status: rec(STATUSES, "status."),
      round: rec(ROUNDS, "round."),
      tag: (tag: string) => {
        const key = `tag.${tag}` as UIKey;
        const v = t(key);
        return v === key ? tag : v;
      },
    };
  }, [t]);
}

export type Labels = ReturnType<typeof useLabels>;
