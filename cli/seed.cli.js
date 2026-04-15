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

import { post } from './system.request.js'

const SCENARIOS_DIR = 'cypress/support/scenarios'
const ESCAPE_KEY_ABORT_CONTROLLER = new AbortController()

async function run () {
  const scenarios = _scenarios()

  const selectedScenario = await _selectScenario(scenarios)
  console.log(`Running: scenario ${selectedScenario}`)

  await _tearDown()

  const body = await _body(selectedScenario)

  await _load(body)

  console.log('Finished successfully')
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

async function _load (body) {
  console.log('Running: data load')

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
    message: 'Type to search scenario:',
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
  console.log('Running: tear down')

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
    console.log('\nCancelled.')
  } else {
    console.error(err)
    process.exit(1) // Standard practice to exit with failure code
  }
}
