## Why

The app shell (ribbon, theme, global dialogs, save feedback, window identity) is the frame every view depends on, yet its behavior is only defined implicitly in `src/App.tsx` and its dialogs. Capturing it as a spec makes future shell changes reviewable against observable behavior.

## What Changes

- Document the 7 ribbon tabs (Home, Progreso, Guías, Editor YAML, Badges, Codelabs, Mocks) with text + icon, active underline, and uppercase styling.
- Document per-tab ribbon command groups: Home (Selección, Agrupar, Plan), Progreso/Guías/Badges (Portapapeles, Selección), Codelabs (Recursos → Skills Boost), Mocks (Simulacros → CCDV-F), Editor (Archivo → Guardar).
- Document ribbon collapse to a tab-only menu bar via the trailing chevron toggle.
- Document theme customization: light/dark mode switch (dark default), seed color swatches + custom color input, generated tonal palette preview, monospaced font picker with sample; settings persist via `ISettingsStore` through `AppThemeHost`.
- Document the add-certification dialog: full YAML form (general + meta + verified sources + 8 weeks with Bloom/Kirkpatrick), inline validation errors (ID slug, duplicates, required fields, per-week title/domain/points), YAML build with quoting, save via `onSaveYamlText`, error when schema validation fails.
- Document the Pomodoro dialog: focus/short/long lengths (defaults 25/5/15), start/pause, skip, reset, long break every 4th focus, progress bar, beep on transition, local-only state.
- Document global affordances: bottom-right FAB stack (Pomodoro, add certification), bottom-right save toast ("Successfully saved changes!", 3s auto-hide), window/product title "CloudCerts SelfStudy Hub".

## Capabilities

### New Capabilities
- `app-shell`: Application shell — ribbon tabs and command groups, collapse, theme picker + host, add-certification dialog, Pomodoro dialog, save toast, FABs, window title.

### Modified Capabilities
(none — no existing specs; `openspec/specs/` is empty)

## Impact

- Planning only; no code changes.
- Source of truth: `src/App.tsx`, `src/presentation/components/Ribbon.tsx`, `src/presentation/components/ThemePicker.tsx`, `src/presentation/AppThemeHost.tsx`, `src/presentation/components/CertificationFormDialog.tsx`, `src/presentation/components/PomodoroDialog.tsx`, `src-tauri/tauri.conf.json` (window title), `src/presentation/theme.tsx` (seeds/fonts).
- Assumptions: ribbon has 7 tabs as coded (Home/Progreso/Guías/Editor YAML/Badges/Codelabs/Mocks — the request said "8" but the source defines 7); theme settings persist via injected `ISettingsStore`; Pomodoro state is intentionally non-persisted.
