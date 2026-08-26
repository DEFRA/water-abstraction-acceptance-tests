import { search } from '@inquirer/prompts'

/**
 * Show a searchable scenario picker in the terminal
 *
 * @param {object[]} scenarios - the full list of scenarios to search
 * @param {object} [defaultValue] - the previously selected scenario, highlighted by default
 * @param {AbortController} ESCAPE_KEY_ABORT_CONTROLLER - aborts the prompt when Escape is pressed
 * @returns {Promise<object>} the scenario the user selected
 */
export async function searchScenarios(scenarios, defaultValue, ESCAPE_KEY_ABORT_CONTROLLER) {
  return search(
    {
      message: 'Type to search scenarios:',
      default: defaultValue, // Highlights the last used scenario
      source: async (input) => {
        let filteredScenarios = scenarios

        if (input) {
          filteredScenarios = _findMatchingScenarios(scenarios, input)
        }

        return _presentScenarios(filteredScenarios)
      }
    },
    { signal: ESCAPE_KEY_ABORT_CONTROLLER.signal }
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
