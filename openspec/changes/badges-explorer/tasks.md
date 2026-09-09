## 1. Card rendering

- [ ] 1.1 Verify one card per planned guide shows title, issuer, validity, up to 3 skill chips, criteria link, and header count by loading a plan with multiple guides and inspecting the badges view.
- [ ] 1.2 Verify the empty plan shows the informational guidance message by clearing `selectedGuides` and asserting no cards render.

## 2. Imagery, validity, and criteria

- [ ] 2.1 Verify a guide with `badgeImage` renders the real Credly image (alt = badge title) and a guide without one renders the provider-color avatar with the code's first two characters.
- [ ] 2.2 Verify lifetime labeling for `validityYears` 0 and year counts otherwise, and that the criteria link renders only when `guideSource` exists and points at the official guide.
- [ ] 2.3 Run `openspec validate --specs` and confirm it passes after the sync.
