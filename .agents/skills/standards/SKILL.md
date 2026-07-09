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
- In spec files and data files, destructure entities out of scenario/data-file results with array patterns rather than indexing directly, e.g. prefer `const { companies: [company], licences: [licence] } = scenario` over `const company = scenario.companies[0]`, and prefer `const { companies: [company], addresses: [address] } = companyData` over `const company = companyData.companies[0]`

## Spec file structure (Playwright)

- Every spec file must have a single `test.describe` block containing everything: entity variables declared with `let`, then `test.beforeAll`, then `test.beforeEach`, then the `test`s. Nothing scenario-related lives at module scope above the `describe`.
- `test.beforeAll` builds the scenario, destructures the entities the tests need (using temporary `scenario`-prefixed names to avoid shadowing), assigns them to the outer `let` variables, then loads the scenario. Use the `setup` fixture when the scenario needs no calculated dates; use `tearDown` + `calculatedDates` + `load` individually when it does.

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

// Good — scenario needs calculated dates, so tearDown/calculatedDates/load are used directly instead of setup
test.describe('Submit a return with no meter readings (internal)', () => {
  let returnLog

  test.beforeAll(async ({ tearDown, calculatedDates, load }) => {
    await tearDown()

    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      returnLogs: [scenarioReturnLog]
    } = scenario

    returnLog = scenarioReturnLog

    await load(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('attempt to submit a return without entering any readings', async ({ page }) => { ... })
})
```

## Locators (Playwright)

- Prefer role- and label-based locators (`getByRole`, `getByLabel`, `getByText`) over positional or structural CSS selectors like `:nth-child(n)`
- When porting a Cypress test, do not carry over Cypress's positional/class-chain selectors (e.g. `:nth-child(2) > .govuk-summary-list__actions > .govuk-link`) verbatim — rewrite them as Playwright locators that target what the element means (its role, label, or `data-test` attribute), not where it sits in the DOM
- When several elements could match, disambiguate by scoping the `name`/`hasText` option or via a shared helper (e.g. a `_summaryRow(page, label)` that filters a `.govuk-summary-list__row` by its label) rather than reaching for `:nth-child`

## Naming conventions

- **Directories and JavaScript files**: `kebab-case` (e.g. `core-licence.data.js`)
- **Test files**: `kebab-case` with a `.spec.js` suffix (e.g. `view-licence.spec.js`)
- **Data files**: `kebab-case` with a `.data.js` suffix (e.g. `company.data.js`)
- **Scenario files**: `kebab-case` with a `.scenario.js` suffix (e.g. `licence.scenario.js`)
- **Data/scenario file imports**: name the import after the file itself, including its `Data`/`Scenario` suffix, e.g. `import companyData from '../data/company.data.js'` and `import licenceScenario from './licence.scenario.js'`, not `import company from '../data/company.data.js'`
- **Data/scenario file call results**: when invoking a `../data/*` or scenario import to build its data, use a plain descriptive name for the result rather than repeating the `Data`/`Scenario` suffix, e.g. `const company = companyData()` and `const licence = licenceScenario()`, not `const companyData = companyData()` (which also collides with the import binding)
- **Data file parameters**: parameter names inside `../data/*.data.js` files must stay consistent with each other across the whole data folder for the same concept, always `Data`-suffixed regardless of what the caller named its local result, e.g. every data file that accepts a company's data calls the parameter `companyData` — `export default function (licenceRef, companyData, primaryUserData = null) { ... }`, not `export default function (licenceRef, company, primaryUser = null) { ... }`

## Alanisms

See `alanisms.md` for non-negotiable code conventions that cannot be enforced by linting.

## Quality gates

Before completing any task:

1. Lint checks pass
2. No 'alanisms' identified
3. No `console.log`, `console.dir`, `test.only`, or `describe.only` present
4. No commented out code
5. No unintended files changed
