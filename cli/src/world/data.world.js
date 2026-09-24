import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'path'

const SCENARIOS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../tests/support/scenarios')

/**
 * Load every scenario file and generate its data, keyed by the scenario file name
 *
 * @returns {Promise<object>} the generated data for each scenario, keyed by scenario name
 */
export default async function dataWorld() {
  const scenarios = {}
  const files = await fs.readdir(SCENARIOS_DIR)
  const filenames = files.filter((file) => {
    return file.endsWith('.scenario.js')
  })

  for (const filename of filenames) {
    const scenarioPath = path.resolve(SCENARIOS_DIR, filename)
    const { default: data } = await import(`file://${scenarioPath}`)

    // Use the scenario file name without the 'scenario.js'
    const [key] = filename.split('.')

    scenarios[key] = data()
  }

  return scenarios
}
