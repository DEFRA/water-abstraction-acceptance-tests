import { faker } from 'water-abstraction-engine/test/faker.js'

import dataWorld from './data.world.js'
import loadService from '../../../tests/support/load/load.service.js'
import populateWorld from './populate.world.js'
import protectWorld from './protect.world.js'
import saveWorld from './save.world.js'

const SEED = 4

/**
 * Seed every scenario together as one world, after checking none of them clash, then save the data it created
 *
 * The engine's shared Faker instance is seeded first, so the data it generates is the same on every machine.
 *
 * When run from the CLI (`CLI_MODE=true`) the world is populated with more data as well. That data is not saved, as no
 * spec looks it up.
 */
export default async function createWorld() {
  faker.seed(SEED)

  const scenarios = await dataWorld()

  protectWorld(scenarios)

  const worldData = Object.values(scenarios)

  if (process.env.CLI_MODE === 'true') {
    worldData.push(populateWorld())
  }

  // Each scenario only depends on its own data, so they can be loaded at the same time. The load service still inserts
  // the data within a scenario in order
  await Promise.all(worldData.map(loadService))

  await saveWorld(scenarios)
}
