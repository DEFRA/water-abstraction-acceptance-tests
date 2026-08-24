import { calculatedDates } from '../../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-vers-and-unmatched-return.scenario.js'
import { expect, test } from '../../../../support/fixtures.js'

test.describe('Licence with an Unmatched Return (internal)', () => {
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
    'creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the unmatched return, the return issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version, a single charge reference and one charge element. Its only return is two-part tariff but has a different purpose to the charge element, so the engine cannot match it.

**Acceptance Criteria**
- The charge element is flagged unable to match a return and the unmatched return is flagged over abstraction, so the licence has multiple issues.
- With no matching return the charge element's full authorised volume is billable and the unmatched return allocates nothing.`
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
      await page.locator('[data-test="unable-to-match-return"]').check()
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')
      await page.getByRole('button', { name: 'Clear filters' }).click()

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Multiple Issues')
      await expect(page.locator('[data-test="licence-progress-1"]')).toBeEmpty()
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
      await expect(page.locator('[data-test="licence-holder"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        'Test Region two-part tariff'
      )

      // The return is two-part tariff but its purpose differs from the element, so it sits in the unmatched returns
      // table, over-abstracted with nothing allocated
      await expect(page.locator('.govuk-table__caption')).toContainText('Unmatched returns')
      await expect(page.locator('[data-test="unmatched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Storage'
      )
      await expect(page.locator('[data-test="unmatched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="unmatched-return-total-0"] > :nth-child(1)')).toContainText(
        '0 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="unmatched-return-total-0"] > :nth-child(2)')).toContainText(
        'Over abstraction'
      )
      await expect(page.locator('[data-test="unmatched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toHaveCount(0)

      // The charge element has no matching return, so it is flagged unable to match and bills its full authorised volume
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 1 two-part tariff charge element'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('Unable to match return')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toBeEmpty()

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="billable-returns"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="issues-0"]')).toContainText('Unable to match return')
      await expect(page.locator('[data-test="no-returns-message"]')).toContainText(
        'No matching two-part tariff returns'
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toHaveCount(0)
    }
  )
})
