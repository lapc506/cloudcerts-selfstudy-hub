# catalog-data Specification

## Purpose

The certification catalog data contract: the YAML guide schema, domain normalization rules, and in-memory repository mechanics that every consumer view reads from.

## Requirements

### Requirement: Eight-week guide schema with versioned meta

The system SHALL require each guide YAML to carry identity fields (`id`, `provider`, `title`, `code`, `cost`, `summary`), exactly 8 uniquely-numbered weeks (1–8) each with title and points plus optional domain sections (domain, weight, points), and a `meta` block with exam version, guide date/source, format, passing score, weighted domains, level, validity years (0–5), recert window/options/discount, versions history, verified sources with fetch dates, optional badge image, career paths, and popularity.

#### Scenario: Valid guide passes schema

- **WHEN** a guide YAML contains all identity fields, 8 unique weeks 1–8, and a complete meta block
- **THEN** validation SHALL report no errors.

#### Scenario: Week count or numbering violation

- **WHEN** a guide YAML has other than 8 weeks, a week number outside 1–8, or duplicate week numbers
- **THEN** validation SHALL report an error naming the offending week constraint.

#### Scenario: Level format enforced

- **WHEN** a guide declares its difficulty level
- **THEN** it SHALL match the `<3-digit> · <label>` band format (e.g. `100 · Foundational`, `200 · Associate`, `300 · Professional`); otherwise validation SHALL report an error.

### Requirement: Domain normalization with legacy migration

The system SHALL normalize raw guides by mapping priority to 1–5 (migrating legacy `High`/`Medium`/`Low` and clamping out-of-range numbers, default 3), popularity to 1–5 (default 3), keeping Bloom tags only WHEN integers 1–6 and Kirkpatrick tags only WHEN L1–L4 (case-insensitive), defaulting missing titles/colors/summaries, and carrying meta fields through with `validityYears` defaulting to 0.

#### Scenario: Legacy priority migrates

- **WHEN** a guide declares `default_priority` as `High`, `Medium`, or `Low`
- **THEN** the normalized priority SHALL be 5, 3, or 1 respectively, and numeric values SHALL clamp into 1–5.

#### Scenario: Out-of-range Bloom and Kirkpatrick tags are dropped

- **WHEN** a section carries a Bloom value outside 1–6 or a Kirkpatrick value outside L1–L4
- **THEN** the normalized section SHALL omit that tag rather than failing.

#### Scenario: Lifetime validity default

- **WHEN** a guide omits validity or declares 0
- **THEN** the normalized `validityYears` SHALL be 0, formatted downstream as lifetime (vitalicia).

### Requirement: Stable study-item identity and plan text

The system SHALL identify each study point as `certId/w<week>/s<section>/p<point>` (flat weeks without sections use `s-1`), count progress by matching those ids against the done map, and build the plan response text listing planned guides with priority caps over an 8-week structured plan statement.

#### Scenario: Item ids stable for progress tracking

- **WHEN** progress is recorded against a guide
- **THEN** each point SHALL resolve to its stable id so done-state survives re-renders and catalog reloads.

### Requirement: In-memory repository with Tick refresh

The system SHALL serve the catalog from embedded YAML parsed at load, where saving replaces only the entry whose id matches the parsed document (after validation passes and only WHEN the id already exists), exposes a copy of the last validation issues, and notifies consumers via a Tick counter that re-reads the store.

#### Scenario: Valid save replaces matching entry

- **WHEN** a YAML edit parses and validates without errors and its id matches an existing guide
- **THEN** the repository SHALL replace exactly that entry and bump the Tick so consumers re-read.

#### Scenario: Invalid or unknown-id save rejected

- **WHEN** a YAML edit has syntax errors, validation errors, or an id with no matching guide
- **THEN** the save SHALL return false, leave the catalog untouched, and record structured issues retrievable afterwards.
