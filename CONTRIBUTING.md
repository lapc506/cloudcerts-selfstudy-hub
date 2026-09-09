# Contributing to CloudCerts SelfStudy Hub

Thanks for your interest. This project is small and AI-assisted, so the bar is:
**small diffs, verified exam facts, architecture intact, docs updated.**

## Ways to contribute

- **Study content**: fix a domain weight, add/correct study points, attach official sources
  with fetch dates. Exam facts need verification (see `AI_POLICY.md`).
- **Question banks / mocks**: new questions with explanations, tied to an exam domain.
- **Code**: bug fixes, perf follow-ups (`PRD.md` §5, item R1), Storybook stories.
- **Docs**: anything unclear in `README.md` / `PRD.md` / `ARCHITECTURE.md`.
- **Bug reports**: what you did, what you expected, what happened, app version, OS.

## Ground rules

1. **Respect the layer model** (`ARCHITECTURE.md`): presentation → application → domain;
   infrastructure implements domain ports. Run the `rg` checks from `ARCHITECTURE.md`
   before opening a PR. New UI takes data via props — no store imports in presentation.
2. **Schema-first YAML**: any new guide/bank/mock field starts in the validator
   (`src/domain/guideSchema.ts` / `mockSchema.ts`) with path-precise errors, then the FAB
   form and the Editor. Never the reverse.
3. **Verify-before-invent**: every exam-domain weight, objective, and source URL must come
   from an official vendor page/PDF (see `AI_POLICY.md`). Unverifiable content is rejected.
4. **Stories for UI**: new/changed components ship with Storybook stories (atomic design:
   atoms → molecules → organisms).
5. **Docs with code**: a PR that changes behavior updates `PRD.md` requirement IDs and adds
   a `CHANGELOG.md` entry under `Unreleased`.
6. **No `src/` drive-bys**: keep diffs focused; one concern per PR.

## Development setup

```bash
npm install
npm run dev          # browser dev → http://localhost:1420 (localStorage fallback)
npm run tauri:dev    # desktop shell (compiles Rust; first run is slow)
npm run storybook    # component library → http://localhost:6006
npm run build        # tsc strict + vite build (must pass clean)
```

Linux needs the Tauri system deps listed in `README.md`. Node ≥ 20, Rust stable.

## Pull requests

- Branch from `main`, one concern per PR, conventional commits
  (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`).
- Include: what changed, requirement IDs touched (`FR-…` / `NFR-…`), how you verified
  (`tsc`, Storybook, manual pass in the Tauri binary), and the **AI disclosure** required
  by `AI_POLICY.md`.
- New features need tests or stories; bug fixes need a reproduction note.
- Maintainers may close PRs with undisclosed AI output or unverified exam facts.

## Reporting issues

Use a clear title, steps to reproduce, expected vs actual behavior, version (`package.json`
+ `src-tauri/tauri.conf.json`), and OS. For content errors, link the official source that
proves the fix.
