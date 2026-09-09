# study-guides Specification

## Purpose

Study guides present each certification as 8 weekly accordions with domain sub-accordions, persisted To-Do checkpoints, progress counts, taxonomy chips, and rich metadata panels, with sidebar-driven navigation that auto-expands and scrolls to any week.

## Requirements

### Requirement: Week and domain accordions
The system SHALL render each selected certification as a card with one accordion per week (week 1 expanded by default, others collapsed, unmounted on collapse), where weeks with sections show nested domain sub-accordions (first expanded by default) and weeks without sections show a flat point list; each week header SHALL show its title plus domain-count and done/total chips.

#### Scenario: Week 1 starts expanded
- **WHEN** the Guides view opens with a selected certification
- **THEN** its week 1 accordion is expanded and weeks 2–8 are collapsed

#### Scenario: Expanding a week reveals domains
- **WHEN** the user expands a collapsed week with sections
- **THEN** its domain sub-accordions appear with the first one expanded

### Requirement: Checkpoints toggle and persist
The system SHALL render every study point as a row where both row click and checkbox toggle completion (checked rows show strikethrough + disabled color), SHALL persist each checkpoint in the SQLite `progress` table keyed by stable item ID with an optimistic in-memory state saved on every toggle, SHALL fall back to localStorage outside Tauri, and SHALL flush progress when the plan is saved.

#### Scenario: Row click completes a point
- **WHEN** the user clicks an unchecked study-point row
- **THEN** the row shows checked with strikethrough and the checkpoint persists across restarts

#### Scenario: Progress survives restart
- **WHEN** the user completes checkpoints and restarts the app
- **THEN** the same points still show completed

### Requirement: Progress counts at every level
The system SHALL show done/total counts on each domain chip, each week chip (green when complete), and each certification header with a progress bar, all computed from the same stable item IDs so counts agree across the guide, sidebar and Home views.

#### Scenario: Completing a domain updates all counts
- **WHEN** the user completes every point of a domain
- **THEN** the domain chip, its week chip and the certification header all reflect the new totals

### Requirement: Navigate-to-week auto-expands and scrolls
The system SHALL support sidebar-driven navigation where opening a guide week force-expands the target week accordion (even if collapsed) and smooth-scrolls the view to its anchored element.

#### Scenario: Sidebar week click lands on the week
- **WHEN** the user clicks week S5 in the sidebar
- **THEN** the Guides view opens with week 5 expanded and scrolled into view

### Requirement: Bloom and Kirkpatrick chips
The system SHALL show on each domain header a weight chip when a weight exists, a `Bn` chip with the Bloom level label as tooltip when tagged, and an `Ln` chip with the Kirkpatrick label as tooltip when tagged.

#### Scenario: Taxonomy tooltips explain levels
- **WHEN** the user hovers a `B3` chip
- **THEN** a tooltip shows the Apply-level Bloom label

### Requirement: Certification meta and verified sources
The system SHALL render per certification a meta panel with exam-version, guide-date and validity chips, format + passing-score line, exam-domain chips, career-path chips, exam version control (vigente version highlighted in success color), recertification window/options/discount, official-guide link, and a verified-sources panel listing each source link with its last-fetched date; it SHALL also show header pills for priority, popularity flames and validity.

#### Scenario: Verified sources show fetch dates
- **WHEN** a certification has verified sources
- **THEN** each source link shows its label and the date it was last verified

#### Scenario: Vigente version is highlighted
- **WHEN** an exam version note contains "vigente"
- **THEN** its chip renders filled in the success color

### Requirement: Guide header actions and empty state
The system SHALL render a "Guías de Estudio" header with guide count and per-guide week count, a copy-response button that writes the formatted form response to the clipboard (with a legacy fallback), a success alert describing the one-click copy, and — when no guides are selected — an info alert directing the user to the sidebar instead of any guide cards.

#### Scenario: Copy button copies the response
- **WHEN** the user clicks "Copiar respuesta para formulario"
- **THEN** the formatted employment-form response lands on the clipboard

#### Scenario: No selection shows guidance
- **WHEN** no certifications are selected
- **THEN** an info alert explains how to select certifications in the sidebar
