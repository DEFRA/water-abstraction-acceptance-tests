import scenarioData from '../../../support/scenarios/registered-licence-with-monitoring-station-tagged.scenario.js'
import { test, expect } from '../../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence],
  monitoringStations: [monitoringStation]
} = scenario

test.describe('Set up but then cancel an abstraction alert (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.environmentOfficer)
  })

  test('creates and then cancels an abstraction alert prior to sending for the tagged licence', async ({
    page,
    users
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

    // Select the stop alert type and continue
    await page.locator('input[type="radio"][value="stop"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm we are on the Which thresholds do you need to send an alert for? page
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('.govuk-heading-l')).toContainText('Which thresholds do you need to send an alert for?')

    // Select the threshold and continue
    await page.locator('#alertThresholds').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm data on Check the licence matches for the selected thresholds page is correct and continue
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('.govuk-heading-l')).toHaveText('Check the licence matches for the selected thresholds')
    await expect(page.locator('[data-test="licence-ref-0"]')).toHaveText(licence.licenceRef)
    await expect(page.locator('[data-test="abstraction-period-0"]')).toHaveText('10 October to 11 November')
    await expect(page.locator('[data-test="restriction-0"]')).toHaveText('Stop')
    await expect(page.locator('[data-test="threshold-0"]')).toHaveText('100m3/s')
    await expect(page.locator('[data-test="alert-0"]')).toHaveText('')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm we are on the Select an email address to include in the alerts page
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('.govuk-heading-l')).toContainText('Select an email address to include in the alerts')
    await expect(page.locator('.govuk-radios')).toContainText(users.environmentOfficer)

    // Select Use another email address, enter an email address and continue
    await page.locator('input[type="radio"][value="other"]').check()
    await page.locator('#otherUser').fill('test.user@testing.com')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm data on Check the recipients page is correct and cancel the alert
    await expect(page.locator('.govuk-caption-l')).toContainText('Notice WAA-')
    await expect(page.locator('.govuk-heading-l')).toContainText('Check the recipients')
    await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 recipients')
    await expect(page.locator('.govuk-table__body')).toContainText('external@example.com')
    await expect(page.locator('.govuk-table__body')).toContainText(licence.licenceRef)
    await expect(page.locator('.govuk-table__body')).toContainText('Email - primary user')
    await expect(page.locator('.govuk-table__body')).toContainText('Preview')
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Confirm cancellation of the alert
    await expect(page.locator('.govuk-caption-l')).toContainText('Notice WAA-')
    await expect(page.locator('.govuk-heading-l')).toHaveText('You are about to cancel this notice')
    await expect(page.locator('.govuk-summary-list__row').nth(1).locator('.govuk-summary-list__value')).toContainText(
      'Stop'
    )
    await page.getByRole('button', { name: 'Confirm cancel' }).click()

    // Confirm we are back on the monitoring station page
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.catchmentName)
    await expect(page.locator('.govuk-heading-l')).toHaveText(monitoringStation.label)
  })
})
