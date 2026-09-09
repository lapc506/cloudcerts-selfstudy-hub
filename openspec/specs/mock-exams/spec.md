# mock-exams Specification

## Purpose

Original, fair-use question banks and reference-based mock exams with timed quiz running, weighted scoring, and review backed by official documentation citations.

## Requirements

### Requirement: Question banks carry justified choices with official citations

The system SHALL model each bank question with a text, at least two choices each carrying an individual justification, an array of correct answer indices, a teaching explanation, and optional official-documentation citations (URL plus revision/verification dates) at both question and choice level.

#### Scenario: Bank question is fully justified

- **WHEN** a bank question is loaded
- **THEN** every choice exposes its text and a non-empty justification stating why it is correct or not, the question exposes its correct answer indices and a teaching explanation, and citations expose an https URL with fetched/revised dates where present.

#### Scenario: Citation fields are validated

- **WHEN** a bank YAML is saved with a choice or question citation
- **THEN** the system SHALL reject non-https URLs and non-ISO dates as errors and warn when a choice carries no `sources` entry (fair-use traceability).

### Requirement: Mocks reference shared bank questions

The system SHALL model each mock exam as metadata (`title`, `certId`, `timeMinutes`, `passingPercent`, `allowRetry`) plus an ordered list of `{bank, id}` references, and SHALL resolve those references against all banks so that multiple mocks can share the same question without duplication.

#### Scenario: Shared question across mocks

- **WHEN** two mocks reference the same `{bank, id}` pair
- **THEN** both resolve to the identical bank question content.

#### Scenario: Dangling or duplicate reference is rejected

- **WHEN** a mock YAML is saved with a reference to a nonexistent `bank:id` key or a duplicate reference within the same mock
- **THEN** the save SHALL fail with a structured validation error naming the offending reference.

#### Scenario: Unresolvable mock shows guidance

- **WHEN** a started mock resolves to zero questions
- **THEN** the runner SHALL show a warning directing the user to fix the YAML references instead of rendering an empty quiz.

### Requirement: QuizRunner runs timed single and multi-choice quizzes

The system SHALL run a mock as a paginated quiz with a countdown timer that auto-finishes at zero, single-select (radio) questions when exactly one answer is correct and multi-select (checkbox) questions otherwise, forward/back navigation, and explicit finish/exit controls.

#### Scenario: Timer auto-finishes the attempt

- **WHEN** the countdown reaches zero before the user finishes
- **THEN** the attempt SHALL automatically transition to the finished/result state.

#### Scenario: Multi-choice answering matches single-choice semantics

- **WHEN** the user answers a question
- **THEN** a single-answer question SHALL keep exactly one selected choice while a multi-answer question SHALL toggle each choice independently, and navigation SHALL preserve all prior selections.

### Requirement: Weighted scoring against passing threshold with retry

The system SHALL score each attempt by awarding a question's `points` (default 1) only on an exact match of the selected index set vs the correct index set, compute the percentage earned over total points, mark pass/fail by comparing against the mock's `passingPercent` (pass WHEN percentage is greater than or equal), and offer retry only WHEN the mock allows it.

#### Scenario: Exact-set weighted scoring

- **WHEN** an attempt finishes
- **THEN** the result SHALL show earned/total points and percentage, where partially-correct multi-select answers earn zero for that question.

#### Scenario: Pass/fail and retry gating

- **WHEN** the percentage meets or exceeds `passingPercent`
- **THEN** the result SHALL report approval with the threshold; otherwise it SHALL report non-approval with guidance to review explanations, and the retry control SHALL appear only WHEN `allowRetry` is true.

### Requirement: Review shows justifications and official source links

The system SHALL render, for every question after finishing, the correctness verdict, the user's vs correct answers, the teaching explanation, every choice annotated correct/incorrect with its justification, and each official source as an outbound link labeled with note/host plus revision and verification dates.

#### Scenario: Full review rendering

- **WHEN** the user reviews a finished attempt
- **THEN** each question SHALL display its verdict chip, both answer sets, the explanation, per-choice justifications, and source links with `rev.`/`verificado` dates where recorded.

### Requirement: ExamTopics banks are metadata links only

The system SHALL present third-party ExamTopics practice banks as metadata cards (code, title, URL, question count) linking outbound, and SHALL NEVER import verbatim third-party question content into the repository.

#### Scenario: Metadata-only external banks

- **WHEN** the mocks view lists external banks
- **THEN** each entry SHALL show only code, title, question count, and an outbound link, with third-party resources explicitly labeled non-official alongside a disclaimer to cross-check against the official exam guide.

### Requirement: Per-bank fair-use assessment

The system SHALL attach to each question bank an optional fair-use assessment (`work`, `purpose`, `verdict` of `likely-fair`/`needs-review`/`avoid`, ISO `assessedAt`, and the four checklist factors with favoring/opposing entries), and SHALL surface a per-mock badge showing "Fair use ✓" only WHEN every referenced bank assesses as `likely-fair`, else "Revisar fair use".

#### Scenario: Fair-use badge reflects referenced banks

- **WHEN** a mock card renders
- **THEN** it SHALL show the success badge WHEN all its referenced banks carry a `likely-fair` verdict and the warning badge otherwise.

#### Scenario: Original banks assess as likely-fair

- **WHEN** a repository-owned bank of original sample questions for personal self-study is assessed
- **THEN** its assessment SHALL record verdict `likely-fair` with the four factors favoring research/scholarship/transformative use, published factual nature, small quantity, and no significant market effect.
