import { useState } from "react";
import type { Difficulty, GrenadeType, MapId, Side, SideOrBoth, SourceKind, SourceMeta, TacticCategory, ThrowType, VerificationStatus, RoundType } from "@/types/content";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { useContent } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { DIFF_LABEL, GRENADE_LABEL, TACTIC_LABEL, THROW_LABEL, STATUS_LABEL, ROUND_LABEL } from "@/lib/labels";
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
  return (
    <fieldset className="space-y-3 rounded-xl border border-line bg-bg p-4">
      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">Источник (обязательно)</legend>
      <Field label="Источник">
        <Select value={d.sourceId} onChange={(e) => setD({ ...d, sourceId: e.target.value })}>
          <option value="__new">+ Новый источник по ссылке</option>
          {sources.filter((s) => s.kind !== "user").map((s) => (
            <option key={s.id} value={s.id}>{s.name}{s.publisher ? ` — ${s.publisher}` : ""}</option>
          ))}
        </Select>
      </Field>
      {d.sourceId === "__new" && <Field label="Название материала"><Input value={d.newName} onChange={(e) => setD({ ...d, newName: e.target.value })} placeholder="Например: NAVI vs Vitality, Mirage, IEM Cologne 2026" /></Field>}
      <div className="grid grid-cols-2 gap-3">
        <Field label={d.sourceId === "__new" ? "Ссылка на оригинал" : "Точная ссылка (необязательно)"}><Input value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} placeholder="https://…" /></Field>
        <Field label="Автор"><Input value={d.author} onChange={(e) => setD({ ...d, author: e.target.value })} placeholder="Если известен" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Статус проверки" hint="«Проверено» — вы сверили всё с источником.">
          <Select value={d.status} onChange={(e) => setD({ ...d, status: e.target.value as VerificationStatus })}>
            {(Object.keys(STATUS_LABEL) as VerificationStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </Select>
        </Field>
        <Field label="Заметка"><Input value={d.note} onChange={(e) => setD({ ...d, note: e.target.value })} placeholder="Что не удалось подтвердить" /></Field>
      </div>
    </fieldset>
  );
}

function Footer({ onCancel, disabled, label = "Сохранить" }: { onCancel(): void; disabled: boolean; label?: string }) {
  return (
    <div className="flex justify-end gap-2 border-t border-line pt-4">
      <Button type="button" variant="ghost" onClick={onCancel}>Отмена</Button>
      <Button type="submit" variant="primary" disabled={disabled}>{label}</Button>
    </div>
  );
}

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

/* ───────── Grenade ───────── */

