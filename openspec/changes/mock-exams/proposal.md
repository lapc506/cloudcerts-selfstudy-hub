## Why

The app ships original, fair-use question banks and reference-based mock exams, but that behavior (bank schema, shared references, QuizRunner semantics, ExamTopics metadata-only links, per-bank fair-use assessment) is nowhere specified. A `mock-exams` capability spec locks in the current contract so future banks, mocks, and quiz UI changes stay consistent and legally safe.

## What Changes

- Specify the question-bank model: choices with per-answer justifications plus official-doc citations (`sources` with URL + dates).
- Specify shared `{bank, id}` question references resolvable across multiple mocks (no question duplication).
- Specify QuizRunner behavior: countdown timer with auto-finish, single/multi-choice answering, weighted scoring vs `passingPercent`, retry gated by `allowRetry`, review with per-choice justifications and official source links.
- Specify ExamTopics integration as metadata links only (URL + count); no verbatim question imports.
- Specify per-bank fair-use assessment (`fair_use` block, 4-factor checklist) and the "Fair use ✓ / Revisar fair use" surfacing in MocksView.

## Capabilities

### New Capabilities

- `mock-exams`: question banks, reference-based mock exams, quiz running/scoring/review, ExamTopics metadata links, and fair-use assessment.

### Modified Capabilities

(none — greenfield spec capturing existing behavior)

## Impact

- Spec-only change; no code edits. Grounds: `src/presentation/components/MocksView.tsx`, `src/presentation/components/QuizRunner.tsx`, `src/domain/mockExam.ts`, `src/domain/mockSchema.ts`, `src/infrastructure/mockExamRepository.ts`, `src/infrastructure/examTopics.ts`, `FAIR_USE.md`.
- Assumptions: existing behavior is the intended contract (passing threshold comparison is `>=`; multi-choice requires exact-set match for points; timer auto-finishes at 0; unresolvable refs render a warning state).
