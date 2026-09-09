# QA traceability (QT4L) — mini-guide

SSOT: `/home/kvttvrsis/Documentos/GitHub/chimeranext/better-toolkits/toolkits/fractional-cto-toolkit/references/engineering-standards/qa-traceability-four-layers.md`

## When the `tasks.md` section is mandatory

| Change type | QA section in `tasks.md` | Scenario → verification table |
| --- | --- | --- |
| Behavior delta (OpenSpec `specs/` change) | **Mandatory** from `propose` | **Mandatory**, one row per `#### Scenario:` |
| Decision record / docs-only / infra | Optional pointer | Not required |
| Hotfix without spec change | N/A | Existing tests + SOP |

## The four layers in this repo

| Layer | Artifact here |
| --- | --- |
| 1 — Normative AC | `openspec/specs/<capability>/spec.md` + `openspec validate` |
| 2 — Manual QA (stage) | No domain SOP yet — checklist in the change's `tasks.md` until one lands |
| 3 — Automated (CI) | `src/**/*.test.ts` (vitest unit) · `*.stories.tsx` play (storybook) · `test/e2e/*.spec.ts` (wdio) · `src-tauri/tests/*.rs` (cargo) |
| 4 — HITL round | `docs/qa/rounds/<domain>-<date>/round.md` |

## Stub (copy into behavior-change `tasks.md`)

```markdown
## QA traceability (four layers)

| Layer | Artifact |
| --- | --- |
| 1 — Normative AC | `specs/<capability>/spec.md` (this change) |
| 2 — Manual QA (stage) | tasks.md checklist (no domain SOP yet) |
| 3 — Automated | `<test file>` (table below) |
| 4 — HITL round | `docs/qa/rounds/<domain>-<date>/round.md` |

### Scenario → verification

| OpenSpec scenario | Automated test | Manual | HITL case ID | Storybook |
| --- | --- | --- | --- | --- |
| `<exact scenario title>` | `<file>::<test>` or `(pending N)` | tasks.md bullet | `<DOM>-…` | `Story/name` or — |
```
