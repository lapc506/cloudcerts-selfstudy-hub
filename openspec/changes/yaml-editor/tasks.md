## 1. Editing and Validation Conformance

- [ ] 1.1 Verify kind/document pickers load raw YAML and switching discards unsaved edits, by editing then switching documents
- [ ] 1.2 Verify schema errors (week count, duplicates, empty fields, bad URLs/dates/levels, Bloom/Kirkpatrick ranges, unparseable YAML, unknown ID) block save with structured paths, by submitting each defect class
- [ ] 1.3 Verify pedagogy warnings (missing weight/Bloom/Kirkpatrick, no L3/L4, flat Bloom) display without blocking, by saving valid but untagged guides

## 2. Save Flow and Persistence Conformance

- [ ] 2.1 Verify Guardar button and Editor ribbon save show per-kind success, clear issues and refresh the catalog, by saving valid YAML both ways
- [ ] 2.2 Verify failed saves keep text editable with path-tagged alerts and retrievable last issues, by saving invalid YAML
- [ ] 2.3 Verify in-memory session persistence with the source-edit footnote, by saving, observing live views, and reloading
