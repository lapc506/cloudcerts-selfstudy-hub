# Changelog — CloudCerts SelfStudy Hub

All notable changes to this project. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/). Dates are UTC.

## [Unreleased]

### Added

- Product documentation set: `PRD.md` (IEEE-830-adapted requirements with FR/NFR/C IDs),
  rewritten `README.md` (shields, catalog table, quickstart), `CONTRIBUTING.md`,
  `AI_POLICY.md` (verify-before-invent for exam facts), `CODE_OF_CONDUCT.md`.
- OpenSpec baseline via `openspec init` (schema `spec-driven`, `openspec/config.yaml`);
  no proposals registered yet — future changes go through
  `/opsx:propose → /opsx:apply → /opsx:archive`.

### Fixed

- `README.md` catalog corrected to the real 35-guide inventory (was a stale 5-item table).

## [0.1.0] — 2026-09-08

> Reconstructed baseline: this release documents the app as it exists in development.
> There were no earlier tagged releases; everything below describes current behavior.

### Added

- **Catalog**: 35 self-study guides × 8 weeks, exam-domain sections with weights,
  Bloom 1–6 + Kirkpatrick L1–L4 tags, difficulty 100/200/300, popularity 1–5 (🔥),
  career paths, verified official PDF sources with fetch dates, Credly-backed badge
  images. Providers: AWS 6, GCP 7, Azure 5, CNCF 5, NVIDIA 4, LF 2, ISTQB 2,
  Anthropic 2, Red Hat 1 (EX280), HashiCorp 1 (TA-004).
- **Views**: Home roadmap (`Plan de estudios`), Progreso KPIs + priority distribution +
  per-cert tracking, Guías (week → domain accordions, checkable To-Dos), Editor YAML
  (guides/banks/mocks + schema validator with path errors and pedagogy warnings),
  Badges (Open Badges 3.0 explorer), Codelabs (`.ipynb` renderer + Skills Boost links),
  Mocks (timer, single/multi choice, domain-weighted scoring vs 70%, retry, review with
  explanations; banks shared across mocks).
- **Shell**: Office-style ribbon (collapsible), Paperbase-style navy sidebar nav tree
  (group by provider/priority/difficulty, navigate-to-week), priorities 1–5 (🎓),
  Pomodoro dialog (25/5/15), theme picker (light/dark + M3 seeds, SQLite-backed), FAB
  add-certification dialog, explicit save + Snackbar toasts.
- **Persistence**: study plan in webview `localStorage`; theme (`settings`) + checkpoints
  (`progress`) in SQLite `cloudcerts.db` at `~/.local/share/com.cloudcertshub.app/`
  (Linux); `localStorage` fallback outside Tauri.
- **Engineering**: Clean Architecture (`ARCHITECTURE.md`), TypeScript strict, Tauri 2 +
  React 18 + MUI v5 + Vite 5, Storybook on `:6006` (~30 stories, atomic design),
  Vite dev on `:1420`, bundled offline fonts.

### Known issues / deferred

- Performance follow-ups from a DevTools trace: single ~969 KB JS chunk (no
  code-splitting), ~1900-node DOM on the heaviest view, untrimmed font payload.
  Tracked as roadmap item R1 in `PRD.md` §5.
- No production distribution/signing; Spanish-only UI; no CCAR-P/CCAO-F guides
  (insufficient public data). See `PRD.md` §3.7.

[Unreleased]: https://github.com/lapc506/cloudcerts-selfstudy-hub/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/lapc506/cloudcerts-selfstudy-hub/releases/tag/v0.1.0
