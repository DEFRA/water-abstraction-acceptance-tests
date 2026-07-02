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

## Locators (Playwright)

- Prefer role- and label-based locators (`getByRole`, `getByLabel`, `getByText`) over positional or structural CSS selectors like `:nth-child(n)`
- When porting a Cypress test, do not carry over Cypress's positional/class-chain selectors (e.g. `:nth-child(2) > .govuk-summary-list__actions > .govuk-link`) verbatim — rewrite them as Playwright locators that target what the element means (its role, label, or `data-test` attribute), not where it sits in the DOM
- When several elements could match, disambiguate by scoping the `name`/`hasText` option or via a shared helper (e.g. a `_summaryRow(page, label)` that filters a `.govuk-summary-list__row` by its label) rather than reaching for `:nth-child`

## Naming conventions

- **Directories and JavaScript files**: `kebab-case` (e.g. `core-licence.js`)
- **Test files**: `kebab-case` with a `.spec.js` suffix (e.g. `view-licence.spec.js`)
- **Data file imports**: name the import after the file itself, not after what it returns, e.g. `import company from '../data/company.js'`, not `import companiesData from '../data/company.js'`
- **Data file call results**: when invoking a `../data/*` import to build its data, append `Data` to the resulting variable name, e.g. `const companyData = company('Big Farm Co Ltd')`, not `const companies = company('Big Farm Co Ltd')`
- **Threading data file results through other functions**: this `Data`-suffixed name must be kept consistent wherever that value is passed on, including as a parameter name in another data file, e.g. `export default function (licenceRef, companyData, primaryUserData = null) { ... }`, not `export default function (licenceRef, companiesData, primaryUserData = null) { ... }`

## Alanisms

See `alanisms.md` for non-negotiable code conventions that cannot be enforced by linting.

## Quality gates

Before completing any task:

1. Lint checks pass
2. No 'alanisms' identified
3. No `console.log`, `console.dir`, `test.only`, or `describe.only` present
4. No commented out code
5. No unintended files changed
