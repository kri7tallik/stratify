import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const CFG_KEY = "stratify.supabase";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function readSupabaseConfig(): SupabaseConfig | null {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const cfg = JSON.parse(raw) as SupabaseConfig;
      if (cfg.url && cfg.anonKey) return cfg;
    }
  } catch {
    /* ignore */
  }
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  return url && anonKey ? { url, anonKey } : null;
}

export function saveSupabaseConfig(cfg: SupabaseConfig | null) {
  if (cfg) localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  else localStorage.removeItem(CFG_KEY);
  client = undefined;
}

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const cfg = readSupabaseConfig();
  client = cfg ? createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, storageKey: "stratify.auth" } }) : null;
  return client;
}
