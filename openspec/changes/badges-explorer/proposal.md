## Why

The Badges view renders Open Badges 3.0 preview cards from the catalog for the user's planned guides, but that contract (which fields appear, where images come from, what happens without a plan or image) is unspecified. A `badges-explorer` capability spec pins the current behavior so catalog meta changes cannot silently break the preview.

## What Changes

- Specify Open Badges 3.0 preview cards for plan guides: badge name, issuer, criteria link (real `guideSource`), validity label, and skills (up to 3 exam domains).
- Specify real Credly badge images (`meta.badgeImage`) with provider-color avatar fallback showing the cert code initials.
- Specify empty-plan behavior: guidance to add certifications from the catalog sidebar.

## Capabilities

### New Capabilities

- `badges-explorer`: Open Badges 3.0 preview cards for planned guides with Credly imagery and avatar fallback.

### Modified Capabilities

(none — greenfield spec capturing existing behavior)

## Impact

- Spec-only change; no code edits. Grounds: `src/presentation/components/BadgesView.tsx`, `src/domain/entities.ts` (`CertificationMeta`, `formatValidity`).
- Assumptions: "skills" shown are the first 3 `meta.domains` entries keyed by text before any `:` separator; header count text reflects the selected-guides count; criteria link renders only when `guideSource` is present.
