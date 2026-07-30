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
- `description` is one flowing sentence (not a comma-spliced run-on of three or more clauses) that says what's actually composed — the entities and any detail a caller would need to pick the right scenario from a list. It's fine to end with a short reason clause (e.g. `'...so it can be used to test old charge scheme behaviour'`, `'...making it eligible for a renewal invitation'`).
- `description` must add information beyond `title` — never repeat `title` verbatim.
- Don't restate implementation detail that's already covered by an in-code comment (e.g. why a date field is set the way it is) — the description is for picking a scenario, not for explaining the builder's internals.
- A dependency that exists only to make the composition valid (e.g. a charge version required for a bill run to exist) can be omitted from `title`/`description` to keep them concise, provided a comment in the file notes that it's still part of the scenario.

## Composing scenarios

- Scenario files compose data explicitly: call each `*.data.js` builder yourself and thread the results into other builders as arguments. Never give a builder parameter a default that calls another builder internally (e.g. `purposes = [purposeData()]`) — that hides the dependency graph.
- Default parameter values for a builder live in the builder's own signature (`tests/support/data/*.data.js`), not re-declared in the scenario file. A scenario overrides a default by passing an explicit argument at the call site, not by relocating the default.
- Don't alphabetize `const` declarations or return-object keys in scenario/data files — the API processes entities in insertion order, so the sequence must follow dependency order (parent entities before the children that reference them). See `alanisms.md` rule 1 for the general alphabetical-keys rule and this exception to it.

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
