import type { Tactic } from "@/types/content";
import { TACTICS_MORE } from "./tactics.more";

const D = "2026-11-24";
const ROLE_NOTE =
  "Steps and utility come from the cited source. The split into five numbered roles was arranged by STRATIFY so it can be studied player-by-player.";

const TACTICS_CORE: Tactic[] = [
  {
    id: "mir-a-execute",
    title: "A execute: Ramp + Palace + Connector",
    map: "mirage",
    side: "T",
    category: "execute",
    summary:
      "Classic Mirage A hit: isolate the site with CT, Jungle and Stairs smokes, burn deep corners, then swing Palace and Ramp together after a flash.",
    roles: [
      { slot: 1, role: "Smoker — CT", task: "CT smoke from Palace, then entry through Palace." },
      { slot: 2, role: "Smoker — Jungle", task: "Jungle smoke from T Spawn, then follow Ramp." },
      { slot: 3, role: "Smoker — Stairs", task: "Stairs smoke, then trade the Ramp entry." },
      { slot: 4, role: "Entry — Ramp", task: "Molotov a deep corner (Firebox or Sandwich), flash and swing Ramp." },
      { slot: 5, role: "Connector / Mid", task: "Pressure Connector from Mid to stop the cross-rotation." },
    ],
    steps: [
      { label: "Set up", detail: "Ramp, Palace and a Mid player take their positions.", focus: ["tramp", "palace", "topmid"] },
      { label: "Isolate the site", detail: "Smoke CT, Jungle and Stairs to block rotations.", focus: ["ct", "jungle", "stairs"] },
      { label: "Clear deep corners", detail: "Molotov a deep corner such as Firebox or Sandwich.", focus: ["firebox"] },
      { label: "Swing together", detail: "Flash, then Palace and Ramp swing at the same time.", focus: ["palace", "tramp", "a"] },
      { label: "Plant & hold", detail: "Plant default and hold the crossfires.", focus: ["a"] },
    ],
    grenadeIds: ["mir-ct-palace", "mir-jungle-tspawn", "mir-stairs-tspawn", "mir-connector-tspawn"],
    utilityNotes: ["3 smokes (CT, Jungle, Stairs)", "1+ molotov for a deep corner", "Flashes before the swing"],
    difficulty: "medium",
    meta: { sourceId: "metabot-mirage", status: "verified", checkedAt: D, note: ROLE_NOTE },
  },
  {
    id: "mir-fast-a",
    title: "Fast A exec (skip Mid)",
    map: "mirage",
    side: "T",
    category: "execute",
    summary:
      "Skip Mid entirely and go A immediately with CT + Stairs + Jungle smokes and a molotov Under Balcony; one player lurks Mid/Underpass as a late option.",
    roles: [
      { slot: 1, role: "Smoker — CT", task: "Instant CT smoke." },
      { slot: 2, role: "Smoker — Stairs", task: "Instant Stairs smoke." },
      { slot: 3, role: "Smoker — Jungle", task: "Instant Jungle smoke." },
      { slot: 4, role: "Entry", task: "Molotov Under Balcony, then commit to A." },
      { slot: 5, role: "Lurker", task: "Mid / Underpass for a late flank on rotating CTs." },
    ],
    steps: [
      { label: "Commit instantly", detail: "Everyone (except the lurker) heads to A straight away.", focus: ["tramp", "palace"] },
      { label: "Utility", detail: "Instant CT, Stairs and Jungle smokes; molotov Under Balcony.", focus: ["ct", "stairs", "jungle"] },
      { label: "Take the site", detail: "Hit A together. The lurker punishes CTs stacking or rotating through Mid.", focus: ["a", "underpass"] },
    ],
    grenadeIds: ["mir-ct-palace", "mir-stairs-tspawn", "mir-jungle-tspawn"],
    utilityNotes: ["Works best vs CTs stacking Mid"],
    difficulty: "easy",
    meta: { sourceId: "bo3-mirage", status: "partial", checkedAt: D, note: "Read from search excerpt of the bo3.gg guide; open source for full text. " + ROLE_NOTE },
  },
  {
    id: "mir-b-execute",
    title: "B execute: Apartments + Short",
    map: "mirage",
    side: "T",
    category: "split",
    summary:
      "Isolate B with Market Window and Kitchen door smokes, burn Bench and Van, flash over the Apartments exit while a Short player stops the CT rotation from Mid.",
    roles: [
      { slot: 1, role: "Smoker — Market Window", task: "Smoke Market Window." },
      { slot: 2, role: "Smoker — Kitchen", task: "Smoke the Kitchen door." },
      { slot: 3, role: "Molotovs", task: "Molotov Bench and Van." },
      { slot: 4, role: "Entry — Apartments", task: "Enter from Apartments behind a flash." },
      { slot: 5, role: "Short", task: "Hold Short to stop the rotation from Mid." },
    ],
    steps: [
      { label: "Positions", detail: "Four players stack Apartments, one in Mid towards Short.", focus: ["apps", "short"] },
      { label: "Isolate", detail: "Smoke Market Window and Kitchen door.", focus: ["market"] },
      { label: "Burn close spots", detail: "Molotov Bench and Van.", focus: ["bench", "van"] },
      { label: "Entry", detail: "Flash over the Apartments exit and push; Short cuts the rotation.", focus: ["b", "short"] },
    ],
    grenadeIds: ["mir-market-window", "mir-market-door"],
    utilityNotes: ["2 smokes, 2 molotovs, flashes"],
    difficulty: "medium",
    meta: { sourceId: "metabot-mirage", status: "verified", checkedAt: D, note: ROLE_NOTE },
  },
  {
    id: "mir-mid-default",
    title: "Mid control default",
    map: "mirage",
    side: "T",
    category: "default",
    summary: "Smoke Window, take Top Mid, then use a Connector or Short smoke to cut the CT path and threaten both sites.",
    roles: [
      { slot: 1, role: "Window smoke", task: "Window smoke from T Spawn." },
      { slot: 2, role: "Top Mid", task: "Take Top Mid under the Window smoke." },
      { slot: 3, role: "Connector/Short smoke", task: "Cut the CT path." },
      { slot: 4, role: "A info", task: "Ramp / Palace presence." },
      { slot: 5, role: "B info", task: "Apartments presence." },
    ],
    steps: [
      { label: "Window", detail: "Smoke Window to deny the Mid AWP.", focus: ["window"] },
      { label: "Top Mid", detail: "Take Top Mid.", focus: ["topmid"] },
      { label: "Cut", detail: "Connector or Short smoke; now threaten both sites.", focus: ["connector", "short"] },
    ],
    grenadeIds: ["mir-window-tspawn", "mir-topmid", "mir-connector-tspawn"],
    utilityNotes: [],
    difficulty: "easy",
    meta: { sourceId: "metabot-mirage", status: "verified", checkedAt: D, note: ROLE_NOTE },
  },
  {
    id: "inf-b-execute",
    title: "Simple B execute (CT + Coffins)",
    map: "inferno",
    side: "T",
    category: "execute",
    summary: "Secure Banana, smoke CT and Coffins, molotov New Box, flash and enter together, clearing Dark and Oranges before planting.",
    roles: [
      { slot: 1, role: "Smoker — CT", task: "CT smoke from Banana." },
      { slot: 2, role: "Smoker — Coffins", task: "Coffins smoke from Banana." },
      { slot: 3, role: "Molotov", task: "Molotov New Box." },
      { slot: 4, role: "Flasher", task: "Flash over the site." },
      { slot: 5, role: "Entry", task: "First in; clears Dark and Oranges." },
    ],
    steps: [
      { label: "Banana control", detail: "Secure Banana control first.", focus: ["banana", "lowerbanana"] },
      { label: "Smokes", detail: "Smoke CT, then Coffins.", focus: ["ct", "coffins"] },
      { label: "Molotov", detail: "Molotov New Box or another known close position.", focus: ["newbox"] },
      { label: "Flash & enter", detail: "Flash over the site and enter together.", focus: ["b"] },
      { label: "Clear & plant", detail: "Clear Dark and Oranges; plant only after the core angles are controlled.", focus: ["b"] },
    ],
    grenadeIds: ["inf-ct-banana", "inf-coffins-banana", "inf-newbox-molly"],
    utilityNotes: ["2 smokes, 1 molotov, flashes"],
    difficulty: "easy",
    meta: { sourceId: "expcarry-inferno", status: "verified", checkedAt: D, note: ROLE_NOTE },
  },
  {
    id: "d2-long-take",
    title: "A Long take",
    map: "dust2",
    side: "T",
    category: "default",
    summary: "Flash Long Doors for timing, take A Long, then use the CT/Cross smoke to cross to site. A Car molotov flushes the Long defender.",
    roles: [
      { slot: 1, role: "Flasher", task: "Long Doors flash." },
      { slot: 2, role: "Entry", task: "Take Long behind the flash." },
      { slot: 3, role: "CT smoke", task: "CT smoke from the Long corner." },
      { slot: 4, role: "Molotov", task: "Car molotov." },
      { slot: 5, role: "Short / Mid", task: "Pressure Mid/Short (Xbox smoke) to split defence." },
    ],
    steps: [
      { label: "Long Doors", detail: "Flash and take Long Doors.", focus: ["longdoors"] },
      { label: "Clear Long", detail: "Molotov Car / Pit as needed.", focus: ["long", "car", "pit"] },
      { label: "Cross", detail: "CT smoke; cross to the site.", focus: ["ct", "a"] },
    ],
    grenadeIds: ["d2-ct-long", "d2-ct-deep", "d2-ashort", "d2-xbox"],
    utilityNotes: [],
    difficulty: "easy",
    meta: {
      sourceId: "expcarry-dust2",
      status: "partial",
      checkedAt: D,
      note: "Built from priority utility listed by ExpCarry and Dexerto's CT smoke usage. " + ROLE_NOTE,
    },
  },
];

export const TACTICS: Tactic[] = [...TACTICS_CORE, ...TACTICS_MORE];
