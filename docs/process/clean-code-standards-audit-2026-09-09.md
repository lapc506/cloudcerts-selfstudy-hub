# Audit cloudcerts-selfstudy-hub — 2026-09-09

Scope: all six practices (DSMS, IFS, CPS, PRDS, BrS, QT4L) + `--prs` (no open PRs; PR #1 merged used as reference).
Branch: `docs/engineering-standards`. Scaffold from `/clean-code-standards-setup` landed in the previous commit on this branch.

## Status by practice

| Practice | Status | Note |
| --- | --- | --- |
| DSMS | ⚠ partial | `src/` is layer-first (Clean Architecture), not feature-first |
| IFS | ⚠ partial | Reading rhythm ok (headers); zero `// ---` banners; 2 files >500 lines |
| CPS | ⚠ partial | `src/domain/index.ts` is an unlabeled `export *` dump |
| PRDS | ✔ ready | Template landed; no open PRs to review |
| BrS | ✔ ready | GitFlow variant live (`dev` default, `release`); no rulesets yet |
| QT4L | ⚠ partial | Stub ready; 0/8 `tasks.md` carry a QA section despite scenarios in specs |

## Findings by severity

- [warning] dsms: `src/{application,domain,infrastructure,presentation}/` puts the
  technical layer first (`src/domain/mockSchema.ts`, `src/presentation/components/StudyGuide.tsx`).
  → Remediation: new modules prefer `src/features/<slice>/…`; no reorg without a cutover plan (incremental policy).
- [warning] ifs: no `// ---` major-section banners in `src/` (grep: zero hits);
  `src/infrastructure/yamlCertificationRepository.ts` is 4972 lines,
  `src/presentation/components/StudyGuide.tsx` 545 lines.
  → Remediation: banners on next edits; extract only when touching those files.
- [warning] cps: `src/domain/index.ts:2-9` — 8× bare `export *`, no feature/kind
  grouping, no banners, no `export type`.
  → Remediation: categorize (runtime → `export type`) on the next barrel edit.
- [warning] qt4l: 0/8 `openspec/changes/*/tasks.md` include a QA traceability
  section, while `openspec/specs/*` contain `#### Scenario:` rows (e.g. app-shell
  "Active tab is highlighted").
  → Remediation: paste the stub from `docs/process/qa-traceability.md` on the next behavior-change `tasks.md`.
- [info] prds: PR #1 (merged) had no `TICKET-N`/Tracker section — no tracker exists;
  recorded in `AGENTS.md`. Next PRs use the template (title also gains ticket id when a tracker lands).
- [info] brs: `feat/test-suite-mui9` naming ✓; commits conventional ✓ (`feat:`, `docs(process):`);
  no GitHub rulesets configured — protection TODO in `docs/process/branching.md`; no action today.

## Adoption debt (do not touch today)

- Legacy layer-first `src/` tree (DSMS) — excluded by incremental policy.
- 4972-line `yamlCertificationRepository.ts` split (IFS) — only with a ticket touching it.
- Barrel rewrite of `src/domain/index.ts` (CPS) — only on next barrel edit.
- Branch protection rulesets (BrS) — when review cadence grows.

## Recommended order

1. QT4L rows on the next behavior change (cheapest, closes req→test trace).
2. IFS banners opportunistically (every touched file).
3. CPS grouping on next `index.ts` edit.
4. Rulesets before the second maintainer joins.
5. DSMS slices for new features only.
