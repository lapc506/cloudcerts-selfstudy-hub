## Purpose

The application shell frames every view of CloudCerts SelfStudy Hub: the ribbon tab bar with per-view command groups, theme customization, global dialogs for adding certifications and Pomodoro timing, save feedback, and window identity.

## ADDED Requirements

### Requirement: Ribbon tabs navigate between views
The system SHALL render a tab bar with 7 tabs — Home, Progreso, Guías, Editor YAML, Badges, Codelabs, Mocks — each with an icon and uppercase label, where the active tab is highlighted with an accent underline and clicking a tab switches the main view.

#### Scenario: Active tab is highlighted
- **WHEN** the user looks at the tab bar with view "Guías" active
- **THEN** the "Guías" tab shows the accent underline and primary color while inactive tabs show secondary text styling

#### Scenario: Clicking a tab switches view
- **WHEN** the user clicks the "Mocks" tab
- **THEN** the main content area shows the mocks view and "Mocks" becomes the active tab

### Requirement: Ribbon shows per-tab command groups
The system SHALL show command groups relevant to the active view: Home shows Selección (Seleccionar todas, Limpiar), Agrupar (Entidad, Prioridad, Dificultad with active state), and Plan (Guardar cambios); Progreso, Guías and Badges show Portapapeles (Copiar respuesta, disabled when no guides selected) and Selección; Codelabs shows Recursos (Abrir Skills Boost in a new tab); Mocks shows Simulacros (Mock Exam CCDV-F in a new tab); Editor shows Archivo (Guardar YAML to memory).

#### Scenario: Home groups are visible
- **WHEN** the Home view is active
- **THEN** the ribbon shows the Selección, Agrupar and Plan groups with the current grouping option marked active

#### Scenario: Copy is disabled without selection
- **WHEN** the Guides view is active and no guides are selected
- **THEN** the "Copiar respuesta" command is disabled

#### Scenario: Editor save persists in-memory catalog
- **WHEN** the user clicks Guardar in the Editor tab
- **THEN** the current YAML document is saved to the in-memory repository and the catalog refreshes

### Requirement: Ribbon collapses to a menu bar
The system SHALL provide a trailing toggle that collapses the ribbon tool area so only the tab bar remains, and expands it again on a second toggle, updating the toggle tooltip accordingly.

#### Scenario: Collapse hides command groups
- **WHEN** the user clicks the collapse toggle while the ribbon is expanded
- **THEN** the tool area disappears leaving only tabs, and the toggle tooltip switches to expand

### Requirement: Theme picker customizes appearance
The system SHALL provide a theme dialog with a light/dark mode switch (dark default), seed color swatches plus a custom color input, a generated tonal palette preview, and a monospaced font picker with a live sample, persisting every change through the settings store.

#### Scenario: Switching to light mode
- **WHEN** the user flips the mode switch to light
- **THEN** the whole application renders the light theme and the choice persists across restarts

#### Scenario: Picking a seed color
- **WHEN** the user picks a seed color swatch
- **THEN** the tonal palette preview and application accents regenerate from that seed

### Requirement: Add-certification dialog creates full YAML certifications
The system SHALL provide an "Agregar certificación" dialog with General fields (ID slug, provider with autocomplete, title, code, cost, color, priority 1–5, popularity 1–5, summary), Meta fields (exam version, guide date, guide source, format, passing score, domains, validity years, recert window/options/discount, level, versions), a repeatable verified-sources list (URL, label, fetch date), and 8 week blocks (title, domain, weight, Bloom 1–6, Kirkpatrick L1–L4, one-per-line study points); on save it SHALL validate the ID slug format, reject duplicate IDs, require provider/title/code and per-week title/domain/points, build quoted YAML, and persist it via the repository, showing inline errors otherwise.

#### Scenario: Validation blocks incomplete form
- **WHEN** the user saves with an empty week title
- **THEN** the dialog stays open and lists an error naming the affected week

#### Scenario: Duplicate ID is rejected
- **WHEN** the user saves with an ID already in the catalog
- **THEN** the dialog stays open and reports that the ID already exists

#### Scenario: Valid form saves and closes
- **WHEN** the user completes all required fields and saves
- **THEN** the dialog closes, the new certification appears in the catalog as interested but unselected, and the save toast appears

### Requirement: Pomodoro dialog runs focus cycles
The system SHALL provide a Pomodoro dialog with configurable focus/short/long lengths (defaults 25/5/15 minutes), an mm:ss countdown with progress bar, Iniciar/Pausar, Saltar and Reset controls, automatic transition to a short break (or long break every 4th completed focus) with an audible beep, and a completed-pomodoros counter held in local dialog state only.

#### Scenario: Completing a focus starts a break
- **WHEN** a running focus countdown reaches zero
- **THEN** the completed counter increments, the beep sounds, and a short-break countdown starts (long break after every 4th focus)

#### Scenario: Skip advances the cycle
- **WHEN** the user clicks Saltar during a focus session
- **THEN** the session advances to the matching break without waiting for the timer

### Requirement: Global save feedback and launch actions
The system SHALL show a bottom-right success toast ("Successfully saved changes!") auto-hiding after 3 seconds whenever the plan or a new certification is saved, SHALL keep two bottom-right floating actions (Pomodoro opener, add-certification opener), and SHALL title the window "CloudCerts SelfStudy Hub".

#### Scenario: Saving the plan shows the toast
- **WHEN** the user clicks Guardar cambios in the Home ribbon
- **THEN** the plan and progress flush to their stores and the success toast appears bottom-right for 3 seconds
