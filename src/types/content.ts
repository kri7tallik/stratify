/**
 * Core content model for STRATIFY.
 *
 * Every piece of content carries `SourceMeta` so the UI can always show where
 * a lineup / tactic / exercise came from and how confident we are in it.
 */

export type Side = "T" | "CT";
export type SideOrBoth = Side | "both";
export type Difficulty = "easy" | "medium" | "hard";

/**
 * verified   – content checked against the cited source (text/video read)
 * partial    – the source confirms the item exists, but some fields
 *              (e.g. exact aim point) were not confirmed and must be checked in-game
 * unverified – not confirmed for the current CS2 version (e.g. CS:GO-era source)
 */
export type VerificationStatus = "verified" | "partial" | "unverified";

export type SourceKind =
  | "official"
  | "lineup-db"
  | "article"
  | "video"
  | "workshop"
  | "pro-interview"
  | "match"
  | "user";

export interface Source {
  id: string;
  name: string;
  kind: SourceKind;
  url: string;
  author?: string;
  publisher?: string;
  description?: string;
}

export interface SourceMeta {
  sourceId: string;
  /** Deep link to the exact page / video of this item, if different from the source homepage */
  url?: string;
  author?: string;
  status: VerificationStatus;
  /** ISO date (YYYY-MM-DD) when this item was last checked against the source */
  checkedAt: string;
  note?: string;
}

export type MapId =
  | "mirage"
  | "inferno"
  | "dust2"
  | "ancient"
  | "anubis"
  | "nuke"
  | "overpass"
  | "train"
  | "cache";

export interface Callout {
  id: string;
  name: string;
  /** Schematic position, 0–100 on both axes. NOT radar-accurate. */
  x: number;
  y: number;
  zone: "T" | "CT" | "A" | "B" | "mid" | "neutral";
}

export interface MapRoute {
  id: string;
  name: string;
  side: Side;
  /** Ordered callout ids */
  path: string[];
  description: string;
}

export interface MapPosition {
  id: string;
  name: string;
  side: Side;
  calloutId: string;
  role: string;
  description: string;
}

export interface MapTiming {
  id: string;
  label: string;
  side: SideOrBoth;
  detail: string;
  meta: SourceMeta;
}

export interface CsMap {
  id: MapId;
  name: string;
  codename: string;
  activeDuty: boolean;
  activeDutyNote: string;
  accent: string;
  sites: string[];
  callouts: Callout[];
  edges: [string, string][];
  routes: MapRoute[];
  positions: MapPosition[];
  timings: MapTiming[];
  overview: string;
  meta: SourceMeta;
}

export type GrenadeType = "smoke" | "flash" | "molotov" | "he";

/** Screenshot from the source article (hot-linked, credited, not bundled). */
export interface LineupImage {
  src: string;
  kind: "position" | "aim" | "result";
  credit: string;
}
export type ThrowType =
  | "left-click"
  | "right-click"
  | "jump-throw"
  | "run-jump-throw"
  | "run-throw"
  | "both-click"
  | "walk-throw"
  | "crouch-throw"
  | "unknown";

export interface Grenade {
  id: string;
  title: string;
  map: MapId;
  side: Side;
  type: GrenadeType;
  /** callout id where you throw from */
  fromId: string;
  /** callout id where it lands */
  toId: string;
  position: string;
  aim: string;
  instructions: string[];
  throwType: ThrowType;
  purpose: string;
  difficulty: Difficulty;
  tags: string[];
  videoUrl?: string;
  images?: LineupImage[];
  meta: SourceMeta;
}

export type TacticCategory =
  | "execute"
  | "default"
  | "split"
  | "fake"
  | "retake"
  | "pistol"
  | "eco"
  | "force";

export interface TacticRole {
  slot: 1 | 2 | 3 | 4 | 5;
  role: string;
  task: string;
}

export interface TacticStep {
  label: string;
  detail: string;
  /** Callouts to highlight on the schematic during this step */
  focus?: string[];
  timing?: string;
}

export interface Tactic {
  id: string;
  title: string;
  map: MapId;
  side: Side;
  category: TacticCategory;
  summary: string;
  roles: TacticRole[];
  steps: TacticStep[];
  grenadeIds: string[];
  utilityNotes: string[];
  timings?: string;
  videoUrl?: string;
  difficulty: Difficulty;
  meta: SourceMeta;
}

export type ExerciseCategory =
  | "aim"
  | "spray"
  | "movement"
  | "counter-strafe"
  | "prefire"
  | "deathmatch"
  | "utility"
  | "game-sense"
  | "positioning";

export interface WorkshopMap {
  id: string;
  name: string;
  author: string;
  url: string;
  description: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  minutes: number;
  goal: string;
  instructions: string[];
  reps: string;
  workshopMapId?: string;
  meta: SourceMeta;
}

export interface TrainingProgram {
  id: string;
  name: string;
  minutes: 30 | 60 | 90 | 120;
  focus: string;
  description: string;
  exerciseIds: string[];
  meta: SourceMeta;
}

export type RoundType = "pistol" | "eco" | "force" | "full-buy" | "any";

export interface PlaybookEntry {
  id: string;
  title: string;
  team?: string;
  player?: string;
  map?: MapId;
  side?: SideOrBoth;
  roundType: RoundType;
  kind: "strategy" | "utility" | "routine" | "setup";
  summary: string;
  details: string[];
  event?: string;
  meta: SourceMeta;
}

/** Union used by search / favorites */
export type ContentKind = "grenade" | "tactic" | "exercise" | "program" | "playbook" | "map";

export interface ContentRef {
  kind: ContentKind;
  id: string;
}
