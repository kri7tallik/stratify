// Run: npm run validate — checks the built-in content for broken references.
import { validateContent } from "../src/lib/validate";
import { MAPS } from "../src/data/maps";
import { GRENADES } from "../src/data/grenades";
import { TACTICS } from "../src/data/tactics";
import { EXERCISES, PROGRAMS } from "../src/data/training";
import { PLAYBOOK } from "../src/data/playbook";
import { SOURCES } from "../src/data/sources";

const errors = validateContent({ maps: MAPS, grenades: GRENADES, tactics: TACTICS, exercises: EXERCISES, programs: PROGRAMS, playbook: PLAYBOOK, sources: SOURCES });
const count = (s: string) => [GRENADES, TACTICS].flat().filter((x) => x.meta.status === s).length;
console.log(`maps ${MAPS.length} · grenades ${GRENADES.length} · tactics ${TACTICS.length} · exercises ${EXERCISES.length} · sources ${SOURCES.length}`);
console.log(`grenades+tactics: verified ${count("verified")} · partial ${count("partial")} · unverified ${count("unverified")}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log("content OK");
