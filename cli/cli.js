/**
 * Interactive CLI to seed the local database with test scenarios. See cli/README.md. Run with `npm run cli`
 */

import { listScenarios } from './src/scenarios.lib.js'
import resetWorld from './src/world/reset.world.js'
import scenariosMenu from './src/scenarios.menu.js'
import tasksMenu from './src/tasks.menu.js'
import { logSuccess, withSpinner } from './src/log.lib.js'

const escapeAbortController = new AbortController()

// Reassigned after each use — an AbortController can't be un-aborted, so the next prompt needs a fresh one.
//
// fresh signal for the first scenariosMenu call
let tabAbortController = new AbortController()

async function run() {
  const scenarios = await listScenarios()

  let selectedScenario

  while (true) {
    selectedScenario = await scenariosMenu(
      scenarios,
      escapeAbortController.signal,
      tabAbortController.signal,
      selectedScenario
    )

    if (tabAbortController.signal.aborted) {
      // Tab just fired to open the tasks menu; reset so it can also be pressed to exit tasksMenu
      tabAbortController = new AbortController()

      await tasksMenu(escapeAbortController.signal, tabAbortController.signal)

      // tasksMenu may have aborted the signal i.e. switched back to scenarios; reset so Tab is detectable again in the
      // next scenariosMenu call
      tabAbortController = new AbortController()
    }
  }
}

async function reset() {
  try {
    await withSpinner('Resetting the world...', resetWorld)
    logSuccess('World reset')
    process.exit(0)
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

// `--reset` skips the menus, resets the world and exits
if (process.argv.includes('--reset')) {
  await reset()
}

// Escape quits; Tab opens the tasks menu
process.stdin.on('keypress', (_str, key) => {
  if (key.name === 'escape') {
    escapeAbortController.abort()
  } else if (key.name === 'tab') {
    tabAbortController.abort()
  }
})

// Entry point
await run()
