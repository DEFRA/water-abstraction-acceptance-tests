import { exit } from './cli.lib.js'
import selectTaskPrompt from './select-task.prompt.js'
import { logError, printBanner } from './log.lib.js'
import { seedAll, tearDown } from './tasks.lib.js'

/**
 * Show the CLI's task menu and run whichever entry the user selects
 *
 * Tab returns quietly to the search prompt. Escape and Ctrl+C both exit the CLI.
 *
 * @param {object[]} scenarios - the full list of available scenarios, as returned by listScenarios()
 * @param {AbortSignal} escapeSignal - aborted when Escape is pressed; exits the CLI
 * @param {AbortSignal} tabSignal - aborted when Tab is pressed; switches to the scenarios menu
 */
export default async function tasksMenu(scenarios, escapeSignal, tabSignal) {
  printBanner('Select a task')

  try {
    const choices = [
      { name: 'Seed all scenarios', value: 'seed-all' },
      { name: 'Tear down', value: 'tear-down' }
    ]

    const selected = await selectTaskPrompt(choices, escapeSignal, tabSignal)

    await _processTask(selected, scenarios)
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

async function _processTask(selectedTask, scenarios) {
  if (selectedTask === 'seed-all') {
    await seedAll(scenarios)
  } else if (selectedTask === 'tear-down') {
    await tearDown()
  }
}
