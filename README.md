# CloudCerts SelfStudy Hub

Desktop study companion for cloud & AI certifications — 35 eight-week self-study guides,
progress tracking, mock exams, and YAML-first content authoring, all offline and local-first.

[![Tauri 2](https://img.shields.io/badge/Tauri-2-24C8DB?style=flat-square&logo=tauri)](https://v2.tauri.app)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![MUI v5](https://img.shields.io/badge/MUI-v5-007FFF?style=flat-square&logo=mui)](https://mui.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-tauri--plugin--sql-003B57?style=flat-square&logo=sqlite)](https://github.com/tauri-apps/plugins-workspace)
[![Storybook](https://img.shields.io/badge/Storybook-%7E30%20stories-FF4785?style=flat-square&logo=storybook)](https://storybook.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#license)

**Docs:** [PRD](./PRD.md) · [Architecture](./ARCHITECTURE.md) · [Contributing](./CONTRIBUTING.md) ·
[AI Policy](./AI_POLICY.md) · [Code of Conduct](./CODE_OF_CONDUCT.md) · [Changelog](./CHANGELOG.md) ·
[OpenSpec](./openspec/)

---

## What it is

CloudCerts SelfStudy Hub is a **Tauri 2 desktop app** (React 18, MUI v5, Vite 5,
TypeScript strict) that turns certification prep into a structured loop: **plan** your
roadmap, **study** week-by-week guides, **check off** study points, **drill** mock exams,
and **track** progress — with everything stored locally in SQLite + webview
`localStorage`. No accounts, no telemetry, no cloud.

The UI is in **Spanish**. Each of the 35 guides is a fixed **8-week plan** organized by
official exam domains (with weights) and enriched with Bloom 1–6 + Kirkpatrick L1–L4 tags,
difficulty levels (100/200/300), popularity (🔥 1–5), career paths, and verified official
PDF sources with fetch dates.

## Features

- **Plan de estudios (Home)** — roadmap cards with per-cert progress; click through to any week.
- **Progreso** — KPIs, priority distribution (🎓 1–5), and per-certification tracking rows.
- **Guías** — week accordions → exam-domain sub-accordions → clickable To-Do checkpoints
  persisted in SQLite (`progress` table, stable IDs).
- **Editor YAML** — author guides, question banks, and mocks as YAML (by hand or with an
  LLM); schema validator reports path-precise errors plus pedagogy warnings.
- **Badges** — Open Badges 3.0 explorer with real Credly badge images.
- **Codelabs** — upload `.ipynb`, render markdown/code/text cells (never executes code),
  attach Skills Boost links.
- **Mocks** — local quiz runner: countdown timer, single/multi choice, domain-weighted
  scoring vs a 70% pass bar, retry with reshuffle, and review mode with teaching
  explanations. Banks are shareable across mocks.
- **Shell** — Office-style ribbon (collapsible), Paperbase-style navy sidebar nav tree
  (group by provider/priority/difficulty, navigate-to-week with auto-expand + scroll),
  Pomodoro dialog (25/5/15), theme picker (light/dark + M3 seed palettes, SQLite-backed),
  FAB add-certification dialog (full YAML-schema form), explicit save + Snackbar toasts.

## Catalog — 35 guides

| Provider | Certifications |
| --- | --- |
| AWS (6) | CLF-C02 · SOA-C02 (covers SOA-C03 note) · SAA-C03 · DVA-C02 · SAP-C02 · DOP-C02 |
| Google Cloud (7) | ACE · GenAI Leader · Data Practitioner · PCA · PDE · CDL · ML Engineer |
| Azure (5) | AZ-900 · AI-901 · AZ-104 · AZ-204 · AZ-305 |
| CNCF (5) | CKA · CKAD · OTCA · CGOA · KCA (Kyverno) |
| NVIDIA (4) | NCA-GENL · NCA-ADS · NCA-GENM · NCA-AIIO |
| Linux Foundation (2) | LFCS · CAPA |
| ISTQB (2) | CTFL v4.0 · CT-AI v2.0 (lifetime validity) |
| Anthropic (2) | CCAR-F · CCDV-F |
| Red Hat (1) | EX280 |
| HashiCorp (1) | TA-004 |

## Quickstart

Requirements: **Node.js ≥ 20**, Rust toolchain (`cargo`), and Tauri system deps on Linux
(`libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libxdo-dev`,
`libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`).

```bash
# 1. Install JS dependencies
npm install

# 2. Browser-only dev (no Tauri; theme/progress fall back to localStorage)
npm run dev              # → http://localhost:1420

# 3. Desktop dev shell (compiles the Rust backend + opens the app window)
npm run tauri:dev        # first run takes minutes — it builds all Tauri crates

# 4. Component library
npm run storybook        # → http://localhost:6006 (~30 stories, atomic design)

# 5. Production build (bundles land in src-tauri/target/release/bundle)
npm run tauri:build
```

## Architecture

Clean Architecture with a strict inward-only dependency rule
(`presentation → application → domain`; `infrastructure` implements domain ports).
The composition root (`src/App.tsx` + `src/main.tsx`) wires everything.

Persistence (Linux):

| Data | Store |
| --- | --- |
| Study plan (interests, priorities, selection) | webview `localStorage` |
| Theme | SQLite `cloudcerts.db → settings(theme)` (localStorage fallback in browser) |
| Checkpoint progress | SQLite `cloudcerts.db → progress` (localStorage fallback in browser) |

DB file: `~/.local/share/com.cloudcertshub.app/cloudcerts.db`.
Full layer map and the dependency-rule checks in [`ARCHITECTURE.md`](./ARCHITECTURE.md);
product scope and requirement IDs in [`PRD.md`](./PRD.md).

## Contributing & AI use

Contributions are welcome — start with [`CONTRIBUTING.md`](./CONTRIBUTING.md). This is an
**AI-assisted project**: any AI-generated contribution must be disclosed and every exam
fact must be verified against official sources before it lands — see
[`AI_POLICY.md`](./AI_POLICY.md) (verify-before-invent). Be kind: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## License

MIT (as declared by the project; a `LICENSE` file has yet to be added — see `CHANGELOG.md`).
