import { useEffect, useState } from "react";
import { CloudUpload, CloudDownload, LogOut, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Page, PageHeader, Card, CardHeader, Field, Input, Button, ErrorNotice, Badge } from "@/components/ui";
import { getSupabase, readSupabaseConfig, saveSupabaseConfig } from "@/lib/supabase";
import { useAppStore, progressSnapshot } from "@/store/useAppStore";
import { useContent } from "@/services/content";
import { fmtDate } from "@/lib/format";
import { LANGS, useLang, useT } from "@/i18n";
import { cn } from "@/lib/cn";

function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return session;
}

export function SettingsPage() {
  const name = useAppStore((s) => s.playerName);
  const setName = useAppStore((s) => s.setPlayerName);
  const importSnapshot = useAppStore((s) => s.importSnapshot);
  const setLang = useAppStore((s) => s.setLang);
  const lang = useLang();
  const t = useT();
  const { remote, refresh } = useContent();
  const cfg = readSupabaseConfig();
  const [url, setUrl] = useState(cfg?.url ?? "");
  const [key, setKey] = useState(cfg?.anonKey ?? "");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const session = useSession();
  const sb = getSupabase();

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await fn();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page className="max-w-4xl">
      <PageHeader title={t("set.title")} />

      <Card className="mb-4">
        <CardHeader title={t("set.language")} />
        <div className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-3">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              data-active={lang === l.id ? "true" : undefined}
              className={cn("hud chamfer chamfer-sm flex items-center gap-3 px-4 py-3 text-left ring-1 ring-inset transition", lang === l.id ? "bg-accent/15 ring-accent/60" : "bg-black/25 ring-line hover:ring-line-strong")}
            >
              <span className={cn("font-display text-xl font-bold", lang === l.id ? "text-accent" : "text-ink-faint")}>{l.short}</span>
              <span className="text-[13px] font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader title={t("set.profile")} />
        <div className="p-5">
          <Field label={t("set.nick")} hint={t("set.nickHint")}><Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("c.yourNick")} className="max-w-sm" /></Field>
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader
          title="Supabase"
          subtitle={t("set.sbSub")}
          action={remote.enabled ? <Badge tone={remote.error ? "bad" : "ok"}>{remote.error ? t("set.error") : t("set.connected")}</Badge> : <Badge>{t("set.disabled")}</Badge>}
        />
        <div className="space-y-3 p-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Project URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://xxxx.supabase.co" /></Field>
            <Field label="Anon public key"><Input value={key} onChange={(e) => setKey(e.target.value)} type="password" placeholder="eyJhbGciOi…" /></Field>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              disabled={!/^https:\/\//.test(url) || key.length < 20}
              onClick={() => {
                saveSupabaseConfig({ url: url.trim(), anonKey: key.trim() });
                window.location.reload();
              }}
            >
              {t("set.connect")}
            </Button>
            {cfg && (
              <>
                <Button onClick={() => void refresh()} disabled={remote.loading}>{remote.loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} {t("set.refresh")}</Button>
                <Button variant="ghost" onClick={() => { saveSupabaseConfig(null); window.location.reload(); }}>{t("set.disconnect")}</Button>
              </>
            )}
          </div>
          {remote.enabled && !remote.error && <p className="text-[12px] text-ink-faint">{t("set.loaded", { n: remote.count })}{remote.lastSync ? ` · ${fmtDate(remote.lastSync, lang)}` : ""}</p>}
          {remote.error && <ErrorNotice title={t("set.catalogFailed")} message={remote.error} onRetry={() => void refresh()} />}
        </div>
      </Card>

      {sb && (
        <Card>
          <CardHeader title={t("set.cloud")} subtitle={t("set.cloudSub")} />
          <div className="space-y-4 p-5">
            {!session ? (
              stage === "email" ? (
                <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); void run(async () => { const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }); if (error) throw error; setStage("code"); setMsg(t("set.codeSent")); }); }}>
                  <Field label="Email" className="flex-1"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                  <Button type="submit" variant="primary" disabled={busy || !email.includes("@")}>{busy && <Loader2 size={14} className="animate-spin" />} {t("set.getCode")}</Button>
                </form>
              ) : (
                <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); void run(async () => { const { error } = await sb.auth.verifyOtp({ email, token: code.trim(), type: "email" }); if (error) throw error; setMsg(t("set.signedIn")); }); }}>
                  <Field label={t("set.code")} className="flex-1"><Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" /></Field>
                  <Button type="submit" variant="primary" disabled={busy || code.length < 6}>{t("set.signIn")}</Button>
                  <Button type="button" variant="ghost" onClick={() => setStage("email")}>{t("c.back")}</Button>
                </form>
              )
            ) : (
              <>
                <div className="chamfer chamfer-sm flex items-center justify-between bg-black/30 p-3 text-[13px] ring-1 ring-inset ring-line">
                  <span>{t("set.signedAs", { email: session.user.email ?? "" })}</span>
                  <Button size="sm" variant="ghost" onClick={() => void sb.auth.signOut()}><LogOut size={14} /> {t("set.signOut")}</Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    disabled={busy}
                    onClick={() => void run(async () => {
                      const { error } = await sb.from("progress_snapshots").upsert({ user_id: session.user.id, payload: progressSnapshot(), updated_at: new Date().toISOString() });
                      if (error) throw error;
                      setMsg(t("set.saved"));
                    })}
                  >
                    <CloudUpload size={14} /> {t("set.backup")}
                  </Button>
                  <Button
                    disabled={busy}
                    onClick={() => void run(async () => {
                      const { data, error } = await sb.from("progress_snapshots").select("payload, updated_at").eq("user_id", session.user.id).maybeSingle();
                      if (error) throw error;
                      if (!data) throw new Error(t("set.noBackup"));
                      importSnapshot(data.payload);
                      setMsg(t("set.restored", { date: fmtDate(data.updated_at, lang) }));
                    })}
                  >
                    <CloudDownload size={14} /> {t("set.restore")}
                  </Button>
                </div>
              </>
            )}
            {msg && <p className="flex items-center gap-1.5 text-[13px] text-ok"><CheckCircle2 size={14} /> {msg}</p>}
            {err && <ErrorNotice message={err} />}
          </div>
        </Card>
      )}
    </Page>
  );
}
