import type { CsMap, Exercise, Grenade, PlaybookEntry, Source, Tactic, TrainingProgram } from "@/types/content";

/** Integrity checks for content: broken references, missing sources, bad dates. */
export function validateContent(c: {
  maps: CsMap[];
  grenades: Grenade[];
  tactics: Tactic[];
  exercises: Exercise[];
  programs: TrainingProgram[];
  playbook: PlaybookEntry[];
  sources: Source[];
}): string[] {
  const errors: string[] = [];
  const src = new Set(c.sources.map((s) => s.id));
  const maps = new Map(c.maps.map((m) => [m.id, new Set(m.callouts.map((x) => x.id))]));
  const nades = new Set(c.grenades.map((g) => g.id));
  const ex = new Set(c.exercises.map((e) => e.id));
  const seen = new Set<string>();
  const metaOk = (where: string, meta: { sourceId: string; checkedAt: string }) => {
    if (!src.has(meta.sourceId)) errors.push(`${where}: unknown source "${meta.sourceId}"`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.checkedAt)) errors.push(`${where}: bad checkedAt "${meta.checkedAt}"`);
  };
  const dup = (id: string) => (seen.has(id) ? errors.push(`duplicate id "${id}"`) : seen.add(id));

  for (const m of c.maps) {
    const ids = maps.get(m.id)!;
    m.edges.forEach(([a, b]) => (!ids.has(a) || !ids.has(b)) && errors.push(`map ${m.id}: edge ${a}-${b} has unknown callout`));
    m.routes.forEach((r) => r.path.forEach((p) => !ids.has(p) && errors.push(`map ${m.id} route ${r.id}: unknown callout ${p}`)));
    m.positions.forEach((p) => !ids.has(p.calloutId) && errors.push(`map ${m.id} position ${p.id}: unknown callout ${p.calloutId}`));
    metaOk(`map ${m.id}`, m.meta);
  }
  for (const g of c.grenades) {
    dup(g.id);
    const ids = maps.get(g.map);
    if (!ids) errors.push(`grenade ${g.id}: unknown map ${g.map}`);
    else {
      if (!ids.has(g.fromId)) errors.push(`grenade ${g.id}: unknown fromId ${g.fromId}`);
      if (!ids.has(g.toId)) errors.push(`grenade ${g.id}: unknown toId ${g.toId}`);
    }
    metaOk(`grenade ${g.id}`, g.meta);
  }
  for (const t of c.tactics) {
    dup(t.id);
    const ids = maps.get(t.map);
    t.grenadeIds.forEach((id) => !nades.has(id) && errors.push(`tactic ${t.id}: unknown grenade ${id}`));
    t.steps.forEach((s) => s.focus?.forEach((f) => ids && !ids.has(f) && errors.push(`tactic ${t.id}: unknown focus callout ${f}`)));
    if (t.roles.length !== 5) errors.push(`tactic ${t.id}: expected 5 roles, got ${t.roles.length}`);
    metaOk(`tactic ${t.id}`, t.meta);
  }
  for (const e of c.exercises) (dup(e.id), metaOk(`exercise ${e.id}`, e.meta));
  for (const p of c.programs) {
    dup(p.id);
    p.exerciseIds.forEach((id) => !ex.has(id) && errors.push(`program ${p.id}: unknown exercise ${id}`));
    metaOk(`program ${p.id}`, p.meta);
  }
  for (const p of c.playbook) (dup(p.id), metaOk(`playbook ${p.id}`, p.meta));
  return errors;
}
