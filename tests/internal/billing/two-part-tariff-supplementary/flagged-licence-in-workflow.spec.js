import { calculatedDates } from '../../../support/helpers/calculated-dates.helpers.js'
import { findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe('Send a two-part tariff supplementary bill run (internal)', { tag: ['@supplementary-billing'] }, () => {
  let endYear
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('licence-flagged-for-tpt-supplementary-in-workflow')

    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = calculatedDates()

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()
    user = scenario.user
  })

  test.beforeEach(async ({ login }) => {
    await login(user)
  })

  test(
    'creates an SROC two-part tariff supplementary bill run and confirm the licence is not included',
    {
      annotation: {
        type: 'tpt-supplementary-journey',
        description: `A licence that is current and in workflow, has one applicable charge version with a single charge reference and two two-part tariff charge elements, and two completed returns matching them. The licence also has a sent two-part tariff bill run for the same year, which is what flags it for the next two-part tariff supplementary bill run.

**Acceptance Criteria**
- The licence should NOT appear in the bill run`
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
      await page.getByRole('radio', { name: regions.NORTH_WEST.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the financial year')
      await page.locator(`input[value="${endYear}"]`).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // Building might take a few seconds, so we look for the status EMPTY, and if not found reload the page and try
      // again. The status being EMPTY asserts that the licence has NOT been picked up, which is the expected behaviour
      const billRunRow = findBillRunRow(page, regions.NORTH_WEST, 'Two-part tariff supplementary')

      await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'empty')
      await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(billRunRow.getByRole('cell', { name: regions.NORTH_WEST.displayName, exact: true })).toBeVisible()
    }
  )
})
