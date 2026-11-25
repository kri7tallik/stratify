import { useState } from "react";
import type { Difficulty, GrenadeType, MapId, Side, SideOrBoth, SourceKind, SourceMeta, TacticCategory, ThrowType, VerificationStatus, RoundType } from "@/types/content";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { DIFFICULTIES, GRENADE_TYPES_LIST, TACTIC_CATEGORIES, THROW_TYPES, STATUS_LIST, ROUND_TYPES, useLabels } from "@/lib/labels";
import { useT } from "@/i18n";
import { todayKey, uid } from "@/lib/format";

/* ───────── Source picker shared by all forms ───────── */

interface SourceDraft {
  sourceId: string;
  newName: string;
  url: string;
  author: string;
  status: VerificationStatus;
  note: string;
}

const emptySource: SourceDraft = { sourceId: "__new", newName: "", url: "", author: "", status: "unverified", note: "" };

function useSourceDraft() {
  const [d, setD] = useState<SourceDraft>(emptySource);
  const addSource = useAppStore((s) => s.addSource);
  const valid = d.sourceId === "__new" ? !!d.url.trim() && !!d.newName.trim() : true;

  /** Commits a new source if needed and returns the SourceMeta to attach */
  const commit = (): SourceMeta => {
    let sourceId = d.sourceId;
    if (sourceId === "__new") {
      sourceId = "src-" + uid();
      addSource({ id: sourceId, name: d.newName.trim(), url: d.url.trim(), kind: guessKind(d.url), author: d.author || undefined });
    }
    const hasLink = d.sourceId !== "__new" || !!d.url;
    return {
      sourceId,
      url: d.sourceId !== "__new" && d.url ? d.url : undefined,
      author: d.author || undefined,
      // Without any link the item can never be "verified"
      status: hasLink ? d.status : "unverified",
      checkedAt: todayKey(),
      note: d.note || undefined,
    };
  };
  return { d, setD, valid, commit };
}

function guessKind(url: string): SourceKind {
  if (/youtube|youtu\.be|twitch/.test(url)) return "video";
  if (/hltv\.org\/matches|liquipedia/.test(url)) return "match";
  if (/steamcommunity\.com\/sharedfiles/.test(url)) return "workshop";
  if (/csnades|tracker\.gg\/cs2\/lineups/.test(url)) return "lineup-db";
  return "article";
}

function SourceFields({ draft }: { draft: ReturnType<typeof useSourceDraft> }) {
  const { sources } = useContent();
  const { d, setD } = draft;
  const t = useT();
  const L = useLabels();
  return (
    <fieldset className="chamfer space-y-3 bg-sunken p-4 ring-1 ring-inset ring-accent/25">
      <legend className="tag-label px-1 !text-accent">{t("form.src.legend")}</legend>
      <Field label={t("form.src.source")}>
        <Select value={d.sourceId} onChange={(e) => setD({ ...d, sourceId: e.target.value })}>
          <option value="__new">{t("form.src.new")}</option>
          {sources.filter((s) => s.kind !== "user").map((s) => (
            <option key={s.id} value={s.id}>{s.name}{s.publisher ? ` — ${s.publisher}` : ""}</option>
          ))}
        </Select>
      </Field>
      {d.sourceId === "__new" && <Field label={t("form.src.name")}><Input value={d.newName} onChange={(e) => setD({ ...d, newName: e.target.value })} placeholder={t("form.src.namePh")} /></Field>}
      <div className="grid grid-cols-2 gap-3">
        <Field label={d.sourceId === "__new" ? t("form.src.url") : t("form.src.urlExact")}><Input value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} placeholder="https://…" /></Field>
        <Field label={t("form.author")}><Input value={d.author} onChange={(e) => setD({ ...d, author: e.target.value })} placeholder={t("form.src.authorPh")} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.src.status")} hint={t("form.src.statusHint")}>
          <Select value={d.status} onChange={(e) => setD({ ...d, status: e.target.value as VerificationStatus })}>
            {STATUS_LIST.map((s) => <option key={s} value={s}>{L.status[s]}</option>)}
          </Select>
        </Field>
        <Field label={t("form.src.note")}><Input value={d.note} onChange={(e) => setD({ ...d, note: e.target.value })} placeholder={t("form.src.notePh")} /></Field>
      </div>
    </fieldset>
  );
}

