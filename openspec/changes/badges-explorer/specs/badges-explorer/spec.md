## Purpose

Open Badges 3.0 style preview cards for the certifications in the user's study plan, rendered from catalog metadata with real badge imagery.

## ADDED Requirements

### Requirement: Badge preview cards for plan guides

The system SHALL render one preview card per certification in the user's plan (`selectedGuides`), each showing the badge name (cert title), the issuer (provider), a criteria link to the real official guide source, a validity chip, and up to three skill chips derived from the exam domains, plus a header count of badges shown.

#### Scenario: Plan guides render as cards

- **WHEN** the user has certifications in their plan
- **THEN** the system SHALL render one card per planned guide showing title, issuer, validity, skills, and criteria link, with a header stating the badge count.

#### Scenario: Empty plan shows guidance

- **WHEN** the plan contains no certifications
- **THEN** the system SHALL show an informational message directing the user to add certifications from the catalog sidebar instead of rendering cards.

### Requirement: Credly imagery with avatar fallback

The system SHALL display the real Credly badge image (`meta.badgeImage`) WHEN present, and otherwise SHALL render a fallback avatar in the provider color showing the first two characters of the cert code.

#### Scenario: Real badge image shown

- **WHEN** a planned certification carries a `badgeImage` URL
- **THEN** the card SHALL render that image with the badge title as alt text.

#### Scenario: Avatar fallback without image

- **WHEN** a planned certification has no `badgeImage`
- **THEN** the card SHALL render an avatar in the provider color labeled with the first two characters of the cert code.

### Requirement: Validity and criteria reflect catalog meta

The system SHALL label validity via the shared validity formatter (lifetime WHEN `validityYears` is 0, else year count) and SHALL link criteria to the certification's real `guideSource`, rendering the link only WHEN a source exists.

#### Scenario: Lifetime vs dated validity

- **WHEN** a badge card renders
- **THEN** a certification with `validityYears` 0 SHALL show a lifetime label and any other value SHALL show the corresponding year count.

#### Scenario: Criteria link opens official guide

- **WHEN** a certification has a `guideSource`
- **THEN** the card SHALL expose it as an outbound "Ver criterio" link; WHEN absent, no criteria link SHALL render.
