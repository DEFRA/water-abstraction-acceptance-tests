/**
 * The tasks the CLI can run, such as seeding all scenarios or tearing down
 *
 * @module TasksLib
 */

import tearDownService from '../../tests/support/tear-down/tear-down.service.js'
import { loadScenario } from './scenarios.lib.js'

/**
 * Seed a curated set of scenarios, one after another. Does not tear down first
 *
 * @param {object[]} scenarios - the full list of available scenarios, as returned by listScenarios()
 */
export async function seedAll(scenarios) {
  for (const scenario of scenarios) {
    await loadScenario(scenario)
  }
}

/**
 * Tear down all test data. Does not load anything afterwards
 */
export async function tearDown() {
  await tearDownService()
}
