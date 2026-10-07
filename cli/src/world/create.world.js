import dataWorld from './data.world.js'
import extraWorld from './extra.world.js'
import loadService from '../../../tests/support/load/load.service.js'
import protectWorld from './protect.world.js'
import saveWorld from './save.world.js'

/**
 * Seed every scenario together as one world, after checking none of them clash, then save the data it created
 *
 * When run from the CLI (`CLI_MODE=true`) the extra world is seeded as well. It is not saved, as no spec looks it up.
 */
export default async function createWorld() {
  const scenarios = await dataWorld()

  protectWorld(scenarios)

  const worldData = Object.values(scenarios)

  if (process.env.CLI_MODE === 'true') {
    worldData.push(extraWorld())
  }

  // Each scenario only depends on its own data, so they can be loaded at the same time. The load service still inserts
  // the data within a scenario in order
  await Promise.all(worldData.map(loadService))

  await saveWorld(scenarios)
}
