/**
 * Interactive CLI to seed the local database with test scenarios. See cli/README.md. Run with `npm run cli`
 */

import { listScenarios } from './src/scenarios.lib.js'
import scenariosMenu from './src/scenarios.menu.js'
import tasksMenu from './src/tasks.menu.js'

const escapeAbortController = new AbortController()

// Reassigned after each use — an AbortController can't be un-aborted, so the next prompt needs a fresh one
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
      tabAbortController = new AbortController()

      await tasksMenu(scenarios, escapeAbortController.signal, tabAbortController.signal)

      tabAbortController = new AbortController()
    }
  }
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
