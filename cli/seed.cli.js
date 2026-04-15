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

const SCENARIOS_DIR = 'cypress/support/scenarios'
const ENVS_DIR = 'environments'

async function run () {
  const env = await _environment()
  console.log(`Running: against the ${env.name} environment`)

  const scenarios = _scenarios()

  const selectedScenario = await _selectScenario(scenarios)
  console.log(`Running: scenario ${selectedScenario}`)

  await _tearDown(env.config.baseUrl)

  const body = await _body(selectedScenario)

  await _load(env.config.baseUrl, body)
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

/**
 * Loads the 'local' environment variables.
 * @returns {Promise<{ name: string, baseUrl: string }>}
 */
async function _environment () {
  const configPath = path.join(process.cwd(), ENVS_DIR, 'local.json')
  const fileContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  return {
    name: 'local',
    ...fileContent
  }
}

async function _load (baseUrl, body) {
  console.log('Running: data load')
  const response = await fetch(`${baseUrl}/system/data/load`, {
    method: 'POST',
    headers: {
      'User-Agent': 'undici-stream-example',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    console.error('Server error:', response.status, errorData)

    throw error('Data load failed')
  }
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
  })
}

async function _tearDown (baseUrl) {
  console.log('Running: tear down')

  const tearDownResponse = await fetch(`${baseUrl}/system/data/tear-down`, { method: 'POST' })

  if (!tearDownResponse.ok) {
    const errorData = await tearDownResponse.json().catch(() => null)
    console.error('Server error:', tearDownResponse.status, errorData)
    process.exit(1)
  }
}

try {
  await run()
} catch (err) {
  if (err.name === 'ExitPromptError') {
    console.log('\nCancelled.')
  } else {
    console.error(err)
    process.exit(1) // Standard practice to exit with failure code
  }
}