export function AddGrenadeForm({ onDone }: { onDone(): void }) {
  const { maps } = useContent();
  const add = useAppStore((s) => s.addGrenade);
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
          aim: f.aim || "См. источник",
          instructions: lines(f.instructions).length ? lines(f.instructions) : ["См. источник."],
          throwType: f.throwType,
          purpose: f.purpose.trim(),
          difficulty: f.difficulty,
          tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
          videoUrl: f.videoUrl || undefined,
          meta: src.commit(),
        });
        onDone();
      }}
    >
      <Field label="Название"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Например: A Short smoke from Cat" /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Карта"><Select value={f.map} onChange={(e) => setF({ ...f, map: e.target.value as MapId, fromId: "", toId: "" })}>{maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></Field>
        <Field label="Сторона"><Select value={f.side} onChange={(e) => setF({ ...f, side: e.target.value as Side })}><option>T</option><option>CT</option></Select></Field>
        <Field label="Тип"><Select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as GrenadeType })}>{(Object.keys(GRENADE_LABEL) as GrenadeType[]).map((t) => <option key={t} value={t}>{GRENADE_LABEL[t]}</option>)}</Select></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Бросок из (на схеме)"><Select value={f.fromId} onChange={(e) => setF({ ...f, fromId: e.target.value })}><option value="">—</option>{map.callouts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
        <Field label="Падает в (на схеме)"><Select value={f.toId} onChange={(e) => setF({ ...f, toId: e.target.value })}><option value="">—</option>{map.callouts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Где стоять"><Input value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} /></Field>
        <Field label="Точка прицеливания"><Input value={f.aim} onChange={(e) => setF({ ...f, aim: e.target.value })} /></Field>
      </div>
      <Field label="Инструкция (по шагу на строку)"><Textarea value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Тип броска"><Select value={f.throwType} onChange={(e) => setF({ ...f, throwType: e.target.value as ThrowType })}>{(Object.keys(THROW_LABEL) as ThrowType[]).map((t) => <option key={t} value={t}>{THROW_LABEL[t]}</option>)}</Select></Field>
        <Field label="Сложность"><Select value={f.difficulty} onChange={(e) => setF({ ...f, difficulty: e.target.value as Difficulty })}>{(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => <option key={d} value={d}>{DIFF_LABEL[d]}</option>)}</Select></Field>
      </div>
      <Field label="Назначение"><Input value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} placeholder="Что даёт эта граната" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Теги (через запятую)"><Input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="a execute, mid control" /></Field>
        <Field label="Видео (YouTube и т.п.)"><Input value={f.videoUrl} onChange={(e) => setF({ ...f, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=…" /></Field>
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
          roles: f.roles.map((r, i) => ({ slot: (i + 1) as 1 | 2 | 3 | 4 | 5, role: r.split(":")[0]?.trim() || `Игрок ${i + 1}`, task: r.split(":").slice(1).join(":").trim() || r.trim() || "—" })),
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
      <Field label="Название"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
      <div className="grid grid-cols-4 gap-3">
        <Field label="Карта"><Select value={f.map} onChange={(e) => setF({ ...f, map: e.target.value as MapId, grenadeIds: [] })}>{maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></Field>
        <Field label="Сторона"><Select value={f.side} onChange={(e) => setF({ ...f, side: e.target.value as Side, grenadeIds: [] })}><option>T</option><option>CT</option></Select></Field>
        <Field label="Категория"><Select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as TacticCategory })}>{(Object.keys(TACTIC_LABEL) as TacticCategory[]).map((c) => <option key={c} value={c}>{TACTIC_LABEL[c]}</option>)}</Select></Field>
        <Field label="Сложность"><Select value={f.difficulty} onChange={(e) => setF({ ...f, difficulty: e.target.value as Difficulty })}>{(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => <option key={d} value={d}>{DIFF_LABEL[d]}</option>)}</Select></Field>
      </div>
      <Field label="Краткое описание"><Textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></Field>
      <Field label="Шаги" hint="Один шаг на строку, формат «Название: описание»"><Textarea value={f.steps} onChange={(e) => setF({ ...f, steps: e.target.value })} placeholder={"Isolate: smoke CT, Jungle, Stairs\nSwing: flash and swing Palace + Ramp"} className="min-h-[110px]" /></Field>
      <div className="space-y-2">
        <span className="block text-xs font-medium text-ink-muted">Роли пяти игроков («Роль: задача»)</span>
        {f.roles.map((r, i) => (
          <Input key={i} value={r} onChange={(e) => setF({ ...f, roles: f.roles.map((x, j) => (j === i ? e.target.value : x)) })} placeholder={`${i + 1}. Entry: первый заходит через Palace`} />
        ))}
      </div>
      {mapNades.length > 0 && (
        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink-muted">Гранаты из Grenade Lab</span>
          <div className="flex flex-wrap gap-1.5">
            {mapNades.map((g) => {
              const on = f.grenadeIds.includes(g.id);
              return (
                <button type="button" key={g.id} onClick={() => setF({ ...f, grenadeIds: on ? f.grenadeIds.filter((x) => x !== g.id) : [...f.grenadeIds, g.id] })} className={`rounded-md border px-2 py-1 text-[12px] ${on ? "border-accent/60 bg-accent/10" : "border-line text-ink-muted"}`}>
                  {g.title}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Тайминги"><Input value={f.timings} onChange={(e) => setF({ ...f, timings: e.target.value })} placeholder="Если указаны в источнике" /></Field>
        <Field label="Видео / демо"><Input value={f.videoUrl} onChange={(e) => setF({ ...f, videoUrl: e.target.value })} placeholder="https://…" /></Field>
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
      <Field label="Название"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Команда"><Input value={f.team} onChange={(e) => setF({ ...f, team: e.target.value })} placeholder="Vitality" /></Field>
        <Field label="Игрок"><Input value={f.player} onChange={(e) => setF({ ...f, player: e.target.value })} placeholder="ZywOo" /></Field>
        <Field label="Турнир / матч"><Input value={f.event} onChange={(e) => setF({ ...f, event: e.target.value })} /></Field>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Field label="Карта"><Select value={f.map} onChange={(e) => setF({ ...f, map: e.target.value as MapId })}><option value="">—</option>{maps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></Field>
        <Field label="Сторона"><Select value={f.side} onChange={(e) => setF({ ...f, side: e.target.value as SideOrBoth })}><option value="both">T/CT</option><option>T</option><option>CT</option></Select></Field>
        <Field label="Раунд"><Select value={f.roundType} onChange={(e) => setF({ ...f, roundType: e.target.value as RoundType })}>{(Object.keys(ROUND_LABEL) as RoundType[]).map((r) => <option key={r} value={r}>{ROUND_LABEL[r]}</option>)}</Select></Field>
        <Field label="Тип"><Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as typeof f.kind })}><option value="strategy">Стратегия</option><option value="utility">Гранаты</option><option value="setup">Расстановка</option><option value="routine">Рутина</option></Select></Field>
      </div>
      <Field label="Суть"><Textarea value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></Field>
      <Field label="Детали (по пункту на строку)"><Textarea value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} /></Field>
      <SourceFields draft={src} />
      <Footer onCancel={onDone} disabled={!valid} />
    </form>
  );
}

/* ───────── Source only ───────── */

export function AddSourceForm({ onDone }: { onDone(): void }) {
  const add = useAppStore((s) => s.addSource);
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
      <Field label="Название"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Ссылка" hint="Должна начинаться с http(s)://"><Input value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Тип"><Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as SourceKind })}>{(["article", "video", "lineup-db", "workshop", "pro-interview", "match", "official"] as SourceKind[]).map((k) => <option key={k}>{k}</option>)}</Select></Field>
        <Field label="Автор"><Input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} /></Field>
        <Field label="Издатель"><Input value={f.publisher} onChange={(e) => setF({ ...f, publisher: e.target.value })} /></Field>
      </div>
      <Field label="Описание"><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <Footer onCancel={onDone} disabled={!valid} />
    </form>
  );
}
