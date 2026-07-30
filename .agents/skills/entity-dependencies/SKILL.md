---
name: entity-dependencies
description: Known hard dependencies between entities in tests/support/data and tests/support/scenarios, so composed scenarios stay valid
---

# Entity dependencies skill

## Context

This file documents entities in `tests/support/data/*.data.js` that have a hard dependency on another entity always being present, even when that dependency isn't the focus of a given scenario. It exists to surface these dependencies explicitly so scenario composition stays as accurate to the real data model as possible — a scenario that seeds an entity without its required dependency can insert data that doesn't reflect how the service actually works, or fail outright.

This is a living document, not an exhaustive schema. Add an entry whenever a new hard dependency is identified, whether by tracing a data builder's own requirements or by finding a scenario that got it wrong.

## Checking a dependency

When writing or reviewing a scenario:

1. Check the data builder's own signature/body for what it destructures directly off another `*Data` object — that's a hard dependency, not an optional nicety.
2. Confirm the dependency is present somewhere in the composed scenario: either built directly in the scenario file, or inherited by composing another scenario/data builder that already builds it.
3. If a dependency exists only to make the composition valid and isn't itself the point of the scenario, it can be left out of `title`/`description` (see `.agents/skills/scenarios/SKILL.md`) — but leave a comment in the scenario file noting it's still part of the scenario and why.

## Known dependencies

- **A charge version must have a billing account.** `chargeVersionData(billingAccountData, licenceData)` destructures `billingAccountData.billingAccounts[0]` directly — build one with `billingAccountData(licenceData)` and pass it as the first arg.
- **A return requirement must have a return version.** `returnRequirementData(returnVersionData, licenceData)` destructures `returnVersionData.returnVersions[0]` directly — build one with `returnVersionData(licenceData)` and pass it as the first arg.
- **A return log must have a return requirement.** `returnLogData(licenceData, returnRequirementData, period)` destructures `returnRequirementData.returnRequirements[0]` directly — build one with `returnRequirementData(returnVersionData, licenceData)` and pass it as the second arg.
- **A licence with a sent bill run must have a charge version.** The bill run itself has no direct FK to a charge version in the seed data, but a scenario pairing a licence with a sent bill run (e.g. for supplementary billing) needs a charge version present on that licence for the pairing to be meaningful/valid.
