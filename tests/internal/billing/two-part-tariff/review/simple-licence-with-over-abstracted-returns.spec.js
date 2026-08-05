import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-vers-and-two-over-abstracted-returns.scenario.js'
import { test, expect } from '../../../../support/fixtures.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'

test.describe('Simple Licence with Over-abstracted Returns (internal)', () => {
  let endYear
  let startYear

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()

    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = dates

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()
    startYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

    const scenario = scenarioData(dates)

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test(
    'creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version, a single charge reference and two charge elements. The return matching the first element is over-abstracted; the return matching the second is over-abstracted and abstracts outside the charge period.

**Acceptance Criteria**
- The licence is flagged with the over abstraction and abstraction outside period issues.
- An over-abstracted return still only allocates up to the lower of the charge element and charge reference volume, not the over-abstracted amount.`
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
      await page.locator('[data-test="abs-outside-period"]').check()
      await page.locator('[data-test="over-abstraction"]').check()
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')
      await page.getByRole('button', { name: 'Clear filters' }).click()

      await expect(page.locator('[data-test="licence-1"]')).toContainText('AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Multiple Issues')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-holder"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        'Test Region two-part tariff'
      )

      // First matched return is over-abstracted: 38 ML submitted but only the element's 32 ML allocates
      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('32 ML / 38 ML')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('Over abstraction')

      // Second matched return is over-abstracted and abstracts outside the charge period
      await expect(page.locator('[data-test="matched-return-status-1"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-1"]')).toContainText('30 ML / 36 ML')
      await expect(page.locator('[data-test="matched-return-total-1"]')).toContainText('Abstraction outside period')
      await expect(page.locator('[data-test="matched-return-total-1"]')).toContainText('Over abstraction')

      await expect(page.locator('[data-test="matched-return-action-2"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // One charge reference with two two-part tariff elements; both elements fully allocate (32 + 30 of the 64 volume)
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '62 ML / 64 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('32 ML / 32 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-1"]')
      ).toContainText('30 ML / 30 ML')
    }
  )
})
