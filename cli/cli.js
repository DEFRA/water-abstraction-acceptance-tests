/**
 * Interactive CLI to seed the local database with test scenarios. See cli/README.md. Run with `npm run cli`
 */

import { exit } from './src/cli.lib.js'
import { searchScenariosPrompt } from './src/search-scenarios.prompt.js'
import { selectTaskPrompt } from './src/select-task.prompt.js'
import { tearDown } from './src/tear-down.lib.js'
import { listScenarios, loadScenario } from './src/scenarios.lib.js'
import { logError, logInfo } from './src/log.lib.js'

const escapeAbortController = new AbortController()

// Reassigned after each use — an AbortController can't be un-aborted, so the next prompt needs a fresh one
let tabAbortController = new AbortController()

async function run() {
  const scenarios = await listScenarios()

  let selectedScenario

  while (true) {
    try {
      selectedScenario = await searchScenariosPrompt(
        scenarios,
        selectedScenario,
        escapeAbortController.signal,
        tabAbortController.signal
      )

      await tearDown()

      await loadScenario(selectedScenario)
    } catch (err) {
      if (tabAbortController.signal.aborted) {
        tabAbortController = new AbortController()

        await selectTaskPrompt(scenarios, escapeAbortController.signal, tabAbortController.signal)

        tabAbortController = new AbortController()

        continue
      }

      // ExitPromptError comes from a real Ctrl+C (SIGINT), distinct from our own Escape/Tab AbortController signals
      if (escapeAbortController.signal.aborted || err.name === 'ExitPromptError') {
        exit()
      } else {
        logError(`\nError: ${err.message}`)
        logInfo('Returning to menu... (press Escape to exit)\n')
      }
    }
  }
}

// Escape quits (from the search prompt) or backs out of the menu; Tab opens the menu
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'escape') {
    escapeAbortController.abort()
  } else if (key.name === 'tab') {
    tabAbortController.abort()
  }
})

// Entry point
await run()
