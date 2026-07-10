import scenarioData from '../../../support/scenarios/registered-licence-with-monitoring-station-untagged.scenario.js'
import { test, expect } from '../../../support/fixtures.js'

const scenario = scenarioData()

const {
  licences: [licence],
  monitoringStations: [monitoringStation]
} = scenario

test.describe('Tag a licence that is not linked to a condition (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.environmentOfficer)
  })

  test('tags a licence with no linked conditions so the abstraction period must be entered manually', async ({
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
    await page.locator('#threshold-mBOD').fill('123')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select stop flow
    await page.locator('input[type="radio"][value="stop"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter the licence number this threshold applies to
    await page.locator('#licence-ref').fill(licence.licenceRef)
    await page.getByRole('button', { name: 'Continue' }).click()

    // The licence has no conditions recorded against it, confirm manual entry of abstraction period
    await expect(page.locator('.govuk-heading-l')).toContainText(
      `There are no flow or level cessation conditions for licence ${licence.licenceRef}`
    )
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter the abstraction period for the licence
    await expect(page.locator('.govuk-heading-l')).toContainText(
      `Enter an abstraction period for licence ${licence.licenceRef}`
    )
    await page.locator('#abstractionPeriodStartDay').fill('10')
    await page.locator('#abstractionPeriodStartMonth').fill('10')
    await page.locator('#abstractionPeriodEndDay').fill('11')
    await page.locator('#abstractionPeriodEndMonth').fill('11')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the restriction details
    await expect(_summaryRowValue(page, 0)).toContainText('123mBOD')
    await expect(_summaryRowValue(page, 1)).toContainText('Stop')
    await expect(_summaryRowValue(page, 2)).toContainText(licence.licenceRef)
    await expect(_summaryRowValue(page, 3)).toContainText('None')
    await expect(_summaryRowValue(page, 4)).toContainText('10 October to 11 November')
    await expect(page.locator('.govuk-summary-list__row').nth(4).getByRole('link', { name: 'Change' })).toBeVisible()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Confirm we are back on the monitoring station page and the licence is tagged
    await expect(page.locator('.govuk-notification-banner__heading')).toHaveText(
      `Tag for licence ${licence.licenceRef} added`
    )
    await expect(page.locator('.govuk-heading-l')).toHaveText(monitoringStation.label)
    await expect(page.locator('[data-test="licence-ref-0"]')).toHaveText(licence.licenceRef)
    await expect(page.locator('[data-test="abstraction-period-0"]')).toHaveText('10 October to 11 November')
    await expect(page.locator('[data-test="restriction-0"]')).toHaveText('Stop')
    await expect(page.locator('[data-test="threshold-0"]')).toHaveText('123mBOD')
    await expect(page.locator('[data-test="alert-0"]')).toHaveText('')
    await expect(page.locator('[data-test="alert-date-0"]')).toHaveText('')
    await expect(page.locator('[data-test="action-0"]')).toHaveText('View')

    // Confirm the licence is linked to the monitoring station in the licence summary
    await page.locator('[data-test="licence-ref-0"]').getByRole('link', { name: licence.licenceRef }).click()
    await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
    await expect(page.locator('.govuk-list').filter({ hasText: monitoringStation.label })).toBeVisible()
  })
})

/**
 * Locates the govuk-summary-list value cell at the given row position
 *
 * The rows on this page aren't labelled with accessible text in the rendered markup, so they can't be targeted by
 * role/label — this ports the position-based Cypress selectors directly.
 */
function _summaryRowValue(page, position) {
  return page.locator('.govuk-summary-list__row').nth(position).locator('.govuk-summary-list__value')
}
