# Branching strategy — CloudCerts SelfStudy Hub

SSOT: `/home/kvttvrsis/Documentos/GitHub/chimeranext/better-toolkits/toolkits/fractional-cto-toolkit/references/engineering-standards/branching-strategy.md`
(Repo type: application → Environment Branching, GitFlow variant.)

## Current state (verified)

| Branch | Role | Default |
| --- | --- | --- |
| `dev` | Integration; PRs land here; CI runs unit + cargo test | ✅ default |
| `release` | Production cuts; Tauri bundles built from here | — |

No `staging` (single-maintainer desktop app — add when a stage environment exists).

## Flow

1. **Feature/fix/docs**: branch from `dev` as `type/slug` (`feat/…`, `fix/…`, `docs/…`, `chore/…`, `test/…`).
2. **PR to `dev`** with `.github/PULL_REQUEST_TEMPLATE.md` body; merge after human OK.
3. **Release**: PR `dev` → `release`; `make prod-tauri-build` from `release`; tag `v*` triggers `release.yml` bundles.

## Commits

Conventional Commits: `type(scope): description` (`feat(mock): …`, `fix(ui): …`, `chore(deps): …`).

## Protection (TODO)

No GitHub rulesets configured yet. Recommended when cadence grows:

1. Require PR for `dev` and `release` (+1 approval on `release`).
2. Require status checks (CI workflow: lint + unit + cargo test).
3. Block direct pushes / force-push on `dev` and `release`.
