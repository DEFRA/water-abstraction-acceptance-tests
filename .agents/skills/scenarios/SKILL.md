---
name: scenarios
description: Conventions for writing tests/support/scenarios/*.scenario.js and tests/support/data/*.data.js files — composition, data ordering, title/description wording, and how to add variants
---

# Scenarios skill

## Context

A scenario file (`tests/support/scenarios/*.scenario.js`) composes one or more data builders (`tests/support/data/*.data.js`) into the full data-seeding object a spec loads via the `setup` fixture. Every scenario file is also listed by `cli:seed.cli.js` for manual local seeding, picked by its exported `title`/`description`.

## Title and description

- Every scenario file exports a `title` and a `description`.
- `title` is short — a noun phrase naming what's in the scenario, e.g. `'Licence in workflow, and an annual bill run'`.
- `title` must be a grammatically correct rendering of the file name: split the `kebab-case` stem on hyphens, sentence-case it, add the articles (`a`/`an`) and joining words (`and`, `with`) English needs, and expand any abbreviation the file name uses (e.g. `tpt` → `two-part tariff`, `chg-ver(s)` → `charge version(s)`) rather than leaving it literal. Don't drop a word the file name carries (e.g. `external-sharing-access.scenario.js` must keep "External" in its title) and don't fold in extra detail the file name doesn't carry, even if it's true of the scenario — that belongs in `description` instead.
- `description` is one flowing sentence (not a comma-spliced run-on of three or more clauses) that says what's actually composed — the entities and any detail a caller would need to pick the right scenario from a list. It's fine to end with a short reason clause (e.g. `'...so it can be used to test old charge scheme behaviour'`, `'...making it eligible for a renewal invitation'`).
- `description` must add information beyond `title` — never repeat `title` verbatim.
- Don't restate implementation detail that's already covered by an in-code comment (e.g. why a date field is set the way it is) — the description is for picking a scenario, not for explaining the builder's internals.
- A dependency that exists only to make the composition valid (e.g. a charge version required for a bill run to exist) can be omitted from `title`/`description` to keep them concise, provided a comment in the file notes that it's still part of the scenario.

## Composing scenarios

- Scenario files compose data explicitly: call each `*.data.js` builder yourself and thread the results into other builders as arguments. Never give a builder parameter a default that calls another builder internally (e.g. `purposes = [purposeData()]`) — that hides the dependency graph.
- Default parameter values for a builder live in the builder's own signature (`tests/support/data/*.data.js`), not re-declared in the scenario file. A scenario overrides a default by passing an explicit argument at the call site, not by relocating the default.
- Don't alphabetize `const` declarations or return-object keys in scenario/data files — the API processes entities in insertion order, so the sequence must follow dependency order (parent entities before the children that reference them). See `alanisms.md` rule 1 for the general alphabetical-keys rule and this exception to it.

## Data file return shape

- A key holds the item directly, e.g. `licences: { id, licenceRef, ... }`. If a data file's return shape ever changes, update every one of its callers (other data files, scenario files, and any spec files that destructure its result) in the same piece of work — a half-updated file breaks its callers.
- **Single-entity data file**: a data file that builds exactly one entity (the normal case once multi-entity files are split — see below) returns the entity itself, with no table-name wrapper at all, e.g. `licenceData` returns `{ id, licenceRef, ... }`, not `{ licences: { id, licenceRef, ... } }`. Wrapping a single return value in its own table name forces every caller into a needless `.tableName` dot-access or destructure to reach the entity. A data file that genuinely builds more than one entity (e.g. `licence-version-purpose.data.js` producing `licenceVersionPurposes`/`licenceVersionPurposePoints`) keeps its table-name-keyed object, since there's no single bare value to return — see the split rule below for whether that should change instead.
- **Array-returning data file**: a data file whose job is to genuinely build more than one row of the *same* entity (not several different entities) is named with a plural filename, and returns the array directly with no wrapper key at all — the trailing `s` in the filename is what signals "this returns an array", so the caller knows what to expect without opening the file. E.g. `return-submission-lines.data.js` returns `[{ id, returnSubmissionId, startDate, endDate, quantity }, ...]` directly (not `{ returnSubmissionLines: [...] }`), alongside the singular `return-submission.data.js`, which returns the one bare `returnSubmission` entity the lines reference via `returnSubmission.id`.
- A data file takes the specific entity object(s)/array(s) it needs as parameters, not the whole upstream `*Data` result object — see the "Data file parameters (single-object data files)" rule in `.agents/skills/standards/SKILL.md` for the full convention and examples.
- **Compose with the singular entity name as the key, not the plural table name.** Where something merges bare single-entity results into the seeding object — a scenario's `_licence`- or `_company`-style private helper, or the outer scenario function itself — use the singular name as the key via object shorthand, e.g. `return { permitLicence, licenceDocument, licence, licenceVersion }`, not `{ permitLicences: permitLicence, licenceDocuments: licenceDocument, licences: licence, licenceVersions: licenceVersion }`. Nothing composing or consuming a scenario needs to know or spell out the plural table name — see `.agents/skills/standards/SKILL.md`'s "Spec file structure" section for how a spec then reads the same key back out, and the next bullet for how the plural wire format gets resolved.
- Regardless of shape, the wire format sent to the seed endpoint must still be pluralized, array-valued keys (e.g. `licences: [{...}]`, `addresses: [{...}]`). This is handled once, centrally, in the `load` fixture (`tests/support/fixtures.js`)'s `_asArrays` helper, via a `_pluralize` function: `s`/`x`/`ch`/`sh`-ending words aren't distinguishable as singular-vs-already-plural by spelling alone, so most keys pluralize by appending a plain `s` (`licence` → `licences`) and a key already ending in a single `s` is treated as already plural and left alone (`companies` stays `companies`). The known exception is a singular word ending in a doubled `ss` (`address`, `companyAddress`), which gets `es` appended (`address` → `addresses`) since no already-plural word ends that way; a singular word ending in a consonant + `y` pluralizes as `-ies` (`company` → `companies`). Scenario and data files never think about any of this; a single scenario's final data object can freely mix singular and already-plural keys, and single-object and array values — `_asArrays` normalizes all of it in one pass. If a future entity name needs its own irregular plural, extend `_pluralize`, not the callers.
- A data file that returns several unrelated entities under one function (as `licence.data.js` originally did, producing `permitLicences`, `licenceDocumentHeaders`, `licenceDocuments`, `licenceDocumentRoles`, `licences`, and `licenceVersions` before it was split) should be split so each entity gets its own single-purpose `*.data.js` file, named and parameterised for that entity alone. This lets other scenarios reuse just the one entity they need (e.g. only `licence-version.data.js`) instead of being forced to take the whole bundle.
- The composition that used to live inside that one big data file moves to a private helper in the scenario file that first needed it, named after the thing it builds (e.g. `_licence` in `licence.scenario.js`, composing `licenceData`, `permitLicenceData`, `licenceDocumentData`, `licenceDocumentHeaderData`, `licenceDocumentRoleData`, and `licenceVersionData`; `company.data.js` was split the same way into `company.data.js`, `address.data.js`, and `company-address.data.js`, composed by a `_company` helper in the same file). This gives other scenarios a single reusable building block (`_licence` for "what a core licence looks like", `_company` for a company and its address) without duplicating the composition logic, while still allowing a scenario that only needs one piece (e.g. just a licence version, or just a bare company) to call that entity's data file directly. Multiple private helpers in one scenario file are ordered alphabetically by name, same as any other private function.

## Adding a variant or edge case

- When an existing no-arg (or under-parameterized) builder needs a different value for a scenario-specific case, don't add a new parameter to the builder. Call it with no args and mutate the returned object's fields directly in the scenario file, e.g.:

```js
const billRun = billRunData()
billRun.billRuns[0].batchType = 'two_part_tariff'
billRun.billRuns[0].fromFinancialYearEnding = 2023
billRun.billRuns[0].toFinancialYearEnding = 2023
```

- This applies even to the first caller that needs the variant, not just once multiple callers exist. Only touch a builder's own signature if asked explicitly for a parameterized version.
- Don't merge near-duplicate scenario files into one parameterized function, even when they differ by a single field. Each scenario file is an independently pickable option in `cli:seed` — collapsing two into one removes a pickable variant. Default to a new single-purpose file per distinct data shape; only suggest consolidating (and ask first) when no one would ever want to seed a variant on its own.

## Naming

See `.agents/skills/standards/SKILL.md` for file/import naming conventions (`kebab-case`, `.scenario.js`/`.data.js` suffixes, import/result naming).

A scenario file's name must lead with the type of licence it builds, then describe what's added on top with `-with-`:

- `licence-` on its own means an unregistered licence, e.g. `licence-with-agreement.scenario.js`.
- `registered-licence-` means a registered licence, e.g. `registered-licence-with-monitoring-station-tagged.scenario.js`.
- `presroc-licence-` means a licence pre-dating the SRoC scheme, e.g. `presroc-licence-with-charge-version.scenario.js`.

Any scenario that composes one of these as a dependency must carry the same prefix, so the name still tells you the licence type without opening the file. Test spec files that build on one of these scenarios should follow the same prefix convention in their own file name where the licence type is relevant to picking the right spec.

**In prose** (titles, descriptions, test names, annotations, comments), the standard spelling is `presroc` — one word, no hyphen. Lower case mid-sentence (`a presroc licence`); capitalise only as the first word of a title or sentence (`Presroc licence with an agreement`). Don't use `pre-SRoC`, `pre-Sroc`, or `PreSRoC`. This applies to our own shorthand for "pre-dating the SRoC scheme" — it doesn't apply to `SRoC`/`SROC` when text is naming the actual charging scheme itself.
