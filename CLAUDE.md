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

## Design (redesign, Nov 2026)
Modern "island" layout with **light and dark themes**.
- Themes: tokens are CSS variables (`"R G B"`) in `src/styles/index.css` under `:root[data-theme="light"|"dark"]`; Tailwind colours read them (`bg-bg`, `bg-bg-raised`, `bg-sunken`, `text-ink(-muted|-faint)`, `ring-line`, `accent`, `on-accent`, `tside`, `ctside`, `ok/warn/bad`). Never hard-code `#hex`, `bg-black/x` or `text-white` for UI chrome — use tokens (`bg-ink/[0.05]` for subtle fills). Exception: always-dark "screens" (`.screen` radars, screenshots, lightbox) may use white text.
- Accent = acid lime `--accent` (fill, text on it = `text-on-accent`); `text-accent` / `ring-accent` / `border-accent` map to the readable `--accent-ink` variant automatically (dark olive on paper, lime on black). Second colour `accent-2` = aqua.
- Preference lives in the store (`theme: light|dark|system`, default system); `src/lib/theme.ts` (`useApplyTheme`, `switchTheme`), toggle in `layout/ThemeToggle.tsx`, full choice in the header menu and Settings. `index.html` sets `data-theme` before first paint.
- Shell: `layout/Header.tsx` — floating glass header (logo, pill nav with sliding active state, session timer, search, theme, "More" menu with secondary pages/language/theme) and `MobileDock` (floating bottom dock on < lg). Drawers/modals render in a portal on `<body>`.
- Type: Unbounded (`font-hero`, page titles / big numbers), Inter Tight (`font-display`, UI headings), Inter (body), JetBrains Mono (labels, numbers). Headings are sentence case, not uppercase.
- Shapes: rounded (`.chamfer` now means border-radius 20 / `-sm` 12 / `-lg` 28), pill buttons/segmented controls with inverted ink active state, `.frame` = 1px border, `.frame-hot` / hovered interactive cards = lime→aqua gradient border, `.glass`, `.tag-label` (mono caps), `.backdrop` (lime/aqua mesh) + `.dots`, `.grain`. Respect `prefers-reduced-motion`.

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
