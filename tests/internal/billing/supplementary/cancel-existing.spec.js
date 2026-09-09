import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../support/scenarios/presroc-licence-flagged-for-supplementary-with-current-annual-bill-run.scenario.js'
import { summaryValue } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe(
  'Cancel existing supplementary bill runs (internal)',
  { tag: ['@presroc', '@supplementary-billing'] },
  () => {
    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

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
      await page.getByRole('radio', { name: regions.SOUTHERN.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText(regions.SOUTHERN.displayName)
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.SOUTHERN.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Old')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.SOUTHERN.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Old')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // The presroc bill run is now cancelled and gone, so the sroc one takes its place at the top of the list
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'ready')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.SOUTHERN.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.SOUTHERN.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
    })
  }
)
