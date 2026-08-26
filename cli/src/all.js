import { loadScenario } from './scenarios.js'

/**
 * Seed a curated set of scenarios, one after another. Does not tear down first
 *
 * @param {object[]} scenarios - the full list of available scenarios, as returned by listScenarios()
 */
export async function seedAll(scenarios) {
  for (const scenario of scenarios) {
    try {
      await loadScenario(scenario)
    } catch (error) {
      throw new Error(`Failed to load scenario - "${scenario}": \n ${error.message}`, { cause: error })
    }
  }
}
