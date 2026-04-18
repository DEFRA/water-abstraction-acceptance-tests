/**
 * Load test scenarios for use with manual exploratory testing
 *
 * This script provides an interactive CLI to seed the local database with specific test scenarios. It automates the
 * "Tear Down" and "Data Load" cycles.
 *
 * To run this script without Node.js emitting ESM interop warnings use
 *
 * ```bash
 * npm run seed
 * ```
 *
 * > Defined in `package.json` as `"seed": "node cli/seed.cli.js"`
 *
 * @module SeedCLI
 */

import fs from 'fs'
import path from 'path'
import { search } from '@inquirer/prompts'

import { logError, logInfo, logSuccess, logWarning, styleBold } from './log.lib.js'
import { post } from './system.request.js'

const SCENARIOS_DIR = 'cypress/support/scenarios'
const ESCAPE_KEY_ABORT_CONTROLLER = new AbortController()

async function run () {
  logInfo(styleBold('Use this tool to load test scenarios for manual exploratory testing\n'))

  const scenarios = _scenarios()

  const selectedScenario = await _selectScenario(scenarios)

  await _tearDown()

  const body = await _body(selectedScenario)

  await _load(selectedScenario, body)

  logSuccess('Finished!')
}

async function _body (selectedScenario) {
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
  return await getBody()
}

async function _load (selectedScenario, body) {
  logInfo(`Loading scenario ${styleBold(selectedScenario)}...`)

  await post('/system/data/load', body)
}

function _scenarios () {
  return fs.readdirSync(SCENARIOS_DIR)
    .filter((file) => {
      return file.endsWith('.js')
    })
    .map((file) => {
      return file.replace('.js', '')
    })
}

async function _selectScenario (scenarios) {
  return search({
    message: 'Type to search scenarios:',
    source: async (input) => {
      if (!input) {
        return scenarios.map(s => ({ name: s, value: s }))
      }
      return scenarios
        .filter(s => s.toLowerCase().includes(input.toLowerCase()))
        .map(s => ({ name: s, value: s }))
    }
  },
  { signal: ESCAPE_KEY_ABORT_CONTROLLER.signal }
  )
}

async function _tearDown () {
  logInfo('Tearing down previous scenario data...')

  await post('/system/data/tear-down')
}

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'escape') {
    ESCAPE_KEY_ABORT_CONTROLLER.abort()
  }
})

try {
  await run()
} catch (err) {
  if (['AbortPromptError', 'ExitPromptError'].includes(err.name)) {
    logWarning('\nCancelled', true)
  } else {
    logError(err.message)
    process.exit(1) // Standard practice to exit with failure code
  }
}
