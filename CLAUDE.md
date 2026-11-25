# STRATIFY — project guide for Claude

CS2 / FACEIT tactical companion: maps, grenade lineups, tactics, training programs, pro playbook, progress.
Owner: kri7tallik. Talk to the owner in Russian.

- Repo: https://github.com/kri7tallik/stratify (branch `main`)
- Live site: https://kri7tallik.github.io/stratify/ — auto-deployed by `.github/workflows/deploy-pages.yml` on every push to `main`
- Windows installer: `.github/workflows/build-windows.yml` builds Tauri and publishes to the rolling GitHub release `latest`

## Stack
Vite 5 + React 18 + TypeScript (strict, noUnusedLocals) + Tailwind 3 + framer-motion + zustand (persist key `stratify.state`, version 1) + HashRouter with lazy routes + lucide-react. Optional Supabase (remote catalog + cloud progress). Desktop shell: Tauri 2.

## Commands
- `npm run dev` — dev server on http://localhost:1420
- `npx tsc -b` — typecheck (must be clean)
- `npm run validate` — content integrity check (maps/callouts/grenades/sources references)
- `npm run build` — production build (set `GITHUB_PAGES=1` for base `/stratify/`)
- `npm run tauri:dev` / `npm run tauri:build` — desktop app

Before every commit: `npx tsc -b && npm run validate && npm run build`.

## Layout
- `src/types/content.ts` — data model. Every item has `meta: SourceMeta { sourceId, url?, author?, status: verified|partial|unverified, checkedAt, note? }`
- `src/data/` — built-in content: `maps.ts` (callouts on 0–100 radar coords), `grenades.ts`, `tactics.ts` + `tactics.more.ts`, `training.ts`, `playbook.ts`, `sources.ts`
- `public/radars/*.webp` — official Valve radar overviews (from CS2 game files)
- `src/services/content.tsx` — ContentProvider: merges built-in → Supabase → user content, then localizes
- `src/i18n/` — `ui.ts` (UI dictionary, `e(uk, ru, en)`), `content/ru.ts` + `content/uk.ts` (overlays keyed `kind:id`), `content/sources.ts`; hooks `useT()`, `useLang()`; labels via `useLabels()` in `src/lib/labels.ts`
- `src/components/ui/*` — design-system kit; `src/components/layout/*` — shell, sidebar, mobile nav, command palette, lang switch
- `src/components/map/MapSchematic.tsx` — radar + callouts + animated trajectories
- `src/features/*` — pages (dashboard, maps, grenades, tactics, training, playbook, progress, prep, library, settings, favorites)

## Content rules (important)
- Only real, sourced content. Never invent lineups, strats or pro routines. Every item needs a source link, author when known, and a check date.
- Mark anything not fully confirmed as `partial`/`unverified` with a `note`.
- Lineup images are hot-linked from the source article (`<img referrerPolicy="no-referrer">` with fallback), credited in `LineupImage.credit`. Do not re-host them.
- When adding or changing content, add translations for both `ru` and `uk` overlays. English is the base text in `src/data`.
- Callout names stay in English (as in-game). In RU/UK, the owner prefers the slang names: Смок, Флешка, Молотов (Молик), HE.

## Design
CS HUD style. Fonts: Tektur (display), Inter Variable (body), JetBrains Mono (numbers). Dark palette with orange accent `#ff6b1a` / amber `#ffb22e`; T side `#e8b04a`, CT side `#5b9cf5`. Utilities in `src/styles/index.css`: `.chamfer`, `.frame`/`.frame-hot`, `.surface`, `.hud` (corner brackets), `.shine`, `.tag-label`, `.stripes`, `.text-gradient`, `.backdrop`, `.grain`. Respect `prefers-reduced-motion`.

## Lineup data (Nov 2026)
- `src/data/grenades.ts` — older lineups (BLAST.tv / Dexerto, late 2023) → `partial` with a shared note (`OLD_BLAST`, `OLD_CI`), plus `GRENADES = [...CORE, ...FRESH]`.
- `src/data/grenades.fresh.ts` — 2025 lineups: Refrag "Utility Secrets" (Samuel Allen, stand/aim/result shots, all 9 maps), CS2 Pulse HE pages, bo3.gg Mirage flashes. RU/UK overlays live in `src/i18n/content/fresh.ru.ts` / `fresh.uk.ts`.
- Notes shared by many items are translated once in `src/i18n/content/notes.ts` (keyed by the English note).
- `npm run validate` now fails if a built-in grenade lacks a ru/uk overlay (title, position, aim, purpose, same number of steps) or a translated note.
- Lineup images: `kind` order is position → aim → result; the viewer sorts by it.
- Not re-tested in-game (no CS2 here): Anubis (pre-Jan-2026 return) and Cache (pre-2026 rework) Refrag lineups are `partial`.

## Lineup viewer
`src/features/grenades/LineupLightbox.tsx` — fullscreen portal (z-70) over the drawer: ←/→/Home/End, swipe, swipe-down or Esc to close (capture-phase, doesn't close the drawer), wheel / pinch / double-click zoom, drag to pan, step thumbnails, credit + source link. Grenade drawers use `NADE_DRAWER_WIDTH` (920).

## Next tasks (ideas)
1. Re-test `partial` lineups in CS2 Practice and promote the ones that still work; add `result` shots where sources lack them.
2. More flashes / molotovs / HE for Cache and Ancient from 2026 sources.
