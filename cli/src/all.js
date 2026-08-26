import { loadScenario } from './scenarios.js'
import { logInfo, styleBold } from './log.lib.js'

const ALL_SCENARIOS = ['licence.scenario', 'registered-licence.scenario']

/**
 * Seed a curated set of scenarios, one after another. Does not tear down first
 *
 * @param {object[]} scenarios - the full list of available scenarios, as returned by listScenarios()
 */
export async function seedAll(scenarios) {
  logInfo(styleBold('Seeding all scenarios...\n'))

  for (const filename of ALL_SCENARIOS) {
    const scenario = scenarios.find((availableScenario) => {
      return availableScenario.filename === filename
    })

    if (!scenario) {
      throw new Error(`Could not find scenario "${filename}.js" in tests/support/scenarios`)
    }

    await loadScenario(scenario)
  }
}
