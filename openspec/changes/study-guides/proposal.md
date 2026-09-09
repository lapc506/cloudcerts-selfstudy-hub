## Why

Study guides are the core learning surface — week accordions, checkpoints, progress counts and metadata panels — but their behavior (SQLite persistence, auto-expand navigation, taxonomy chips) lives only in code. A spec pins the observable contract before any guide redesign.

## What Changes

- Document week accordions (week 1 expanded by default, done/total chips, domain-count chip) containing domain sub-accordions (first expanded, weight/Bloom/Kirkpatrick/count chips) with study-point rows where row click and checkbox both toggle.
- Document To-Do checkpoints persisted in the SQLite `progress` table (`item_id`, `done`) via the progress store, with localStorage fallback outside Tauri, optimistic in-memory state, and explicit flush on plan save.
- Document per-week, per-domain and per-cert done/total counts with progress bars, plus stable item IDs (`studyItemId`) unifying progress across views.
- Document navigate-to-week: sidebar click opens the Guides view, force-expands the target week (`forceOpenSignal`), and smooth-scrolls to the `week-<cert>-<n>` anchor.
- Document Bloom (`B1`–`B6` with label tooltips) and Kirkpatrick (`L1`–`L4` with label tooltips) chips on domain headers.
- Document the certification meta panel: exam version, guide emission date, validity, format + passing score, exam domains, career-path chips, exam version control (vigente highlighted), recertification window/options/discount, official guide link, and verified-sources panel with per-source fetch dates.
- Document the guide header: title, per-guide week count, copy-response-for-form button with clipboard + execCommand fallback, and the empty-selection info alert.

## Capabilities

### New Capabilities
- `study-guides`: Study guide rendering, checkpoints, progress counts, week navigation, taxonomy chips, and metadata panels.

### Modified Capabilities
(none — no existing specs cover this)

## Impact

- Planning only; no code changes.
- Source of truth: `src/presentation/components/StudyGuide.tsx`, `src/presentation/molecules/StudyPointRow.tsx`, `src/application/useStudyProgress.ts`, `src/infrastructure/sqliteProgressStore.ts`, `src/domain` (`studyItemId`, `collectCertItemIds`, `collectWeekItemIds`, `countDone`, `BLOOM_LABELS`, `KIRKPATRICK_LABELS`, `formatValidity`, `popularityFlames`, `priorityCaps`).
- Assumptions: validity/popularity display (chips in header and PlanView) is covered here as guide metadata display; the copy-response text format itself (`buildFormResponse`) is out of scope and belongs to a future form-response capability.
