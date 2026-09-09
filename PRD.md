# PRD — CloudCerts SelfStudy Hub

> Product Requirements Document. Structure adapted from the IEEE 830 / ISO/IEC/IEEE 29148
> family of SRS templates (see References): Introduction, Product Overview, Requirements,
> Verification, Roadmap. This document describes **what** the product does; **how** it is
> built lives in `ARCHITECTURE.md` and `openspec/`.

| Field | Value |
| --- | --- |
| Product | CloudCerts SelfStudy Hub |
| Version | 0.1.0 (see `CHANGELOG.md`) |
| Type | Desktop app — Tauri 2 + React 18 + MUI v5 + Vite 5 + TypeScript (strict) |
| Window title | `CloudCerts SelfStudy Hub` |
| UI language | Spanish (full i18n is out of scope, §3.7) |
| Status | Local development (debug binary + Vite dev server; no signed distribution) |

---

## 1. Introduction

### 1.1 Purpose

CloudCerts SelfStudy Hub is a desktop study companion for cloud & AI certifications. It gives
a self-learner one place to **plan** (roadmap + priorities), **study** (35 eight-week guides
with checkable study points), **practice** (local mock exams with weighted scoring),
**track** (KPIs + per-cert progress persisted in SQLite), and **extend** (YAML-first authoring
of guides, question banks, and mocks with schema validation).

This PRD is the source of truth for product scope: every view, persistence decision, and
explicit non-goal below is normative unless marked as roadmap.

### 1.2 Scope

**In scope:**

- A catalog of 35 self-study guides (see §A.1), each a fixed 8-week plan organized by
  official exam domains (with weights), tagged with Bloom taxonomy levels 1–6, Kirkpatrick
  levels L1–L4, difficulty (100/200/300), popularity (1–5, 🔥), and career paths.
- Eight ribbon-tab views: Plan de estudios (Home), Progreso, Guías, Editor YAML, Badges,
  Codelabs, Mocks (+ the shell: ribbon, sidebar, Pomodoro, theme picker, FAB add flow).
- Offline-first desktop persistence: study plan in webview `localStorage`, theme +
  progress-checkpoints in SQLite (`cloudcerts.db`, table `progress` + `settings`).
- YAML-schema-first authoring with path-precise validation errors and pedagogy warnings.
- Storybook component library (~30 stories, atomic design) for UI development.

**Out of scope** (see §3.7 for detail): full i18n, CCAR-P / CCAO-F guides, production
distribution/signing, cloud sync/accounts, content auto-updates.

### 1.3 Glossary

| Term | Meaning |
| --- | --- |
| Guide | One 8-week self-study plan for a single certification exam. |
| Week | One of 8 sequential units in a guide; contains exam-domain sections. |
| Domain section | A sub-accordion inside a week, mapped to an official exam domain + weight %. |
| Study point / checkpoint | A clickable To-Do item inside a domain section; persisted per-user. |
| Priority | User-assigned interest weight 1–5 (🎓) per certification; drives distribution KPIs. |
| Difficulty | Catalog metadata 100 (fundamental) / 200 (associate) / 300 (professional/specialty). |
| Popularity | Catalog metadata 1–5 (🔥). |
| Bank | A named pool of exam questions shared across mocks. |
| Mock | A quiz assembled from one or more banks; run locally with timer + weighted scoring. |
| Bloom tag | Cognitive level 1–6 (Remember → Create) attached to study content. |
| Kirkpatrick tag | Training-evaluation level L1–L4 (Reaction → Results) attached to study content. |
| Plan | The user's selection: interested certs + priorities; stored in webview `localStorage`. |
| Shell | The app chrome: Office-style ribbon, Paperbase-style sidebar, FAB, Snackbar, dialogs. |

### 1.4 References

- IEEE 830 / ISO/IEC/IEEE 29148 — SRS organization (section structure adapted, not copied).
- `ARCHITECTURE.md` — Clean Architecture layer model (domain/application/infrastructure/
  presentation) and dependency rules; normative for implementation.
- `openspec/` — OpenSpec baseline (`openspec init`, schema `spec-driven`); future changes
  go through `/opsx:propose → /opsx:apply → /opsx:archive`.
