import scenarioData from '../../../support/scenarios/registered-licence-with-monitoring-station-tagged.scenario.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { test, expect } from '../../../support/fixtures.js'

test.describe('Tag a licence linked to a condition. The abstraction period is derived from the condition (internal)', () => {
  let licence
  let licenceVersionPurposeCondition
  let monitoringStation

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence],
      licenceVersionPurposeConditions: [scenarioLicenceVersionPurposeCondition],
      monitoringStations: [scenarioMonitoringStation]
    } = scenario

    licence = scenarioLicence
    licenceVersionPurposeCondition = scenarioLicenceVersionPurposeCondition
    monitoringStation = scenarioMonitoringStation

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.environmentOfficer)
  })

  test('tags a licence linked to a condition, the user selects the condition which pre-populates the abs period', async ({
    page
  }) => {
    await page.goto(`/system/monitoring-stations/${monitoringStation.id}`)

    // Confirm we are on the monitoring station page
    await expect(page.locator('.govuk-caption-l')).toHaveText(monitoringStation.catchmentName)
    await expect(page.locator('.govuk-heading-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="meta-data-grid-reference"]')).toHaveText(monitoringStation.gridReference)
    await expect(page.locator('[data-test="meta-data-wiski-id"]')).toHaveText('')
    await expect(page.locator('[data-test="meta-data-station-reference"]')).toHaveText('')

    // Tag a licence to the monitoring station
    await page.getByRole('button', { name: 'Tag a licence' }).click()

    // Select meters below ordnance datum (mBOD) and enter threshold
    await page.locator('#unit-6').check()
    await page.locator('#threshold-mBOD').fill('200')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select stop flow
    await page.locator('input[type="radio"][value="reduce"]').check()
    await page.locator('input[type="radio"][value="no"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter the licence number this threshold applies to
    await page.locator('#licence-ref').fill(licence.licenceRef)
    await page.getByRole('button', { name: 'Continue' }).click()

    // The licence has a condition recorded against it. Select "The condition is not listed for this licence"
    await expect(page.locator('.govuk-heading-l')).toContainText(
      `Select the full condition for licence ${licence.licenceRef}`
    )
    await page.locator('#condition').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the restriction details
    await expect(summaryRow(page, 'Threshold').locator('.govuk-summary-list__value')).toContainText('200mBOD')
    await expect(summaryRow(page, 'Type').locator('.govuk-summary-list__value')).toContainText('Reduce')
    await expect(summaryRow(page, 'Licence number').locator('.govuk-summary-list__value')).toContainText(
      licence.licenceRef
    )
    await expect(summaryRow(page, 'Licence condition').locator('.govuk-summary-list__value')).toContainText(
      `Level cessation condition 1: ${licenceVersionPurposeCondition.notes}`
    )
    await expect(summaryRow(page, 'Abstraction period').locator('.govuk-summary-list__value')).toContainText(
      '1 April to 31 March'
    )

    const changeLink = summaryRow(page, 'Abstraction period').locator('.govuk-summary-list__actions .govuk-link')

    await expect(changeLink).toHaveText('')
    await expect(changeLink).toHaveAttribute('href', '')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Confirm we are back on the monitoring station page and the licence is tagged
    await expect(page.locator('.govuk-notification-banner__heading')).toHaveText(
      `Tag for licence ${licence.licenceRef} added`
    )
    await expect(page.locator('.govuk-heading-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="licence-ref-0"]')).toHaveText(licence.licenceRef)
    await expect(page.locator('[data-test="abstraction-period-0"]')).toHaveText('1 April to 31 March')
    await expect(page.locator('[data-test="restriction-0"]')).toHaveText('Reduce')
    await expect(page.locator('[data-test="threshold-0"]')).toHaveText('200mBOD')
    await expect(page.locator('[data-test="alert-0"]')).toHaveText('')
    await expect(page.locator('[data-test="alert-date-0"]')).toHaveText('')
    await expect(page.locator('[data-test="action-0"]')).toHaveText('View')
  })
})
