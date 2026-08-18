import scenarioData from '../../../support/scenarios/licence-flagged-for-tpt-supplementary.scenario.js'
import { test, expect } from '../../../support/fixtures.js'
import { calculatedDates } from '../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Send a two-part tariff supplementary bill run (internal)', { tag: '@supplementary-billing' }, () => {
  let endYear
  let startYear

  test.beforeAll(async ({ setup }) => {
    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = calculatedDates()

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()
    startYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

    const scenario = scenarioData()

    await setup(scenario)
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
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the financial year')
      await page.locator(`input[value="${endYear}"]`).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // We already have one sent two-part tariff bill run seeded (that's what flags the licence for supplementary
      // billing), so the one we just created is identified by position: it will be the top result. We expect its
      // status to be BUILDING. Building might take a few seconds though so to avoid the test failing we look for the
      // status REVIEW, and if not found reload the page and try again. We then select it using the link on the date
      // created
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'review')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Two-part tariff')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Review licences')
      await expect(page.locator('.govuk-body > .govuk-tag')).toContainText('review')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear}`)

      // Continue the bill run, which will mark it as READY
      await page.getByRole('button', { name: 'Continue bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'ready')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region two-part tariff')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
      await expect(_summaryValue(page, 'Bill run type')).toContainText('Two-part tariff supplementary')
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this
      // step is so fast the test will fail because it doesn't see the element

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText('Test Region two-part tariff')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')
    }
  )
})

/**
 * Locates the value cell of a govuk-summary-list row identified by its label
 */
function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
