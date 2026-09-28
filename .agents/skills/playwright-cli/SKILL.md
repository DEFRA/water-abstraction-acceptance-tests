---
name: playwright-cli
description: How to use the Playwright CLI to run and debug specs against the real app, instead of guessing at locators
---

# Playwright CLI skill

## Context

When writing or fixing a Playwright spec in this repo, do not guess at selectors from memory or from a pasted HTML snippet. Run the spec against the real running app and read the actual failure output. See `.agents/skills/standards/SKILL.md` for the locator conventions to apply once you know what the real markup looks like.

## Running a spec

```
npx playwright test tests/path/to/file.spec.js --reporter=list
```

- Add `-g "test name"` to run a single test within a file
- Every run starts with the `world` setup project (`tests/world.setup.js`) resetting the world: clean DB, seed a separate copy of its scenario for each spec, write `cli/src/world/world.json`. Don't tear down or seed by hand first
- Specs run in the `parallel` project, each file against its own copy of its scenario; tests inside one file run in order because they share that copy
- Specs tagged `@sequential` run in the `sequential` project: one at a time, after `parallel` has finished. Tag a spec `@sequential` if it's external, if its journey uses legacy (non-`/system`) internal pages that call water-api, or if it does a postcode lookup (the address facade rate limits them). The legacy UIs can't handle concurrent sessions (see the comment on the `sequential` project in `playwright.config.js`). If a `parallel` test fails, Playwright skips `sequential`; run it on its own with `--project=sequential`
- `tests/internal/billing` is ignored for now (`testIgnore` in `playwright.config.js`) and isn't seeded

## Reading a failure

On failure, Playwright writes `test-results/<test-name>/error-context.md`. This contains:

- An accessibility-tree snapshot of the page **at the moment of failure** — real roles, accessible names, and structure, not what you assume the markup looks like
- The exact error and the offending line

Read this file before changing anything. In particular:

- If a locator times out or hits a strict-mode violation (multiple matches), the snapshot tells you why — e.g. two elements sharing an id, or an element with no accessible name where you expected one
- An element with no accessible name in the snapshot (e.g. `radio [ref=e63]` with no quoted name, next to siblings that do have one) is often an app bug worth flagging, not something to work around by inventing a name

## Iterating

1. Fix one locator at a time
2. Rerun only the failing spec to keep the loop fast
3. Once it passes end to end, run the whole folder to make sure adjacent specs in the same file/folder didn't share or clobber state: `npx playwright test tests/path/to/folder --reporter=list`

For anything the accessibility snapshot doesn't explain, use `--trace on` and inspect it with `npx playwright show-trace test-results/.../trace.zip`, or step through headed with `--debug`.

## Don't

- Don't write a standalone throwaway Node/Playwright script to "peek" at a page. The spec file is the script — running it via the CLI and reading `error-context.md` is faster and doesn't leave stray files in the repo
- Don't fall back to a positional selector (`:nth-child`, `.nth(n)`, `.eq(n)`) just because a role/label locator didn't resolve — that almost always means the assumed role or accessible name was wrong, not that positional indexing is the right fix. Go back to the snapshot and find what the element actually is
