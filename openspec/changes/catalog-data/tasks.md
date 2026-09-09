## 1. Schema and normalization

- [ ] 1.1 Verify `validateGuide` requires identity fields, exactly 8 unique weeks 1–8, the level band format, and `validity_years` 0–5 by validating a good guide plus one broken fixture per constraint and asserting the error paths.
- [ ] 1.2 Verify `normalize` migrates legacy priorities, clamps priority/popularity, drops out-of-range Bloom/Kirkpatrick tags, and defaults validity to 0 by normalizing fixtures and asserting outputs.
- [ ] 1.3 Verify all 35 embedded guides validate without errors by running the guide validator over the repository at load.

## 2. Identity, repository, and refresh

- [ ] 2.1 Verify study-item ids (`certId/wX/sY/pZ`, flat `s-1`) are stable and `countDone`/`collectCertItemIds` agree by marking points done and asserting counts.
- [ ] 2.2 Verify `setCertificationYaml` replaces only the matching-id entry on valid input and rejects syntax errors, validation errors, and unknown ids without touching the catalog, with issues retrievable afterwards.
- [ ] 2.3 Verify a successful save bumps the Tick and consumers re-read the updated catalog (e.g. via the editor save path in `App.tsx`).
- [ ] 2.4 Run `openspec validate --specs` and confirm it passes after the sync.
