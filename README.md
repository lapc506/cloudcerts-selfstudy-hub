# CloudCerts SelfStudy Hub

Compañero de estudio desktop para certificaciones cloud e IA — **43 guías** de autoestudio de 8 semanas,
seguimiento de progreso, mock exams y autoría de contenido YAML-first, todo offline y local-first.

[![Tauri 2](https://img.shields.io/badge/Tauri-2-24C8DB?style=flat-square&logo=tauri)](https://v2.tauri.app)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![MUI v9](https://img.shields.io/badge/MUI-v9-007FFF?style=flat-square&logo=mui)](https://mui.com)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-tauri--plugin--sql-003B57?style=flat-square&logo=sqlite)](https://github.com/tauri-apps/plugins-workspace)
[![Storybook](https://img.shields.io/badge/Storybook-34%20stories-FF4785?style=flat-square&logo=storybook)](https://storybook.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#licencia)

**Docs:** [PRD](./PRD.md) · [Arquitectura](./ARCHITECTURE.md) · [Contribuir](./CONTRIBUTING.md) ·
[Política IA](./AI_POLICY.md) · [Conducta](./CODE_OF_CONDUCT.md) · [Changelog](./CHANGELOG.md) ·
[Estándares](./AGENTS.md) · [OpenSpec](./openspec/) · [Landing](./landing/index.html)

---

## Qué es

CloudCerts SelfStudy Hub es una **app desktop Tauri 2** (React 18, MUI v9, Vite 5,
TypeScript 7) que convierte la preparación de certificaciones en un ciclo estructurado:
**planifica** tu roadmap, **estudia** guías semana a semana, **marca** puntos de estudio,
**practica** con mock exams y **mide** tu progreso — todo guardado localmente en SQLite +
`localStorage` del webview. Sin cuentas, sin telemetría, sin nube.

La UI está en **español**. Cada una de las 43 guías es un plan fijo de **8 semanas**
organizado por dominios oficiales del examen (con pesos) y enriquecido con etiquetas
Bloom 1–6 + Kirkpatrick L1–L4, niveles (100/200/300), popularidad (🔥 1–5), rutas de carrera
y fuentes PDF oficiales verificadas con fecha de consulta.

## Características

- **Plan de estudios (Home)** — tarjetas de roadmap con progreso por cert; navega a cualquier semana.
- **Progreso** — KPIs, distribución de prioridad (🎓 1–5) y filas de seguimiento por certificación.
- **Guías** — acordeones de semana → sub-acordeones por dominio → checkboxes To-Do
  persistidos en SQLite (tabla `progress`, IDs estables).
- **Editor YAML** — crea guías, bancos de preguntas y mocks en YAML (a mano o con un
  LLM); el validador reporta errores con path exacto más advertencias pedagógicas.
- **Badges** — explorador Open Badges 3.0 con imágenes reales de Credly.
- **Codelabs** — sube `.ipynb`, renderiza celdas markdown/código/texto (nunca ejecuta código),
  adjunta links de Skills Boost.
- **Mocks** — quiz runner local: temporizador, opción única/múltiple, puntaje ponderado
  por dominio vs 72% de aprobación, reintento con reordenamiento y modo revisión con
  explicaciones. Los bancos se comparten entre mocks.
- **Shell** — ribbon estilo Office (colapsable), sidebar navy estilo Paperbase con árbol
  (agrupa por proveedor/prioridad/dificultad, navega-a-semana con auto-expansión + scroll),
  diálogo Pomodoro (25/5/15), selector de tema (claro/oscuro + paletas semilla M3 en SQLite),
  diálogo FAB para agregar certificaciones (formulario YAML-schema completo), guardado
  explícito + toasts Snackbar.

## Catálogo — 43 guías

> Requiere el merge de `feat/nvidia-professional-certs` (8 Professional NVIDIA validadas
> contra nvidia.com el 2026-09-09).

| Proveedor | Certificaciones |
| --- | --- |
| AWS (6) | CLF-C02 · SOA-C02 · SAA-C03 · DVA-C02 · SAP-C02 · DOP-C02 |
| Google Cloud (7) | ACE · GenAI Leader · Data Practitioner · PCA · PDE · CDL · ML Engineer |
| Azure (5) | AZ-900 · AI-901 · AZ-104 · AZ-204 · AZ-305 |
| CNCF (5) | CKA · CKAD · OTCA · CGOA · KCA |
| NVIDIA (12) | NCA-GENL · NCA-ADS · NCA-GENM · NCA-AIIO · NCP-GENL · NCP-AAI · NCP-ADS · NCP-OUSD · NCP-AII · NCP-AIO · NCP-AIN · NCP-ARI |
| Linux Foundation (2) | LFCS · CAPA |
| ISTQB (2) | CTFL v4.0 · CT-AI v2.0 (vigencia lifetime) |
| Anthropic (2) | CCAR-F · CCDV-F |
| Red Hat (1) | EX280 |
| HashiCorp (1) | TA-004 |

## Inicio rápido

Requisitos: **Node.js ≥ 20**, toolchain Rust (`cargo`) y dependencias de sistema Tauri en Linux
(`libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libxdo-dev`,
`libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`).

```bash
# 1. Instalar dependencias JS
npm install

# 2. Solo navegador (sin Tauri; tema/progreso caen a localStorage)
npm run dev              # → http://localhost:1420

# 3. App desktop en desarrollo (compila el backend Rust + abre la ventana)
make dev-tauri-run       # primera vez toma minutos — compila todos los crates Tauri

# 4. Librería de componentes
npm run storybook        # → http://localhost:6006 (34 stories, atomic design)

# 5. Build de producción (bundles en src-tauri/target/release/bundle)
make prod-tauri-build
```

Atajos `make`: `help` · `dev-setup` · `dev-clean` · `dev-tauri-build` · `prod-tauri-build` ·
`dev-tauri-run` · `ci-test` · `ci-lint` · `ci-e2e-run`.

## Tests

| Nivel | Comando | Qué cubre |
| --- | --- | --- |
| Unit (Vitest + jsdom) | `npm test -- --run` | Dominio puro + `settingsStore` vía `mockIPC` + contrato mocks Tauri (19 tests) |
| Interacción (Storybook + Chromium) | `npx vitest run --project storybook` | 34 stories + 3 play functions (lento — solo en cambios UI) |
| Integración Rust | `cargo test --manifest-path src-tauri/Cargo.toml` | Gate `tauri.conf.json` vs `Cargo.toml` (`assert2`, `pretty_assertions`, `static_assertions`) |
| E2E (WebdriverIO + mocha) | `npm run test:e2e` | Smoke contra el binario real (requiere build + display; CI con xvfb) |

`npm run lint` = `tsc --noEmit`. CI en `.github/workflows/` (`ci.yml`, `e2e.yml`, `release.yml` con `tauri-action`).

## Arquitectura

Clean Architecture con regla estricta de dependencias hacia adentro
(`presentation → application → domain`; `infrastructure` implementa puertos del dominio).
La raíz de composición (`src/App.tsx` + `src/main.tsx`) cablea todo.

Persistencia (Linux):

| Dato | Almacén |
| --- | --- |
| Plan de estudios (intereses, prioridades, selección) | `localStorage` del webview |
| Tema | SQLite `cloudcerts.db → settings(theme)` (fallback a localStorage en navegador) |
| Progreso de checkpoints | SQLite `cloudcerts.db → progress` (fallback a localStorage en navegador) |

Archivo DB: `~/.local/share/com.cloudcertshub.app/cloudcerts.db`.
Mapa de capas y reglas en [`ARCHITECTURE.md`](./ARCHITECTURE.md);
alcance y requisitos en [`PRD.md`](./PRD.md).

## Ramas

GitFlow aplicado: **`dev`** (default, integración) y **`release`** (cortes de producción).
Features como `type/slug` desde `dev`, PR a `dev`, release vía PR `dev` → `release`.
Detalle en [`docs/process/branching.md`](./docs/process/branching.md).

## Contribuir y uso de IA

Contribuciones bienvenidas — empieza por [`CONTRIBUTING.md`](./CONTRIBUTING.md). Este es un
**proyecto asistido por IA**: toda contribución generada por IA debe declararse y cada dato
de examen debe verificarse contra fuentes oficiales antes de aterrizar — ver
[`AI_POLICY.md`](./AI_POLICY.md) (verificar-antes-de-inventar). Amabilidad ante todo:
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Estándares de ingeniería en [`AGENTS.md`](./AGENTS.md).

## Licencia

MIT — ver [`LICENSE`](./LICENSE).
