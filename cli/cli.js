/**
 * Interactive CLI to seed the local database with test scenarios. See cli/README.md. Run with `npm run cli`
 */

import { searchScenariosPrompt } from './src/search-scenarios.prompt.js'
import { selectTaskPrompt } from './src/select-task.prompt.js'
import { tearDown } from './src/tear-down.lib.js'
import { listScenarios, loadScenario } from './src/scenarios.lib.js'
import { logError, logInfo, logSuccess, logWarning, printBanner, styleBold } from './src/log.lib.js'

// Reassigned after each use — an AbortController can't be un-aborted, so the next prompt needs a fresh one
let escapeAbortController = new AbortController()
let tabAbortController = new AbortController()

async function run() {
  console.clear()

  printBanner('Type to search, or press Tab for the menu')

  const scenarios = await listScenarios()

  let selectedScenario

  while (true) {
    try {
      const signal = AbortSignal.any([escapeAbortController.signal, tabAbortController.signal])

      selectedScenario = await searchScenariosPrompt(scenarios, selectedScenario, signal)

      await tearDown()

      await loadScenario(selectedScenario)

      logSuccess(`${styleBold('Finished!')} (press Escape to exit)\n`)
    } catch (err) {
      if (tabAbortController.signal.aborted) {
        tabAbortController = new AbortController()

        const menuSignal = AbortSignal.any([escapeAbortController.signal, tabAbortController.signal])

        await selectTaskPrompt(scenarios, menuSignal, _exit)

        escapeAbortController = new AbortController()
        tabAbortController = new AbortController()

        continue
      }

      // ExitPromptError comes from a real Ctrl+C (SIGINT), distinct from our own Escape/Tab AbortController signals
      if (escapeAbortController.signal.aborted || err.name === 'ExitPromptError') {
        _exit()
      } else {
        logError(`\nError: ${err.message}`)
        logInfo('Returning to menu... (press Escape to exit)\n')
      }
    }
  }
}

/**
 * Log a goodbye message and exit the CLI
 * @private
 */
function _exit() {
  logWarning('\nGoodbye!')

  // Without this, the keypress listener below keeps stdin resumed and the process hangs after
  // "Goodbye!" instead of exiting, requiring a second Ctrl+C to force it closed
  process.stdin.removeAllListeners('keypress')
  process.exit(0)
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
