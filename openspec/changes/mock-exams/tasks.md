## 1. Bank model and validation

- [ ] 1.1 Verify `validateBank` enforces choice justifications, answer-index bounds, and https/ISO citation checks by running the existing mock-schema test suite (or `openspec validate` if no suite exists, plus manual save of a bad bank YAML showing structured errors).
- [ ] 1.2 Verify bank YAML round-trips justifications and `sources` dates through `normalizeQuestion` by saving the sample bank and asserting parsed output preserves all fields.

## 2. Shared mock references

- [ ] 2.1 Verify `validateMock` rejects dangling and duplicate `{bank, id}` references by saving a mock YAML with each fault and asserting an error names the offending reference.
- [ ] 2.2 Verify `resolveMockQuestions` returns identical content for a question shared by two mocks by resolving both sample mocks and comparing the shared entries.

## 3. QuizRunner behavior

- [ ] 3.1 Verify timer auto-finish by starting a mock with a short `timeMinutes` value and asserting the result state appears at zero without user action.
- [ ] 3.2 Verify single vs multi-choice controls and answer preservation across navigation by answering, navigating back/forward, and asserting selections persist.
- [ ] 3.3 Verify weighted exact-set scoring and `>= passingPercent` pass/fail gating plus `allowRetry` retry visibility by finishing attempts above and below threshold on mocks with retry on and off.

## 4. Review, external links, and fair use

- [ ] 4.1 Verify the review screen renders verdict chips, both answer sets, per-choice justifications, and source links with revision/verification dates by finishing a sample mock and inspecting each question block.
- [ ] 4.2 Verify ExamTopics entries render as metadata-only cards (code, title, count, outbound link) with the third-party disclaimer and no imported question content in the repo (grep banks for verbatim imports).
- [ ] 4.3 Verify the per-mock fair-use badge shows success only when all referenced banks assess `likely-fair`, by checking both sample mocks and a mock referencing a `needs-review` bank.
- [ ] 4.4 Run `openspec validate --specs` and confirm it passes after the sync.
