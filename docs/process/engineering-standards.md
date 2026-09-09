# Engineering standards — local index

SSOT: `/home/kvttvrsis/Documentos/GitHub/chimeranext/better-toolkits/toolkits/fractional-cto-toolkit/references/engineering-standards/`
(Full text lives there. This file is pointers + repo adaptation.)

| # | Practice | Scope | Status here |
| --- | --- | --- | --- |
| 1 | DSMS — Domain-Sliced Module Structure | Where files live | Partial: `src/` is layer-first (Clean Architecture); new modules prefer feature slices (see tree below) |
| 2 | IFS — Intra-File Structure | How one file reads | Partial: Spanish header comments; `// ---` banners pending on next edits |
| 3 | CPS — Categorized Public Surface | Barrel exports | Partial: `src/domain/index.ts` is an unlabeled dump; categorize on next edit |
| 4 | PRDS — PR Description Standards | PR body + size | Ready: `.github/PULL_REQUEST_TEMPLATE.md` |
| 5 | BrS — Branching Strategy | Branches, naming, protection | Ready: `docs/process/branching.md` (`dev` default, `release` prod) |
| 6 | QT4L — QA Traceability (four layers) | Req → test → manual → HITL | Ready: `docs/process/qa-traceability.md`; scenario tables pending per change |

**Adoption order:** DSMS → IFS → CPS → PRDS → BrS → QT4L.
**Day-to-day priority:** IFS, PRDS, QT4L.
**Policy:** incremental only — apply when adding/editing in that area. No mass legacy refactors.

## Suggested DSMS tree (TS + Tauri stack)

```text
src/
  features/{cert-catalog,study-plan,mock-exams,badges,…}/
    presentation/ domain/ data/   # technical layers nest UNDER the feature
  shared/                          # cross-feature primitives (atoms, theme, quarks)
  app/                             # composition root (App.tsx, main.tsx)
src-tauri/src/                     # backend stays layer-flat (commands, state)
```

Legacy `src/{domain,application,infrastructure,presentation}/` stays until a
cutover plan exists — do not mix reorg + feature work in one PR (PRDS).
