import type { Grenade, LineupImage, SourceMeta } from "@/types/content";

/**
 * Lineups from 2025 guides (checked 25 Nov 2026).
 *
 * - Refrag "Utility Secrets" series by Samuel Allen (Jan–Jul 2025): stand / aim / result screenshots.
 * - CS2 Pulse HE pages (lineups from Jul 2024, pages updated Jul 2025): aim + result screenshots.
 * - bo3.gg Mirage flashbang guide by Siemka (Mar 2025): aim screenshots.
 *
 * Images are hot-linked from the source (never bundled) and credited; text is paraphrased from it.
 * Where the source leaves something out (throw type, exact spot) the item is `partial` with a note.
 * Throw spots on the radar are approximate — the screenshots are the reference.
 */
const D = "2026-11-25";
const m = (sourceId: string, status: SourceMeta["status"] = "verified", note?: string): SourceMeta => ({ sourceId, status, checkedAt: D, note });

const RF = "https://refrag.gg/cdn-cgi/imagedelivery/5wML_ikJr-qv52ESeLE6CQ/wordpress.refrag.gg/";
const rf = (path: string, kind: LineupImage["kind"]): LineupImage => ({ src: `${RF}${path}/public`, kind, credit: "Refrag" });
const cp = (file: string, kind: LineupImage["kind"]): LineupImage => ({ src: `https://cs2pulse.com/wp-content/uploads/2024/07/${file}`, kind, credit: "CS2 Pulse" });
const bo = (path: string): LineupImage => ({ src: `https://files.bo3.gg/uploads/image/${path}`, kind: "aim", credit: "bo3.gg" });

export const NOTE_HE_2024 = "Lineup first published in July 2024 (page updated July 2025). The aim screenshot also shows where to stand — re-test in Practice.";
export const NOTE_ANUBIS_2025 = "Published Feb 2025, before Anubis returned to the pool in Jan 2026 with clipping changes — re-test in Practice.";
export const NOTE_CACHE_2025 = "Published July 2025 for the pre-release CS2 Cache. Cache was reworked and patched several times in 2026 — re-test in Practice.";
export const NOTE_NO_THROW = "The source doesn't say which throw to use — check it in Practice.";

