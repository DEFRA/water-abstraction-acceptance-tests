import { calculatedDates } from '../../../support/helpers/calculated-dates.helpers.js'
import { billRunRow as findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import { summaryValue } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe('Send a two-part tariff supplementary bill run (internal)', { tag: ['@supplementary-billing'] }, () => {
  let endYear
  let startYear

  test.beforeAll(async ({ world }) => {
    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = calculatedDates()

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()
    startYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

    world('licence-flagged-for-tpt-supplementary')
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test(
    'creates an SROC two-part tariff supplementary bill run and once built completes the review, marks it as ready, and sends it',
    {
      annotation: {
        type: 'tpt-supplementary-journey',
        description: `A licence that is current and not in workflow, has one applicable charge version with a single charge reference and two two-part tariff charge elements, and two completed returns matching them. The licence also has a sent two-part tariff bill run for the same year, which is what flags it for the next two-part tariff supplementary bill run.

**Acceptance Criteria**
- The licence appears in the review with a 'ready' status, having no issues.
- Continuing the bill run marks it as ready, and it can then be sent.`
      }
    },
    async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Two-part tariff supplementary' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.SOUTHERN.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the financial year')
      await page.locator(`input[value="${endYear}"]`).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // Building might take a few seconds, so to avoid the test failing we look for the status REVIEW, and if not
      // found reload the page and try again
      const billRunRow = findBillRunRow(page, regions.SOUTHERN, 'Two-part tariff supplementary')

      await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'review')
      await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(billRunRow.getByRole('cell', { name: regions.SOUTHERN.displayName, exact: true })).toBeVisible()
      await billRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText('Review licences')
      await expect(page.locator('.govuk-body > .govuk-tag')).toContainText('review')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.SOUTHERN.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear}`)

      // Continue the bill run, which will mark it as READY
      await page.getByRole('button', { name: 'Continue bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
      await billRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} two-part tariff`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.SOUTHERN.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Two-part tariff supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this
      // step is so fast the test will fail because it doesn't see the element

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} two-part tariff`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')
    }
  )
})
