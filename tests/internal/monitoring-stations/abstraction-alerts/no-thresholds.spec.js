import { monitoringStations } from '../../../support/default-values.js'
import { expect, test } from '../../../support/fixtures.js'

const monitoringStation = monitoringStations.SECOND

test.describe('Attempt set up of abstraction alert with no thresholds (internal)', () => {
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-with-monitoring-station-tagged')

    user = scenario.users[0]
  })

  test.beforeEach(async ({ login }) => {
    await login(user)
  })

  test('will not create a Reduce alert as there are no thresholds with the reduce restriction type', async ({
    page
  }) => {
    await page.goto(`/system/monitoring-stations/${monitoringStation.id}`)

    await expect(page.locator('h1')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="meta-data-grid-reference"]')).toHaveText(monitoringStation.gridReference)
    await expect(page.locator('[data-test="meta-data-wiski-id"]')).toHaveText(monitoringStation.wiskiId)
    await expect(page.locator('[data-test="meta-data-station-reference"]')).toHaveText(
      monitoringStation.stationReference
    )

    await page.getByRole('button', { name: 'Create a water abstraction alert' }).click()

    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('h1')).toContainText('Select the type of alert you need to send')

    await page.locator('input[type="radio"][value="reduce"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.govuk-error-summary')).toContainText('There is a problem')
    await expect(page.locator('.govuk-error-summary')).toContainText(
      'There are no thresholds with the reduce restriction type, Select the type of alert you need to send'
    )
    await expect(page.locator('#alertType-error')).toContainText(
      'There are no thresholds with the reduce restriction type, Select the type of alert you need to send'
    )
  })
})
