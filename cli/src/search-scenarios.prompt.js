import { search } from '@inquirer/prompts'

import { cliTheme } from './theme.lib.js'
import { printBanner } from './log.lib.js'

/**
 * Show a searchable scenario picker in the terminal
 *
 * @param {object[]} scenarios - the full list of scenarios to search
 * @param {object} [defaultValue] - the previously selected scenario, highlighted by default
 * @param {AbortSignal} signal - aborts the prompt (Escape to quit, Tab for the menu)
 * @returns {Promise<object>} the scenario the user selected
 */
export async function searchScenariosPrompt(scenarios, defaultValue, signal) {
  printBanner('Type to search')

  return search(
    {
      message: 'Search for a scenario:',
      default: defaultValue, // Highlights the last used scenario
      source: async (input) => {
        let filteredScenarios = scenarios

        if (input) {
          filteredScenarios = _findMatchingScenarios(scenarios, input)
        }

        return _presentScenarios(filteredScenarios)
      },
      theme: cliTheme('Task menu')
    },
    { signal }
  )
}

function _findMatchingScenarios(scenarios, input) {
  const query = input.toLowerCase()

  return scenarios.filter((scenario) => {
    return scenario.title.toLowerCase().includes(query) || scenario.filename.toLowerCase().includes(query)
  })
}

function _presentScenarios(filteredScenarios) {
  return filteredScenarios.map((scenario) => {
    return {
      name: scenario.title,
      value: scenario,
      description: scenario.description
    }
  })
}
