import type { Grenade, LineupImage, SourceMeta } from "@/types/content";

/**
 * Grenade lineups (checked 24 Nov 2026).
 *
 * Images are hot-linked from the source article (never bundled) and credited.
 * Instructions are paraphrased from that same article.
 */
const D = "2026-11-24";
const m = (sourceId: string, status: SourceMeta["status"] = "verified", note?: string): SourceMeta => ({ sourceId, status, checkedAt: D, note });

const BLAST = "https://sanity-cdn.blast.tv/images/6znhzi10/production/";
const b = (file: string, kind: LineupImage["kind"]): LineupImage => ({ src: `${BLAST}${file}?w=1280&auto=format`, kind, credit: "BLAST.tv" });
const CI = "https://www.charlieintel.com/cdn-image/wp-content/uploads/";
const ci = (path: string, kind: LineupImage["kind"] = "aim"): LineupImage => ({ src: `${CI}${path}?width=1200&quality=75&format=auto`, kind, credit: "Dexerto / Charlie INTEL" });

const PARTIAL = "No screenshot in the source — line it up in CS2 → Practice → Grenade guide before relying on it.";

export const GRENADES: Grenade[] = [
  // ───────────── MIRAGE · BLAST.tv ─────────────
  {
    id: "mir-ct-palace", title: "CT smoke", map: "mirage", side: "T", type: "smoke", fromId: "tramp", toId: "ct",
    position: "Vertical line on the wall at the corner leading to Ramp", aim: "Slightly under the tower corner",
    instructions: ["Line up on the vertical line at the corner to Ramp.", "Aim slightly under the tower corner.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Cuts CT Spawn / Ticket vision for the A execute.", difficulty: "medium", tags: ["a execute"],
    images: [b("a4d1870d47df84cfb04bfd6f5c8bbc444ae2b143-1920x1080.jpg", "position"), b("3f2368b2da57f2a9144f7d413e1fbe4343f1a150-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },
  {
    id: "mir-stairs-tspawn", title: "Stairs smoke", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "stairs",
    position: "Corner of the first step just outside T Spawn", aim: "Gap in the scaffolding",
    instructions: ["Stand on the corner of the first step outside T Spawn.", "Look up at the gap in the scaffolding.", "Left-click throw. Pair it with Jungle."],
    throwType: "left-click", purpose: "Blocks Stairs onto A. Don't throw it without Jungle.", difficulty: "easy", tags: ["a execute"],
    images: [b("7861a88688c4de78882074c0f13bd3504d8e4545-1920x1080.jpg", "position"), b("16aa05de0e38083483a27b30ad45bfd3de4fd19a-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },
  {
    id: "mir-jungle-tspawn", title: "Jungle smoke", map: "mirage", side: "T", type: "smoke", fromId: "tramp", toId: "jungle",
    position: "Up the steps past the Stairs spot, round the corner, at the marked spot on the wall", aim: "Marked spot after turning 180°",
    instructions: ["Continue up the steps from the Stairs spot and go round the corner.", "Stand at the marked spot on the wall, turn 180°.", "Aim at the marked spot and left-click throw."],
    throwType: "left-click", purpose: "Covers Jungle / Connector gap for the A execute.", difficulty: "medium", tags: ["a execute"],
    images: [b("9d28d927b0fb353d964d4cd3817c5c3b9e635d97-1920x1080.jpg", "position"), b("22336034f98e200d6d3d5c8a91e85d260db57cfe-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },
  {
    id: "mir-topmid", title: "Top Mid smoke", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "topmid",
    position: "On top of the bin in T Spawn", aim: "The antenna",
    instructions: ["Jump on the bin in T Spawn.", "Aim at the antenna.", "Left-click throw."],
    throwType: "left-click", purpose: "Lets you cross Mid safely.", difficulty: "easy", tags: ["mid control"],
    images: [b("7f2aff21e2c56ac5a8fa2eed608ae9ab48268a82-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },
  {
    id: "mir-window-tspawn", title: "Window smoke", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "window",
    position: "Left of the bin in T Spawn", aim: "Top-right of the door",
    instructions: ["Stand left of the bin.", "Aim at the top-right of the door.", "Tap D, then jump-throw."],
    throwType: "jump-throw", purpose: "Blocks the Window AWP so you can take Top Mid.", difficulty: "medium", tags: ["mid control", "anti-awp"],
    images: [b("fc4087ce3b13117302386ec5151598aa3e05439e-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },
  {
    id: "mir-connector-tspawn", title: "Top Connector smoke", map: "mirage", side: "T", type: "smoke", fromId: "tspawn", toId: "connector",
    position: "Crouched, left of the bin in T Spawn", aim: "Crouch-walk until the crosshair reaches the tip of the balcony",
    instructions: ["Crouch to the left of the bin and aim as shown.", "Crouch-walk forward until the crosshair reaches the tip of the balcony.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Cuts Connector off from Mid and A.", difficulty: "hard", tags: ["mid control", "a execute"],
    images: [b("729d3ad3ac10e6e3fe0082ae8efb53ab48945d48-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },
  {
    id: "mir-market-window", title: "Market Window smoke", map: "mirage", side: "T", type: "smoke", fromId: "apps", toId: "market",
    position: "Corner on the right as you leave the TV room (Apartments)", aim: "Up at the tower",
    instructions: ["Get into the right-hand corner as you leave the TV room.", "Aim up at the tower.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks Market Window for the B execute.", difficulty: "medium", tags: ["b execute"],
    images: [b("0ddea8f25dd75d29d685bae768c79a530b2ab104-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },
  {
    id: "mir-market-door", title: "Market Door smoke", map: "mirage", side: "T", type: "smoke", fromId: "apps", toId: "market",
    position: "Same corner as Market Window", aim: "The window on the tower",
    instructions: ["Same spot as the Market Window smoke.", "Aim at the window on the tower.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks the Market (Kitchen) door for the B execute.", difficulty: "medium", tags: ["b execute"],
    images: [b("1026faa2bcff7d8368952596fcfdf952b7a82769-1920x1080.jpg", "aim")],
    meta: m("blast-mirage"),
  },

  // ───────────── INFERNO · BLAST.tv ─────────────
  {
    id: "inf-short", title: "Short smoke", map: "inferno", side: "T", type: "smoke", fromId: "mid", toId: "short",
    position: "Between Mid, Second Mid and Apartments", aim: "Turn around, look up at the antenna",
    instructions: ["Stand where Mid, Second Mid and Apartments meet.", "Turn around and look up at the antenna.", "Left-click throw."],
    throwType: "left-click", purpose: "Covers Short for an A hit.", difficulty: "easy", tags: ["a execute"],
    images: [b("056d69d396ab2db95ef26eb3f1fc81f29b9c5c29-1920x1080.jpg", "position"), b("5261f8df89734dba19525c04fb77df17a706f4e4-1920x1080.jpg", "aim")],
    meta: m("blast-inferno"),
  },
  {
    id: "inf-long", title: "A Long smoke", map: "inferno", side: "T", type: "smoke", fromId: "secondmid", toId: "along",
    position: "Corner in Second Mid", aim: "Just above the roof of the building",
    instructions: ["Go back into Second Mid, into the corner.", "Aim just above the roof of the building.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks Long for an A hit.", difficulty: "medium", tags: ["a execute"],
    images: [b("5572ab6a8b7980fd1ed1bfe6c9d380a0537dc43f-1920x1080.jpg", "position"), b("f67449f66997f9914696a6d13ee2a0f89596beae-1920x1080.jpg", "aim")],
    meta: m("blast-inferno"),
  },
  {
    id: "inf-moto", title: "Moto smoke", map: "inferno", side: "T", type: "smoke", fromId: "mid", toId: "moto",
    position: "Marked spot in Mid", aim: "The archway",
    instructions: ["Stand at the marked spot in Mid.", "Aim at the archway.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Isolates Moto during an A execute.", difficulty: "medium", tags: ["a execute"],
    images: [b("4fe427910ad6cb5ecc042fbff6bb24ad80127460-1920x1080.jpg", "position"), b("500674322c0bdfc4812b8a0a7817e9f98874a9fe-1920x1080.jpg", "aim")],
    meta: m("blast-inferno"),
  },
  {
    id: "inf-arch", title: "Arch smoke", map: "inferno", side: "T", type: "smoke", fromId: "secondmid", toId: "arch",
    position: "Second Mid, near Balcony", aim: "Above the balcony",
    instructions: ["Stand in Second Mid near Balcony.", "Look above the balcony.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Cuts the CT rotation through Arch (A wrap via Long).", difficulty: "medium", tags: ["a execute"],
    images: [b("090fd44dffa1cccedc4ebb0b3a6863b16112511d-1920x1080.jpg", "position"), b("73ba0db581963b22e74f77694924db0a416ad0c5-1920x1080.jpg", "aim")],
    meta: m("blast-inferno"),
  },
  {
    id: "inf-library", title: "Library smoke", map: "inferno", side: "T", type: "smoke", fromId: "secondmid", toId: "library",
    position: "Same spot as the Arch smoke", aim: "Lower than the Arch smoke",
    instructions: ["Same spot as the Arch smoke.", "Aim lower.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks Library for the A wrap.", difficulty: "medium", tags: ["a execute"],
    images: [b("090fd44dffa1cccedc4ebb0b3a6863b16112511d-1920x1080.jpg", "position"), b("deb1187fbce2eb2156b099918b3f98fdb4a5e405-1920x1080.jpg", "aim")],
    meta: m("blast-inferno"),
  },
  {
    id: "inf-ct-banana", title: "CT smoke", map: "inferno", side: "T", type: "smoke", fromId: "banana", toId: "ct",
    position: "Marked spot on Banana", aim: "Just left of the Church corner",
    instructions: ["Go to the marked spot on Banana.", "Look up just left of the Church corner.", "Left-click throw. Also covers the boost spot."],
    throwType: "left-click", purpose: "Blocks CT rotation and the boost for a B execute.", difficulty: "easy", tags: ["b execute"],
    images: [b("d073bb0bda3d41b5eab38bfb12511fc580087aa8-1920x1080.jpg", "position"), b("c9ed1ed5399d4f4aef9740141191c50dcd275a0a-1920x1080.jpg", "aim")],
    meta: m("blast-inferno"),
  },
  {
    id: "inf-coffins-banana", title: "Coffins smoke", map: "inferno", side: "T", type: "smoke", fromId: "banana", toId: "coffins",
    position: "Further forward on Banana, at the marked spot", aim: "Above the scaffolding, at the strip of lights",
    instructions: ["Move further forward on Banana to the marked spot.", "Aim above the scaffolding at the strip of lights.", "Left-click throw."],
    throwType: "left-click", purpose: "Removes the Coffins defender for a B execute.", difficulty: "easy", tags: ["b execute"],
    images: [b("8bef16d46f9a0e9e79b686916ce921bb56221be9-1920x1080.jpg", "position"), b("826b28c42a48ba62dd9c64226d43812a3ee0022a-1920x1080.jpg", "aim")],
    meta: m("blast-inferno"),
  },
  {
    id: "inf-newbox-molly", title: "New Box molotov", map: "inferno", side: "T", type: "molotov", fromId: "banana", toId: "newbox",
    position: "See source", aim: "See source",
    instructions: ["Part of the simple B execute: molotov New Box after the CT and Coffins smokes."],
    throwType: "unknown", purpose: "Clears the close New Box spot before entry.", difficulty: "medium", tags: ["b execute"],
    meta: m("expcarry-inferno", "partial", PARTIAL),
  },

  // ───────────── DUST II · Dexerto ─────────────
  {
    id: "d2-ct-long", title: "CT smoke from Long", map: "dust2", side: "T", type: "smoke", fromId: "long", toId: "ct",
    position: "Running at the corner of the A Long wall", aim: "Left of the antenna",
    instructions: ["Run at the corner of the A Long wall.", "Aim left of the antenna.", "Running jump-throw."],
    throwType: "run-jump-throw", purpose: "Lets Long players cross to A without CT vision.", difficulty: "medium", tags: ["a execute"],
    images: [ci("2023/10/02/cs2-dust-2-along-ct-cross-smoke-lineup-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },
  {
    id: "d2-ct-deep", title: "Deep CT smoke", map: "dust2", side: "T", type: "smoke", fromId: "longdoors", toId: "ct",
    position: "Next to A Long doors", aim: "X-shaped windows, then turn and aim above the building edge",
    instructions: ["Align with the middle of the X-shaped windows, just left of the Long doors.", "Turn and aim higher than the building's edge.", "Standard throw."],
    throwType: "left-click", purpose: "Alternative CT smoke for crossing to A.", difficulty: "medium", tags: ["a execute"],
    images: [ci("2023/10/02/cs2-dust2-a-long-deep-ct-cross-smoke-lineups-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },
  {
    id: "d2-ashort", title: "A Short smoke", map: "dust2", side: "T", type: "smoke", fromId: "long", toId: "short",
    position: "A Long, see screenshot", aim: "Bottom of the ledge",
    instructions: ["Aim at the bottom of the ledge.", "Standard throw."],
    throwType: "left-click", purpose: "Keeps you safe from CTs on Short while taking A.", difficulty: "easy", tags: ["a execute"],
    images: [ci("2023/10/02/cs2-dust2-a-short-cross-smoke-lineups-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },
  {
    id: "d2-xbox", title: "Xbox smoke", map: "dust2", side: "T", type: "smoke", fromId: "tspawn", toId: "xbox",
    position: "T Spawn, tucked in the corner at the edge of the railing", aim: "Left corner of the building in front",
    instructions: ["Jump to the edge of the railing in T Spawn, tucked in the corner.", "Aim at the left corner of the building in front.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Denies CT vision onto Catwalk and high Mid.", difficulty: "medium", tags: ["mid control"],
    images: [ci("2023/10/02/cs2-dust2-xbox-catwalk-mid-smoke-lineups-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },
  {
    id: "d2-ctspawn-xbox", title: "CT Spawn smoke from Mid", map: "dust2", side: "T", type: "smoke", fromId: "xbox", toId: "ct",
    position: "Against Xbox", aim: "Small mark on the Mid wall",
    instructions: ["Stand against Xbox.", "Aim at the small mark on the Mid wall.", "Standard throw."],
    throwType: "left-click", purpose: "Smokes off CT Spawn to move through Mid.", difficulty: "easy", tags: ["mid control"],
    images: [ci("2023/10/02/cs2-dust2-xbox-mid-ct-cross-smoke-lineups-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },
  {
    id: "d2-bdoor", title: "B Doors smoke", map: "dust2", side: "T", type: "smoke", fromId: "outtunnels", toId: "bdoors",
    position: "Outside Tunnels, against the platform's ledge", aim: "Just below the crack",
    instructions: ["Stand against the platform's ledge in Outside Tunnels.", "Aim just below the crack.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks B Doors for the B hit.", difficulty: "medium", tags: ["b execute"],
    images: [ci("2023/10/02/cs2-dust2-b-door-smoke-lineups-2-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },
  {
    id: "d2-bwindow", title: "B Window smoke", map: "dust2", side: "T", type: "smoke", fromId: "outtunnels", toId: "window",
    position: "Same spot as B Doors", aim: "Lower than the B Doors smoke",
    instructions: ["Same spot as the B Doors smoke.", "Move the crosshair lower.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks B Window for the B hit.", difficulty: "medium", tags: ["b execute"],
    images: [ci("2023/10/02/cs2-dust2-b-window-smoke-lineups-1-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },
  {
    id: "d2-bplatform", title: "B Platform smoke", map: "dust2", side: "T", type: "smoke", fromId: "upper", toId: "platform",
    position: "Against the wall next to the first pillar in B Tunnels", aim: "Sky, just under the wooden plank",
    instructions: ["Stand against the wall by the first pillar in B Tunnels.", "Aim at the sky just under the wooden plank.", "Throw."],
    throwType: "left-click", purpose: "Third smoke for the B hit.", difficulty: "easy", tags: ["b execute"],
    images: [ci("2023/10/02/cs2-dust2-b-platform-smoke-lineup-1024x576.jpg")],
    meta: m("charlieintel-dust2"),
  },

  // ───────────── ANCIENT · BLAST.tv ─────────────
  {
    id: "anc-topmid", title: "Mid smoke", map: "ancient", side: "T", type: "smoke", fromId: "tspawn", toId: "mid",
    position: "This side of the pillar in T Spawn", aim: "The wall on your left",
    instructions: ["Stand on this side of the pillar in T Spawn.", "Look at the wall on your left.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Opens Mid — the key to Donut/A and Cave/B.", difficulty: "medium", tags: ["mid control"],
    images: [b("9900a5dc4890f8cdc466b1f83149ed95aef6bdb5-1920x1080.jpg", "position"), b("6aef1b2307c1261dc8c7a5cecc6095fbb0f18e87-1920x1080.jpg", "aim")],
    meta: m("blast-ancient"),
  },
  {
    id: "anc-a-ct", title: "A CT smoke", map: "ancient", side: "T", type: "smoke", fromId: "amain", toId: "ct",
    position: "Corner outside A Main", aim: "Corner above the A Main doorway",
    instructions: ["Stand in the corner outside A Main.", "Look up at the corner above the A Main doorway.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks the deep CT angle (favourite AWP spot).", difficulty: "medium", tags: ["a execute"],
    images: [b("a89b3ebc2c42ac9e312f523312ef698c04e15444-1920x1080.jpg", "position"), b("d01ea73a05cab774aa6e93f9d6775bded9151665-1920x1080.jpg", "aim")],
    meta: m("blast-ancient"),
  },
  {
    id: "anc-temple", title: "Temple smoke", map: "ancient", side: "T", type: "smoke", fromId: "amain", toId: "temple",
    position: "Same corner as A CT", aim: "Marked spot",
    instructions: ["After the A CT smoke, stay in the same corner.", "Aim at the marked spot.", "Left-click throw."],
    throwType: "left-click", purpose: "Blocks Temple for the A execute.", difficulty: "easy", tags: ["a execute"],
    images: [b("a89b3ebc2c42ac9e312f523312ef698c04e15444-1920x1080.jpg", "position"), b("7d82d84624574d3c881b7bdb41ecc8737b8a39b2-1920x1080.jpg", "aim")],
    meta: m("blast-ancient"),
  },
  {
    id: "anc-donut", title: "Donut smoke from A Main", map: "ancient", side: "T", type: "smoke", fromId: "amain", toId: "donut",
    position: "Same corner as A CT", aim: "As shown",
    instructions: ["Same corner outside A Main.", "Move the crosshair as shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Blocks Donut for the A execute.", difficulty: "medium", tags: ["a execute"],
    images: [b("a89b3ebc2c42ac9e312f523312ef698c04e15444-1920x1080.jpg", "position"), b("7eb39eef79bcc7e40de666dbb32188deeee84c0e-1920x1080.jpg", "aim")],
    meta: m("blast-ancient"),
  },
  {
    id: "anc-cave", title: "Cave smoke", map: "ancient", side: "T", type: "smoke", fromId: "bramp", toId: "cave",
    position: "Corner before the doors to Lane", aim: "Turn away from the corner, as shown",
    instructions: ["Stand in the corner before the doors to Lane.", "Turn away from the corner, aim as shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "First of three B smokes from one spot.", difficulty: "medium", tags: ["b execute"],
    images: [b("a4cac6a7ab7fa14b9b3e2a7bfad62487cc308429-1920x1080.jpg", "position"), b("9fbed4bdb12e4cf6a9e3293a4018b8f69c7f766a-1920x1080.jpg", "aim")],
    meta: m("blast-ancient"),
  },
  {
    id: "anc-bshort", title: "B Short smoke", map: "ancient", side: "T", type: "smoke", fromId: "bramp", toId: "bshort",
    position: "Corner before the doors to Lane", aim: "As shown",
    instructions: ["Same corner as the Cave smoke.", "Aim as shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "B Short is a common AWP angle.", difficulty: "medium", tags: ["b execute", "anti-awp"],
    images: [b("a4cac6a7ab7fa14b9b3e2a7bfad62487cc308429-1920x1080.jpg", "position"), b("b2c5a3d240dbed5e5f418e732c939dcb01775cbe-1920x1080.jpg", "aim")],
    meta: m("blast-ancient"),
  },
  {
    id: "anc-blong", title: "B Long smoke", map: "ancient", side: "T", type: "smoke", fromId: "bramp", toId: "blong",
    position: "Corner before the doors to Lane", aim: "Marked spot",
    instructions: ["Same corner as the Cave smoke.", "Aim at the marked spot.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Third B smoke — blocks Long.", difficulty: "medium", tags: ["b execute"],
    images: [b("a4cac6a7ab7fa14b9b3e2a7bfad62487cc308429-1920x1080.jpg", "position"), b("f1b3bd4dc5ebaaab857df90be92f7d2ad076761c-1920x1080.jpg", "aim")],
    meta: m("blast-ancient"),
  },

  // ───────────── ANUBIS · BLAST.tv ─────────────
  {
    id: "anu-mid", title: "Mid smoke from T Spawn", map: "anubis", side: "T", type: "smoke", fromId: "tspawn", toId: "mid",
    position: "Door at the back of T Spawn", aim: "Turn 180°, the wall opposite",
    instructions: ["Go to the door at the back of T Spawn and line up.", "Turn 180° and aim at the wall opposite.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Easy control of the Bridge — first step to split A or pull a B player.", difficulty: "medium", tags: ["mid control"],
    images: [b("31a5b0a5a6dba137854bdd39aab68920f6fe2936-1920x1080.jpg", "position"), b("28bfcc53f06f5e1b38e56735512a77447fb9f787-1920x1080.jpg", "aim")],
    meta: m("blast-anubis", "verified", "Anubis had clipping changes after its Jan 2026 return — re-test once."),
  },
  {
    id: "anu-bconn", title: "B Connector smoke from T Spawn", map: "anubis", side: "T", type: "smoke", fromId: "tspawn", toId: "bconn",
    position: "Wall just outside T Spawn (see minimap in screenshot)", aim: "Turn around, as shown",
    instructions: ["Go just outside T Spawn to the wall shown.", "Turn around and aim as shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Default smoke that keeps CTs guessing.", difficulty: "medium", tags: ["default"],
    images: [b("90957e20db2943c56f3e36139e02fe0d35238b54-1920x1080.jpg", "position"), b("2d2040c3df19d8eb2bf3c52052acc8bedb23f348-1920x1080.jpg", "aim")],
    meta: m("blast-anubis"),
  },
  {
    id: "anu-heaven", title: "Heaven smoke", map: "anubis", side: "T", type: "smoke", fromId: "amain", toId: "heaven",
    position: "Canal outside A Main", aim: "Part of the roof shown",
    instructions: ["Go to the canal outside A Main and line up.", "Line up with the part of the roof shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "First smoke of the A execute.", difficulty: "medium", tags: ["a execute"],
    images: [b("7277ba3490db22ee86ac52e5a3599c4f25f663a6-1920x1080.jpg", "position"), b("fabbc0c8ff23e7ccb4cd09befbe9c80e873b3d26-1920x1080.jpg", "aim")],
    meta: m("blast-anubis"),
  },
  {
    id: "anu-plateau", title: "Plateau smoke", map: "anubis", side: "T", type: "smoke", fromId: "amain", toId: "plateau",
    position: "Corner of the canal outside A Main", aim: "The arch in the A Main wall",
    instructions: ["Line up in the canal corner outside A Main.", "Aim at the arch in the wall of A Main.", "Left-click throw."],
    throwType: "left-click", purpose: "Covers Plateau for the A execute.", difficulty: "easy", tags: ["a execute"],
    images: [b("fe21ed8c2b36b03af6d2c9bdd284237d578883aa-1920x1080.jpg", "position"), b("747b8ee7c0cfafb737e5c22616aad06255be1cd8-1920x1080.jpg", "aim")],
    meta: m("blast-anubis"),
  },
  {
    id: "anu-connector", title: "A Connector smoke", map: "anubis", side: "T", type: "smoke", fromId: "amain", toId: "connector",
    position: "Outside A Main", aim: "Turn around, spot shown",
    instructions: ["Stand at the spot outside A Main.", "Turn around and aim at the spot shown.", "Left-click throw."],
    throwType: "left-click", purpose: "Stops rotating CTs from Connector.", difficulty: "easy", tags: ["a execute"],
    images: [b("640474d5a0443f081379c8fc4c8a8fe933aca56e-1920x1080.jpg", "position"), b("f6f0b7d939df9701ba076622b9526e80c0aee281-1920x1080.jpg", "aim")],
    meta: m("blast-anubis"),
  },
  {
    id: "anu-street", title: "Street smoke", map: "anubis", side: "T", type: "smoke", fromId: "bmain", toId: "street",
    position: "Wall in B Main (B Long)", aim: "Turn 180°, as shown",
    instructions: ["Stand at the wall in B Main.", "Turn 180° and aim as shown.", "Left-click throw. One player can throw all three B smokes."],
    throwType: "left-click", purpose: "B execute smoke 1/3.", difficulty: "easy", tags: ["b execute"],
    images: [b("a0c048adb2383c0fae2fd2f0dc6ed69d3adf3317-1920x1080.jpg", "position"), b("5ab2d7100165b7a51dd6e2d1ef0fa51bd406dce3-1920x1080.jpg", "aim")],
    meta: m("blast-anubis"),
  },
  {
    id: "anu-temple", title: "Temple smoke", map: "anubis", side: "T", type: "smoke", fromId: "bmain", toId: "temple",
    position: "Same wall in B Main", aim: "As shown",
    instructions: ["Same spot as the Street smoke.", "Aim as shown.", "Left-click throw."],
    throwType: "left-click", purpose: "B execute smoke 2/3.", difficulty: "easy", tags: ["b execute"],
    images: [b("a0c048adb2383c0fae2fd2f0dc6ed69d3adf3317-1920x1080.jpg", "position"), b("0b9d1dfe61243711f077d108f94adf7a755966d8-1920x1080.jpg", "aim")],
    meta: m("blast-anubis"),
  },
  {
    id: "anu-bconn-b", title: "Connector smoke from B Main", map: "anubis", side: "T", type: "smoke", fromId: "bmain", toId: "bconn",
    position: "Same wall in B Main", aim: "As shown",
    instructions: ["Same spot as the Street smoke.", "Aim as shown.", "Left-click throw."],
    throwType: "left-click", purpose: "B execute smoke 3/3.", difficulty: "easy", tags: ["b execute"],
    images: [b("a0c048adb2383c0fae2fd2f0dc6ed69d3adf3317-1920x1080.jpg", "position"), b("6552129b899297304290e0440551a79a992add87-1920x1080.jpg", "aim")],
    meta: m("blast-anubis"),
  },

  // ───────────── NUKE · BLAST.tv ─────────────
  {
    id: "nuk-wall", title: "Outside wall smoke #1", map: "nuke", side: "T", type: "smoke", fromId: "tspawn", toId: "outside",
    position: "On the truck in T Spawn", aim: "The wall",
    instructions: ["Stand on the truck in T Spawn.", "Aim at the wall.", "Jump-throw at the same time as smoke #2."],
    throwType: "jump-throw", purpose: "Half of the Outside wall — lets Ts cross to Secret.", difficulty: "medium", tags: ["outside"],
    images: [b("48adc2b40b82029e9ef1d7187a3efe29369260c0-1920x1080.jpg", "position"), b("5ca19a30e1640bbddd31947b81cffabfbe2e39e1-1920x1080.jpg", "aim")],
    meta: m("blast-nuke"),
  },
  {
    id: "nuk-wall-2", title: "Outside wall smoke #2", map: "nuke", side: "T", type: "smoke", fromId: "tspawn", toId: "outside",
    position: "Corner just outside T Spawn", aim: "The blue container",
    instructions: ["Stand in the corner just outside T Spawn.", "Aim at the blue container.", "Jump-throw at the same time as smoke #1."],
    throwType: "jump-throw", purpose: "Other half of the Outside wall.", difficulty: "medium", tags: ["outside"],
    images: [b("0ae3de226150507cb20e98b94c6731a548116696-1920x1080.jpg", "position"), b("8e444f35fb4017a1ff5b1931e085328cac8743a6-1920x1080.jpg", "aim")],
    meta: m("blast-nuke"),
  },
  {
    id: "nuk-garage", title: "Garage smoke", map: "nuke", side: "T", type: "smoke", fromId: "tspawn", toId: "garage",
    position: "Spot just outside T Spawn", aim: "Part of the Silo",
    instructions: ["Stand just outside T Spawn.", "Line up with the part of the Silo shown.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Lets you push to Mini for an A split.", difficulty: "medium", tags: ["outside"],
    images: [b("c98acf498bcd6c88546ce34a7a2f0f56f893700e-1920x1080.jpg", "position"), b("13ecb48b43a75a16593f73e1c64578a4320a19b9-1920x1080.jpg", "aim")],
    meta: m("blast-nuke"),
  },
  {
    id: "nuk-heaven", title: "Heaven smoke", map: "nuke", side: "T", type: "smoke", fromId: "outside", toId: "heaven",
    position: "Fences along the map border (use the blue box / minimap)", aim: "Turn around, the window",
    instructions: ["Stand at the fences along the map border.", "Turn around and aim at the window.", "Jump-throw."],
    throwType: "jump-throw", purpose: "Cuts the Heaven AWP angle.", difficulty: "medium", tags: ["a execute", "anti-awp"],
    images: [b("2481e8d86e1e512eac7ecb2a88e215dd8d16d189-1920x1080.jpg", "position"), b("240325999842e5574f6670caa720c0cf03507f30-1920x1080.jpg", "aim")],
    meta: m("blast-nuke"),
  },
  {
    id: "nuk-tred", title: "T Red smoke", map: "nuke", side: "T", type: "smoke", fromId: "tspawn", toId: "tred",
    position: "T Spawn", aim: "Slightly above the Silo",
    instructions: ["From T Spawn, aim slightly above the Silo.", "Jump-throw — it lands in front of T Red."],
    throwType: "jump-throw", purpose: "Covers T Red for the Outside cross.", difficulty: "easy", tags: ["outside"],
    meta: m("n4g-nuke"),
  },

  // ───────────── CACHE (no screenshots available) ─────────────
  {
    id: "cac-connector", title: "Connector smoke", map: "cache", side: "T", type: "smoke", fromId: "tspawn", toId: "connector",
    position: "T Spawn, centred on the third crosswalk stripe from the right", aim: "Under the start of the letter shown in source, held while running",
    instructions: ["Centre on the third crosswalk stripe from the right.", "Run, keeping the crosshair under the reference letter.", "Throw on the run."],
    throwType: "run-jump-throw", purpose: "Closes Connector at round start.", difficulty: "hard", tags: ["mid control"],
    meta: m("metaratings-cache", "partial", "Cache geometry changed several times in 2026 — re-test."),
  },
  {
    id: "cac-highway", title: "Highway smoke", map: "cache", side: "T", type: "smoke", fromId: "amain", toId: "highway",
    position: "A Main", aim: "See source",
    instructions: ["First step of the simple A execute."],
    throwType: "unknown", purpose: "Blocks Highway for the A execute.", difficulty: "medium", tags: ["a execute"],
    meta: m("expcarry-cache", "partial", PARTIAL),
  },
  {
    id: "cac-forklift", title: "Forklift molotov", map: "cache", side: "T", type: "molotov", fromId: "amain", toId: "forklift",
    position: "A Main", aim: "See source",
    instructions: ["Second step of the simple A execute, after the Highway smoke."],
    throwType: "unknown", purpose: "Flushes the Forklift position.", difficulty: "medium", tags: ["a execute"],
    meta: m("expcarry-cache", "partial", PARTIAL),
  },
];
