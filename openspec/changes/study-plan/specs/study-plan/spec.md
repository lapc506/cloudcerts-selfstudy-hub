## Purpose

The study plan organizes which certifications the user studies: a unified selection model shared by cards and checkboxes, a sidebar navigation tree with grouping and priorities, a resizable sidebar, and the Home roadmap view showing progress per certification.

## ADDED Requirements

### Requirement: Unified plan membership
The system SHALL maintain a single notion of "in the plan" so that clicking a certification card and toggling its checkbox converge on the same membership: selecting via card also marks interest, and unchecking removes membership; select-all marks every catalog certification selected and interested, clear-all empties both.

#### Scenario: Card click selects and marks interest
- **WHEN** the user clicks an unselected certification row
- **THEN** the certification joins the plan and is marked interested

#### Scenario: Checkbox uncheck removes from plan
- **WHEN** the user unchecks a selected certification's checkbox
- **THEN** the certification leaves the plan and is marked not interested

#### Scenario: Select-all fills the plan
- **WHEN** the user clicks "Seleccionar todas"
- **THEN** every catalog certification becomes selected and interested

### Requirement: Sidebar navigation tree
The system SHALL render a permanent navy sidebar listing certifications grouped in collapsible sections, where each certification row shows an expand chevron, a checkbox, a provider icon in the provider color, code and title, and a priority rating; expanding a certification reveals its 8 week rows, and expanding a week reveals its domain sub-rows with weights; clicking a week or domain navigates to that guide week; newly added plan guides auto-expand.

#### Scenario: Expand certification reveals weeks
- **WHEN** the user clicks a certification's expand chevron
- **THEN** its week rows (S1–S8 with titles) appear beneath it

#### Scenario: Week click navigates to guide
- **WHEN** the user clicks week row S3
- **THEN** the Guides view opens, week 3 expands, and the view scrolls to its anchor

#### Scenario: Section collapse hides group
- **WHEN** the user clicks a provider section header
- **THEN** that provider's certifications collapse out of view

### Requirement: Grouping by entity, priority and difficulty
The system SHALL group the sidebar by the active Home ribbon mode: by entity (one section per provider with certification count), by priority (sections 5→1 with caps labels, omitting empty priorities), or by difficulty (one section per exam level with count, sorted by numeric level rank).

#### Scenario: Group by priority
- **WHEN** the user picks "Prioridad" grouping
- **THEN** the sidebar shows sections Prioridad 5 down to 1, each listing only certifications with that priority

#### Scenario: Group by difficulty sorts levels
- **WHEN** the user picks "Dificultad" grouping
- **THEN** sections sort ascending by level number (100 before 200 before 300)

### Requirement: Priorities 1 to 5
The system SHALL let the user set a priority from 1 to 5 per certification via a 5-glyph rating showing a "Prioridad n/5" tooltip, persisting the value in the plan store and coercing stored values through the domain parser.

#### Scenario: Setting priority persists
- **WHEN** the user sets a certification to priority 5
- **THEN** the rating shows 5 filled glyphs and the value survives an app restart

### Requirement: Resizable sidebar
The system SHALL provide a drag handle between sidebar and content that resizes the sidebar by mouse drag or keyboard (Left/Right arrows step 16px, Home jumps to minimum, End to maximum), clamping width to 240–560px, persisting it in local storage, and exposing ARIA separator semantics with current/min/max values.

#### Scenario: Drag resizes within bounds
- **WHEN** the user drags the handle beyond the maximum
- **THEN** the sidebar stops at 560px and the persisted width reads 560

#### Scenario: Keyboard resize
- **WHEN** the focused handle receives an ArrowRight keypress
- **THEN** the sidebar widens by 16px

#### Scenario: Width persists across restarts
- **WHEN** the user resizes to 400px and reloads
- **THEN** the sidebar restores to 400px

### Requirement: Plan de estudios roadmap view
The system SHALL render a Home "Plan de estudios" view with a header (certification count, scheduled weeks, completed/total study points) and a "Plan 8 semanas" chip; each planned certification SHALL show a card with avatar, title, code chip, provider / priority / popularity / validity pills, a progress bar with done/total counts, and an "Abrir guía" button; with an empty plan it SHALL show an info alert directing the user to the sidebar catalog.

#### Scenario: Progress reflects checkpoints
- **WHEN** the user completes 3 of 40 study points of a certification
- **THEN** its card shows 3/40 and the bar at 7.5%

#### Scenario: Abrir guía opens the guide
- **WHEN** the user clicks "Abrir guía" on a certification card
- **THEN** the Guides view opens showing that certification

#### Scenario: Empty plan shows guidance
- **WHEN** the plan has no certifications
- **THEN** an info alert explains how to add certifications from the sidebar catalog
