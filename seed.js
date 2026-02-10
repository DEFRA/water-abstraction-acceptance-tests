/**
 * DATABASE SEEDER / SCENARIO LOADER
 *
 * PURPOSE:
 * This script provides an interactive CLI to seed the local database with specific
 * test scenarios. It automates the "Tear Down" and "Data Load" cycles.
 *
 * USAGE:
 * To run this script without Node.js emitting ESM interop warnings:
 * 👉 npm run seed
 * (Defined in package.json as: "seed": "node --no-warnings seed.js")
 *
 * * MODULE ARCHITECTURE (CommonJS vs ES6):
 * This script is written in CommonJS (using 'require') to maintain compatibility
 * with standard Node.js execution environments without requiring "type": "module"
 * in the root package.json.
 * * However, the scenarios being loaded use ES6 Modules (ESM) to support modern
 * syntax and nested imports. To bridge this gap:
 * 1. We use dynamic `import()`— which is asynchronous and allowed in CJS.
 * 2. We explicitly use the `file://` protocol for absolute path resolution.
 * 3. We access the `.default` property to extract the exported scenario function.
 *
 * SUPPRESSING WARNINGS:
 * Because these scenarios are ESM files inside a CommonJS project, Node.js emits
 * a [MODULE_TYPELESS_PACKAGE_JSON] warning. We use the --no-warnings flag in
 * the npm script to suppress this and keep the CLI output clean.
 */

const fs = require('fs')
const path = require('path')
const prompts = require('@inquirer/prompts')

const SCENARIOS_DIR = 'cypress/support/scenarios'
const ENVS_DIR = 'environments'

async function run () {
  const env = await getEnvironment()

  console.log(`\n Selected ${env.name} environment \n`)

  const scenarios = fs.readdirSync(SCENARIOS_DIR)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''))

  const selected = await prompts.search({
    message: 'Type to search scenario:',
    source: async (input) => {
      if (!input) {
        return scenarios.map(s => ({ name: s, value: s }))
      }
      return scenarios
        .filter(s => s.toLowerCase().includes(input.toLowerCase()))
        .map(s => ({ name: s, value: s }))
    }
  })

  console.log(`Running scenario: ${selected}`)

  try {
    const body = await _body(selected)

    console.log('Running tear down')
    await fetch(`${env.config.baseUrl}/system/data/tear-down`, { method: 'POST' })

    console.log('Running data load')
    await fetch(`${env.config.baseUrl}/system/data/load`, {
      method: 'POST',
      headers: {
        'User-Agent': 'undici-stream-example',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

/**
 * Loads available environment files and prompts the user to select one.
 * @returns {Promise<{ name: string, baseUrl: string }>}
 */
async function getEnvironment () {
  const envFiles = fs.readdirSync(ENVS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''))

  if (envFiles.length === 0) {
    throw new Error(`No environment files found in /${ENVS_DIR}`)
  }

  // Sort: push 'local' to index 0, others follow alphabetically
  const sortedEnvs = envFiles.sort((a, b) => {
    if (a === 'local') return -1
    if (b === 'local') return 1
    return a.localeCompare(b)
  })

  const selected = await prompts.select({
    message: 'Select environment:',
    choices: sortedEnvs.map(e => ({ name: e, value: e }))
  })

  const configPath = path.join(process.cwd(), ENVS_DIR, `${selected}.json`)
  const fileContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  return {
    name: selected,
    ...fileContent
  }
}

async function _body (selected) {
  // 1. Get the absolute path
  const scenarioPath = path.resolve(SCENARIOS_DIR, `${selected}.js`)

  // 2. Use dynamic import() to load the ESM scenario file.
  // This allows the scenario to 'import' other ESM files (like licence.js)
  const scenarioModule = await import(`file://${scenarioPath}`)

  // 3. Handle the export (ESM uses .default)
  const getBody = scenarioModule.default || scenarioModule

  if (typeof getBody !== 'function') {
    throw new Error(`The file "${selected}.js" must have an "export default" function.`)
  }

  // 4. Call the function here to get the actual data object
  return await getBody()
}

run().catch((err) => {
  if (err.name === 'ExitPromptError') {
    console.log('\nCancelled.')
  } else {
    console.error(err)
  }
})
