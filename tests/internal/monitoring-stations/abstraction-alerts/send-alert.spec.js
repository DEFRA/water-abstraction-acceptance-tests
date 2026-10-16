import { monitoringStations } from '../../../support/default-values.js'
import { tableRow } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

const monitoringStation = monitoringStations.SECOND

test.describe('Send an abstraction alert (internal)', () => {
  let licence
  let primaryUser
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-with-monitoring-station-tagged')

    licence = scenario.licence
    primaryUser = scenario.users[1]
    user = scenario.users[0]
  })

  test.beforeEach(async ({ login }) => {
    await login(user)
  })

  test('creates and sends an abstraction alert for the tagged licence', async ({ page }) => {
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

    await page.locator('input[type="radio"][value="warning"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('h1')).toContainText('Which thresholds do you need to send an alert for?')

    await page.locator('#alertThresholds').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('h1')).toHaveText('Check the licence matches for the selected thresholds')
    const licenceRow = tableRow(page, licence.licenceRef)

    await expect(licenceRow.locator('[data-test^="licence-ref-"]')).toHaveText(licence.licenceRef)
    await expect(licenceRow.locator('[data-test^="abstraction-period-"]')).toHaveText('10 October to 11 November')
    await expect(licenceRow.locator('[data-test^="restriction-"]')).toHaveText('Stop')
    await expect(licenceRow.locator('[data-test^="threshold-"]')).toHaveText('100m3/s')
    await expect(licenceRow.locator('[data-test^="alert-"]:not([data-test^="alert-date-"])')).toHaveText('')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('h1')).toContainText('Select an email address to include in the alerts')
    await expect(page.locator('.govuk-radios')).toContainText(user.username)

    await page.locator('input[type="radio"][value="username"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.govuk-caption-l')).toContainText('Notice WAA-')
    await expect(page.locator('h1')).toContainText('Check the recipients')
    await expect(page.locator('.govuk-table__body')).toContainText(primaryUser.username)
    await expect(page.locator('.govuk-table__body')).toContainText(licence.licenceRef)
    await expect(page.locator('.govuk-table__body')).toContainText('Email - primary user')
    await expect(page.locator('.govuk-table__body')).toContainText('Preview')
    await page.getByRole('button', { name: 'Send' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Water abstraction alerts sent')
    await expect(page.locator('.govuk-panel__body')).toContainText('Your reference number is WAA-')
    await page.getByRole('link', { name: 'View notice' }).click()

    await expect(page.locator('h1')).toContainText('Warning alert')
  })
})
