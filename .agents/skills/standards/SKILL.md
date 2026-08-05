---
name: standards
description: Standard skills and patterns an agent should apply when working in this codebase
---

# Standards skill

## Context

This document defines the standards an agent must apply when reviewing or writing code in this project.

## Core principles

- Solve the problem as stated — do not over-engineer or anticipate future requirements
- Follow existing patterns in the codebase before introducing new ones
- Verify work before marking a task complete

## Reading code

- Read the full function and its callers before making changes
- Check for existing utilities before writing new ones
- Use `grep` / search to find all usages of a symbol before renaming or removing it

## Writing code

- Match the style and conventions of the surrounding code
- All `import` statements must be at the top of the file, before any function definitions — never inside functions
- Arrow functions must always use braces: `const fn = () => { return x }`
- No inline comments unless the *why* is genuinely non-obvious
- No `console.log()` or `console.dir()`
- No error handling for scenarios that cannot happen
- No abstractions for a single use case
- Private functions must be ordered alphabetically by name
- In spec files and data files still on the legacy array-returning shape, destructure entities out of scenario/data-file results with array patterns rather than indexing directly, e.g. prefer `const { companies: [company], licences: [licence] } = scenario` over `const company = scenario.companies[0]`, and prefer `const { companies: [company], addresses: [address] } = companyData` over `const company = companyData.companies[0]`. This doesn't apply to scenarios/data files migrated to the single-object shape (see `.agents/skills/scenarios/SKILL.md`) — there's no array to destructure or index into, so a plain property access is used instead (see "Spec file structure" below for the spec-file pattern)

## Spec file structure (Playwright)

- Every spec file must have a single `test.describe` block containing everything: entity variables declared with `let`, then `test.beforeAll`, then `test.beforeEach`, then the `test`s. Nothing scenario-related lives at module scope above the `describe`.
- `test.beforeAll` builds the scenario, pulls out the entities the tests need, assigns them to the outer `let` variables, then loads the scenario via the `setup` fixture. When the scenario needs calculated dates, call `calculatedDates` first to get the dates and pass them into the scenario builder, but still load the result with `setup` rather than calling `tearDown` + `load` individually.
  - On a scenario still on the legacy array shape, pull an entity out with a destructure using temporary `scenario`-prefixed names to avoid shadowing the outer `let`, e.g. `const { licences: [scenarioLicence] } = scenario` then `licence = scenarioLicence`.
  - On a scenario migrated to the single-object shape (see `.agents/skills/scenarios/SKILL.md`), the scenario's key is already the singular entity name, so a plain property assignment replaces the destructure entirely — no temp name needed since there's no `const`/`let` to collide with the outer one: `licence = scenario.licence`.

```js
// Bad — scenario built and destructured at module scope, outside the describe
const scenario = scenarioData()

const {
  licences: [licence]
} = scenario

test.describe('Delete licence agreement journey (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('deletes a licence agreement', async ({ page }) => { ... })
})

// Good — entities declared with let inside the describe, scenario built inside beforeAll
test.describe('Delete licence agreement journey (internal)', () => {
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence]
    } = scenario

    licence = scenarioLicence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('deletes a licence agreement', async ({ page }) => { ... })
})

// Good — scenario needs calculated dates, so calculatedDates is called before building it, but setup still loads it
test.describe('Submit a return with no meter readings (internal)', () => {
  let returnLog

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      returnLogs: [scenarioReturnLog]
    } = scenario

    returnLog = scenarioReturnLog

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('attempt to submit a return without entering any readings', async ({ page }) => { ... })
})

// Good — scenario is on the migrated single-object shape, so no destructure/array-pattern is needed at all
test.describe('Search for a licence (internal)', () => {
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    licence = scenario.licence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.super)
  })

  test('can find a licence by exact licence reference', async ({ page }) => { ... })
})
```

## Locators (Playwright)

- Prefer role- and label-based locators (`getByRole`, `getByLabel`, `getByText`) over positional or structural CSS selectors like `:nth-child(n)` or `.nth(n)`
- When porting a Cypress test, do not carry over Cypress's positional/class-chain selectors (e.g. `:nth-child(2) > .govuk-summary-list__actions > .govuk-link`) verbatim — rewrite them as Playwright locators that target what the element means (its role, label, or `data-test` attribute), not where it sits in the DOM
- When several elements could match, disambiguate by scoping the `name`/`hasText` option or via a shared helper (e.g. a `_summaryRow(page, label)` that filters a `.govuk-summary-list__row` by its label) rather than reaching for `:nth-child`. Watch out for locator chains that filter to a group by one element's name and then call `.first()`/`.nth()` on a re-query inside it — that's still a positional selector wearing a role-based disguise
- **`.nth()` is banned on pages served from `/system/`** (the new service, whose markup we control) — if a `/system/` page is genuinely ambiguous, that's an app bug to raise, not a reason to use `.nth()`. It's an acceptable pragmatic workaround only on legacy pages served from `/`, where markup defects (e.g. duplicate `id`s on radio pairs) sometimes make role/label locators unusable. Where the conflict is between a wrapping element and the actual input — our shared radio-group renderer stamps the same `id` on both the wrapping `<div class="govuk-radios">` and its first `<input>`, breaking that option's label association — scope the locator to the tag as well (e.g. `page.locator('input#loss')`) rather than reaching for `.nth()`
- Always click the primary form-submit button with `page.getByRole('button', { name: 'Continue' })` (or its actual accessible name, e.g. `'Confirm'`) — never the CSS selector `page.locator('form > .govuk-button')`. This applies on both legacy and `/system/` pages

