import { calculatedDates } from '../../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-ver-and-two-refs-and-two-due-returns.scenario.js'
import { expect, test } from '../../../../support/fixtures.js'

test.describe('Licence with Two Charge References (internal)', () => {
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
    'creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns, the returns issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version that has two charge references, each with one charge element. Both elements have a matching return with a status of "due".

**Acceptance Criteria**
- The licence is flagged with the "No returns received" issue.
- The engine allocates only up to the lower of the charge reference volume and the charge element's authorised volume, proven by swapping which is lower between the two references.`
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
      await page.locator('[data-test="no-returns-received"]').check()
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')
      await page.getByRole('button', { name: 'Clear filters' }).click()

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('No returns received')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        'Test Region two-part tariff'
      )

      // Two matched returns, both due (overdue) and flagged as no returns received
      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('overdue')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'No returns received'
      )
      await expect(page.locator('[data-test="matched-return-status-1"] > .govuk-tag')).toContainText('overdue')
      await expect(page.locator('[data-test="matched-return-total-1"] > :nth-child(2)')).toContainText(
        'No returns received'
      )
      await expect(page.locator('[data-test="matched-return-action-2"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // Two charge references, each with one element. The first reference volume (22) is lower than its element (42) so
      // allocation caps at the reference; the second element (32) is lower than its reference (52) so allocation caps
      // at the element.
      // Two charge references, each with one element, sharing the same two volumes (22 and 42) with the reference and
      // element swapped. The first reference (22) is lower than its element (42) so allocation caps at the reference;
      // the second element (22) is lower than its reference (42) so allocation caps at the element. Both allocate 22.
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '2 charge references with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '22 ML / 22 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('22 ML / 42 ML')
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-1"]')).toContainText(
        '22 ML / 42 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-1-charge-element-billable-returns-0"]')
      ).toContainText('22 ML / 22 ML')
    }
  )
})
