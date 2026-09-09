## Summary

- What changed (outcome, not file list)
- Why now (problem or spec link)
- How (1–2 sentences on approach — only where the diff is not obvious)

## Tracker

Fixes TICKET-N

- Issue: <url>
- OpenSpec (if any): `openspec/changes/YYYY-MM-DD-slug/`
- Cross-repo siblings (if any): link other PR URLs here

## Test plan

- [ ] `npm run lint`
- [ ] `npm test -- --run`
- [ ] `cargo test --manifest-path src-tauri/Cargo.toml`
- [ ] Storybook interaction (`npx vitest run --project storybook`) — UI changes
- [ ] …

## Scope boundaries (out of scope)

- Explicitly list what this PR does **not** change (no drive-by refactors, no unrelated fixes).

## Risk / rollout

- Migrations, flags, breaking UI/API, or prod-only config — or `N/A`.

## Screenshots / evidence

- UI: before/after or Storybook capture
- Ops: CI link or log snippet — or `N/A`
