// Define a scenario map to ensure Webpack includes the files
const scenarioImportMap = {
  'cancelling-charge-version': () => import('../support/scenarios/cancelling-charge-version.js'),
  'delete-licence-from-workflow': () => import('../support/scenarios/delete-licence-from-workflow.js'),
  'editing-return': () => import('../support/scenarios/editing-return.js'),
  'external-return-statuses': () => import('../support/scenarios/external-return-statuses.js'),
  'external-return-submission': () => import('../support/scenarios/external-return-submission.js'),
  'external-user-only': () => import('../support/scenarios/external-user-only.js'),
  'internal-return-submission': () => import('../support/scenarios/internal-return-submission.js'),
  'internal-user-only': () => import('../support/scenarios/internal-user-only.js'),
  'licence-in-workflow': () => import('../support/scenarios/licence-in-workflow.js'),
  'licence-with-agreement': () => import('../support/scenarios/licence-with-agreement.js'),
  'licence-with-presroc-chg-ver': () => import('../support/scenarios/licence-with-presroc-chg-ver.js'),
  'monitoring-station-tagged': () => import('../support/scenarios/monitoring-station-tagged.js'),
  'monitoring-station-untagged': () => import('../support/scenarios/monitoring-station-untagged.js'),
  'one-licence-only': () => import('../support/scenarios/one-licence-only.js'),
  'one-return-requirement': () => import('../support/scenarios/one-return-requirement.js'),
  'one-return-requirement-four-return-logs': () => import('../support/scenarios/one-return-requirement-four-return-logs.js'),
  'one-return-requirement-quarterly-returns': () => import('../support/scenarios/one-return-requirement-quarterly-returns.js'),
  'one-return-requirement-two-points': () => import('../support/scenarios/one-return-requirement-two-points.js'),
  'return-notices': () => import('../support/scenarios/return-notices.js'),
  'return-statuses': () => import('../support/scenarios/return-statuses.js'),
  'sharing-access': () => import('../support/scenarios/sharing-access.js'),
  'two-part-tariff-supplementary': () => import('../support/scenarios/two-part-tariff-supplementary.js'),
  'two-return-requirements-three-return-logs': () => import('../support/scenarios/two-return-requirements-three-return-logs.js'),
  'two-return-requirements-two-return-logs': () => import('../support/scenarios/two-return-requirements-two-return-logs.js'),
  'two-return-requirements-with-points': () => import('../support/scenarios/two-return-requirements-with-points.js')
}

describe('Seed Tool', () => {
  it('seeds the data', () => {
    // Get the scenario name from Cypress env
    const scenarioName = Cypress.env('SCENARIO')

    // Stop early if no scenario was provided
    if (!scenarioName) throw new Error('SCENARIO env var is missing')

    // Show which scenario is being used in the Cypress logs
    cy.log(`Loading scenario: ${scenarioName}`)

    // Import the selected scenario module, then seed it
    cy.then(() => {
      // Find the import function for this scenario
      const importFn = scenarioImportMap[scenarioName]

      // Error if the scenario name isn't supported
      if (!importFn) throw new Error(`Unknown scenario: ${scenarioName}`)

      // Dynamically import the scenario file
      return importFn()
    }).then((module) => {
      // Build the data from the scenario's default export
      const scenarioData = module.default()

      // Reset the current state (test data only), then load the new data
      cy.tearDown()

      // Load the scenario data
      cy.load(scenarioData)
    })
  })
})
