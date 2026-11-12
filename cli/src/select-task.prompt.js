/**
 * The task picker prompt used by the CLI
 *
 * @module SelectTaskPrompt
 */

import { select } from '@inquirer/prompts'

import { cliTheme } from './theme.lib.js'

/**
 * Show the CLI's menu (seed all, tear down) and run whichever entry the user selects
 *
 * Tab returns quietly to the search prompt. Escape and Ctrl+C both exit the CLI.
 *
 * @param {object[]} choices - the list of available tasks to choose from
 * @param {AbortSignal} escapeSignal - aborted when Escape is pressed; exits the CLI
 * @param {AbortSignal} tabSignal - aborted when Tab is pressed; switches to the scenarios menu
 *
 * @returns {Promise<string>} the task the user selected
 */
export default async function selectTaskPrompt(choices, escapeSignal, tabSignal) {
  return select(
    {
      choices,
      message: 'Select a task:',
      theme: cliTheme('Scenarios menu')
    },
    { signal: AbortSignal.any([escapeSignal, tabSignal]) }
  )
}