function Footer({ onCancel, disabled, label }: { onCancel(): void; disabled: boolean; label?: string }) {
  const t = useT();
  return (
    <div className="flex justify-end gap-2 border-t border-line pt-4">
      <Button type="button" variant="ghost" onClick={onCancel}>{t("c.cancel")}</Button>
      <Button type="submit" variant="primary" disabled={disabled}>{label ?? t("c.save")}</Button>
    </div>
  );
}

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

/* ───────── Grenade ───────── */

export function AddGrenadeForm({ onDone }: { onDone(): void }) {
  const { maps } = useContent();
  const add = useAppStore((s) => s.addGrenade);
  const t = useT();
  const L = useLabels();
  const src = useSourceDraft();
  const [f, setF] = useState({ title: "", map: "mirage" as MapId, side: "T" as Side, type: "smoke" as GrenadeType, fromId: "", toId: "", position: "", aim: "", instructions: "", throwType: "jump-throw" as ThrowType, purpose: "", difficulty: "medium" as Difficulty, tags: "", videoUrl: "" });
  const map = maps.find((m) => m.id === f.map)!;
  const valid = f.title.trim() && f.fromId && f.toId && f.purpose.trim() && src.valid;

  return (
    <form
      className="space-y-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        add({
          id: "u-g-" + uid(),
          title: f.title.trim(),
          map: f.map,
          side: f.side,
          type: f.type,
          fromId: f.fromId,
          toId: f.toId,
          position: f.position || map.callouts.find((c) => c.id === f.fromId)?.name || "",
          aim: f.aim || L.throw.unknown,
          instructions: lines(f.instructions).length ? lines(f.instructions) : [L.throw.unknown],
          throwType: f.throwType,
          purpose: f.purpose.trim(),
          difficulty: f.difficulty,
          tags: f.tags.split(",").map((x) => x.trim()).filter(Boolean),
          videoUrl: f.videoUrl || undefined,
          meta: src.commit(),
        });
        onDone();
      }}
    >
      <Field label={t("form.title")}><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="A Short smoke from Cat" /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label={t("form.map")}><Select value={f.map} onChange={(e) => setF({ ...f, map: e.target.value as MapId, fromId: "", toId: "" })}>{maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></Field>
        <Field label={t("form.side")}><Select value={f.side} onChange={(e) => setF({ ...f, side: e.target.value as Side })}><option>T</option><option>CT</option></Select></Field>
        <Field label={t("form.type")}><Select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as GrenadeType })}>{GRENADE_TYPES_LIST.map((x) => <option key={x} value={x}>{L.nade[x]}</option>)}</Select></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.from")}><Select value={f.fromId} onChange={(e) => setF({ ...f, fromId: e.target.value })}><option value="">—</option>{map.callouts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
        <Field label={t("form.to")}><Select value={f.toId} onChange={(e) => setF({ ...f, toId: e.target.value })}><option value="">—</option>{map.callouts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.where")}><Input value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} /></Field>
        <Field label={t("form.aim")}><Input value={f.aim} onChange={(e) => setF({ ...f, aim: e.target.value })} /></Field>
      </div>
      <Field label={t("form.steps")}><Textarea value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.throw")}><Select value={f.throwType} onChange={(e) => setF({ ...f, throwType: e.target.value as ThrowType })}>{THROW_TYPES.map((x) => <option key={x} value={x}>{L.throw[x]}</option>)}</Select></Field>
        <Field label={t("form.difficulty")}><Select value={f.difficulty} onChange={(e) => setF({ ...f, difficulty: e.target.value as Difficulty })}>{DIFFICULTIES.map((d) => <option key={d} value={d}>{L.diff[d]}</option>)}</Select></Field>
      </div>
      <Field label={t("form.purpose")}><Input value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} placeholder={t("form.purposePh")} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.tags")}><Input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="a execute, mid control" /></Field>
        <Field label={t("form.video")}><Input value={f.videoUrl} onChange={(e) => setF({ ...f, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=…" /></Field>
      </div>
      <SourceFields draft={src} />
      <Footer onCancel={onDone} disabled={!valid} />
    </form>
  );
}

/* ───────── Tactic ───────── */

export function AddTacticForm({ onDone }: { onDone(): void }) {
  const { maps, grenades } = useContent();
  const add = useAppStore((s) => s.addTactic);
  const t = useT();
  const L = useLabels();
  const src = useSourceDraft();
  const [f, setF] = useState({ title: "", map: "mirage" as MapId, side: "T" as Side, category: "execute" as TacticCategory, summary: "", steps: "", roles: ["", "", "", "", ""], grenadeIds: [] as string[], timings: "", videoUrl: "", difficulty: "medium" as Difficulty });
  const mapNades = grenades.filter((g) => g.map === f.map && g.side === f.side);
  const valid = f.title.trim() && f.summary.trim() && lines(f.steps).length > 0 && src.valid;

  return (
    <form
      className="space-y-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        add({
          id: "u-t-" + uid(),
          title: f.title.trim(),
          map: f.map,
          side: f.side,
          category: f.category,
          summary: f.summary.trim(),
          roles: f.roles.map((r, i) => ({ slot: (i + 1) as 1 | 2 | 3 | 4 | 5, role: r.split(":")[0]?.trim() || t("form.player.n", { n: i + 1 }), task: r.split(":").slice(1).join(":").trim() || r.trim() || "—" })),
          steps: lines(f.steps).map((l) => {
            const [label, ...rest] = l.split(":");
            return { label: label.trim(), detail: rest.join(":").trim() || label.trim() };
          }),
          grenadeIds: f.grenadeIds,
          utilityNotes: [],
          timings: f.timings || undefined,
          videoUrl: f.videoUrl || undefined,
          difficulty: f.difficulty,
          meta: src.commit(),
        });
        onDone();
      }}
    >
      <Field label={t("form.title")}><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
      <div className="grid grid-cols-4 gap-3">
        <Field label={t("form.map")}><Select value={f.map} onChange={(e) => setF({ ...f, map: e.target.value as MapId, grenadeIds: [] })}>{maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></Field>
        <Field label={t("form.side")}><Select value={f.side} onChange={(e) => setF({ ...f, side: e.target.value as Side, grenadeIds: [] })}><option>T</option><option>CT</option></Select></Field>
        <Field label={t("form.category")}><Select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as TacticCategory })}>{TACTIC_CATEGORIES.map((c) => <option key={c} value={c}>{L.tactic[c]}</option>)}</Select></Field>
        <Field label={t("form.difficulty")}><Select value={f.difficulty} onChange={(e) => setF({ ...f, difficulty: e.target.value as Difficulty })}>{DIFFICULTIES.map((d) => <option key={d} value={d}>{L.diff[d]}</option>)}</Select></Field>
      </div>
      <Field label={t("form.summary")}><Textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></Field>
      <Field label={t("form.tSteps")} hint={t("form.tStepsHint")}><Textarea value={f.steps} onChange={(e) => setF({ ...f, steps: e.target.value })} placeholder={"Isolate: smoke CT, Jungle, Stairs\nSwing: flash and swing Palace + Ramp"} className="min-h-[110px]" /></Field>
      <div className="space-y-2">
        <span className="tag-label block !text-[10px]">{t("form.roles")}</span>
        {f.roles.map((r, i) => (
          <Input key={i} value={r} onChange={(e) => setF({ ...f, roles: f.roles.map((x, j) => (j === i ? e.target.value : x)) })} placeholder={t("form.rolePh", { n: i + 1 })} />
        ))}
      </div>
      {mapNades.length > 0 && (
        <div>
          <span className="tag-label mb-1.5 block !text-[10px]">{t("form.labNades")}</span>
          <div className="flex flex-wrap gap-1.5">
            {mapNades.map((g) => {
              const on = f.grenadeIds.includes(g.id);
              return (
                <button type="button" key={g.id} onClick={() => setF({ ...f, grenadeIds: on ? f.grenadeIds.filter((x) => x !== g.id) : [...f.grenadeIds, g.id] })} className={`chamfer chamfer-sm px-2 py-1 text-[12px] ring-1 ring-inset transition ${on ? "bg-accent/15 ring-accent/60" : "text-ink-muted ring-line hover:ring-line-strong"}`}>
                  {g.title}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.timings")}><Input value={f.timings} onChange={(e) => setF({ ...f, timings: e.target.value })} placeholder={t("form.timingsPh")} /></Field>
        <Field label={t("form.videoDemo")}><Input value={f.videoUrl} onChange={(e) => setF({ ...f, videoUrl: e.target.value })} placeholder="https://…" /></Field>
      </div>
      <SourceFields draft={src} />
      <Footer onCancel={onDone} disabled={!valid} />
    </form>
  );
}

/* ───────── Playbook ───────── */

export function AddPlaybookForm({ onDone }: { onDone(): void }) {
  const { maps } = useContent();
  const add = useAppStore((s) => s.addPlaybook);
  const t = useT();
  const L = useLabels();
  const src = useSourceDraft();
  const [f, setF] = useState({ title: "", team: "", player: "", map: "" as MapId | "", side: "both" as SideOrBoth, roundType: "any" as RoundType, kind: "strategy" as "strategy" | "utility" | "routine" | "setup", summary: "", details: "", event: "" });
  const valid = f.title.trim() && f.summary.trim() && (f.team.trim() || f.player.trim()) && src.valid;
  return (
    <form
      className="space-y-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        add({ id: "u-p-" + uid(), title: f.title.trim(), team: f.team.trim() || undefined, player: f.player.trim() || undefined, map: f.map || undefined, side: f.side, roundType: f.roundType, kind: f.kind, summary: f.summary.trim(), details: lines(f.details), event: f.event || undefined, meta: src.commit() });
        onDone();
      }}
    >
      <Field label={t("form.title")}><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label={t("form.team")}><Input value={f.team} onChange={(e) => setF({ ...f, team: e.target.value })} placeholder="Vitality" /></Field>
        <Field label={t("form.player")}><Input value={f.player} onChange={(e) => setF({ ...f, player: e.target.value })} placeholder="ZywOo" /></Field>
        <Field label={t("form.event")}><Input value={f.event} onChange={(e) => setF({ ...f, event: e.target.value })} /></Field>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Field label={t("form.map")}><Select value={f.map} onChange={(e) => setF({ ...f, map: e.target.value as MapId })}><option value="">—</option>{maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></Field>
        <Field label={t("form.side")}><Select value={f.side} onChange={(e) => setF({ ...f, side: e.target.value as SideOrBoth })}><option value="both">T/CT</option><option>T</option><option>CT</option></Select></Field>
        <Field label={t("form.round")}><Select value={f.roundType} onChange={(e) => setF({ ...f, roundType: e.target.value as RoundType })}>{ROUND_TYPES.map((r) => <option key={r} value={r}>{L.round[r]}</option>)}</Select></Field>
        <Field label={t("form.type")}><Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as typeof f.kind })}><option value="strategy">{t("pb.kind.strategy")}</option><option value="utility">{t("pb.kind.utility")}</option><option value="setup">{t("pb.kind.setup")}</option><option value="routine">{t("pb.kind.routine")}</option></Select></Field>
      </div>
      <Field label={t("form.essence")}><Textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></Field>
      <Field label={t("form.details")}><Textarea value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} /></Field>
      <SourceFields draft={src} />
      <Footer onCancel={onDone} disabled={!valid} />
    </form>
  );
}

