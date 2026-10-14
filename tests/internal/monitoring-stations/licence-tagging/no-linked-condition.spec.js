import { monitoringStations } from '../../../support/default-values.js'
import { expect, test } from '../../../support/fixtures.js'
import { summaryRow, tableRow } from '../../../support/helpers/govuk.helpers.js'

const monitoringStation = monitoringStations.FIRST

test.describe('Tag a licence that is not linked to a condition (internal)', () => {
  let licence
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-with-monitoring-station-untagged')

    licence = scenario.licence
    user = scenario.users[0]
  })

  test.beforeEach(async ({ login }) => {
    await login(user)
  })

  test('tags a licence with no linked conditions so the abstraction period must be entered manually', async ({
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
    await page.locator('#threshold-mBOD').fill('123')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Does the licence holder need to stop or reduce at this threshold?')
    await page.locator('input[type="radio"][value="stop"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Enter the licence number this threshold applies to')
    await page.locator('#licence-ref').fill(licence.licenceRef)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText(
      `There are no flow or level cessation conditions for licence ${licence.licenceRef}`
    )
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText(`Enter an abstraction period for licence ${licence.licenceRef}`)
    await page.locator('#abstractionPeriodStartDay').fill('10')
    await page.locator('#abstractionPeriodStartMonth').fill('10')
    await page.locator('#abstractionPeriodEndDay').fill('11')
    await page.locator('#abstractionPeriodEndMonth').fill('11')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('.govuk-heading-l')).toContainText('Check the restriction details')
    await expect(summaryRow(page, 'Threshold').locator('.govuk-summary-list__value')).toContainText('123mBOD')
    await expect(summaryRow(page, 'Type').locator('.govuk-summary-list__value')).toContainText('Stop')
    await expect(summaryRow(page, 'Licence number').locator('.govuk-summary-list__value')).toContainText(
      licence.licenceRef
    )
    await expect(summaryRow(page, 'Licence condition').locator('.govuk-summary-list__value')).toContainText('None')
    await expect(summaryRow(page, 'Abstraction period').locator('.govuk-summary-list__value')).toContainText(
      '10 October to 11 November'
    )
    await expect(summaryRow(page, 'Abstraction period').getByRole('link', { name: 'Change' })).toBeVisible()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.locator('.govuk-notification-banner__heading')).toHaveText(
      `Tag for licence ${licence.licenceRef} added`
    )
    await expect(page.locator('h1')).toHaveText(monitoringStation.label)
    const licenceRow = tableRow(page, licence.licenceRef)

    await expect(licenceRow.locator('[data-test^="licence-ref-"]')).toHaveText(licence.licenceRef)
    await expect(licenceRow.locator('[data-test^="abstraction-period-"]')).toHaveText('10 October to 11 November')
    await expect(licenceRow.locator('[data-test^="restriction-"]')).toHaveText('Stop')
    await expect(licenceRow.locator('[data-test^="threshold-"]')).toHaveText('123mBOD')
    await expect(licenceRow.locator('[data-test^="alert-"]:not([data-test^="alert-date-"])')).toHaveText('')
    await expect(licenceRow.locator('[data-test^="alert-date-"]')).toHaveText('')
    await expect(licenceRow.locator('[data-test^="action-"]')).toHaveText('View')

    await licenceRow.locator('[data-test^="licence-ref-"]').getByRole('link', { name: licence.licenceRef }).click()
    await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
    await expect(page.locator('.govuk-list').filter({ hasText: monitoringStation.label })).toBeVisible()
  })
})
