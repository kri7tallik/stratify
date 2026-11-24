import type { PlaybookEntry } from "@/types/content";

const D = "2026-11-24";

/**
 * Pro Playbook seed. Only entries we could tie to a public source are included.
 * Team-level strategies require demo review (HLTV demos) — add them via
 * Library → Add content with the match link as the source.
 */
export const PLAYBOOK: PlaybookEntry[] = [
  {
    id: "pb-s1mple-market",
    title: "Fast Market window smoke for a B rush",
    player: "s1mple",
    map: "mirage",
    side: "T",
    roundType: "any",
    kind: "utility",
    summary: "s1mple showed a Market window smoke thrown straight from T Spawn — fastest known lineup for that window at the time, used to support a B rush.",
    details: [
      "Thrown from the corner of T Spawn near the Apartments stairs, aiming at the top of the building.",
      "Purpose: deny Market window vision so a B rush can hit before CTs rotate.",
      "Published for CS:GO. Smoke physics changed in CS2 — confirm in a practice server.",
    ],
    meta: { sourceId: "wingg-s1mple", status: "unverified", checkedAt: D, note: "CS:GO-era." },
  },
  {
    id: "pb-monesy-routine",
    title: "m0NESY's practice routine",
    player: "m0NESY",
    roundType: "any",
    kind: "routine",
    summary: "Prefire mode with bots in the most popular positions, finished with deathmatch; sometimes Aim Botz. He named Yprac Arena and aim_botz as his maps.",
    details: [
      "Prefire against bots placed in common positions.",
      "Finish the session with deathmatch.",
      "Occasionally Aim Botz.",
    ],
    meta: { sourceId: "sportsru-monesy", status: "partial", checkedAt: D, note: "Interview predates CS2; Yprac Arena has since been succeeded by Yprac Hub." },
  },
  {
    id: "pb-biegan-cs",
    title: "Counter-strafing: drill it daily",
    player: "Biegan",
    roundType: "any",
    kind: "routine",
    summary: "Biegan's advice: drill counter-strafing daily until automatic — start on practice maps, then move to deathmatch.",
    details: ["Practice maps first (no pressure).", "Then deathmatch to make it automatic in real fights."],
    meta: { sourceId: "user", status: "partial", checkedAt: D, url: "https://cs2pulse.com/how-to-learn-cs2-counter-strafing", author: "CS2 Pulse", note: "Quote reported by CS2 Pulse." },
  },
];
