import { monitoringStations } from '../../../support/default-values.js'
import { expect, test } from '../../../support/fixtures.js'
import { summaryRow, tableRow } from '../../../support/helpers/govuk.helpers.js'

const monitoringStation = monitoringStations.SECOND

test.describe('Tag a licence linked to a condition. The abstraction period is derived from the condition (internal)', () => {
  let licence
  let licenceVersionPurposeCondition
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-with-monitoring-station-tagged')

    licence = scenario.licence
    licenceVersionPurposeCondition = scenario.licenceVersionPurposeCondition
    user = scenario.users[0]
  })

  test.beforeEach(async ({ login }) => {
    await login(user)
  })

  test('tags a licence linked to a condition, the user selects the condition which pre-populates the abs period', async ({
    page
  }) => {
    await page.goto(`/system/monitoring-stations/${monitoringStation.id}`)

    await expect(page.locator('h1')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="meta-data-grid-reference"]')).toHaveText(monitoringStation.gridReference)
    await expect(page.locator('[data-test="meta-data-wiski-id"]')).toHaveText(monitoringStation.wiskiId)
    await expect(page.locator('[data-test="meta-data-station-reference"]')).toHaveText(
      monitoringStation.stationReference
    )

    await page.getByRole('button', { name: 'Tag a licence' }).click()

    await expect(page.locator('h1')).toContainText('What is the licence hands-off flow or level threshold?')
    await page.locator('#unit-6').check()
    await page.locator('#threshold-mBOD').fill('200')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Does the licence holder need to stop or reduce at this threshold?')
    await page.locator('input[type="radio"][value="reduce"]').check()
    await page.locator('input[type="radio"][value="no"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Enter the licence number this threshold applies to')
    await page.locator('#licence-ref').fill(licence.licenceRef)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText(`Select the full condition for licence ${licence.licenceRef}`)
    await page.locator('#condition').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.govuk-heading-l')).toContainText('Check the restriction details')
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

    await expect(page.locator('.govuk-notification-banner__heading')).toHaveText(
      `Tag for licence ${licence.licenceRef} added`
    )
    await expect(page.locator('h1')).toHaveText(monitoringStation.label)
    const licenceRow = tableRow(page, licence.licenceRef)

    await expect(licenceRow.locator('[data-test^="licence-ref-"]')).toHaveText(licence.licenceRef)
    await expect(licenceRow.locator('[data-test^="abstraction-period-"]')).toHaveText('1 April to 31 March')
    await expect(licenceRow.locator('[data-test^="restriction-"]')).toHaveText('Reduce')
    await expect(licenceRow.locator('[data-test^="threshold-"]')).toHaveText('200mBOD')
    await expect(licenceRow.locator('[data-test^="alert-"]:not([data-test^="alert-date-"])')).toHaveText('')
    await expect(licenceRow.locator('[data-test^="alert-date-"]')).toHaveText('')
    await expect(licenceRow.locator('[data-test^="action-"]')).toHaveText('View')
  })
})
