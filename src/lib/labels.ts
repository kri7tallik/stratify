import type { Difficulty, ExerciseCategory, GrenadeType, TacticCategory, ThrowType, VerificationStatus, RoundType } from "@/types/content";

export const GRENADE_LABEL: Record<GrenadeType, string> = { smoke: "Smoke", flash: "Flashbang", molotov: "Molotov", he: "HE Grenade" };
export const THROW_LABEL: Record<ThrowType, string> = {
  "left-click": "Left click",
  "right-click": "Right click",
  "jump-throw": "Jump throw",
  "run-jump-throw": "Run + jump throw",
  "walk-throw": "Walk throw",
  "crouch-throw": "Crouch throw",
  unknown: "См. источник",
};
export const DIFF_LABEL: Record<Difficulty, string> = { easy: "Легко", medium: "Средне", hard: "Сложно" };
export const TACTIC_LABEL: Record<TacticCategory, string> = {
  execute: "Executes",
  default: "Defaults",
  split: "Splits",
  fake: "Fakes",
  retake: "Retakes",
  pistol: "Pistol Rounds",
  eco: "Eco Rounds",
  force: "Force Buy",
};
export const EXERCISE_LABEL: Record<ExerciseCategory, string> = {
  aim: "Aim",
  spray: "Spray Control",
  movement: "Movement",
  "counter-strafe": "Counter-strafing",
  prefire: "Prefire",
  deathmatch: "Deathmatch",
  utility: "Utility",
  "game-sense": "Game Sense",
  positioning: "Positioning",
};
export const STATUS_LABEL: Record<VerificationStatus, string> = {
  verified: "Проверено",
  partial: "Частично",
  unverified: "Не проверено",
};
export const ROUND_LABEL: Record<RoundType, string> = { pistol: "Pistol", eco: "Eco", force: "Force", "full-buy": "Full buy", any: "Любой" };
