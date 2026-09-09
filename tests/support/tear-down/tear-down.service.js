/**
 * Removes all data from the database and re seeds
 * @module TearDownService
 */

import { clean } from 'water-abstraction-engine/test/database.js'

/**
 * Removes all data from the database and re seeds
 */
export default async function tearDownService() {
  await clean()
}
