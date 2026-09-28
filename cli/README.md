# Seed CLI

Interactively load a test scenario for manual/exploratory testing. Tears down existing test data, then loads the one you pick.

## Run it

```bash
npm run cli
```

Type to search, Enter to select, Escape to exit. Pick another scenario to reload; the picker remembers your last choice.

Press Tab for the menu: reset world (destroys then seeds every scenario together as one world) or destroy world (cleans the database and removes the saved `world.json`).

To reset the world without the menus, run `npm run cli:reset` (or `npm run cli -- --reset`). It resets, then exits.
