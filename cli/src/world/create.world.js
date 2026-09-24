import dataWorld from './data.world.js'
import loadService from '../../../tests/support/load/load.service.js'
import protectWorld from './protect.world.js'
import saveWorld from './save.world.js'

/**
 * Seed every scenario together as one world, after checking none of them clash, then save the data it created
 */
export default async function createWorld() {
  const scenarios = await dataWorld()

  protectWorld(scenarios)

  for (const scenarioData of Object.values(scenarios)) {
    await loadService(scenarioData)
  }

  await saveWorld(scenarios)
}
