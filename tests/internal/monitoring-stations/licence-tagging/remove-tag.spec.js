import scenarioData from '../../../support/scenarios/registered-licence-with-monitoring-station-tagged.scenario.js'
import { test, expect } from '../../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence],
  monitoringStations: [monitoringStation]
} = scenario

test.describe('Attempt to remove a tag from a monitoring station (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.environmentOfficer)
  })

  test('removes the tagged licence from the monitoring station', async ({ page }) => {
    await page.goto(`/system/monitoring-stations/${monitoringStation.id}`)

    // Confirm we are on the monitoring station page
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.catchmentName)
    await expect(page.locator('.govuk-heading-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="meta-data-grid-reference"]')).toHaveText(monitoringStation.gridReference)
    await expect(page.locator('[data-test="meta-data-wiski-id"]')).toHaveText('')
    await expect(page.locator('[data-test="meta-data-station-reference"]')).toHaveText('')

    // View the tag for the linked licence
    await page.locator('[data-test="action-0"]').getByRole('link', { name: 'View' }).click()

    // Confirm we are viewing the tag details
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('.govuk-heading-l')).toHaveText(`Details for ${licence.licenceRef}`)
    await expect(page.locator('.govuk-summary-card__title')).toContainText('Stop tag')
    await expect(page.locator('[data-test="threshold-0"]')).toHaveText('100m3/s')
    await expect(page.locator('[data-test="type-0"]')).toHaveText('Stop')
    await expect(page.locator('[data-test="linked-condition-0"]')).toHaveText('Not linked to a condition')

    // Remove the tag
    await page.locator('.govuk-summary-card__actions').getByRole('link', { name: 'Remove tag' }).click()

    // Confirm we are on the confirm tag removal page
    await expect(page.locator('.govuk-caption-l')).toHaveText(`Licence ${licence.licenceRef}`)
    await expect(page.locator('.govuk-heading-l')).toHaveText('You’re about to remove the tag for this licence')
    await expect(page.locator('.govuk-heading-m')).toHaveText('Hands off flow threshold')
    await expect(page.locator('.govuk-warning-text__text')).toContainText(
      'You will not be able to send a water abstraction alert for the licence at this restriction type and threshold.'
    )
    await expect(page.locator('[data-test="watercourse"]')).toHaveText(monitoringStation.catchmentName)
    await expect(page.locator('[data-test="station"]')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="threshold"]')).toHaveText('100m3/s')
    await expect(page.locator('[data-test="type"]')).toHaveText('Stop')
    await expect(page.locator('[data-test="linked-condition"]')).toHaveText('Not linked to a condition')

    // Confirm removal of the tag
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Confirm we are back on the monitoring station page and the tag has been removed
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText(
      `Tag removed for ${licence.licenceRef}`
    )
    await expect(page.locator('.govuk-heading-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('p.govuk-body')).toHaveText(
      'There are no licences tagged with restrictions for this monitoring station'
    )
  })
})
