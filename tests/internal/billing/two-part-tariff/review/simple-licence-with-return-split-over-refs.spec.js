import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-vers-and-return-split-over-refs.scenario.js'
import { test, expect } from '../../../../support/fixtures.js'
import { calculatedDates } from '../../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'

test.describe('Simple Licence with a Return Split Over Charge References (internal)', () => {
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
    'creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched return, the return issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version that has two charge references, each with one charge element sharing the same purpose but a different abstraction period. Its single return matches both charge references.

**Acceptance Criteria**
- The licence is flagged with the return split over charge references issue.
- The return still fully allocates, split across the two charge references.`
      }
    },
    async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Two-part tariff', exact: true }).check()
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
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'review')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Two-part tariff')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Review licences')
      await expect(page.locator('.govuk-body > .govuk-tag')).toContainText('review')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear}`)

      await page.locator('.govuk-details__summary').click()
      await page.locator('[data-test="aggregate-factor"]').check()
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('#main-content')).toContainText('No licences found')
      await page.getByRole('button', { name: 'Clear filters' }).click()
      await page.locator('.govuk-details__summary').click()
      await page.locator('[data-test="return-split-over-refs"]').check()
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')
      await page.getByRole('button', { name: 'Clear filters' }).click()

      await expect(page.locator('[data-test="licence-1"]')).toContainText('AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Return split over charge references')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-holder"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        'Test Region two-part tariff'
      )

      // A single matched return, flagged as split over charge references, that still fully allocates (24 ML of 24 ML)
      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Return split over charge references'
      )
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('24 ML / 24 ML')
      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // Two charge references, each with one element; the return's 24 ML is split 10 ML / 14 ML across them. The
      // references have different charge categories and sort by subsistence charge (highest first), so 4.6.19 is shown
      // before 4.6.1.
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '2 charge references with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-reference-0"]')).toContainText('Charge reference 4.6.19')
      await expect(page.locator('[data-test="charge-version-0-reference-1"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '10 ML / 32 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('10 ML / 10 ML')
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-1"]')).toContainText(
        '14 ML / 32 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-1-charge-element-billable-returns-0"]')
      ).toContainText('14 ML / 14 ML')

      // First element's match details: 10 ML of the return allocates to it, still flagged split over charge references
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('10 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('10 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('24 ML / 24 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Return split over charge references'
      )
      await page.getByRole('link', { name: 'Go back to review licence' }).click()

      // Second element's match details: the other 14 ML of the return allocates to it
      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await page.locator('[data-test="charge-version-0-charge-reference-1-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('14 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('14 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('24 ML / 24 ML')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Return split over charge references'
      )
    }
  )
})
