import resetWorld from 'water-abstraction-engine/cli/world/reset.world.js'

/**
 * Playwright global setup: reset the world before any spec runs
 */
export default async function worldSetup() {
  await resetWorld()
}