export const FRESH_GRENADES: Grenade[] = [
  // ───────────── MIRAGE · Refrag (Mar 2025) ─────────────
  {
    id: "mir-rf-window", title: "Window smoke (bin corner)", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "window",
    position: "Stuck into the corner of the bin in T Spawn", aim: "Corner of the detailing on the wall",
    instructions: ["Get stuck into the corner of the bin.", "Put the crosshair on the corner of the wall detailing.", "Throw (the source doesn't name the throw type)."],
    throwType: "unknown", purpose: "Default Window smoke you can throw from any spawn.", difficulty: "easy", tags: ["mid control", "anti-awp"],
    images: [rf("2025/03/Mirage-Window-Smoke-Lineup-Spot.jpg", "position"), rf("2025/03/Mirage-Window-Lineup-edited.jpg", "aim"), rf("2025/03/Mirage-Window-Smoke.jpg", "result")],
    meta: m("refrag-mirage", "partial", NOTE_NO_THROW),
  },
  {
    id: "mir-rf-connector", title: "Connector smoke (bin corner)", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "connector",
    position: "Same bin corner as the Window smoke", aim: "Cross-section of the antenna",
    instructions: ["Stay in the same bin corner as for the Window smoke.", "Aim at the cross-section of the antenna.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Continues the Mid take from the same spot as Window.", difficulty: "easy", tags: ["mid control"],
    images: [rf("2025/03/Mirage-Window-Smoke-Lineup-Spot.jpg", "position"), rf("2025/03/Mirage-Con-Smoke-Lineup-edited.jpg", "aim"), rf("2025/03/Mirage-Con-Smoke.jpg", "result")],
    meta: m("refrag-mirage"),
  },
  {
    id: "mir-rf-stairs", title: "Stairs smoke (vertical beam)", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "stairs",
    position: "Centred on the vertical beam shown in the screenshot", aim: "Spot on the building edge shown in the screenshot",
    instructions: ["Line up in the centre of the vertical beam.", "Put the crosshair on the spot shown.", "Jump-throw. The A Bench smoke uses the same spot."],
    throwType: "jump-throw", purpose: "Blocks Stairs for the A take.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/03/Mirage-Stairs-Smoke-Lineup-Spot.jpg", "position"), rf("2025/03/Mirage-Stairs-Smoke-Lineup-edited.jpg", "aim"), rf("2025/03/Mirage-Stairs-and-Bench-Smokes.jpg", "result")],
    meta: m("refrag-mirage"),
  },
  {
    id: "mir-rf-abench", title: "A Bench smoke", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "a",
    position: "Same spot as the Stairs smoke", aim: "Same crosshair placement as the Stairs smoke",
    instructions: ["Use exactly the Stairs-smoke lineup.", "Hold W and jump-throw.", "The result screenshot shows both smokes on A."],
    throwType: "run-jump-throw", purpose: "Pairs with the Stairs smoke to cut off the A site bench area.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/03/Mirage-Stairs-Smoke-Lineup-Spot.jpg", "position"), rf("2025/03/Mirage-Stairs-Smoke-Lineup-edited.jpg", "aim"), rf("2025/03/Mirage-Stairs-and-Bench-Smokes.jpg", "result")],
    meta: m("refrag-mirage"),
  },
  {
    id: "mir-rf-market-window", title: "Market Window smoke (Apartments)", map: "mirage", side: "T", type: "smoke", fromId: "apps", toId: "market",
    position: "Apartments corridor, spot shown in the screenshot", aim: "Dark mark on the crenellation",
    instructions: ["Line up in Apartments as shown.", "Put the crosshair on the dark mark on the crenellation.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks Market Window for the B hit.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/03/Mirage-B-Smokes-Lineup-Spot.jpg", "position"), rf("2025/03/Mirage-Market-Window-Smoke-Lineup-edited.jpg", "aim"), rf("2025/03/Mirage-Market-Window-Smoke.jpg", "result")],
    meta: m("refrag-mirage"),
  },
  {
    id: "mir-rf-short", title: "Short smoke (Apartments)", map: "mirage", side: "T", type: "smoke", fromId: "apps", toId: "short",
    position: "Same Apartments corner as Market Window", aim: "Corner of the tower",
    instructions: ["Stay in the same corner as for the Market Window smoke.", "Aim at the corner of the tower.", "Left-click throw."],
    throwType: "left-click", purpose: "Cuts Short off from B site.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/03/Mirage-B-Smokes-Lineup-Spot.jpg", "position"), rf("2025/03/Mirage-Short-Smoke-Lineup-edited.jpg", "aim"), rf("2025/03/Mirage-Short-Smoke.jpg", "result")],
    meta: m("refrag-mirage"),
  },

  // ───────────── MIRAGE · bo3.gg flashes (Mar 2025) ─────────────
  {
    id: "mir-bo-window-flash", title: "Window flash from T Spawn", map: "mirage", side: "T", type: "flash", fromId: "tspawn", toId: "window",
    position: "Near the trash can in T Spawn", aim: "Slightly above Mid Window",
    instructions: ["Stand near the trash can in T Spawn.", "Aim slightly above Mid Window.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Forces the Window AWPer or rifler off the angle.", difficulty: "medium", tags: ["mid control", "anti-awp"],
    images: [bo("73386/image/webp-c7e30b64375aaadf80ef9c15bb892b24.webp")],
    meta: m("bo3-mirage-flash"),
  },
  {
    id: "mir-bo-mid-flash", title: "Mid flash from T Spawn", map: "mirage", side: "T", type: "flash", fromId: "tspawn", toId: "mid",
    position: "Behind the T Spawn boxes", aim: "Top of Mid (see screenshot)",
    instructions: ["Stand behind the T Spawn boxes.", "Aim at the top of Mid as shown.", "Throw so it pops near Window and Connector."],
    throwType: "unknown", purpose: "Blinds CTs holding Mid from Window, Catwalk or Connector.", difficulty: "medium", tags: ["mid control"],
    images: [bo("73385/image/webp-be8be03f475d8059fc5850fda432b505.webp")],
    meta: m("bo3-mirage-flash", "partial", NOTE_NO_THROW),
  },

  // ───────────── MIRAGE · CS2 Pulse HE ─────────────
  {
    id: "mir-he-tetris", title: "Tetris HE from Jungle", map: "mirage", side: "CT", type: "he", fromId: "jungle", toId: "a",
    position: "Corner of Jungle", aim: "Wooden beam above Sandwich",
    instructions: ["Stand in the corner of Jungle.", "Aim at the wooden beam above Sandwich.", "Left-click throw."],
    throwType: "left-click", purpose: "Damages a T taking Tetris during an A hit.", difficulty: "easy", tags: ["retake"],
    images: [cp("image10-13.png", "aim"), cp("image3-12.png", "result")],
    meta: m("cs2pulse-he-mirage", "partial", NOTE_HE_2024),
  },
  {
    id: "mir-he-sandwich", title: "Sandwich HE from Jungle", map: "mirage", side: "CT", type: "he", fromId: "jungle", toId: "stairs",
    position: "Next to the Jungle wall (same spot as Tetris)", aim: "As shown in the screenshot",
    instructions: ["Stand next to the Jungle wall, same spot as the Tetris HE.", "Line up the crosshair as shown.", "Left + right click (medium) throw."],
    throwType: "both-click", purpose: "Damages a T holding Sandwich.", difficulty: "easy", tags: ["retake"],
    images: [cp("image11-13.png", "aim"), cp("image1-14.png", "result")],
    meta: m("cs2pulse-he-mirage", "partial", NOTE_HE_2024),
  },

  // ───────────── INFERNO · Refrag (Mar 2025) ─────────────
  {
    id: "inf-rf-ct", title: "CT smoke (Banana barrels)", map: "inferno", side: "T", type: "smoke", fromId: "banana", toId: "ct",
    position: "Stuck in the corner of the barrels on Banana", aim: "Leftmost corner of the tower's roof overhang, raised until it touches the brickwork",
    instructions: ["Get stuck in the corner of the barrels on Banana.", "Find the leftmost corner of the tower's overhanging roof and raise the crosshair straight up until it touches the brickwork.", "Left-click throw."],
    throwType: "left-click", purpose: "Covers CT and the boost spot for the B take.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/03/Inferno-CT-Smoke-Lineup-Spot.jpg", "position"), rf("2025/03/Inferno-CT-Smoke-Lineup.jpg", "aim"), rf("2025/03/Inferno-CT-Smoke.jpg", "result")],
    meta: m("refrag-inferno"),
  },
  {
    id: "inf-rf-newbox-molly", title: "New Box molotov", map: "inferno", side: "T", type: "molotov", fromId: "car", toId: "newbox",
    position: "Tucked into the corner of Car", aim: "As shown in the screenshot",
    instructions: ["Get tucked into the corner of Car.", "Put the crosshair where the screenshot shows.", "Left-click throw."],
    throwType: "left-click", purpose: "Burns the B anchor out of New Box.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/03/Inferno-Newbox-Molly-Lineup-Spot.jpg", "position"), rf("2025/03/Inferno-Newbox-Molly-Lineup.jpg", "aim"), rf("2025/03/Inferno-Newbox-Molly.jpg", "result")],
    meta: m("refrag-inferno"),
  },
  {
    id: "inf-rf-moto", title: "Moto smoke (Mid gutter)", map: "inferno", side: "T", type: "smoke", fromId: "mid", toId: "moto",
    position: "Centre of the gutter in Mid", aim: "Bottom of the bulb of the overhanging light",
    instructions: ["Line up in the centre of the gutter in Mid.", "Aim at the bottom of the bulb on the overhanging light.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Separates Long from A site — for an A hit or a Long-to-B wrap.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/03/Inferno-Moto-Smoke-Lineup-Spot.jpg", "position"), rf("2025/03/Inferno-Moto-Smoke-Lineup.jpg", "aim"), rf("2025/03/Inferno-Moto-Smoke.jpg", "result")],
    meta: m("refrag-inferno"),
  },
  {
    id: "inf-rf-pit-molly", title: "Pit molotov", map: "inferno", side: "T", type: "molotov", fromId: "apps", toId: "pit",
    position: "Lined up with the fencing inside Apartments, then edged out into the corridor", aim: "Edge out until the spikes on the wall appear (see screenshot)",
    instructions: ["Line up with the fencing inside Apartments.", "Edge out into the corridor until you see the spikes on the wall.", "Left-click throw."],
    throwType: "left-click", purpose: "Forces the Pit defender out for the A take.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/03/Inferno-Pit-Molly-Lineup-Spot.jpg", "position"), rf("2025/03/Inferno-Pit-Molly-Lineup.jpg", "aim"), rf("2025/03/Inferno-Pit-Molly.jpg", "result")],
    meta: m("refrag-inferno"),
  },
  {
    id: "inf-rf-chimney-flash", title: "Chimney flash (A site)", map: "inferno", side: "T", type: "flash", fromId: "apps", toId: "a",
    position: "Centre of the vertical beam in Apartments", aim: "Crouched, on the windows of the tower",
    instructions: ["Line up in the centre of the vertical beam in Apartments.", "Crouch and find the windows of the tower.", "Left-click throw."],
    throwType: "crouch-throw", purpose: "Blinds CTs on A site as teammates climb onto it.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/03/Inferno-Chimney-Flash-Lineup-Spot.jpg", "position"), rf("2025/03/Inferno-Chimney-Flash.jpg", "aim")],
    meta: m("refrag-inferno"),
  },

  // ───────────── INFERNO · CS2 Pulse HE ─────────────
  {
    id: "inf-he-banana", title: "Banana HE from T Spawn (smoke clear)", map: "inferno", side: "T", type: "he", fromId: "tspawn", toId: "banana",
    position: "On the circular shadow just outside T Spawn", aim: "As shown in the screenshot",
    instructions: ["Stand on the circular shadow just outside T Spawn.", "Line up the crosshair as shown.", "Left-click throw. It lands far away, so it mostly helps your teammates."],
    throwType: "left-click", purpose: "Clears a CT smoke on Banana for a moment.", difficulty: "easy", tags: ["smoke clear"],
    images: [cp("image12-17.png", "aim"), cp("image1-18.png", "result")],
    meta: m("cs2pulse-he-inferno", "partial", NOTE_HE_2024),
  },
  {
    id: "inf-he-backsite", title: "Back Site A HE from the mailbox", map: "inferno", side: "CT", type: "he", fromId: "arch", toId: "a",
    position: "Next to the red mailbox just outside Arch", aim: "Middle-right of the wooden balcony in front",
    instructions: ["Stand next to the red mailbox just outside Arch.", "Aim at the middle-right part of the wooden balcony in front of you.", "Left-click throw."],
    throwType: "left-click", purpose: "Hits Back Site A, where both Ts and CTs like to hide.", difficulty: "easy", tags: ["retake"],
    images: [cp("image10-17.png", "aim"), cp("image8-16.png", "result")],
    meta: m("cs2pulse-he-inferno", "partial", NOTE_HE_2024),
  },
  {
    id: "inf-he-default-a", title: "A default plant HE from the mailbox", map: "inferno", side: "CT", type: "he", fromId: "arch", toId: "a",
    position: "On top of the same mailbox, rightmost edge", aim: "As shown in the screenshot",
    instructions: ["Jump on top of the mailbox and stand on its rightmost edge.", "Line up the crosshair as shown.", "Left-click throw."],
    throwType: "left-click", purpose: "Hits the default plant: stops a plant (CT) or a defuse (T).", difficulty: "medium", tags: ["retake", "post-plant"],
    images: [cp("image2-17.png", "aim"), cp("image5-17.png", "result")],
    meta: m("cs2pulse-he-inferno", "partial", NOTE_HE_2024),
  },

  // ───────────── DUST II · Refrag (Mar 2025) ─────────────
  {
    id: "d2-rf-xbox", title: "Xbox smoke (roof mark)", map: "dust2", side: "T", type: "smoke", fromId: "tspawn", toId: "xbox",
    position: "Stuck into the corner shown in the screenshot", aim: "Mark on the lip of the roof",
    instructions: ["Get stuck into the corner shown.", "Put the crosshair on the mark on the lip of the roof.", "Jump-throw — it bounces onto Xbox."],
    throwType: "jump-throw", purpose: "Denies the Mid AWP line and Bottom Mid info; enables Mid defaults.", difficulty: "easy", tags: ["mid control", "anti-awp"],
    images: [rf("2025/03/Dust2-Xbox-Lineup-Spot.jpg", "position"), rf("2025/03/Dust2-Xbox-Lineup.jpg", "aim"), rf("2025/03/Dust2-Xbox-Smoke.jpg", "result")],
    meta: m("refrag-dust2"),
  },
  {
    id: "d2-rf-mid-b", title: "Mid-to-B smoke (from Xbox)", map: "dust2", side: "T", type: "smoke", fromId: "xbox", toId: "ctmid",
    position: "Tucked into the corner of Xbox", aim: "Right side of the thin plank",
    instructions: ["Tuck into the corner of Xbox.", "Aim at the spot on the right side of the thin plank.", "Crouch and jump-throw."],
    throwType: "jump-throw", purpose: "Denies CT info on the Mid-to-B cross. The source notes this lineup changed from CS:GO to CS2.", difficulty: "medium", tags: ["mid control", "b execute"],
    images: [rf("2025/03/Dust2-Mid-B-Lineup-Spot.jpg", "position"), rf("2025/03/Dust2-Mid-B-Lineup.jpg", "aim"), rf("2025/03/Dust2-Mid-B-Smoke.jpg", "result")],
    meta: m("refrag-dust2"),
  },
  {
    id: "d2-rf-ct-cross", title: "CT cross smoke (blue box)", map: "dust2", side: "T", type: "smoke", fromId: "long", toId: "ct",
    position: "Right side of the blue box on Long", aim: "Just in from the corner of the roofing",
    instructions: ["Line up on the right side of the blue box.", "Aim just in from the corner of the roofing.", "Left-click throw."],
    throwType: "left-click", purpose: "Finishes the Long take — blocks the CT-to-A cross.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/03/Dust2-Long-Cross-Lineup-Spot.jpg", "position"), rf("2025/03/Dust2-Long-Cross-Lineup.jpg", "aim"), rf("2025/03/Dust2-Long-Cross-Smoke.jpg", "result")],
    meta: m("refrag-dust2"),
  },
  {
    id: "d2-rf-long-flash", title: "Long take flash", map: "dust2", side: "T", type: "flash", fromId: "outsidelong", toId: "long",
    position: "Centre of the wall (see screenshot)", aim: "From the top of the white arrow straight up to the top of the wall",
    instructions: ["Line up in the centre of the wall.", "Find the top of the white arrow and move straight up to the top of the wall.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blinds the CT holding Long during the Long take.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/03/Dust2-Long-Flash-Lineup-Spot.jpg", "position"), rf("2025/03/Dust2-Long-Flash-Lineup.jpg", "aim")],
    meta: m("refrag-dust2"),
  },
  {
    id: "d2-rf-bdoor", title: "B Doors smoke (Upper Tunnels)", map: "dust2", side: "T", type: "smoke", fromId: "upper", toId: "bdoors",
    position: "Left-hand side of the wooden crate in Upper Tunnels", aim: "As shown in the screenshot",
    instructions: ["Line up on the left-hand side of the wooden crate in Upper Tunnels.", "Put the crosshair where the screenshot shows.", "Left-click throw."],
    throwType: "left-click", purpose: "Cuts the CT rotation through B Doors on every B execute.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/03/Dust2-B-Door-Lineup-Spot.jpg", "position"), rf("2025/03/Dust2-B-Door-Lineup.jpg", "aim"), rf("2025/03/Dust2-B-Door-Smoke.jpg", "result")],
    meta: m("refrag-dust2"),
  },
  {
    id: "d2-he-bwindow", title: "Under B Window HE from CT Mid", map: "dust2", side: "CT", type: "he", fromId: "ctmid", toId: "window",
    position: "Corner of the CT area (see screenshot)", aim: "Corner of the shadow on the ground",
    instructions: ["Stand in the corner of the CT area as shown.", "Aim at the corner of the shadow on the ground.", "Running jump-throw."],
    throwType: "run-jump-throw", purpose: "Retake HE for the spot under B Window.", difficulty: "medium", tags: ["retake"],
    images: [cp("image5-20.png", "aim"), cp("image10-20.png", "result")],
    meta: m("cs2pulse-he-dust2", "partial", NOTE_HE_2024),
  },

  // ───────────── NUKE · Refrag (Apr 2025) ─────────────
  {
    id: "nuk-rf-outside-molly", title: "Outside molotov (CT)", map: "nuke", side: "CT", type: "molotov", fromId: "ct", toId: "outside",
    position: "Running along the yellow line", aim: "Edge of the main building until the large pole appears",
    instructions: ["Run along the yellow line.", "Keep looking at the edge of the main building until the large pole becomes visible.", "Run towards it for a few steps and left-click throw while running."],
    throwType: "run-throw", purpose: "Slows the T Outside take so CT Outside / Main / rotator can set up.", difficulty: "hard", tags: ["outside", "anti-rush"],
    images: [rf("2025/04/Nuke-Outside-Molly-Lineup-Spot.jpg", "position"), rf("2025/04/Nuke-Outside-Molly-Lineup.jpg", "aim"), rf("2025/04/Nuke-Outside-Molly.jpg", "result")],
    meta: m("refrag-nuke"),
  },
  {
    id: "nuk-rf-wall-1", title: "Outside smoke wall #1 (one-player setup)", map: "nuke", side: "T", type: "smoke", fromId: "tspawn", toId: "outside",
    position: "Tucked into the corner shown (tricky to get stuck in)", aim: "First crosshair spot shown",
    instructions: ["Tuck into the corner shown — practise getting stuck in.", "Aim at the first spot.", "Jump-throw, then throw smoke #2 right away."],
    throwType: "jump-throw", purpose: "Half of a two-smoke Outside wall one player can throw.", difficulty: "medium", tags: ["outside"],
    images: [rf("2025/04/Nuke-Outside-Smokes-Lineup-Spot.jpg", "position"), rf("2025/04/Nuke-Outside-Smoke-Jumpthrow-Lineup.jpg", "aim"), rf("2025/04/Nuke-Outside-Smoke-Wall.jpg", "result")],
    meta: m("refrag-nuke"),
  },
  {
    id: "nuk-rf-wall-2", title: "Outside smoke wall #2 (one-player setup)", map: "nuke", side: "T", type: "smoke", fromId: "tspawn", toId: "outside",
    position: "Same corner as smoke #1", aim: "Second crosshair spot shown",
    instructions: ["Straight after smoke #1, stay in the corner.", "Aim at the second spot.", "Hold W and jump-throw."],
    throwType: "run-jump-throw", purpose: "Completes the Outside smoke wall.", difficulty: "medium", tags: ["outside"],
    images: [rf("2025/04/Nuke-Outside-Smokes-Lineup-Spot.jpg", "position"), rf("2025/04/Nuke-Outside-Smoke-W-Jumpthrow-Lineup.jpg", "aim"), rf("2025/04/Nuke-Outside-Smoke-Wall.jpg", "result")],
    meta: m("refrag-nuke"),
  },
  {
    id: "nuk-rf-a-popflash", title: "A site pop flash (roof)", map: "nuke", side: "T", type: "flash", fromId: "troof", toId: "a",
    position: "Left of centre of the metal structure on the roof", aim: "As shown in the screenshot",
    instructions: ["Line up left of centre of the metal structure.", "Put the crosshair where the screenshot shows.", "Jump-throw. The Back Site molotov uses the same lineup."],
    throwType: "jump-throw", purpose: "Pop flash so a teammate can come out of Hut onto A.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/04/Nuke-A-Pop-Flash-Lineup-Spot.jpg", "position"), rf("2025/04/Nuke-A-Pop-Flash-Lineup.jpg", "aim")],
    meta: m("refrag-nuke"),
  },
  {
    id: "nuk-rf-backsite-molly", title: "A Back Site molotov (roof)", map: "nuke", side: "T", type: "molotov", fromId: "troof", toId: "a",
    position: "Same spot as the A pop flash", aim: "Same crosshair placement as the A pop flash",
    instructions: ["Use the A pop-flash lineup.", "Jump-throw the molotov instead of the flash."],
    throwType: "jump-throw", purpose: "Burns out a Back Site anchor on A.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/04/Nuke-A-Pop-Flash-Lineup-Spot.jpg", "position"), rf("2025/04/Nuke-A-Pop-Flash-Lineup.jpg", "aim"), rf("2025/04/Nuke-A-Back-Site-Molly.jpg", "result")],
    meta: m("refrag-nuke"),
  },
  {
    id: "nuk-rf-tophut-molly", title: "Top Hut molotov", map: "nuke", side: "T", type: "molotov", fromId: "troof", toId: "hut",
    position: "On the metal structure, exactly as shown (unforgiving spot)", aim: "Precisely as shown in the screenshot",
    instructions: ["Get onto the metal structure and line up exactly as shown.", "Put the crosshair precisely where the screenshot shows.", "Run a couple of steps and left-click throw while moving."],
    throwType: "run-throw", purpose: "Clears a CT hiding on top of Hut before you take A.", difficulty: "hard", tags: ["a execute"],
    images: [rf("2025/04/Nuke-Hut-Molly-Lineup-Spot.jpg", "position"), rf("2025/04/Nuke-Hut-Molly-Lineup.jpg", "aim"), rf("2025/04/Nuke-Top-Hut-Molly.jpg", "result")],
    meta: m("refrag-nuke"),
  },
  {
    id: "nuk-he-squeaky", title: "Squeaky door HE from Lobby", map: "nuke", side: "T", type: "he", fromId: "lobby", toId: "hut",
    position: "Right corner of the Lobby door", aim: "Steel bar on the roof",
    instructions: ["Stand at the right corner of the Lobby door.", "Aim at the steel bar on the roof.", "Left-click throw."],
    throwType: "left-click", purpose: "Breaks Squeaky door for a fast A execute — see through it and push without the squeak.", difficulty: "easy", tags: ["a execute"],
    images: [cp("image7-19.png", "aim"), cp("image5-18.png", "result")],
    meta: m("cs2pulse-he-nuke", "partial", NOTE_HE_2024),
  },

  // ───────────── ANCIENT · Refrag (Feb 2025) ─────────────
  {
    id: "anc-rf-red", title: "Red Room smoke", map: "ancient", side: "T", type: "smoke", fromId: "tspawn", toId: "red",
    position: "Loosely centred on the pillar shown", aim: "Dark spot shown in the screenshot",
    instructions: ["Line up loosely in the centre of the pillar.", "Aim at the dark spot.", "Jump-throw."],
    throwType: "jump-throw", purpose: "The source calls it the most important smoke on Ancient: denies Mid info and a brutal AWP line.", difficulty: "easy", tags: ["mid control", "anti-awp"],
    images: [rf("2025/02/Ancient-Red-Smoke-Lineup-Spot.jpg", "position"), rf("2025/02/Ancient-Red-Smoke-Lineup-edited.jpg", "aim"), rf("2025/02/Ancient-Red-Smoke.jpg", "result")],
    meta: m("refrag-ancient"),
  },
  {
    id: "anc-rf-donut-mid", title: "Donut smoke (Mid take)", map: "ancient", side: "T", type: "smoke", fromId: "mid", toId: "donut",
    position: "Lined up with the second vertical crack along the bottom of the wall", aim: "Exactly on the wooden beam shown",
    instructions: ["Line up with the second vertical crack along the bottom of the wall.", "Put the crosshair on the wooden beam exactly as shown.", "Left-click throw."],
    throwType: "left-click", purpose: "Takes away the CT Mid player's Donut cover, flash plays and AWP lines.", difficulty: "easy", tags: ["mid control"],
    images: [rf("2025/02/Ancient-Donut-Smoke-Lineup-Spot.jpg", "position"), rf("2025/02/Ancient-Donut-Smoke-Lineup-edited.jpg", "aim"), rf("2025/02/Ancient-Donut-Smoke.jpg", "result")],
    meta: m("refrag-ancient"),
  },
  {
    id: "anc-rf-temple", title: "Temple smoke (A execute)", map: "ancient", side: "T", type: "smoke", fromId: "amain", toId: "temple",
    position: "Corner shown in the screenshot (same spot for both A smokes)", aim: "Middle of the razor-thin gap between the leaves",
    instructions: ["Get into the corner shown.", "Aim at the middle of the thin gap between the leaves.", "Jump-throw. Follow up with the A Donut smoke."],
    throwType: "jump-throw", purpose: "Smoke 1/2 of a basic A execute.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/02/Ancient-A-Temple-Lineup-Spot.jpg", "position"), rf("2025/02/Ancient-A-Temple-Lineup-edited.jpg", "aim"), rf("2025/02/Ancient-A-Temple-Smoke.jpg", "result")],
    meta: m("refrag-ancient"),
  },
  {
    id: "anc-rf-donut-a", title: "Donut smoke (A execute)", map: "ancient", side: "T", type: "smoke", fromId: "amain", toId: "donut",
    position: "Same corner as the Temple smoke", aim: "Bottom-left of the mass of leaves",
    instructions: ["Stay in the Temple-smoke corner.", "Aim at the bottom-left of the mass of leaves.", "Hold W and jump-throw."],
    throwType: "run-jump-throw", purpose: "Smoke 2/2 of a basic A execute.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/02/Ancient-A-Temple-Lineup-Spot.jpg", "position"), rf("2025/02/Ancient-A-Donut-Lineup-edited.jpg", "aim"), rf("2025/02/Ancient-A-Donut-Smoke.jpg", "result")],
    meta: m("refrag-ancient"),
  },
  {
    id: "anc-he-blong", title: "B Long HE from the doors", map: "ancient", side: "T", type: "he", fromId: "bramp", toId: "blong",
    position: "Wedged into the left door", aim: "As shown in the screenshot",
    instructions: ["Wedge yourself into the left door.", "Line up the crosshair as shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Hits the CT in Long behind the demolished stairs.", difficulty: "medium", tags: ["b execute"],
    images: [cp("image10-16.png", "aim"), cp("image2-16.png", "result")],
    meta: m("cs2pulse-he-ancient", "partial", NOTE_HE_2024),
  },
  {
    id: "anc-he-red", title: "Red smoke-clear HE from Sniper's Nest", map: "ancient", side: "CT", type: "he", fromId: "ct", toId: "red",
    position: "Back wall of Sniper's Nest, lined up with the rock on the ground", aim: "Bottom of that rock",
    instructions: ["Stand next to the back wall in Sniper's Nest, lined up with the rock on the ground.", "Aim at the bottom of the rock.", "Walking right-click throw."],
    throwType: "walk-throw", purpose: "Clears the T smoke in front of Red for a moment.", difficulty: "medium", tags: ["smoke clear"],
    images: [cp("image1-17.png", "aim"), cp("image3-15.png", "result")],
    meta: m("cs2pulse-he-ancient", "partial", NOTE_HE_2024),
  },

  // ───────────── ANUBIS · Refrag (Feb 2025) ─────────────
  {
    id: "anu-rf-mid", title: "Mid smoke (T Spawn fence)", map: "anubis", side: "T", type: "smoke", fromId: "tspawn", toId: "mid",
    position: "Centre of the middle pillar holding the fence in T Spawn", aim: "Bottom-right corner of the largest towel",
    instructions: ["Line up in the centre of the middle pillar of the fence in T Spawn.", "Aim at the bottom-right corner of the largest towel.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Early Mid control and blocks a common AWP line.", difficulty: "easy", tags: ["mid control", "anti-awp"],
    images: [rf("2025/02/Anubis-Mid-Smoke-Lineup-Spot-1.jpg", "position"), rf("2025/02/Anubis-Mid-Smoke-Lineup-1.jpg", "aim"), rf("2025/02/Anubis-Mid-Smoke.jpg", "result")],
    meta: m("refrag-anubis", "partial", NOTE_ANUBIS_2025),
  },
  {
    id: "anu-rf-ebox", title: "Ebox smoke (T Spawn fence)", map: "anubis", side: "T", type: "smoke", fromId: "tspawn", toId: "mid",
    position: "Same spot as the Mid smoke", aim: "As shown in the screenshot",
    instructions: ["Line up exactly as for the Mid smoke.", "Aim where the screenshot shows.", "Hold W and jump-throw."],
    throwType: "run-jump-throw", purpose: "Covers Ebox and both walk-out spots so Water players avoid an early AWP.", difficulty: "easy", tags: ["mid control", "anti-awp"],
    images: [rf("2025/02/Anubis-Mid-Smoke-Lineup-Spot-1.jpg", "position"), rf("2025/02/Anubis-Ebox-Smoke-Lineup.jpg", "aim"), rf("2025/02/Anubis-Ebox-Smoke.jpg", "result")],
    meta: m("refrag-anubis", "partial", NOTE_ANUBIS_2025),
  },
  {
    id: "anu-rf-bcross", title: "B cross smoke", map: "anubis", side: "T", type: "smoke", fromId: "bmain", toId: "b",
    position: "Stuck into the corner shown in B Main", aim: "As shown in the screenshot",
    instructions: ["Get stuck into the corner shown.", "Aim where the screenshot shows.", "Jump-throw. The B Main pop flash uses the same spot."],
    throwType: "jump-throw", purpose: "Cross smoke to get out onto B site.", difficulty: "medium", tags: ["b execute"],
    images: [rf("2025/02/Anubis-B-Cross-Smoke-Lineup-Spot.jpg", "position"), rf("2025/02/Anubis-B-Cross-Smoke-Lineup.jpg", "aim"), rf("2025/02/Anubis-B-Cross-Smoke.jpg", "result")],
    meta: m("refrag-anubis", "partial", NOTE_ANUBIS_2025),
  },
  {
    id: "anu-rf-bflash", title: "B Main pop flash", map: "anubis", side: "T", type: "flash", fromId: "bmain", toId: "b",
    position: "Same corner as the B cross smoke", aim: "Tip of the leaf shown",
    instructions: ["Stay in the B cross-smoke corner.", "Put the crosshair on the tip of the leaf.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Pop flash to follow the cross smoke onto B.", difficulty: "medium", tags: ["b execute"],
    images: [rf("2025/02/Anubis-B-Cross-Smoke-Lineup-Spot.jpg", "position"), rf("2025/02/Anubis-B-Main-Flash-Lineup.jpg", "aim")],
    meta: m("refrag-anubis", "partial", NOTE_ANUBIS_2025),
  },
  {
    id: "anu-rf-heaven", title: "A Heaven smoke (wooden box)", map: "anubis", side: "T", type: "smoke", fromId: "amain", toId: "heaven",
    position: "Corner shown in the screenshot", aim: "Spot on the wooden box",
    instructions: ["Get into the corner shown.", "Put the crosshair on the spot on the wooden box.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Stops a Heaven peek as you climb onto A.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/02/Anubis-Heaven-Smoke-Lineup-Spot.jpg", "position"), rf("2025/02/Anubis-Heaven-Smoke-Lineup.jpg", "aim"), rf("2025/02/Anubis-Heaven-Smoke.jpg", "result")],
    meta: m("refrag-anubis", "partial", NOTE_ANUBIS_2025),
  },
  {
    id: "anu-rf-camera", title: "A Camera smoke", map: "anubis", side: "T", type: "smoke", fromId: "amain", toId: "a",
    position: "Up on the steps, stuck in the corner shown", aim: "As shown in the screenshot",
    instructions: ["Hop up onto the steps and get stuck in the corner.", "Line up the crosshair as shown.", "Crouch, hold left + right click and jump-throw."],
    throwType: "jump-throw", purpose: "Covers Camera for the A take. The source calls it the hardest of the set.", difficulty: "hard", tags: ["a execute"],
    images: [rf("2025/02/Anubis-Camera-Smoke-Lineup-Spot.jpg", "position"), rf("2025/02/Anubis-Camera-Smoke-Lineup.jpg", "aim"), rf("2025/02/Anubis-Camera-Smoke.jpg", "result")],
    meta: m("refrag-anubis", "partial", NOTE_ANUBIS_2025),
  },
  {
    id: "anu-he-default-a", title: "Default A HE from Heaven", map: "anubis", side: "CT", type: "he", fromId: "heaven", toId: "a",
    position: "Next to the right wall in Heaven, leading to A", aim: "Spot shown in the screenshot",
    instructions: ["Stand next to the right wall in Heaven that leads to A.", "Aim at the spot shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Lands on default A — where Ts plant after taking the site.", difficulty: "easy", tags: ["retake"],
    images: [cp("image7-20.png", "aim"), cp("image1-20.png", "result")],
    meta: m("cs2pulse-he-anubis", "partial", NOTE_HE_2024),
  },
  {
    id: "anu-he-pillar", title: "Behind-pillar HE from B Long", map: "anubis", side: "T", type: "he", fromId: "bmain", toId: "b",
    position: "Spot in B Long shown in the screenshot", aim: "As shown in the screenshot",
    instructions: ["Stand on the spot in B Long.", "Line up the crosshair as shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Hits a CT behind the pillar who thinks only one angle matters.", difficulty: "medium", tags: ["b execute"],
    images: [cp("image3-18.png", "aim"), cp("image2-19.png", "result")],
    meta: m("cs2pulse-he-anubis", "partial", NOTE_HE_2024),
  },

  // ───────────── OVERPASS · Refrag (Jul 2025) ─────────────
  {
    id: "ovp-rf-heaven", title: "B Heaven smoke from Short", map: "overpass", side: "T", type: "smoke", fromId: "connector", toId: "b",
    position: "Stuck in the corner of the board at Short", aim: "As shown in the screenshot",
    instructions: ["Get stuck in the corner of the board.", "Put the crosshair where the screenshot shows.", "Left-click throw."],
    throwType: "left-click", purpose: "Smokes Heaven for the B take.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/07/Overpass-Heaven-Lineup-Spot.jpg", "position"), rf("2025/07/Overpass-Heaven-Smoke-Lineup.jpg", "aim"), rf("2025/07/Overpass-Heaven-Smoke.jpg", "result")],
    meta: m("refrag-overpass"),
  },
  {
    id: "ovp-rf-monster", title: "Monster smoke from CT (Dumpster)", map: "overpass", side: "CT", type: "smoke", fromId: "a", toId: "monster",
    position: "Corner of the dumpster at Dumpster (A side)", aim: "As shown in the screenshot",
    instructions: ["Stand in the corner of the dumpster.", "Put the crosshair where the screenshot shows.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Lets your A player give B early control: Monster is smoked before Ts arrive.", difficulty: "medium", tags: ["anti-rush"],
    images: [rf("2025/07/Overpass-Monster-and-Short-Lineup-Spot.jpg", "position"), rf("2025/07/Overpass-Monster-Smoke-Lineup.jpg", "aim"), rf("2025/07/Overpass-Monster-Smoke.jpg", "result")],
    meta: m("refrag-overpass"),
  },
  {
    id: "ovp-rf-short", title: "B Short smoke from CT (Dumpster)", map: "overpass", side: "CT", type: "smoke", fromId: "a", toId: "connector",
    position: "Same dumpster corner as the Monster smoke", aim: "As shown in the screenshot",
    instructions: ["Stay in the dumpster corner.", "Put the crosshair where the screenshot shows.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Smokes Short before Ts can get there.", difficulty: "medium", tags: ["anti-rush"],
    images: [rf("2025/07/Overpass-Monster-and-Short-Lineup-Spot.jpg", "position"), rf("2025/07/Overpass-Short-Smoke-Lineup.jpg", "aim"), rf("2025/07/Overpass-Short-Smoke.jpg", "result")],
    meta: m("refrag-overpass"),
  },
  {
    id: "ovp-rf-bank", title: "A Bank smoke from Mid", map: "overpass", side: "T", type: "smoke", fromId: "mid", toId: "a",
    position: "Corner of the leftmost bench in Mid", aim: "As shown in the screenshot",
    instructions: ["Line up at the corner of the leftmost bench.", "Put the crosshair where the screenshot shows.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Smoke 1/2 of an easy A execute from Mid.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/07/Overpass-Bank-and-Dumpster-Lineup-Spot.jpg", "position"), rf("2025/07/Overpass-Bank-Smoke-Lineup.jpg", "aim"), rf("2025/07/Overpass-A-Site-Smokes.jpg", "result")],
    meta: m("refrag-overpass"),
  },
  {
    id: "ovp-rf-dumpster", title: "A Dumpster smoke from Mid", map: "overpass", side: "T", type: "smoke", fromId: "mid", toId: "a",
    position: "Same bench corner as the Bank smoke", aim: "Right side of the right-hand round vent, straight up to the roof edge",
    instructions: ["Stay at the bench corner.", "Find the right side of the right-hand round vent and go straight up to the roof edge.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Smoke 2/2 of the A execute from Mid.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/07/Overpass-Bank-and-Dumpster-Lineup-Spot.jpg", "position"), rf("2025/07/Overpass-Dumpster-Smoke-Lineup.jpg", "aim"), rf("2025/07/Overpass-A-Site-Smokes.jpg", "result")],
    meta: m("refrag-overpass"),
  },

  // ───────────── CACHE · Refrag (Jul 2025, pre-release Cache) ─────────────
  {
    id: "cac-rf-mid-flash", title: "Mid pop flash (CT)", map: "cache", side: "CT", type: "flash", fromId: "ct", toId: "mid",
    position: "Spot shown in the screenshot", aim: "As shown in the screenshot",
    instructions: ["Line up as shown.", "Put the crosshair where the screenshot shows.", "Right-click jump-throw — it pops about where the crosshair is in the third screenshot."],
    throwType: "jump-throw", purpose: "Fast pop flash on Mid with little reaction time for Ts.", difficulty: "easy", tags: ["mid control", "anti-rush"],
    images: [rf("2025/05/Cache-Mid-Popflash-Lineup-Spot.jpg", "position"), rf("2025/05/Cache-Mid-Popflash-Lineup.jpg", "aim"), rf("2025/05/Cache-Mid-Popflash-Pop-Spot.jpg", "result")],
    meta: m("refrag-cache", "partial", NOTE_CACHE_2025),
  },
  {
    id: "cac-rf-tmid", title: "T Mid smoke (CT washing machine)", map: "cache", side: "CT", type: "smoke", fromId: "ct", toId: "mid",
    position: "Right-hand corner of the washing machine outside CT Spawn", aim: "As shown in the screenshot",
    instructions: ["Stand in the right-hand corner of the washing machine outside CT Spawn.", "Put the crosshair where the screenshot shows.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks the T Mid / Garage entrance to slow early T Mid control.", difficulty: "easy", tags: ["mid control", "anti-rush"],
    images: [rf("2025/05/Cache-T-Mid-Smoke-Lineup-Spot.jpg", "position"), rf("2025/05/Cache-T-Mid-Smoke-Lineup.jpg", "aim"), rf("2025/05/Cache-T-Mid-Smoke.jpg", "result")],
    meta: m("refrag-cache", "partial", NOTE_CACHE_2025),
  },
  {
    id: "cac-rf-amain", title: "A Main smoke (CT washing machine)", map: "cache", side: "CT", type: "smoke", fromId: "ct", toId: "amain",
    position: "Same washing-machine corner", aim: "Start at the first spot, shift-walk until the crosshair reaches the second spot",
    instructions: ["Tuck in next to the washing machine.", "Start with the crosshair on spot 1, then shift-walk until it reaches spot 2.", "Jump-throw while still shift-walking."],
    throwType: "walk-throw", purpose: "Slows a T push through A Main.", difficulty: "hard", tags: ["anti-rush"],
    images: [rf("2025/05/Cache-A-Main-Smoke-Lineup-Pos1-1.jpg", "position"), rf("2025/05/Cache-A-Main-Smoke-Lineup-Pos2.jpg", "aim"), rf("2025/05/Cache-A-Main-Smoke.jpg", "result")],
    meta: m("refrag-cache", "partial", NOTE_CACHE_2025),
  },
  {
    id: "cac-rf-tree", title: "B Tree smoke", map: "cache", side: "T", type: "smoke", fromId: "bmain", toId: "b",
    position: "Lined up as shown in the screenshot", aim: "As shown in the screenshot",
    instructions: ["Line up as shown.", "Put the crosshair where the screenshot shows.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Smokes off Tree for the B take.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/05/Cache-B-Tree-Lineup-Spot-1.jpg", "position"), rf("2025/05/Cache-B-Tree-Lineup.jpg", "aim"), rf("2025/05/Cache-B-Tree-Smoke.jpg", "result")],
    meta: m("refrag-cache", "partial", NOTE_CACHE_2025),
  },

  // ───────────── TRAIN · Refrag (Jan 2025) ─────────────
  {
    id: "trn-rf-camera", title: "Camera smoke (stained bollard)", map: "train", side: "T", type: "smoke", fromId: "tmain", toId: "a",
    position: "Corner of the yellow bollard with the big stain", aim: "Bottom corner of the roof overhang",
    instructions: ["Get into the corner of the stained yellow bollard.", "Aim at the bottom corner of the roof overhang.", "Jump-throw."],
    throwType: "jump-throw", purpose: "The source's key T default smoke on Train; pairs with Sandwich for an A execute.", difficulty: "easy", tags: ["default", "a execute"],
    images: [rf("2025/01/De_Train-Stained-Bollard-Lineup-Spot.jpg", "position"), rf("2025/01/De_Train-Camera-Smoke-Lineup-edited.jpg", "aim")],
    meta: m("refrag-train"),
  },
  {
    id: "trn-rf-sandwich", title: "Sandwich smoke", map: "train", side: "T", type: "smoke", fromId: "tmain", toId: "a",
    position: "Yellow bollard to the left of the graffiti on the train", aim: "Blemish on the wall shown",
    instructions: ["Tuck into the yellow bollard left of the graffiti on the train.", "Aim at the blemish on the wall.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Sandwich smoke for the A execute.", difficulty: "medium", tags: ["a execute"],
    images: [rf("2025/01/De_Train-Free-Bollard-Lineup-Spot.jpg", "position"), rf("2025/01/De_Train-Sandwich-Smoke-Lineup-edited.jpg", "aim"), rf("2025/01/De_Train-Sandwich-Smoke.jpg", "result")],
    meta: m("refrag-train"),
  },
  {
    id: "trn-rf-aflash", title: "A site pop flash", map: "train", side: "T", type: "flash", fromId: "tmain", toId: "a",
    position: "On the corner, looking at the leftmost side of the gutter", aim: "Top-right corner of the 'A' sign",
    instructions: ["Stand on the corner looking at the leftmost side of the gutter.", "Aim at the top-right corner of the 'A' sign.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Pop flash for teammates rushing out of T-Con onto A.", difficulty: "easy", tags: ["a execute"],
    images: [rf("2025/01/De_Train-A-Flash-Lineup-Spot.jpg", "position"), rf("2025/01/De_Train-A-Flash-Lineup-edited.jpg", "aim")],
    meta: m("refrag-train"),
  },
  {
    id: "trn-rf-bottom-ramp", title: "B Bottom Ramp smoke", map: "train", side: "T", type: "smoke", fromId: "tspawn", toId: "b",
    position: "Lined up with the edge of the wall", aim: "Shadow on the floor",
    instructions: ["Line up with the edge of the wall.", "Aim at the shadow on the floor.", "Right-click throw."],
    throwType: "right-click", purpose: "Smoke 1/2 to get out onto B.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/01/De_Train-Bottom-Ramp-Lineup-Spot.jpg", "position"), rf("2025/01/De_Train-Bottom-Ramp-Smoke-Lineup-edited.jpg", "aim"), rf("2025/01/De_Train-B-Smokes.jpg", "result")],
    meta: m("refrag-train"),
  },
  {
    id: "trn-rf-bomb-train", title: "B Bomb Train smoke", map: "train", side: "T", type: "smoke", fromId: "tspawn", toId: "b",
    position: "Stuck in the corner of the box", aim: "Centre of the light part of the trash bag",
    instructions: ["Get stuck in the corner of the box.", "Aim at the centre of the light quadrant of the trash bag.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Smoke 2/2 to get out onto B.", difficulty: "easy", tags: ["b execute"],
    images: [rf("2025/01/De_Train-Bomb-Train-Lineup-Spot.jpg", "position"), rf("2025/01/De_Train-Bomb-Train-Smoke-Lineup-edited.jpg", "aim"), rf("2025/01/De_Train-B-Smokes.jpg", "result")],
    meta: m("refrag-train"),
  },
  {
    id: "trn-rf-tcon", title: "T-Con smoke (CT)", map: "train", side: "CT", type: "smoke", fromId: "ct", toId: "tmain",
    position: "Stuck in the corner shown", aim: "Start at spot 1, shift-walk until the crosshair hits spot 2",
    instructions: ["Get stuck in the corner.", "Start with the crosshair on spot 1, then shift-walk until it hits spot 2.", "Jump-throw the moment it hits spot 2."],
    throwType: "walk-throw", purpose: "CT default that makes T pops onto A harder.", difficulty: "hard", tags: ["default", "anti-rush"],
    images: [rf("2025/01/De_Train-T-Con-Lineup-Spot.jpg", "position"), rf("2025/01/De_Train-T-Con-Lineup-Pos1-edited.jpg", "aim"), rf("2025/01/De_Train-T-Con-Lineup-Pos2-edited.jpg", "aim")],
    meta: m("refrag-train"),
  },
];
