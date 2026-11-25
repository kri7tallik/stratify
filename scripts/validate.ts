// Run: npm run validate — checks the built-in content for broken references.
import { validateContent } from "../src/lib/validate";
import { MAPS } from "../src/data/maps";
import { GRENADES } from "../src/data/grenades";
import { TACTICS } from "../src/data/tactics";
import { EXERCISES, PROGRAMS } from "../src/data/training";
import { PLAYBOOK } from "../src/data/playbook";
import { SOURCES } from "../src/data/sources";
import { RU } from "../src/i18n/content/ru";
import { UK } from "../src/i18n/content/uk";
import { SHARED_NOTES } from "../src/i18n/content/notes";

const errors = validateContent({ maps: MAPS, grenades: GRENADES, tactics: TACTICS, exercises: EXERCISES, programs: PROGRAMS, playbook: PLAYBOOK, sources: SOURCES });

// Every built-in lineup must be translated (CLAUDE.md: ru + uk are mandatory).
const FIELDS = ["title", "position", "aim", "purpose", "instructions"] as const;
for (const [lang, dict] of [["ru", RU], ["uk", UK]] as const) {
  for (const g of GRENADES) {
    const o = dict[`grenade:${g.id}`];
    if (!o) errors.push(`grenade ${g.id}: missing ${lang} translation`);
    else {
      FIELDS.forEach((f) => !o[f] && errors.push(`grenade ${g.id}: ${lang} translation has no ${f}`));
      if (o.instructions && o.instructions.length !== g.instructions.length) errors.push(`grenade ${g.id}: ${lang} has ${o.instructions.length} steps, base has ${g.instructions.length}`);
    }
  }
  // shared verification notes need a translation too
  for (const g of GRENADES) if (g.meta.note && !dict[`grenade:${g.id}`]?.note && !SHARED_NOTES[g.meta.note]?.[lang]) errors.push(`grenade ${g.id}: note not translated to ${lang}`);
}
// hot-linked screenshots must come from https sources
for (const g of GRENADES) g.images?.forEach((img) => !img.src.startsWith("https://") && errors.push(`grenade ${g.id}: image is not https`));
const count = (s: string) => [GRENADES, TACTICS].flat().filter((x) => x.meta.status === s).length;
console.log(`maps ${MAPS.length} · grenades ${GRENADES.length} · tactics ${TACTICS.length} · exercises ${EXERCISES.length} · sources ${SOURCES.length}`);
console.log(`grenades+tactics: verified ${count("verified")} · partial ${count("partial")} · unverified ${count("unverified")}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log("content OK");
