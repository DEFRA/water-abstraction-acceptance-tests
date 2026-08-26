/**
 * Interactive CLI to seed the local database with test scenarios. See cli/README.md. Run with `npm run cli`
 */

import { searchScenarios } from './src/search.lib.js'
import tearDownService from '../tests/support/tear-down/tear-down.service.js'
import { listScenarios, loadScenario } from './src/scenarios.js'
import { logError, logInfo, logSuccess, logWarning, styleBold } from './src/log.lib.js'

const ESCAPE_KEY_ABORT_CONTROLLER = new AbortController()

async function run() {
  logInfo(styleBold('Use this tool to load test scenarios for manual exploratory testing\n'))

  const scenarios = await listScenarios()

  let selectedScenario

  while (true) {
    try {
      selectedScenario = await searchScenarios(scenarios, selectedScenario, ESCAPE_KEY_ABORT_CONTROLLER)

      logInfo('Tearing down previous scenario data...')

      await tearDownService()

      await loadScenario(selectedScenario)

      logSuccess(`${styleBold('Finished!')} (press Escape to exit)\n`)
    } catch (err) {
      // Handle exit signals from Inquirer
      if (['AbortPromptError', 'ExitPromptError'].includes(err.name)) {
        logWarning('\nGoodbye!')
        break
      } else {
        // Log the error but stay in the loop so the user can try again
        logError(`\nError: ${err.message}`)
        logInfo('Returning to menu... (press Escape to exit)\n')
      }
    }
  }

  // Without this, the keypress listener below keeps stdin resumed and the process hangs after
  // "Goodbye!" instead of exiting, requiring a second Ctrl+C to force it closed
  process.stdin.removeAllListeners('keypress')
  process.exit(0)
}

// Escape aborts whichever prompt is currently awaiting ESCAPE_KEY_ABORT_CONTROLLER's signal
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'escape') {
    ESCAPE_KEY_ABORT_CONTROLLER.abort()
  }
})

// Entry point
await run()