/* ───────── Source only ───────── */

export function AddSourceForm({ onDone }: { onDone(): void }) {
  const add = useAppStore((s) => s.addSource);
  const t = useT();
  const [f, setF] = useState({ name: "", url: "", kind: "article" as SourceKind, author: "", publisher: "", description: "" });
  const valid = f.name.trim() && /^https?:\/\//.test(f.url.trim());
  return (
    <form
      className="space-y-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        add({ id: "src-" + uid(), name: f.name.trim(), url: f.url.trim(), kind: f.kind, author: f.author || undefined, publisher: f.publisher || undefined, description: f.description || undefined });
        onDone();
      }}
    >
      <Field label={t("form.title")}><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label={t("form.link")} hint={t("form.linkHint")}><Input value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label={t("form.type")}><Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as SourceKind })}>{(["article", "video", "lineup-db", "workshop", "pro-interview", "match", "official"] as SourceKind[]).map((k) => <option key={k}>{k}</option>)}</Select></Field>
        <Field label={t("form.author")}><Input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} /></Field>
        <Field label={t("form.publisher")}><Input value={f.publisher} onChange={(e) => setF({ ...f, publisher: e.target.value })} /></Field>
      </div>
      <Field label={t("form.description")}><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <Footer onCancel={onDone} disabled={!valid} />
    </form>
  );
}
