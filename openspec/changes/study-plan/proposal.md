## Why

The study plan (sidebar catalog + Home roadmap view) is the user's entry point for organizing certifications, yet its unified selection model, grouping, priorities and resizable navigation have no behavior contract. Capturing it as a spec makes plan-sync and navigation changes reviewable.

## What Changes

- Document the unified plan model: card click and checkbox share one notion of "in the plan" (`handleToggleGuide`/`handleToggleInterest` keep `selectedGuides` and `interested` in sync), with select-all / clear-all ribbon actions.
- Document the sidebar nav tree: navy Paperbase drawer, provider sections with collapse chevrons, per-cert rows (expand chevron, checkbox, provider icon, code + title, priority rating), expandable week rows that navigate to the guide, and expandable domain sub-rows with weight.
- Document grouping modes driven by the Home ribbon: by entity (provider + count), by priority (5→1 with caps labels, only non-empty), by difficulty (level label + count, sorted by numeric rank, unclassified last).
- Document priorities 1–5 via the `PriorityRating` atom (🎓 glyph, tooltip "Prioridad n/5"), persisted per certification through the plan store with migration via `parsePriority`.
- Document the resizable sidebar: drag handle plus keyboard (arrows ±16px, Home/End to min/max), clamped to 240–560px, persisted in `localStorage` (`cloudcerts_sidebar_width`), ARIA separator semantics.
- Document the Plan de estudios (Home) view: header counts (certs, weeks, done/total points), "Plan 8 semanas" chip, per-cert cards with avatar, code chip, provider/priority/popularity/validity pills, progress bar with done/total, and "Abrir guía" navigation; empty-plan info alert.

## Capabilities

### New Capabilities
- `study-plan`: Study plan model, sidebar navigation tree, grouping, priorities, resizable sidebar, and Home roadmap view.

### Modified Capabilities
(none — no existing specs cover this)

## Impact

- Planning only; no code changes.
- Source of truth: `src/App.tsx` (plan sync handlers, sidebar width state), `src/presentation/components/Sidebar.tsx`, `src/presentation/components/PlanView.tsx`, `src/presentation/atoms/PriorityRating.tsx`, `src/presentation/molecules/SidebarResizer.tsx`, `src/application/useCertificationState.ts`, `src/domain` (`defaultPlan`, `parsePriority`, `priorityCaps`, `collectCertItemIds`, `countDone`).
- Assumptions: "card click == checkbox" refers to the row click toggling guide selection while the checkbox toggles interest, both converging on the same plan membership via App handlers; auto-expand of newly added guides' trees is included.
