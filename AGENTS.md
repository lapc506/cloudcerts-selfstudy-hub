# AGENTS.md — CloudCerts SelfStudy Hub

> Read before opening a PR. This file carries **pointers** to the engineering
> standards SSOT — never duplicated protocol text.

## Stack

TypeScript 7 + React 18 + MUI v9 + Vite 5 + Tauri v2 (Rust) + SQLite
(`tauri-plugin-sql`). Tests: Vitest unit (jsdom) · Storybook interaction
(Chromium) · WebdriverIO E2E (mocha) · `cargo test`.

## Engineering standards (SSOT)

Toolkit: `/home/kvttvrsis/Documentos/GitHub/chimeranext/better-toolkits/toolkits/fractional-cto-toolkit/references/engineering-standards/`

| Practice | SSOT | Day-to-day rule |
| --- | --- | --- |
| DSMS / IFS / CPS | `dsms-ifs-cps.md` | Feature-first for new modules; `// ---` banners; `export type` for types |
| PRDS | `prds.md` | PR body per `.github/PULL_REQUEST_TEMPLATE.md`; ~≤400 lines; one intent |
| BrS | `branching-strategy.md` + `docs/process/branching.md` | `type/slug` from `dev`; PR `dev` → `release`; conventional commits |
| QT4L | `qa-traceability-four-layers.md` + `docs/process/qa-traceability.md` | Behavior change ⇒ QA section in `tasks.md` + scenario → verification table |

Index + adoption order: `docs/process/engineering-standards.md`.

## Repo roles (PRDS)

- Assignee / reviewer: `lapc506` (human OK required before merge).
- Merge only after explicit human OK. Agents never `gh pr merge --admin` unless asked.
- No tracker in use yet: PR titles/bodies use the scope text; add `TICKET-N` when a tracker lands.

## Verification before a PR

- `npm run lint` (tsc) · `npm test -- --run` (unit) · `cargo test --manifest-path src-tauri/Cargo.toml`
- Storybook interaction: `npx vitest run --project storybook` (needs Chromium; slow — run on UI changes)
- `make prod-tauri-build` only for release cuts (slow: Rust release + 3 bundles)
- OpenSpec: `openspec validate --specs` when touching `openspec/`
