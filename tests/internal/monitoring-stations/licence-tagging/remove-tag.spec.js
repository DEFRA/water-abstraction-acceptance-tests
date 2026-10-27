import { monitoringStations } from 'water-abstraction-engine/cli/world/default-values.js'

import { tableRow } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

const monitoringStation = monitoringStations.SECOND

test.describe('Attempt to remove a tag from a monitoring station (internal)', () => {
  let licence
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-with-monitoring-station-tagged')

    licence = scenario.licence
    user = scenario.users[0]
  })

  test.beforeEach(async ({ login }) => {
    await login(user)
  })

  test('removes the tagged licence from the monitoring station', async ({ page }) => {
    await page.goto(`/system/monitoring-stations/${monitoringStation.id}`)

    await expect(page.locator('h1')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="meta-data-grid-reference"]')).toHaveText(monitoringStation.gridReference)
    await expect(page.locator('[data-test="meta-data-wiski-id"]')).toHaveText(monitoringStation.wiskiId)
    await expect(page.locator('[data-test="meta-data-station-reference"]')).toHaveText(
      monitoringStation.stationReference
    )

    const licenceRow = tableRow(page, licence.licenceRef)

    await licenceRow.locator('[data-test^="action-"]').getByRole('link', { name: 'View' }).click()

    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('h1')).toHaveText(`Details for ${licence.licenceRef}`)
    await expect(page.locator('.govuk-summary-card__title')).toContainText('Stop tag')
    await expect(page.locator('[data-test="threshold-0"]')).toHaveText('100m3/s')
    await expect(page.locator('[data-test="type-0"]')).toHaveText('Stop')
    await expect(page.locator('[data-test="linked-condition-0"]')).toHaveText('Not linked to a condition')

    await page.locator('.govuk-summary-card__actions').getByRole('link', { name: 'Remove tag' }).click()

    await expect(page.locator('.govuk-caption-l')).toHaveText(`Licence ${licence.licenceRef}`)
    await expect(page.locator('h1')).toHaveText('You’re about to remove the tag for this licence')
    await expect(page.locator('.govuk-heading-m')).toHaveText('Hands off flow threshold')
    await expect(page.locator('.govuk-warning-text__text')).toContainText(
      'You will not be able to send a water abstraction alert for the licence at this restriction type and threshold.'
    )
    await expect(page.locator('[data-test="watercourse"]')).toHaveText(monitoringStation.catchmentName)
    await expect(page.locator('[data-test="station"]')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="threshold"]')).toHaveText('100m3/s')
    await expect(page.locator('[data-test="type"]')).toHaveText('Stop')
    await expect(page.locator('[data-test="linked-condition"]')).toHaveText('Not linked to a condition')

    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.locator('.govuk-notification-banner__heading')).toContainText(
      `Tag removed for ${licence.licenceRef}`
    )
    await expect(page.locator('h1')).toHaveText(monitoringStation.label)
    await expect(tableRow(page, licence.licenceRef)).toHaveCount(0)
  })
})