## Page structure (Playwright)

- Do not use a comment to say what page a block of actions is on — assert the page's `h1` instead. The assertion documents itself and fails immediately if the page's copy changes, where a comment would silently go stale
- For every page a journey visits, group its actions as: an `h1` assertion, then the input action(s) for that page, then the action that confirms or navigates on to the next page — separated by a blank line from the next page's block
- Some pages render more than one `<h1>` (e.g. a GOV.UK confirmation panel alongside another heading). If `page.locator('h1')` hits a strict-mode violation, use `.last()` to target the specific, actionable heading rather than reaching for an unrelated locator

```js
// Bad — a comment stands in for actually asserting what page we're on
// Select reason for new charge information
await page.getByRole('radio', { name: 'New licence', exact: true }).check()
await page.getByRole('button', { name: 'Continue' }).click()

// Good — h1, input, action
await expect(page.locator('h1')).toContainText('Select reason for new charge information')
await page.getByRole('radio', { name: 'New licence', exact: true }).check()
await page.getByRole('button', { name: 'Continue' }).click()
```

## Annotations (Playwright)

- When a `test` or `test.describe` needs an annotation explaining what it covers (e.g. the supplementary-billing trigger a test proves), use `type: 'description'`, not `type: 'info'`. `type: 'issue'` remains correct for linking a ticket, and other specific types (e.g. `'tpt-review'`) remain correct where a suite already uses one to group or report on a distinct category of test

## Naming conventions

- **Directories and JavaScript files**: `kebab-case` (e.g. `core-licence.data.js`)
- **Test files**: `kebab-case` with a `.spec.js` suffix (e.g. `view-licence.spec.js`)
- **Data files**: `kebab-case` with a `.data.js` suffix (e.g. `company.data.js`). A singular filename (`return-submission.data.js`) returns the bare single data object; a plural filename (`return-submission-lines.data.js`) returns an array of that data object's rows directly, no wrapper key — the trailing `s` is the signal, so the caller knows the return shape without opening the file. See the "Migrated array-returning data file" rule in `.agents/skills/scenarios/SKILL.md` for the full convention.
- **Scenario files**: `kebab-case` with a `.scenario.js` suffix (e.g. `licence.scenario.js`)
- **Entity files**: `kebab-case` with a `.entity.js` suffix (e.g. `billing-account.entity.js`). An entity file composes several data objects — and, where one already exists, other entities — into a complete, valid data group. See `tests/support/entities/README.md` for the full data object vs entity vs scenario distinction, and for when an entity file should depend on another entity file.
- **Data/scenario file imports**: name the import after the file itself, including its `Data`/`Scenario` suffix, e.g. `import companyData from '../data/company.data.js'` and `import licenceScenario from './licence.scenario.js'`, not `import company from '../data/company.data.js'`
- **Data/scenario file call results**: when invoking a `../data/*` or scenario import to build its data, use a plain descriptive name for the result rather than repeating the `Data`/`Scenario` suffix, e.g. `const company = companyData()` and `const licence = licenceScenario()`, not `const companyData = companyData()` (which also collides with the import binding)
- **Entity file imports and call results**: unlike a data/scenario file, an entity file's import keeps a `build` prefix so its call result can keep the plain `<name>Entity` name instead, e.g. `import buildBillingAccountEntity from '../entities/billing-account.entity.js'` then `const billingAccountEntity = buildBillingAccountEntity(company, address)`, not `import billingAccountEntity from ...` then `const billingAccountEntity = billingAccountEntity(...)` (which shadows the import inside its own declaration and throws `Cannot access 'billingAccountEntity' before initialization`). Access the entity's composed fields off the result, e.g. `billingAccountEntity.billingAccount`, and spread the whole result into the caller's own return object (`...billingAccountEntity`) rather than pulling fields out individually. See `tests/support/entities/README.md` for the full rationale.
- **Data file parameters (legacy array-returning data files)**: parameter names inside a `../data/*.data.js` file that still returns the legacy array shape must stay consistent with each other across the whole data folder for the same concept, always `Data`-suffixed regardless of what the caller named its local result, e.g. every such data file that accepts a company's data calls the parameter `companyData` — `export default function (licenceRef, companyData, primaryUserData = null) { ... }`, not `export default function (licenceRef, company, primaryUser = null) { ... }`
- **Data file parameters (single-object data files)**: a data file migrated to the single-object return shape takes the specific data object(s)/array(s) it needs directly, not the whole upstream `*Data` result — e.g. `export default function (licenceRef, company, address) { ... }`, not `export default function (licenceRef, companyData) { ... }` with an internal destructure. The caller passes each data object it already has in hand as its own argument, e.g. `companyAddressData(company, address)`, where `company` and `address` are themselves already-built bare data objects — never a larger bundle for the callee to unpack. Once a data object exists (e.g. a `licence` built by `licenceData`), pass that whole object into builders that depend on it — never pre-extract its individual fields into separate scalar arguments. E.g. `permitLicenceData(licence)` (reading `licence.licenceRef`/`licence.startDate` internally), not `permitLicenceData(licence.licenceRef, licence.startDate)`. Raw scalars are only passed for values that don't yet exist as part of any data object (e.g. the `licenceRef` and `startDate` used to first create the licence itself)

## Alanisms

See `alanisms.md` for non-negotiable code conventions that cannot be enforced by linting.

## Quality gates

Before completing any task:

1. Lint checks pass
2. No 'alanisms' identified
3. No `console.log`, `console.dir`, `test.only`, or `describe.only` present
4. No commented out code
5. No unintended files changed
