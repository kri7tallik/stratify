-- STRATIFY — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).

-- 1) Sources registry --------------------------------------------------------
create table if not exists public.sources (
  id          text primary key,
  name        text not null,
  kind        text not null check (kind in ('official','lineup-db','article','video','workshop','pro-interview','match','user')),
  url         text not null default '',
  author      text,
  publisher   text,
  description text,
  created_at  timestamptz not null default now()
);

-- 2) Content catalog ----------------------------------------------------------
-- One row per grenade / tactic / exercise / program / playbook entry / source.
-- `data` holds the same JSON shape as src/types/content.ts (without `id`).
create table if not exists public.content_items (
  id          text primary key,
  kind        text not null check (kind in ('grenade','tactic','exercise','program','playbook','source')),
  map         text,
  side        text check (side in ('T','CT','both')),
  status      text not null default 'unverified' check (status in ('verified','partial','unverified')),
  source_id   text references public.sources(id) on delete set null,
  checked_at  date not null default current_date,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);
create index if not exists content_items_kind_idx on public.content_items (kind);
create index if not exists content_items_map_idx  on public.content_items (map);

-- Every item must carry provenance inside its JSON as well.
alter table public.content_items
  drop constraint if exists content_items_meta_chk;
alter table public.content_items
  add constraint content_items_meta_chk check (kind = 'source' or (data ? 'meta'));

-- 3) Per-user progress backup -------------------------------------------------
create table if not exists public.progress_snapshots (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  payload    jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS -------------------------------------------------------------------------
alter table public.sources            enable row level security;
alter table public.content_items      enable row level security;
alter table public.progress_snapshots enable row level security;

-- Catalog is public read-only; write via service role / dashboard only.
drop policy if exists "sources read"  on public.sources;
create policy "sources read"  on public.sources       for select using (true);
drop policy if exists "content read" on public.content_items;
create policy "content read" on public.content_items for select using (true);

-- Progress: each user sees and writes only their own snapshot.
drop policy if exists "own progress select" on public.progress_snapshots;
create policy "own progress select" on public.progress_snapshots for select using (auth.uid() = user_id);
drop policy if exists "own progress upsert" on public.progress_snapshots;
create policy "own progress upsert" on public.progress_snapshots for insert with check (auth.uid() = user_id);
drop policy if exists "own progress update" on public.progress_snapshots;
create policy "own progress update" on public.progress_snapshots for update using (auth.uid() = user_id);
