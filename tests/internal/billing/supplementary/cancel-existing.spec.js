import scenarioData from '../../../support/scenarios/presroc-licence-flagged-for-supplementary-with-current-annual-bill-run.scenario.js'
import { test, expect } from '../../../support/fixtures.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe(
  'Cancel existing supplementary bill runs (internal)',
  { tag: ['@presroc', '@supplementary-billing'] },
  () => {
    test.beforeAll(async ({ setup, calculatedDates }) => {
      const dates = await calculatedDates()
      const scenario = scenarioData(dates)

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('cancels both the presroc and sroc supplementary bill runs once built', async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Old')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
      await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
      await expect(_summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Old')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // The presroc bill run is now cancelled and gone, so the sroc one takes its place at the top of the list
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'ready')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
      await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
      await expect(_summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
    })
  }
)

function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
