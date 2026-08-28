import { select } from '@inquirer/prompts'

import { cliTheme } from './theme.lib.js'
import { exit } from './cli.lib.js'
import { seedAll } from './seed-all.lib.js'
import { tearDown } from './tear-down.lib.js'
import { logError, printBanner } from './log.lib.js'

const MENU_ITEMS = {
  SEED_ALL: 'seed-all',
  TEAR_DOWN: 'tear-down'
}

/**
 * Show the CLI's menu (seed all, tear down) and run whichever entry the user selects
 *
 * Tab returns quietly to the search prompt. Escape and Ctrl+C both exit the CLI.
 *
 * @param {object[]} scenarios - the full list of available scenarios, as returned by listScenarios()
 * @param {AbortSignal} escapeSignal - aborted when Escape is pressed; exits the CLI
 * @param {AbortSignal} tabSignal - aborted when Tab is pressed; switches to the scenarios menu
 */
export async function selectTaskPrompt(scenarios, escapeSignal, tabSignal) {
  printBanner('Select a task')

  try {
    const selected = await select(
      {
        message: 'Select a task:',
        choices: [
          { name: 'Seed all scenarios', value: MENU_ITEMS.SEED_ALL },
          { name: 'Tear down', value: MENU_ITEMS.TEAR_DOWN }
        ],
        theme: cliTheme('Scenarios menu')
      },
      { signal: AbortSignal.any([escapeSignal, tabSignal]) }
    )

    if (selected === MENU_ITEMS.SEED_ALL) {
      await seedAll(scenarios)
    } else {
      await tearDown()
    }
  } catch (err) {
    if (tabSignal.aborted) {
      return
    }

    if (escapeSignal.aborted || err.name === 'ExitPromptError') {
      exit()
      return
    }

    logError(`\nError: ${err.message}`)
  }
}
