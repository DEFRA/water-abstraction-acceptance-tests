import scenarioData from '../../support/scenarios/licence-with-to-set-up-workflow-and-bill-run.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Deleting a licence from workflow (internal)', { tag: '@supplementaryBilling' }, () => {
  let licence

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      licences: [scenarioLicence]
    } = scenario

    licence = scenarioLicence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('flags the licence for supplementary billing', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/summary`)

    await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
    await expect(page.locator('.govuk-notification-banner__content')).not.toBeVisible()
    await page.getByRole('link', { name: 'Manage', exact: true }).click()
    await page.getByRole('link', { name: 'Check licences in workflow' }).click()

    await expect(page.locator('h1').first()).toContainText('Workflow')
    await expect(page.getByRole('tab', { name: 'To set up' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Review charge information' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Change request' })).toBeVisible()
    await page.getByRole('tab', { name: 'To set up' }).click()
    const toSetUpTable = page.locator('table.govuk-table')
    const toSetUpRow = toSetUpTable.getByRole('row', { name: licence.licenceRef })
    await toSetUpRow.getByRole('link', { name: 'Remove' }).click()

    await expect(page.locator('h1')).toContainText("You're about to remove this licence from the workflow")
    await expect(page.getByRole('cell', { name: licence.licenceRef })).toBeVisible()
    await page.getByRole('button', { name: 'Remove' }).click()

    await expect(page.getByText('There are no licences that require charge information setup.')).toBeVisible()

    // Search for the licence that was removed
    await page.getByRole('link', { name: 'Search' }).click()
    await page.locator('#query').fill(licence.licenceRef)
    await page.locator('#search-button').click()
    await page.locator('.searchresult-row', { hasText: licence.licenceRef }).getByRole('link').click()

    // Navigate to back to the Licence summary page
    await page.locator('nav a', { hasText: 'Licence summary' }).click()

    // Check the licence has been flagged for supplementary billing
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next two-part tariff supplementary bill run and the supplementary bill run.'
    )
  })
})

// Chnage some statsu to setup or not
