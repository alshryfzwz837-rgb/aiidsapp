# AGENTS.md

AI-IDS 6.0 is a dark-themed SOC / intrusion-detection platform for a Yemeni cybersecurity graduation project. Arabic RTL is the primary language. It runs on TanStack Start (React 19) and is deployed to Netlify.

**Continue from [PLAN.md](./PLAN.md).** Milestone 1 (the UI surface) is done. The next step is Milestone 2 (data model + API).

## Directory map

```
src/
  routes/                 file-based routes (one per sidebar item)
    __root.tsx            <html lang="ar" dir="rtl">, fonts, providers, AppShell
    index.tsx             dashboard grid
    events.tsx            event explorer + detail drawer (search params: q, id)
    models.tsx            model metrics, confusion matrix, CSV validator
    ueba|soar|threat-intelligence|honeypots|compliance|users|reports|database|settings.tsx
                          thin wrappers around components/ModulePages.tsx
  components/
    layout/AppShell.tsx   sidebar (NAV list), header, footer, mobile drawer
    dashboard/            KpiCards, Charts (donut/trend), ThreatMap, Panels
    ModulePages.tsx       secondary module pages
    Brand.tsx             SVG shield logo, Yemen flag
    ui.tsx                Panel, badges, DemoChip, Ltr/Mono helpers, PageHeader
  lib/
    fixtures.ts           ALL demo data — the single swap point for real APIs
    demoStream.tsx        30 s synthetic refresh (trend + recent events)
    i18n.tsx              AR/EN context: t(ar, en), sets html dir/lang
    csvValidator.ts       client-side dataset checks (mirror these in /api/train/csv)
```

## Conventions

- **Colours:** use the theme tokens in `src/styles.css`, for example `bg-surface`, `border-line`, `text-cyan-bright`, `text-ink-2`, `text-threat`, `text-warn`, `text-ok`. Cards use the `.glass` class and add `.glass-hover` for the hover lift.
- **Technical values** (IPs, ports, model names, protocols) must render LTR. Wrap them in `<Mono>` or `<Ltr>`, or use the `.ltr` / `.mono` classes.
- **Bilingual strings** are written inline as `t('عربي', 'English')`. Arabic is the default at SSR.
- **Logical CSS properties:** use `ms-/me-/ps-/pe-/start-/end-/border-s/border-e` so layouts mirror in both directions. Recharts containers are wrapped in `dir="ltr"`.
- **Grid order:** in RTL the first grid child renders on the right. Dashboard rows are listed right-to-left to match the reference (the donut is on the far left).
- **Honest labelling:** any value that is not produced by a real backend must carry `<DemoChip>` or a similar label. Never present synthetic metrics as research results.
- **Identity:** Yemen only (the flag is red/white/black). Never show Saudi Arabia.
- **SOAR:** simulation mode only. Never add code that executes real blocking or isolation without an explicit admin-approval flow.

## Non-obvious decisions

- The spec asked for Chart.js to be replaced by Recharts, so the template's Chart.js dependency was removed.
- The world map uses `world-atlas/countries-110m.json` (Yemen is id `887`; Antarctica, id `010`, is filtered out) with `geoNaturalEarth1`.
- The footer's system status honestly reports `Demo / Fixtures / Pending` until the backend exists.
- Settings persist to `localStorage` (`aiids.settings`, `aiids.lang`) and are UI preferences only. Server-side settings arrive in Milestone 7.
- Persistent data must use Netlify Database (Postgres + Drizzle, schema in `db/schema.ts`). See the `netlify-database` skill.
