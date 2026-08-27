import { select } from '@inquirer/prompts'

import { seedAll } from './seed-all.lib.js'
import { tearDown } from './tear-down.lib.js'
import { logError, logSuccess, printBanner, styleBold } from './log.lib.js'

const MENU_ITEMS = {
  SEED_ALL: 'seed-all',
  TEAR_DOWN: 'tear-down'
}

/**
 * Show the CLI's menu (seed all, tear down) and run whichever entry the user selects
 *
 * Escape or Tab (aborting `signal`) returns quietly to the search prompt. A real Ctrl+C calls `exit`
 *
 * @param {object[]} scenarios - the full list of available scenarios, as returned by listScenarios()
 * @param {AbortSignal} signal - aborts the prompt (Escape or Tab to return to the search prompt)
 * @param {Function} exit - called if the user force-closes the prompt with Ctrl+C
 */
export async function selectTaskPrompt(scenarios, signal, exit) {
  console.clear()

  printBanner('Select a task:')

  try {
    const selected = await select(
      {
        message: 'Select a task:',
        choices: [
          { name: 'Seed all scenarios', value: MENU_ITEMS.SEED_ALL },
          { name: 'Tear down', value: MENU_ITEMS.TEAR_DOWN }
        ]
      },
      { signal }
    )

    if (selected === MENU_ITEMS.SEED_ALL) {
      await seedAll(scenarios)
    } else {
      await tearDown()
    }

    logSuccess(`${styleBold('Finished!')} (press Escape to exit)\n`)
  } catch (err) {
    if (signal.aborted) {
      return
    }

    if (err.name === 'ExitPromptError') {
      exit()
      return
    }

    logError(`\nError: ${err.message}`)
  }
}
