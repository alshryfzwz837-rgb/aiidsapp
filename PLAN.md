# AI-IDS 6.0 — Product Roadmap

AI-IDS 6.0 is a large platform: SOC dashboard, event pipeline, five ML models, Zeek/Suricata ingestion, UEBA, SOAR, IOC management, RBAC and reporting. It is delivered in self-contained milestones so every step ships something usable.

All UI data lives in `src/lib/fixtures.ts`. Each backend milestone replaces a slice of that module with real API calls. **The component tree does not change.**

---

## ✅ Milestone 1: SOC product surface (done)

- Dark SOC design system: tokens, glass cards, cyan glow and grid background. Arabic RTL is the primary language, English LTR the secondary.
- App shell:
  - Right-side sidebar with all 12 routes
  - Header with live Aden-time clock, search, AR/EN switch, notifications and profile
  - Status footer
  - Mobile drawer
- Dashboard with all 11 reference panels:
  - 6 KPI cards
  - Threat donut, event trend and world threat map (Yemen emphasised)
  - Recent events, AI models, UEBA
  - SOAR, honeypots, compliance, quick stats
- **Security Events:** search, 5 filters, pagination and a detail drawer (features, IOC, UEBA, audit trail).
- **AI Models:**
  - Comparison table, confusion matrix, classification report and feature importance
  - Training pipeline and dataset card
  - In-browser CSV dataset validator
- Working pages for UEBA, SOAR, Threat Intelligence (add-IOC form), Honeypots, Compliance, Users/RBAC, Reports (CSV/JSON/PDF export), Database and Settings.
- A "Demo Mode / Synthetic Bootstrap Dataset" label appears wherever numbers are not real.

## Milestone 2: Data model & core API

**Stack decision to confirm:**
- The hosted app runs on Netlify: TypeScript server routes and Netlify Database (Postgres + Drizzle).
- The spec also asks for a Windows-local FastAPI + SQLite package for the graduation deliverable. That package is handled in Milestone 8.

**Work:**
- Create the tables: `users`, `events`, `models`, `model_runs`, `ueba_baselines`, `iocs`, `soar_actions`, `audit_logs`, `honeypot_events`, `compliance_controls`, `system_settings`. Every event carries a UUID, timestamps, severity, confidence, prediction, model and status.
- Add these endpoints:
  - `GET /api/health`, `/api/stats`, `/api/events`, `/api/events/{id}`
  - `GET/POST /api/iocs`, `GET /api/audit`, `GET /api/schema`
- Seed the database with labelled synthetic data.
- Swap the fixture imports for fetch hooks. Add skeleton loaders and error states ("تعذر الاتصال بالخادم", "قاعدة البيانات غير متاحة").
- Make the footer status reflect real health checks.

## Milestone 3: Authentication & RBAC

- Local login and logout with secure password hashing.
- Roles: Admin, SOC Analyst and Viewer, enforced on every API route.
- Audit logging for login, logout and configuration changes.
- Rate limiting, input validation and restricted CORS.

## Milestone 4: ML engine

- Training pipeline: cleaning → missing values → encoding → feature selection → stratified split → class balancing → training → evaluation → persistence.
- Models:
  - Random Forest, Gradient Boosting, Logistic Regression and SVM, combined in an ensemble
  - Isolation Forest, used for anomaly scores only
- `POST /api/train/csv` (reusing the validator rules in `src/lib/csvValidator.ts`), `GET /api/models`, `GET /api/models/{id}` and `GET /api/evaluation`.
- `POST /api/predict` and `/api/predict/batch`, returning `{prediction, confidence, severity, anomaly_score, model_votes, recommended_response}`.
- The KPI accuracy card and model panels show **only** evaluated metrics, together with dataset name, version, records, split and seed.
- Scikit-learn training needs a Python runtime. Two options: the local FastAPI package (Milestone 8), or exported models served through ONNX or JSON on Netlify.

## Milestone 5: IDS ingestion, severity engine & UEBA

- `POST /api/ingest/zeek` parses conn.log. `POST /api/ingest/suricata` parses eve.json.
- Normalised feature schema: duration, bytes, packets, ports, protocol, connection state, failed attempts, rates, unique destinations and service.
- Severity engine (LOW/MEDIUM/HIGH/CRITICAL) that weighs prediction, confidence, anomaly score, IOC match, event type and UEBA risk.
- UEBA baselines per user, IP, device, location and time. Deviation and risk scoring.

## Milestone 6: SOAR simulation & threat intelligence

- `GET /api/soar` and `POST /api/soar/simulate` with playbooks. **Simulation is always the default.** Any real action requires explicit admin approval.
- IOC lifecycle: expiry, confidence decay and matching against incoming events.

## Milestone 7: Reports, settings & real-time

- Server-generated reports (PDF/CSV/JSON) with an audit entry for each one.
- Settings stored in `system_settings`.
- Configurable refresh interval, with optional WebSocket or SSE push.

## Milestone 8: Graduation deliverable & QA

- Optional Windows-local package: FastAPI + SQLite backend, `setup_full.bat`, `start_api.bat`, `start.bat` and pytest suite.
- Full functional test matrix covering every button, route and API endpoint, plus RBAC, ingestion, CSV training, responsiveness, RTL and English.
- Methodology documentation, limitations and future work.
