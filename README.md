# AI-IDS 6.0 — Yemen Cyber Defense & AI Intrusion Detection Platform

**AI-Powered Intrusion Detection & Response · الجمهورية اليمنية 🇾🇪 · الأمن السيبراني لمستقبل آمن**

AI-IDS 6.0 is a Security Operations Center (SOC) web platform built as a cybersecurity graduation project. It has a dark SOC visual identity, and Arabic RTL is the primary language (English LTR is also available). It covers AI-based intrusion detection, behavior analytics (UEBA), simulated automated response (SOAR), threat intelligence (IOCs), honeypots, compliance and reporting.

> **Demo Mode.** Every number in the current build comes from clearly labelled synthetic fixtures (`src/lib/fixtures.ts`). Nothing is presented as a real attack or a real benchmark. The ML metrics become real only after the ML-engine milestone trains and evaluates the models on a real dataset.

## What's live

| Route | Screen |
|---|---|
| `/` | Security dashboard: 6 KPIs, threat donut, event trend, world threat map, recent events, AI models, UEBA, SOAR, honeypots, compliance, quick stats |
| `/events` | Event explorer with search, severity/type/status/IP/date filters, pagination and a detail drawer |
| `/models` | Model comparison, confusion matrix, classification report, feature importance, pipeline, CSV validator |
| `/ueba` | Monitored entities and risk scores |
| `/soar` | Playbooks and response simulation (Simulation Mode is locked on) |
| `/threat-intelligence` | IOC table with a type filter and an add-indicator form |
| `/honeypots` | Sensors and captured attacks |
| `/compliance` | Framework coverage and methodology notes |
| `/users` | Users and the RBAC permission matrix |
| `/reports` | CSV / JSON / PDF export of 7 report types |
| `/database` | Planned data schema |
| `/settings` | Language, refresh interval, detection threshold, log level (saved locally) |

## Tech stack

- **TanStack Start** (React 19, TypeScript, file-based routing) on **Netlify**
- **Tailwind CSS 4** with custom SOC design tokens (`src/styles.css`)
- **Recharts** for charts, **d3-geo + world-atlas** for the SVG world map, **Lucide** icons
- Fonts: Tajawal (Arabic), Inter (Latin), JetBrains Mono (technical values)

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
# or, with Netlify emulation:
netlify dev       # http://localhost:8888
```

## Academic integrity rules built into the UI

- Model accuracy (e.g. 97.8%) is marked as a demo value until backend evaluation produces it.
- The threat map is labelled "محاكاة" (simulated).
- "الأمن السيبراني اليمني" is shown as **Yemen Security Baseline — Project Reference** (معيار داخلي للمشروع). It is not an official national standard.
- SOAR never executes real blocking or isolation. Simulation is the default, and any real integration will require admin approval.

## Roadmap

See [PLAN.md](./PLAN.md). The remaining milestones are:

2. Data model and core API
3. Authentication and RBAC
4. ML engine (5 models, real evaluation, CSV training)
5. Zeek/Suricata ingestion, the severity engine and UEBA
6. SOAR simulation API and the IOC lifecycle
7. Reports, settings and real-time updates
8. Windows-local FastAPI package and the full QA matrix