- `README.md`, `CONTRIBUTING.md`, `AI_POLICY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`.
- Official exam pages linked per guide as `sources` (each with a fetch date) — the only
  trusted source for exam facts (see `AI_POLICY.md`: verify-before-invent).

### 1.5 Document conventions

- Requirement IDs: `FR-<AREA>-<NN>` (functional), `NFR-<QUALITY>-<NN>` (non-functional),
  `C-<NN>` (constraints). IDs are stable; renumbering is a breaking doc change.
- Keywords SHALL / SHALL NOT / SHOULD follow RFC 2119.
- Spanish UI strings are quoted verbatim (e.g. `Plan de estudios`); the prose of this
  document is in English.

---

## 2. Product Overview

### 2.1 Context

Certification candidates juggle vendor PDFs, video courses, practice exams, and personal
notes across disconnected tools. CloudCerts SelfStudy Hub consolidates the *study loop*
into a single offline desktop app: pick certs, follow a week-by-week plan, check off study
points, drill mocks, and watch progress — with all personal data stored locally
(SQLite + `localStorage`, no accounts, no telemetry).

### 2.2 Product functions (summary)

| # | Function | View |
| --- | --- | --- |
| F1 | Roadmap cards + overall progress | Home (`Plan de estudios`) |
| F2 | KPIs, priority distribution, per-cert tracking | Progreso |
| F3 | Week accordions → domain sub-accordions → checkable study points | Guías |
| F4 | Author guides/banks/mocks in YAML with schema validation | Editor YAML |
| F5 | Open Badges 3.0 explorer with real Credly badge images | Badges |
| F6 | `.ipynb` upload + notebook rendering + Skills Boost links | Codelabs |
| F7 | Local quiz runner (timer, single/multi choice, 70% weighted pass, retry, review) | Mocks |
| F8 | App chrome: ribbon, sidebar nav tree, Pomodoro, themes, FAB add-cert, toasts | Shell |

### 2.3 User classes

| User | Description | Needs |
| --- | --- | --- |
| U1 Self-learner | Individual preparing 1+ cloud/AI exams, Spanish-speaking | Structured plan, progress memory, practice exams |
| U2 Content author | U1 turned editor; authors guides/banks via YAML or LLM assistance | Schema validation, pedagogy warnings, explicit save |
| U3 Contributor | Developer extending the app (see `CONTRIBUTING.md`) | Clean Architecture boundaries, Storybook stories, validator parity |

Single-user, single-machine. No roles, no sharing, no collaboration features.

### 2.4 Constraints (summary; normative detail in §3.6)

Linux-first Tauri 2 desktop; offline fonts bundled; SQLite at
`~/.local/share/com.cloudcertshub.app/cloudcerts.db`; plan in webview `localStorage`;
TypeScript strict; MUI v5 only (no v6/v7 migration in scope); Storybook on `:6006`;
Vite dev on `:1420`.

### 2.5 Assumptions and dependencies

- A1: Exam-domain weights and objectives change over time; each guide carries verified
  official PDF `sources` with fetch dates so staleness is detectable.
- A2: Users run the Tauri shell (SQLite path) rather than pure browser dev mode
  (`localStorage` fallback) for durable progress.
- A3: Badge images resolve from Credly at view time; offline badge browsing degrades to
  metadata without images.
- A4: `.ipynb` files come from the user's own study material (e.g. Google Skills Boost);
  the renderer does not execute code.

---

## 3. Requirements

### 3.1 External interfaces

#### 3.1.1 User interface

- The app SHALL present an Office-style **ribbon** (tabs, command groups, collapsible to a
  menu bar) and a Paperbase-style **navy sidebar nav tree** grouping certifications by
  entity / priority / difficulty, with chevrons.
- Sidebar selection SHALL navigate to the corresponding guide week with auto-expand +
  scroll-into-view.
- All views SHALL respect the active MUI theme (light/dark + seed color + monospaced
  typography options) chosen in the theme picker.
- The UI language SHALL be Spanish; English appears only in proper nouns (cert names) and
  developer-facing surfaces (YAML keys, validator messages may mix).

#### 3.1.2 Software interfaces

- **SQLite** via `tauri-plugin-sql`: database `cloudcerts.db` with `settings(key, value)`
  and `progress` tables. Outside Tauri (browser dev), `localStorage` fallback applies.
