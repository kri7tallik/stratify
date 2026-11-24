import { useEffect, useState } from "react";
import { CloudUpload, CloudDownload, LogOut, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Page, PageHeader, Card, CardHeader, Field, Input, Button, ErrorNotice, Badge } from "@/components/ui";
import { getSupabase, readSupabaseConfig, saveSupabaseConfig } from "@/lib/supabase";
import { useAppStore, progressSnapshot } from "@/store/useAppStore";
import { useContent } from "@/services/content";
import { fmtDate } from "@/lib/format";

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
      <PageHeader title="Профиль и данные" />

      <Card className="mb-4">
        <CardHeader title="Профиль" />
        <div className="p-5">
          <Field label="Ник" hint="Используется в приветствии на Dashboard."><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваш ник" className="max-w-sm" /></Field>
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader
          title="Supabase"
          subtitle="Необязательно. Даёт удалённый каталог контента (таблица content_items) и облачную копию прогресса. Схема: supabase/migrations/0001_init.sql"
          action={remote.enabled ? <Badge tone={remote.error ? "bad" : "ok"}>{remote.error ? "Ошибка" : "Подключено"}</Badge> : <Badge>Отключено</Badge>}
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
              Сохранить и подключить
            </Button>
            {cfg && (
              <>
                <Button onClick={() => void refresh()} disabled={remote.loading}>{remote.loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Обновить каталог</Button>
                <Button variant="ghost" onClick={() => { saveSupabaseConfig(null); window.location.reload(); }}>Отключить</Button>
              </>
            )}
          </div>
          {remote.enabled && !remote.error && <p className="text-[12px] text-ink-faint">Загружено {remote.count} записей{remote.lastSync ? ` · ${fmtDate(remote.lastSync)}` : ""}.</p>}
          {remote.error && <ErrorNotice title="Каталог не загрузился" message={remote.error} onRetry={() => void refresh()} />}
        </div>
      </Card>

      {sb && (
        <Card>
          <CardHeader title="Облачная копия прогресса" subtitle="Вход по одноразовому коду из письма (Supabase Auth, Email OTP)." />
          <div className="space-y-4 p-5">
            {!session ? (
              stage === "email" ? (
                <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); void run(async () => { const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }); if (error) throw error; setStage("code"); setMsg("Код отправлен на почту."); }); }}>
                  <Field label="Email" className="flex-1"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                  <Button type="submit" variant="primary" disabled={busy || !email.includes("@")}>{busy && <Loader2 size={14} className="animate-spin" />} Получить код</Button>
                </form>
              ) : (
                <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); void run(async () => { const { error } = await sb.auth.verifyOtp({ email, token: code.trim(), type: "email" }); if (error) throw error; setMsg("Вход выполнен."); }); }}>
                  <Field label="Код из письма" className="flex-1"><Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" /></Field>
                  <Button type="submit" variant="primary" disabled={busy || code.length < 6}>Войти</Button>
                  <Button type="button" variant="ghost" onClick={() => setStage("email")}>Назад</Button>
                </form>
              )
            ) : (
              <>
                <div className="flex items-center justify-between rounded-lg border border-line bg-bg p-3 text-[13px]">
                  <span>Вошли как <b>{session.user.email}</b></span>
                  <Button size="sm" variant="ghost" onClick={() => void sb.auth.signOut()}><LogOut size={14} /> Выйти</Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    disabled={busy}
                    onClick={() => void run(async () => {
                      const { error } = await sb.from("progress_snapshots").upsert({ user_id: session.user.id, payload: progressSnapshot(), updated_at: new Date().toISOString() });
                      if (error) throw error;
                      setMsg("Прогресс сохранён в облако.");
                    })}
                  >
                    <CloudUpload size={14} /> Сохранить в облако
                  </Button>
                  <Button
                    disabled={busy}
                    onClick={() => void run(async () => {
                      const { data, error } = await sb.from("progress_snapshots").select("payload, updated_at").eq("user_id", session.user.id).maybeSingle();
                      if (error) throw error;
                      if (!data) throw new Error("В облаке ещё нет копии.");
                      importSnapshot(data.payload);
                      setMsg(`Восстановлено из копии от ${fmtDate(data.updated_at)}.`);
                    })}
                  >
                    <CloudDownload size={14} /> Восстановить
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
