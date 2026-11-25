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

## Next tasks (agreed with owner)
1. **Fresh lineups 2025–2026.** For every map, research current CS2 guides (2025+): smokes, flashes, molotovs, HE. Re-check existing lineups against map updates; fix, replace or mark outdated ones. Each with source URL, author, check date and source screenshots (position / aim / result).
2. **Fullscreen lineup viewer.** Clicking a lineup photo opens a fullscreen lightbox: dark overlay, large image, switch position → aim → result with arrows / swipe / keyboard, wheel/pinch zoom, Esc to close, captions + credit. Also make the grenade drawer wider and its thumbnails larger.
