# STRATIFY — CS2 Tactical Companion

Десктоп-приложение для Windows (Tauri 2 + React + TypeScript + Tailwind + Framer Motion + Supabase).
Помогает готовиться к матчам FACEIT/Premier: карты, гранаты, тактики, тренировки и личный прогресс. Каждый материал привязан к источнику.

## Сайт

Веб-версия: **https://kri7tallik.github.io/stratify/** — обновляется сама после каждого пуша в `main` (workflow `Deploy site`).

## Запуск

Нужно на Windows:
1. **Node.js 20+**
2. **Rust** (`rustup`, toolchain `stable-x86_64-pc-windows-msvc`)
3. **Microsoft C++ Build Tools** (workload «Desktop development with C++»)
4. **WebView2**: в Windows 10/11 обычно уже есть

```powershell
npm install
npm run tauri:dev      # приложение в режиме разработки
npm run tauri:build    # установщики: src-tauri/target/release/bundle/{nsis,msi}/
```

Только веб-интерфейс, без Tauri: `npm run dev` и открыть http://localhost:1420.

Без локальной сборки: запушьте проект на GitHub и запустите workflow **Build Windows installer** (`.github/workflows/build-windows.yml`). Готовый `.exe` появится в артефактах.

## Что внутри

- **Подготовка к матчу**: выбираете карту и получаете на одном экране разминку с таймером, чеклисты гранат за T и CT (сначала проверенные) и тактики карты.
- **Квиз по callouts**: вкладка «Квиз» на странице карты. Подсвечивается позиция, нужно выбрать её название.
- **Проверка целостности**: `npm run validate` ищет битые ссылки на позиции, гранаты и источники. Та же проверка показывается в Библиотеке → Проверка.

## Архитектура

```
src/
  types/content.ts         модель данных (SourceMeta у каждого материала)
  data/                    встроенная база: sources, maps, grenades(.more), tactics(.more), training, playbook
  services/content.tsx     репозиторий: встроенная база + Supabase-каталог + материалы пользователя
  store/useAppStore.ts     прогресс, избранное, сессии, материалы пользователя (zustand + localStorage)
  lib/                     supabase, форматирование, радар-изображения, открытие ссылок
  components/
    ui/                    дизайн-система (Button, Card, Badge, Segmented, Drawer, Modal, States…)
    layout/                AppShell, Sidebar, Topbar, CommandPalette (Ctrl+K)
    map/MapSchematic.tsx   интерактивная схема: callouts, маршруты, траектории гранат
  features/                по папке на раздел: dashboard, maps, grenades, tactics, training,
                           playbook, progress, library, favorites, settings, prep
src-tauri/                 Rust-оболочка (окно, plugin-opener)
supabase/migrations/       SQL-схема каталога и облачного бэкапа прогресса
```

Данные объединяются в три слоя (более поздний слой перекрывает ранний по `id`):
**встроенная база → Supabase `content_items` → материалы пользователя**.

## Источники и проверка

У каждого материала есть `meta: { sourceId, url?, author?, status, checkedAt, note? }`:

| status | значение |
|---|---|
| `verified` | сверено с текстом/видео источника |
| `partial` | источник подтверждает, что лайнап/тактика существует, но детали (например, точка прицеливания) надо сверить в игре |
| `unverified` | материал эпохи CS:GO или без источника |

Раздел **Библиотека → Проверка** показывает всё, что требует проверки.
Встроенная база проверена 24.11.2026. Пул карт: Ancient, Anubis, Cache, Dust II, Inferno, Mirage, Nuke (Cache заменил Overpass 8 июля 2026; Train выбыл 22 января 2026).

**Радары** — официальные overview-изображения из файлов CS2 (© Valve), лежат в `public/radars/`. Маркеры позиций расставлены вручную и приблизительны.

**Фото лайнапов** (где стоять / куда целиться) подгружаются по ссылке из статьи-источника (BLAST.tv, Dexerto) с подписью автора — в приложение они не копируются. Нужен интернет.

## Как добавлять контент

- **В приложении:** Библиотека → «Новая граната / тактика / запись Playbook / источник». Без ссылки на источник материал всегда помечается как «Не проверено». Экспорт и импорт в JSON.
- **В коде:** добавьте объект в `src/data/*.ts`. TypeScript проверит структуру.
- **Через Supabase:** вставьте строку в `content_items` (`kind`, `data` в формате из `types/content.ts`). Она появится у всех пользователей каталога.
- **Новая карта:** добавьте объект в `MAPS` (`src/data/maps.ts`): callouts с координатами 0–100, рёбра, маршруты и позиции. ID карты добавьте в тип `MapId`.

## Supabase (необязательно)

1. Создайте проект и выполните `supabase/migrations/0001_init.sql`.
2. Настройки → Supabase: укажите URL и anon key (или задайте `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` в `.env`).
3. Облачный бэкап прогресса работает через вход по коду из письма. В шаблоне письма Supabase (Auth → Email Templates → Magic Link) должен быть `{{ .Token }}`.
