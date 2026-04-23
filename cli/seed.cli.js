/**
 * Load test scenarios for use with manual exploratory testing
 *
 * This script provides an interactive CLI to seed the local database with specific test scenarios. It automates the
 * "Tear Down" and "Data Load" cycles.
 *
 * To run this script use
 *
 * ```bash
 * npm run cli:seed
 * ```
 *
 * > Defined in `package.json` as `"cli:seed": "node cli/seed.cli.js"`
 *
 * @module SeedCLI
 */

import fs from 'fs'
import path from 'path'
import { search } from '@inquirer/prompts'

import { logError, logInfo, logSuccess, logWarning, styleBold } from './log.lib.js'
import { get, post } from './system.request.js'

const ESCAPE_KEY_ABORT_CONTROLLER = new AbortController()
const SCENARIOS_DIR = 'cypress/support/scenarios'

async function run () {
  logInfo(styleBold('Use this tool to load test scenarios for manual exploratory testing\n'))

  const currentServiceData = await _currentServiceData()

  const scenarios = _scenarios()

  let selectedScenario

  // Persistent loop until user aborts
  while (true) {
    try {
      selectedScenario = await _prompt(scenarios, selectedScenario)

      await _tearDown()

      const body = await _body(selectedScenario, currentServiceData)

      await _load(selectedScenario, body)

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
}

/**
 * Fetch 'current' data for the service
 *
 * This is information like the current financial year, summer and winter
 * cycles, and billing periods.
 *
 * Some scenarios need this information to dynamically generate the data they
 * will seed.
 *
 * @private
 */
async function _currentServiceData () {
  const response = await get('/system/data/dates')

  return response.json()
}

/**
 * Extract data from the scenario file
 * @private
 */
async function _body (selectedScenario, currentServiceData) {
  // 1. Get the absolute path
  const scenarioPath = path.resolve(SCENARIOS_DIR, `${selectedScenario}.js`)

  // 2. Use dynamic import() to load the ESM scenario file.
  // This allows the scenario to 'import' other ESM files (like licence.js)
  const scenarioModule = await import(`file://${scenarioPath}`)

  // 3. Handle the export (ESM uses .default)
  const getBody = scenarioModule.default || scenarioModule

  if (typeof getBody !== 'function') {
    throw new Error(`The file "${selectedScenario}.js" must have an "export default" function.`)
  }

  // 4. Call the function here to get the actual data object
  return await getBody(currentServiceData)
}

/**
 * Send scenario data to the water-abstraction-system for loading
 * @private
 */
async function _load (selectedScenario, body) {
  logInfo(`Loading scenario ${styleBold(selectedScenario)}...`)

  await post('/system/data/load', body)
}

/**
 * Generate the CLI prompt the user will use to select the scenario to load
 *
 * {@link https://github.com/SBoudrias/Inquirer.js|@inquirer/prompts} is the package we use to create the CLI prompt. It
 * has a lot of different prompt types, but we use the `search` type which gives us a nice searchable dropdown in the
 * terminal.
 *
 * We have to provide 2 args to `search()`. The first is 'options' which defines how the prompt looks and behaves. It
 * must contain a `message` which is the text shown to the user when asking the question, and a `source` function which
 * is called each time the user types to get the list of options to show in the dropdown.
 *
 * The second is an object that can be used to pass in an `AbortSignal`, which we use to allow the user to cancel the
 * prompt by pressing the Escape key.
 *
 * The function we provide to `source` filters the list of scenarios based on the user's input, and then maps them into
 * the format expected by `search()`.
 *
 * Normally we would declare the function elsewhere to simplify things in _`prompt()`. However, we take advantage of a
 * closure here so that `source` has access to the `scenarios` variable without us having to pass it in as an argument.
 *
 * If we didn't, we would either have to fetch all the possible scenarios on each key press, or declare it globally
 * within the module.
 *
 * @private
 */
async function _prompt (scenarios, defaultValue) {
  return search(
    {
      message: 'Type to search scenarios:',
      default: defaultValue, // Highlights the last used scenario
      source: async (input) => {
        let filteredScenarios = scenarios

        if (input) {
          filteredScenarios = scenarios.filter((scenario) => {
            return scenario.toLowerCase().includes(input.toLowerCase())
          })
        }

        return filteredScenarios
          .map((scenario) => {
            return { name: scenario, value: scenario }
          })
      }
    },
    { signal: ESCAPE_KEY_ABORT_CONTROLLER.signal }
  )
}

/**
 * Get list of available scenario files
 * @private
 */
function _scenarios () {
  return fs.readdirSync(SCENARIOS_DIR)
    .filter((file) => {
      return file.endsWith('.js')
    })
    .map((file) => {
      return file.replace('.js', '')
    })
}

/**
 * Clear existing data
 * @private
 */
async function _tearDown () {
  logInfo('Tearing down previous scenario data...')

  await post('/system/data/tear-down')
}

/**
 * Global keypress listener for the Escape key signal
 */
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'escape') {
    ESCAPE_KEY_ABORT_CONTROLLER.abort()
  }
})

// Entry point
await run()
