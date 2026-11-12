/**
 * Lists the scenario files and loads a selected scenario into the database
 *
 * @module ScenariosLib
 */

import fs from 'fs'
import path from 'path'

import loadService from '../../tests/support/load/load.service.js'

const SCENARIOS_DIR = 'tests/support/scenarios'

/**
 * List the available scenario files, each with its title and description
 *
 * @returns {Promise<object[]>} the scenarios
 */
export async function listScenarios() {
  const scenarios = []

  const filenames = fs
    .readdirSync(SCENARIOS_DIR)
    .filter((file) => {
      return file.endsWith('.js')
    })
    .map((file) => {
      return file.replace('.js', '')
    })

  for (const filename of filenames) {
    const scenarioPath = path.resolve(SCENARIOS_DIR, `${filename}.js`)
    const mod = await import(`file://${scenarioPath}`)

    scenarios.push({
      description: mod.description ?? '',
      filename,
      path: scenarioPath,
      title: mod.title ?? filename
    })
  }

  return scenarios
}

/**
 * Load a scenario's data via the load service
 *
 * @param {object} selectedScenario - the scenario chosen from the CLI prompt
 */
export async function loadScenario(selectedScenario) {
  const scenarioPath = selectedScenario.path

  // Dynamic import() (rather than a static import) so the scenario, an ESM file that may itself import
  // other files like licence.js, can be loaded by path at runtime
  const scenarioModule = await import(`file://${scenarioPath}`)
  const getBody = scenarioModule.default || scenarioModule

  if (typeof getBody !== 'function') {
    throw new Error(`The file "${selectedScenario.filename}.js" must have an "export default" function.`)
  }

  const body = await getBody()

  await loadService(body)
}
