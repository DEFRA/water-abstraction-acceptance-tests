import scenarioData from '../../../support/scenarios/registered-licence-with-monitoring-station-tagged.scenario.js'
import { test, expect } from '../../../support/fixtures.js'

const scenario = scenarioData()

const {
  monitoringStations: [monitoringStation]
} = scenario

test.describe('Attempt set up of abstraction alert with no thresholds (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.environmentOfficer)
  })

  test('will not create a Reduce alert as there are no thresholds with the reduce restriction type', async ({
    page
  }) => {
    await page.goto(`/system/monitoring-stations/${monitoringStation.id}`)

    // Confirm we are on the monitoring station page
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.catchmentName)
    await expect(page.locator('.govuk-heading-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="meta-data-grid-reference"]')).toHaveText(monitoringStation.gridReference)
    await expect(page.locator('[data-test="meta-data-wiski-id"]')).toHaveText('')
    await expect(page.locator('[data-test="meta-data-station-reference"]')).toHaveText('')

    // Select Create a water abstraction alert
    await page.getByRole('button', { name: 'Create a water abstraction alert' }).click()

    // Confirm we are on the Select the type of alert you need to send page
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('.govuk-heading-l')).toContainText('Select the type of alert you need to send')

    // Select the reduce alert type and continue
    await page.locator('input[type="radio"][value="reduce"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm that a validation error has been generated
    await expect(page.locator('.govuk-error-summary')).toContainText('There is a problem')
    await expect(page.locator('.govuk-error-summary')).toContainText(
      'There are no thresholds with the reduce restriction type, Select the type of alert you need to send'
    )
    await expect(page.locator('#alertType-error')).toContainText(
      'There are no thresholds with the reduce restriction type, Select the type of alert you need to send'
    )
  })
})
