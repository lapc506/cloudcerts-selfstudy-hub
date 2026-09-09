## Why

The YAML editor is the only way to fix guide content without touching source files, but its validation contract (blocking errors vs pedagogy warnings), save flow and session-only persistence are undocumented. A spec pins what "Guardar" guarantees before any editor or schema change.

## What Changes

- Document editing of three document kinds: Guías (one per catalog certification, labeled title + code), Bancos (question banks) and Mocks (exam simulations referencing bank questions by `{bank, id}` with sharing across mocks).
- Document schema validation via `validateGuide`: blocking errors with structured paths (root strings, priority/popularity 1–5, meta exam_version/guide_source https/format/domains/validity 0–5/level pattern/badge https/verified_sources with ISO dates/versions, exactly 8 uniquely numbered weeks each with title and ≥1 section with domain and ≥1 non-empty point, Bloom 1–6, Kirkpatrick L1–L4) plus non-blocking pedagogy warnings (missing weight/Bloom/Kirkpatrick per section, no L3/L4 coverage, flat Bloom ≤2 profile); unparseable YAML and unknown certification IDs also block.
- Document the save flow: Guardar (button or Editor ribbon) validates and on success shows a per-kind success alert and refreshes the catalog; on failure shows path-tagged error and pedagogy-warning alerts and keeps the text editable; last validation issues are retrievable for display.
- Document in-memory session persistence: saves mutate the repository for the current session only (re-parse + normalize into the catalog), and full persistence requires editing `src/infrastructure/yamlCertificationRepository.ts`, as the editor footnote states.

## Capabilities

### New Capabilities
- `yaml-editor`: YAML editing of guides, banks and mocks with schema validation, save flow, and session persistence.

### Modified Capabilities
(none — no existing specs cover this)

## Impact

- Planning only; no code changes.
- Source of truth: `src/presentation/components/YAMLGuideEditor.tsx`, `src/domain/guideSchema.ts`, `src/infrastructure/yamlCertificationRepository.ts` (`setCertificationYaml`, `getCertificationYaml`, `getLastValidationIssues`), mock repository `saveYaml`/`getYaml`/`getLastValidationIssues`.
- Assumptions: bank/mock document schemas are covered only at the level the editor exposes (kind switching, `{bank, id}` references, shared questions); their full field-level validation belongs to the mock-exams capability owned by the concurrent agent.
