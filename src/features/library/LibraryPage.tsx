import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, ExternalLink, Download, Upload, Trash2, Database } from "lucide-react";
import { Page, PageHeader, Card, Button, Badge, Drawer, Segmented, EmptyState, StatusBadge, ErrorNotice } from "@/components/ui";
import { useContent, useUserIds } from "@/services/content";
import { useAppStore } from "@/store/useAppStore";
import { openExternal } from "@/lib/open";
import { AddGrenadeForm, AddPlaybookForm, AddSourceForm, AddTacticForm } from "./forms";
import type { SourceMeta, VerificationStatus } from "@/types/content";
import { validateContent } from "@/lib/validate";
import { useT, type UIKey } from "@/i18n";

type AddKind = "grenade" | "tactic" | "playbook" | "source";

export function LibraryPage() {
  const { sources, grenades, tactics, exercises, programs, playbook, maps } = useContent();
  const user = useAppStore((s) => s.user);
  const remove = useAppStore((s) => s.removeUserItem);
  const importSnapshot = useAppStore((s) => s.importSnapshot);
  const userIds = useUserIds();
  const [params, setParams] = useSearchParams();
  const add = params.get("add") as AddKind | null;
  const [tab, setTab] = useState<"sources" | "mine" | "audit">("sources");
  const [importErr, setImportErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const t = useT();
  const addTitle = (k: AddKind) => t(`lib.add.${k}` as UIKey);
  const kindL = (k: string) => t(`lib.kind.${k}` as UIKey);

  const allMeta = useMemo(() => {
    const out: { kind: string; title: string; meta: SourceMeta }[] = [];
    grenades.forEach((g) => out.push({ kind: "grenade", title: g.title, meta: g.meta }));
    tactics.forEach((x) => out.push({ kind: "tactic", title: x.title, meta: x.meta }));
    exercises.forEach((e) => out.push({ kind: "exercise", title: e.name, meta: e.meta }));
    programs.forEach((p) => out.push({ kind: "program", title: p.name, meta: p.meta }));
    playbook.forEach((p) => out.push({ kind: "playbook", title: p.title, meta: p.meta }));
    maps.forEach((m) => out.push({ kind: "map", title: m.name, meta: m.meta }));
    return out;
  }, [grenades, tactics, exercises, programs, playbook, maps]);

  const usage = useMemo(() => {
    const c: Record<string, number> = {};
    allMeta.forEach((x) => (c[x.meta.sourceId] = (c[x.meta.sourceId] ?? 0) + 1));
    return c;
  }, [allMeta]);

  const integrity = useMemo(() => validateContent({ maps, grenades, tactics, exercises, programs, playbook, sources }), [maps, grenades, tactics, exercises, programs, playbook, sources]);

  const statusCount = (s: VerificationStatus) => allMeta.filter((x) => x.meta.status === s).length;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ app: "stratify", version: 1, exportedAt: new Date().toISOString(), user }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `stratify-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file: File) => {
    setImportErr(null);
    try {
      const data = JSON.parse(await file.text());
      if (data?.app !== "stratify" || !data.user) throw new Error(t("lib.notExport"));
      const u = data.user;
      const merge = <T extends { id: string }>(a: T[] = [], b: T[] = []) => [...new Map([...a, ...b].map((x) => [x.id, x])).values()];
      importSnapshot({
        user: {
          sources: merge(user.sources, u.sources),
          grenades: merge(user.grenades, u.grenades),
          tactics: merge(user.tactics, u.tactics),
          playbook: merge(user.playbook, u.playbook),
          timings: { ...user.timings, ...(u.timings ?? {}) },
        },
      });
    } catch (e) {
      setImportErr(e instanceof Error ? e.message : String(e));
    }
  };

  const mine = [
    ...user.grenades.map((x) => ({ kind: "grenades" as const, label: "grenade", id: x.id, title: x.title, meta: x.meta })),
    ...user.tactics.map((x) => ({ kind: "tactics" as const, label: "tactic", id: x.id, title: x.title, meta: x.meta })),
    ...user.playbook.map((x) => ({ kind: "playbook" as const, label: "playbook", id: x.id, title: x.title, meta: x.meta })),
    ...user.sources.map((x) => ({ kind: "sources" as const, label: "source", id: x.id, title: x.name, meta: null })),
  ];

  const openAdd = (k: AddKind | null) => {
    const n = new URLSearchParams(params);
    if (k) n.set("add", k);
    else n.delete("add");
    setParams(n, { replace: true });
  };

  return (
    <Page>
      <PageHeader
        kicker="Library"
        title={t("lib.title")}
        actions={
          <>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
            <Button variant="ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> {t("lib.import")}</Button>
            <Button variant="ghost" onClick={exportJson}><Download size={14} /> {t("lib.export")}</Button>
          </>
        }
      />

      {importErr && <div className="mb-4"><ErrorNotice title={t("lib.importFailed")} message={importErr} /></div>}

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {(["grenade", "tactic", "playbook", "source"] as AddKind[]).map((k) => (
          <button key={k} onClick={() => openAdd(k)} className="chamfer group flex items-center gap-3 bg-black/20 p-4 text-left ring-1 ring-inset ring-line transition hover:bg-accent/[0.06] hover:ring-accent/50">
            <div className="chamfer chamfer-sm grid h-9 w-9 place-items-center bg-bg-panel text-ink-faint transition group-hover:rotate-90 group-hover:text-accent"><Plus size={16} /></div>
            <span className="font-display text-[12px] font-semibold uppercase tracking-wider">{addTitle(k)}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Segmented value={tab} onChange={setTab} options={[{ value: "sources", label: t("lib.tab.sources", { n: sources.length }) }, { value: "mine", label: t("lib.tab.mine", { n: mine.length }) }, { value: "audit", label: t("lib.tab.audit") }]} />
      </div>

      {tab === "sources" && (
        <Card>
          <ul className="divide-y divide-line">
            {sources.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium">{s.name}</span>
                    <Badge>{s.kind}</Badge>
                    {userIds.has(s.id) && <Badge tone="accent">{t("lib.mine")}</Badge>}
                  </div>
                  <div className="truncate text-[12px] text-ink-faint">{[s.publisher, s.author, s.description].filter(Boolean).join(" · ") || s.url}</div>
                </div>
                <span className="w-28 text-right font-mono text-[11px] text-ink-faint">{t("lib.items", { n: usage[s.id] ?? 0 })}</span>
                {s.url ? <Button size="sm" variant="ghost" onClick={() => openExternal(s.url)} aria-label={t("c.openSource")}><ExternalLink size={14} /></Button> : <span className="w-9" />}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === "mine" &&
        (mine.length === 0 ? (
          <EmptyState icon={<Database size={20} />} title={t("lib.emptyMine")} text={t("lib.emptyMineText")} />
        ) : (
          <Card>
            <ul className="divide-y divide-line">
              {mine.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3 text-[13px]">
                  <Badge>{kindL(m.label)}</Badge>
                  <span className="flex-1 truncate font-medium">{m.title}</span>
                  {m.meta && <StatusBadge status={m.meta.status} />}
                  <Button size="sm" variant="ghost" onClick={() => remove(m.kind, m.id)} aria-label={t("c.delete")}><Trash2 size={14} /></Button>
                </li>
              ))}
            </ul>
          </Card>
        ))}

      {tab === "audit" && (
        <div className="space-y-4">
          {integrity.length > 0 ? (
            <ErrorNotice title={t("lib.integrityErr", { n: integrity.length })} message={integrity.slice(0, 8).join(" · ")} />
          ) : (
            <div className="chamfer bg-ok/[0.06] px-4 py-3 text-[13px] text-ok ring-1 ring-inset ring-ok/25">{t("lib.integrityOk")}</div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {(["verified", "partial", "unverified"] as VerificationStatus[]).map((s) => (
              <Card key={s} inner="p-4">
                <StatusBadge status={s} />
                <div className="mt-2 font-display text-3xl font-bold tabular-nums">{statusCount(s)}</div>
                <div className="text-[12px] text-ink-faint">
                  {t(`status.${s}Desc` as UIKey)}
                </div>
              </Card>
            ))}
          </div>
          <Card>
            <div className="tag-label px-5 pt-4">{t("lib.needsCheck")}</div>
            <ul className="divide-y divide-line">
              {allMeta.filter((x) => x.meta.status !== "verified").map((x, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-2.5 text-[13px]">
                  <Badge>{kindL(x.kind)}</Badge>
                  <span className="flex-1 truncate">{x.title}</span>
                  <span className="max-w-[40%] truncate text-[12px] text-ink-faint">{x.meta.note}</span>
                  <StatusBadge status={x.meta.status} compact />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <Drawer open={!!add} onClose={() => openAdd(null)} title={add ? addTitle(add) : ""} width={620}>
        {add === "grenade" && <AddGrenadeForm onDone={() => openAdd(null)} />}
        {add === "tactic" && <AddTacticForm onDone={() => openAdd(null)} />}
        {add === "playbook" && <AddPlaybookForm onDone={() => openAdd(null)} />}
        {add === "source" && <AddSourceForm onDone={() => openAdd(null)} />}
      </Drawer>
    </Page>
  );
}
