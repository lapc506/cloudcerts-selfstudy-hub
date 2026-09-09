## Purpose

The YAML editor lets users fix guides, question banks and mocks as raw YAML with structured schema validation, where blocking errors prevent saving, pedagogy warnings advise without blocking, and saves persist in memory for the current session.

## ADDED Requirements

### Requirement: Edit guide, bank and mock documents
The system SHALL let the user pick a document kind (Guía, Banco, Mock) and a document within it (guides labeled title + code, banks and mocks labeled title + id), load its raw YAML into a monospaced text area, and reload the text whenever the kind or document changes, discarding unsaved edits.

#### Scenario: Switching documents reloads text
- **WHEN** the user switches from one guide to another with unsaved edits
- **THEN** the text area shows the newly selected document's YAML

#### Scenario: Mock references shared bank questions
- **WHEN** a mock YAML references a question by `{bank, id}`
- **THEN** the resolved question matches the bank entry and several mocks can share it

### Requirement: Schema validation with path errors
The system SHALL validate guide YAML against the schema and block saving on any error: the document must parse and be an object with non-empty id/provider/title/code/cost/summary, integer default_priority 1–5 (popularity 1–5 when present), a meta object with non-empty exam_version, https guide_source, non-empty format, non-empty domains array, integer validity_years 0–5, level matching `NNN · name`, https badge_image when present, non-empty verified_sources with https URLs and ISO fetch dates, and valid versions entries; weeks must be exactly 8 uniquely numbered 1–8 with non-empty titles and ≥1 section each with non-empty domain and ≥1 non-empty point, Bloom 1–6 and Kirkpatrick L1–L4 when present; every error SHALL carry a structured path (e.g. `weeks[4].sections[0].points[1]`).

#### Scenario: Wrong week count blocks save
- **WHEN** the user saves a guide with 7 weeks
- **THEN** the save fails and an error states weeks must be exactly 8

#### Scenario: Bad path error pinpoints the field
- **WHEN** validation fails on a nested point
- **THEN** the reported issue names the full structured path to that point

#### Scenario: Unknown certification ID blocks save
- **WHEN** the user saves valid YAML for an ID outside the catalog
- **THEN** the save fails reporting the unknown ID

### Requirement: Pedagogy warnings do not block
The system SHALL emit non-blocking warnings for missing section weight, missing Bloom tag, missing Kirkpatrick tag, zero L3/L4 coverage across the guide, and an all-≤2 Bloom profile, displaying them separately from errors without preventing a save.

#### Scenario: Untagged section warns but saves
- **WHEN** the user saves a schema-valid guide with sections missing Bloom tags
- **THEN** the save succeeds and pedagogy warnings list the untagged sections

### Requirement: Save flow with success and issue alerts
The system SHALL save via the editor Guardar button or the Editor ribbon command, SHALL show a per-kind success alert and clear issues on success while refreshing the catalog, and SHALL show path-tagged error and pedagogy-warning alerts while keeping the text editable on failure; the last validation issues SHALL remain retrievable for display.

#### Scenario: Successful save refreshes catalog
- **WHEN** the user saves valid guide YAML
- **THEN** a success alert appears, issues clear, and the catalog reflects the new content

#### Scenario: Failed save keeps text editable
- **WHEN** the user saves YAML with schema errors
- **THEN** error alerts list each path-tagged issue and the text remains for fixing

### Requirement: In-memory session persistence
The system SHALL persist saved documents in memory for the current session only (re-parsing and normalizing into the live catalog), SHALL lose them on reload, and SHALL tell the user that full persistence requires editing the repository source file.

#### Scenario: Save visible until reload
- **WHEN** the user saves a guide change and keeps the session open
- **THEN** every view reflects the change until the app reloads
