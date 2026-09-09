## 1. Ribbon Conformance

- [ ] 1.1 Verify all 7 tabs render with icon + uppercase label and active underline, by launching the app and switching each tab
- [ ] 1.2 Verify per-tab command groups (Home/Agrupar/Plan, Portapapeles/Selección, Recursos, Simulacros, Archivo) fire their handlers, by clicking each command and observing the effect
- [ ] 1.3 Verify ribbon collapse hides the tool area and the toggle tooltip flips, by toggling collapse twice

## 2. Theme Conformance

- [ ] 2.1 Verify light/dark switch re-themes the app and persists across reload, by toggling mode and restarting the app
- [ ] 2.2 Verify seed swatch + custom color input regenerate the tonal palette, by picking two seeds and observing accents
- [ ] 2.3 Verify font picker changes the monospaced family with live sample, by selecting each font option

## 3. Dialogs and Feedback Conformance

- [ ] 3.1 Verify add-certification dialog validates ID slug, duplicates, required fields and per-week blocks, by submitting invalid forms and reading inline errors
- [ ] 3.2 Verify a valid add-certification form builds YAML, persists it, closes, and shows the save toast, by creating a test certification
- [ ] 3.3 Verify Pomodoro countdown, pause/skip/reset, 25/5/15 defaults, long break every 4th focus, and beep, by running shortened lengths
- [ ] 3.4 Verify bottom-right toast auto-hides after 3s and window title reads "CloudCerts SelfStudy Hub", by saving the plan and inspecting the title
