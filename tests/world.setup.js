/**
 * Playwright global setup that resets the world before any spec runs
 *
 * @module WorldSetup
 */

import resetWorld from '../cli/src/world/reset.world.js'

/**
 * Playwright global setup: reset the world before any spec runs
 */
export default async function worldSetup() {
  await resetWorld()
}
