import dataWorld from './data.world.js'
import loadService from '../../../tests/support/load/load.service.js'
import protectWorld from './protect.world.js'
import saveWorld from './save.world.js'

/**
 * Seed a curated set of scenarios, one after another. Does not tear down first
 */
export default async function createWorld() {
  const scenarios = await dataWorld()

  protectWorld(scenarios)

  for (const scenarioData of Object.values(scenarios)) {
    await loadService(scenarioData)
  }

  await saveWorld(scenarios)
}
