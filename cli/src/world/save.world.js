import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'path'

/**
 * Write the world's scenario data to `world.json` next to this file, so the data it created can be looked up
 * later
 *
 * @param {object} scenarios - the generated data for each scenario, keyed by scenario name
 */
export default async function saveWorld(scenarios) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const WORLD_FILE = path.resolve(__dirname, 'world.json')

  await fs.writeFile(WORLD_FILE, JSON.stringify(scenarios, null, 2), 'utf-8')
}