- **Webview `localStorage`**: the study plan (interested certs, priorities, selection).
- **Credly CDN**: badge images for the Badges view (read-only, best-effort).
- **Skills Boost links**: outbound URLs from Codelabs; no API integration.

### 3.2 Functional requirements — Shell

| ID | Requirement |
| --- | --- |
| FR-SHELL-01 | The ribbon SHALL expose one tab per view (Home/`Plan de estudios`, Progreso, Guías, Editor YAML, Badges, Codelabs, Mocks) with command groups per tab, and SHALL collapse to a menu bar on demand. |
| FR-SHELL-02 | The sidebar SHALL render a nav tree of the 35-cert catalog groupable by entity (provider), priority (1–5 🎓), and difficulty (100/200/300), with chevron expand/collapse. |
| FR-SHELL-03 | Clicking a sidebar node SHALL navigate to the matching guide week, auto-expanding accordions and scrolling the target into view. |
| FR-SHELL-04 | The Pomodoro dialog (lucide `Timer` icon) SHALL offer 25-min focus / 5-min short break / 15-min long break presets with start/pause/reset. |
| FR-SHELL-05 | The theme picker SHALL offer light/dark modes, seed-color choices (M3 palettes via `@material/material-color-utilities`), and monospaced typography options; the choice SHALL persist in SQLite (`settings`, key `theme`). |
| FR-SHELL-06 | The FAB SHALL open an add-certification dialog implementing the full guide YAML schema as a form; submitting SHALL create a guide that validates cleanly. |
| FR-SHELL-07 | Mutating actions (save, add, reset) SHALL use an explicit-save model with a bottom-right Snackbar toast confirming the outcome; no silent autosave for destructive operations. |

### 3.3 Functional requirements — Views

#### Home — `Plan de estudios`

| ID | Requirement |
| --- | --- | --- |
| FR-HOME-01 | Home SHALL render roadmap cards (one per interested certification) showing title, provider, difficulty, popularity (🔥), priority (🎓), and overall progress %. |
| FR-HOME-02 | Clicking a roadmap card SHALL deep-link to the corresponding guide week view. |

#### Progreso

| ID | Requirement |
| --- | --- | --- |
| FR-PROG-01 | Progreso SHALL show KPIs: total checkpoints, completed checkpoints, global completion %, active mocks passed/attempted. |
| FR-PROG-02 | Progreso SHALL show the priority distribution (counts per priority 1–5). |
| FR-PROG-03 | Progreso SHALL show per-certification tracking rows with progress bars and navigation to the guide. |

#### Guías

| ID | Requirement |
| --- | --- | --- |
| FR-GUIDE-01 | Each guide SHALL present exactly 8 weeks as accordions; each week SHALL contain domain sub-accordions in official exam-domain order with weight % labels. |
| FR-GUIDE-02 | Domain sections SHALL expose clickable To-Do checkpoints; toggling SHALL persist to the SQLite `progress` table keyed by stable study-point IDs. |
| FR-GUIDE-03 | Study content SHALL carry Bloom (1–6) and Kirkpatrick (L1–L4) tags where authored; the UI SHALL render them as chips. |
| FR-GUIDE-04 | Each guide SHALL display its metadata: difficulty (100/200/300), popularity (1–5 🔥), career paths, and verified official PDF sources with fetch dates. |

#### Editor YAML

| ID | Requirement |
| --- | --- | --- |
| FR-EDIT-01 | The editor SHALL edit guides, question banks, and mocks as YAML documents (hand-typed or LLM-generated). |
| FR-EDIT-02 | On every validation run the editor SHALL report schema issues with JSON-path errors (missing keys, wrong types, week-count ≠ 8) and pedagogy warnings (e.g. missing Bloom/Kirkpatrick tags, domain weights not summing to 100%). |
| FR-EDIT-03 | Saving from the editor SHALL require explicit confirmation and SHALL refuse to persist documents with schema errors (warnings allowed). |

#### Badges

| ID | Requirement |
| --- | --- | --- |
| FR-BADGE-01 | The Badges view SHALL present an Open Badges 3.0 explorer over the catalog, rendering real Credly badge images when reachable. |
| FR-BADGE-02 | Badge detail SHALL show issuer, exam code, and a link to the official exam page. |

