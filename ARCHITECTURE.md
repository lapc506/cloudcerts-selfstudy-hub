# Arquitectura — Clean Architecture

Estructura en capas con regla de dependencia estricta: **el código solo puede
importar hacia adentro** (presentation → application → domain; infrastructure
implementa los puertos del dominio). La composition root (`src/App.tsx` +
`src/main.tsx`) es la única que cablea todas las capas.

```
src/
  domain/               Núcleo: entidades, value objects, puertos y lógica pura.
                        Cero dependencias (solo externas tipadas). No importa
                        application / infrastructure / presentation.
    entities.ts         Certification, Week, UserState, ThemeSettings, defaultPlan
    priority.ts         Value object Prioridad 1–5 + migración del legado
    progress.ts         Ids estables de puntos de estudio + conteo
    formResponse.ts     Respuesta para formularios (pura)
    ports.ts            ICertificationRepository, IPlanStore, ISettingsStore,
                        IProgressStore, IMockExamRepository
    mockExam.ts         QuestionBank, BankQuestion, MockExam (con FairUseAssessment)
    mockSchema.ts       Validador de bancos y mocks (issues con path)
    guideSchema.ts      Validador de guías (errores + warnings pedagógicos)
    index.ts            Barril del dominio
  application/          Casos de uso (hooks). Depende solo de domain.
    useCertificationState.ts   Plan (store + catálogo inyectados)
    useStudyProgress.ts        Checks de estudio (store inyectado)
  infrastructure/       Adaptadores de los puertos. Depende solo de domain.
    yamlCertificationRepository.ts  Catálogo desde el YAML embebido
    localStoragePlanStore.ts        Plan en localStorage del webview
    settingsStore.ts                Tema en SQLite (Tauri) / localStorage
    sqliteDb.ts                     Conexión SQLite compartida (cloudcerts.db)
    sqliteProgressStore.ts          Checks en SQLite tabla progress
    mockExamRepository.ts           Bancos + mocks con refs compartidas
    examTopics.ts                   Mapeo verificado de bancos externos (metadatos)
  presentation/         UI (MUI). Recibe datos por props; no importa adaptadores.
    quarks/             Tokens de diseño (skill atomic-design-quarks)
    atoms/              PriorityRating (props puras, <50 líneas)
    molecules/          StudyPointRow, RibbonToolButton, RibbonGroup, KpiCard
    components/         Organismos por feature (Plan/Guides/Dashboard/Editor/
                        Shell): Sidebar, StudyGuide, PlanView,
                        CertificationFormDialog, PomodoroDialog, Dashboard,
                        Ribbon, YAMLGuideEditor, ThemePicker
    theme.ts            Tema MUI (los defaults viven en domain)
    AppThemeHost.tsx    Provider (store inyectado por props)
  App.tsx               Composition root: repositorios → hooks → componentes
  main.tsx              Entry: settingsStore → AppThemeHost → App

src-tauri/              Backend Rust (Tauri): ventana, plugin sql. Sin comandos
                        propios todavía; si se agregan, van por módulos en
                        src-tauri/src/.

Persistencia (Linux):
  Plan (intereses, prioridades, selección) → localStorage del webview
    ~/.local/share/com.cloudcertshub.app/localstorage/
  Tema → SQLite `cloudcerts.db` (o localStorage fuera de Tauri)
  Progreso de checks → SQLite tabla `progress` (o localStorage fuera de Tauri)
    ~/.local/share/com.cloudcertshub.app/cloudcerts.db
```

Verificación rápida de la regla:

```bash
# no deben existir estas importaciones
rg 'from "\.\./types"|data/certifications|hooks/|/lib/|context/' src --glob '!**/node_modules/**'
rg 'from "\.\./(application|infrastructure|presentation)' src/domain/
rg 'infrastructure' src/application/ src/presentation/ --glob '*.{ts,tsx}'
```
