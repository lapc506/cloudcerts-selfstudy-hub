## Why

The 35-guide certification catalog is the foundation every other view (plan, guides, badges, mocks, progress) reads from, but its schema contract, normalization rules, and in-memory refresh mechanics are unspecified. A `catalog-data` capability spec pins the YAML schema, domain normalization (priority/popularity, Bloom/Kirkpatrick, validity, difficulty bands), and the in-memory repository semantics so content and code changes cannot silently break consumers.

## What Changes

- Specify the 35-guide YAML schema: exactly 8 uniquely-numbered weeks with titles and points, optional domain sections with weights, and meta (exam version, guide date/source, format, passing score, domains, level, validity, recert fields, versions history, verified sources, badge image, career paths, popularity).
- Specify normalization: priority 1–5 with legacy High/Medium/Low migration, popularity 1–5 flames, Bloom 1–6 and Kirkpatrick L1–L4 tags (dropped when out of range), difficulty bands via `level` (`100 · Foundational`, `200 · Associate/Intermediate`, `300 · Professional/Specialist`), and lifetime validity (`validityYears` 0).
- Specify the in-memory repository: embedded YAML parsed at load, `setCertificationYaml` replacing only the matching-id entry after validation, structured last-validation issues, and Tick-based refresh re-reading the store.

## Capabilities

### New Capabilities

- `catalog-data`: certification catalog YAML schema, domain normalization, and in-memory repository with Tick refresh.

### Modified Capabilities

(none — greenfield spec capturing existing behavior; content of the 35 guides is out of scope, schema + normalize + repository mechanics only)

## Impact

- Spec-only change; no code edits. Grounds: `src/domain/entities.ts`, `src/domain/priority.ts`, `src/domain/progress.ts`, `src/domain/formResponse.ts`, `src/infrastructure/yamlCertificationRepository.ts` (schema + normalize only, not guide content), `src/domain/guideSchema.ts`, `src/App.tsx` (`catalogTick`).
- Assumptions: guide count (35) is a snapshot, not a normative requirement — the schema requires each guide to validate, not the total; `setCertificationYaml` rejects unknown ids (no creation path); progress item ids (`certId/wX/sY/pZ`, flat weeks use `s-1`) are stable across edits.