#### Codelabs

| ID | Requirement |
| --- | --- | --- |
| FR-CODE-01 | Codelabs SHALL accept `.ipynb` uploads and render markdown, code, and plain-text cells (no code execution). |
| FR-CODE-02 | Codelabs entries SHALL support an associated Skills Boost link rendered as an outbound action. |

#### Mocks

| ID | Requirement |
| --- | --- | --- |
| FR-MOCK-01 | The mock runner SHALL support single-choice and multi-choice questions, a countdown timer, and navigation (next/previous/flag for review). |
| FR-MOCK-02 | Scoring SHALL be domain-weighted (per-question weights aggregate to domain weights) with a 70% pass threshold; the result screen SHALL show pass/fail, per-domain breakdown, and elapsed time. |
| FR-MOCK-03 | After finishing, the runner SHALL offer retry (reshuffled) and review modes; review SHALL show the correct answer(s) plus a teaching explanation per question. |
| FR-MOCK-04 | Question banks SHALL be shareable across mocks (many-to-many: one bank feeds multiple mocks). |

### 3.4 Data and YAML schema (summary)

Authoritative field rules live in the validator (`src/domain/guideSchema.ts`,
`src/domain/mockSchema.ts`) and mirrored form logic; the summary below is informative.

**Guide YAML** (top level): `id` (slug, unique), `title`, `provider`, `examCode`,
`difficulty` (100|200|300), `popularity` (1–5), `priority` default (1–5), `careerPaths[]`,
`sources[]` (`{label, url, fetchedAt}` — official PDFs only), `weeks[8]` →
`{n, title, domains[]}` → `{name, weightPct, bloom[], kirkpatrick[], points[]}` →
`{id (stable), text}`. Invariants: exactly 8 weeks; domain `weightPct` per guide sums to
100 (±1 tolerance, warning); study-point `id`s are stable across edits (progress keys).

**Bank YAML**: `id`, `title`, `questions[]` → `{id, stem, type: single|multi, choices[],
answer[] (indices), explanation, domain, weight}`.

**Mock YAML**: `id`, `title`, `bankRefs[]` (≥1), `timeLimitMin`, `passPct` (default 70),
`shuffle` (default true).

**Runtime stores**: `settings(key TEXT PRIMARY KEY, value TEXT NOT NULL)` — key `theme`;
`progress` — one row per completed checkpoint keyed by stable study-point ID; `plan`
(interests, priorities, selection) in webview `localStorage`.

### 3.5 Non-functional requirements

| ID | Requirement |
| --- | --- | --- |
| NFR-PERF-01 | The production bundle SHALL be code-split by view; no single JS chunk SHALL exceed 300 KB gzipped. (Known violation: single ~969 KB chunk — see Roadmap R1.) |
| NFR-PERF-02 | Initial DOM SHALL stay under ~1200 nodes on the heaviest view (known: ~1900 — see R1). |
| NFR-PERF-03 | Font payload SHALL include only the used weights/subsets (trim the five bundled families); UI text SHALL NOT block on fonts (system fallback first). |
| NFR-PERF-04 | Guide navigation (sidebar → week scroll) SHALL complete within 500 ms on a reference laptop; checkpoint toggles SHALL paint optimistically and persist async. |
| NFR-REL-01 | All user data (plan, progress, theme) SHALL survive app restarts; SQLite writes SHALL be atomic per action with explicit-save confirmation. |
| NFR-USE-01 | Every mutating action SHALL give feedback within 200 ms (optimistic UI or Snackbar); destructive actions SHALL confirm first. |
| NFR-MAIN-01 | New UI SHALL ship with Storybook stories following atomic design (atoms/molecules/organisms); presentation components SHALL receive data via props (no direct store imports) per `ARCHITECTURE.md`. |
| NFR-SEC-01 | No accounts, no network calls except Credly images and outbound links; `.ipynb` rendering SHALL NOT execute code. |

### 3.6 Design, implementation & distribution constraints

