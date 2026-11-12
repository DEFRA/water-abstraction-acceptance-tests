---
name: alanisms
description: Non-negotiable code conventions that cannot be enforced by automation or linting
---

# Alanisms

Quirky but non-negotiable code conventions from our lead engineer. They cannot be enforced by automation or linting, so they require active judgement on every change.

> This file is a living document. New ones will be added as they are identified.

## 1 — Object keys must be in alphabetical order

All object literals must have their keys sorted A–Z.

```js
// Bad
return {
  pageTitle: 'Jokes',
  joke: data.joke,
  backLink: { href: '/', text: 'Back' }
}

// Good
return {
  backLink: { href: '/', text: 'Back' },
  joke: data.joke,
  pageTitle: 'Jokes'
}
```

This applies everywhere: return values, inline objects, exported objects, test assertions.

**Exception — data and scenario files (`tests/support/data/*.data.js`, `tests/support/scenarios/*.scenario.js`):** The API that seeds test data processes entities in insertion order, so the keys in the returned object and the `const` declarations above it must follow dependency order (parent entities before children that reference them), not alphabetical order. Do not sort these.

## 2 — `import` statements must be in alphabetical order by variable name

Within each group (see rule 3), sort imports A–Z by the local name. Named imports (destructured) are an exception: place them after default imports within the same group, then sort named imports alphabetically by file name (not by the variable names being imported).

```js
// Bad
import path from 'path'
import crypto from 'node:crypto'

// Good
import crypto from 'node:crypto'
import path from 'path'

// Bad — named imports mixed with default imports
import FetchSessionDal from '../../../../dal/fetch-session.dal.js'
import { flashNotification } from '../../../../lib/general.lib.js'
import { formatValidationResult } from '../../../../presenters/base.presenter.js'
import PermissionsPresenter from '../../../../presenters/users/internal/setup/permissions.presenter.js'

// Good — default imports first (sorted by variable name), then named imports (sorted by file name)
import FetchSessionDal from '../../../../dal/fetch-session.dal.js'
import PermissionsPresenter from '../../../../presenters/users/internal/setup/permissions.presenter.js'
import { formatValidationResult } from '../../../../presenters/base.presenter.js'
import { flashNotification } from '../../../../lib/general.lib.js'
```

## 3 — External packages and internal dependencies must be in separate groups

Group 1 is external packages (from `node_modules`). Group 2 is internal dependencies (relative paths). Separate the groups with a blank line. Each group is sorted alphabetically (rule 2).

```js
// Bad — external packages and internal dependencies mixed
import { readFileSync } from 'fs'
import coreLicenceScenario from './scenarios/core-licence.scenario.js'
import { request } from '@playwright/test'

// Good — two groups, each in alpha order
import { request } from '@playwright/test'
import { readFileSync } from 'fs'

import coreLicenceScenario from './scenarios/core-licence.scenario.js'
```

## 4 — Blank line after variable declarations before the first statement

A blank line must separate variable declarations from the first non-declaration statement. When mixing `const` and `let` declarations, each declaration kind must also be separated from the next by a blank line.

```js
// Bad — no blank line before statement
const username = 'alan.thegreat@gmail.com'
await page.goto('/login')

// Good — blank line before statement
const username = 'alan.thegreat@gmail.com'

await page.goto('/login')

// Bad — mixed const/let with no blank lines between kinds
const username = 'alan.thegreat@gmail.com'
let attempts = 0
await page.goto('/login')

// Good — blank line between const and let, and before statement
const username = 'alan.thegreat@gmail.com'

let attempts = 0

await page.goto('/login')
```
