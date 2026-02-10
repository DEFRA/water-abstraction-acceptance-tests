import fs from 'fs'
import { search } from '@inquirer/prompts'
import { execa } from 'execa'

const SCENARIOS_DIR = 'cypress/support/scenarios'
const SEED_RUNNER = 'cypress/e2e/seed-runner.cy.js'

async function run () {
  const scenarios = fs.readdirSync(SCENARIOS_DIR)
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''))

  const selected = await search({
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

  console.log(`\n Running scenario: ${selected}\n`)

  try {
    // Note: I matched the env var name 'SCENARIO' from your last snippet
    await execa('npm', ['run', 'cy:run:local', '--', '--spec', SEED_RUNNER], {
      stdio: 'inherit',
      env: {
        ...process.env,
        CYPRESS_SCENARIO: selected
      }
    })
  } catch (error) {
    process.exit(1)
  }
}

run().catch((err) => {
  if (err.name === 'ExitPromptError') {
    console.log('\nCancelled.')
  } else {
    console.error(err)
  }
})