| ID | Constraint |
| --- | --- | --- |
| C-01 | Desktop only: Tauri 2 + Rust backend; no Tauri custom commands yet — backend changes go in `src-tauri/src/` modules. |
| C-02 | TypeScript strict; Clean Architecture dependency rule (presentation → application → domain; infrastructure implements domain ports; violations fail review). |
| C-03 | MUI v5 pinned (`@mui/material ^5`, `@emotion/*`); no MUI v6/v7 migration in this scope. |
| C-04 | Offline-first fonts bundled via `@fontsource/*`; no runtime Google-Fonts fetch. |
| C-05 | SQLite file fixed at `~/.local/share/com.cloudcertshub.app/cloudcerts.db` (Linux); schema changes need a migration path preserving `settings` + `progress`. |
| C-06 | Ports: Vite dev `:1420`, Storybook `:6006`; Tauri debug binary is the dev shell. |
| C-07 | No production distribution/signing pipeline (no updater, no `.deb`/`.AppImage` signing) — developer builds only. |

### 3.7 Out of scope (explicit non-goals)

1. **Full i18n** — the UI stays Spanish; English docs are for contributors only.
2. **CCAR-P / CCAO-F guides** — insufficient public exam data to author verified guides.
3. **Production distribution & signing** — deferred until content and perf baselines land.
4. **Cloud sync / accounts / telemetry** — local-first is a feature, not a gap.
5. **Content auto-updates** — exam changes arrive via manual YAML edits + validator.

---

## 4. Verification

| Level | Method | Entry point |
| --- | --- | --- |
| Schema validation | YAML validator unit tests (path errors + pedagogy warnings) | Editor YAML (`FR-EDIT-02`) |
| Component | Storybook stories (~30) + interaction checks | `npm run storybook` → `:6006` |
| Type safety | `tsc` strict (part of `npm run build`) | CI / pre-merge |
| Manual acceptance | Per-view checklist derived from FR IDs (each FR maps to ≥1 acceptance step) | Tauri debug binary |
| Performance | DevTools trace audit vs NFR-PERF-01…04 (chunk size, DOM nodes, font payload) | Roadmap R1 exit criteria |
| Traceability | OpenSpec delta specs per change (`/opsx:propose`) reference the FR/NFR IDs they touch | `openspec/changes/<name>/` |

---

## 5. Roadmap

| ID | Item | Exit criteria |
| --- | --- | --- |
| R1 | Performance follow-ups (from DevTools trace) | Code-split views (≤300 KB/chunk), trim font payload, heaviest view ≤1200 DOM nodes; re-trace to confirm. |
| R2 | Production distribution & signing | Signed installers (`.deb`/`.AppImage` min.), updater wiring, versioned releases in `CHANGELOG.md`. |
| R3 | CCAR-P / CCAO-F guides | Publish only when sufficient official public data exists to meet the verified-sources bar (`FR-GUIDE-04`). |
| R4 | Full i18n (Spanish-first today) | Externalized strings + English locale; no hard-coded UI Spanish. |
| R5 | Spec baseline in OpenSpec | Register current behavior as `openspec/specs/*` domains so future changes use deltas (init-only today). |

---

## Appendix A — Catalog (35 guides)

| Provider | Certifications (exam codes) | Count |
| --- | --- | --- |
| AWS | CLF-C02, SOA-C02 (covers SOA-C03 note), SAA-C03, DVA-C02, SAP-C02, DOP-C02 | 6 |
| Google Cloud | ACE, GenAI Leader, Data Practitioner, PCA, PDE, CDL, ML Engineer | 7 |
| Azure | AZ-900, AI-901, AZ-104, AZ-204, AZ-305 | 5 |
| CNCF | CKA, CKAD, OTCA, CGOA, KCA (Kyverno) | 5 |
| NVIDIA | NCA-GENL, NCA-ADS, NCA-GENM, NCA-AIIO | 4 |
| Linux Foundation | LFCS, CAPA | 2 |
| ISTQB | CTFL v4.0, CT-AI v2.0 (lifetime validity) | 2 |
| Anthropic | CCAR-F, CCDV-F | 2 |
| Red Hat | EX280 | 1 |
| HashiCorp | TA-004 | 1 |
| **Total** | | **35** |

Each entry carries: 8 weeks · exam-domain sections with weights · Bloom 1–6 + Kirkpatrick
L1–L4 tags · difficulty 100/200/300 · popularity 1–5 (🔥) · career paths · verified
official PDF sources with fetch dates · badge image (Credly-backed in the Badges view).
