import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-vers-and-aggregate-value.scenario.js'
import { test, expect } from '../../../../support/fixtures.js'
import { calculatedDates } from '../../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'

test.describe('Licence with an Aggregate (internal)', () => {
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
    'creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns, the element issues and the allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. The charge reference has an aggregate value and it has one return that matches.

**Acceptance Criteria**
- The licence is flagged with the aggregate issue.
- The return still fully allocates to the charge element.
- The aggregate and charge adjustment factors can be amended on the charge reference.`
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
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')

      await expect(page.locator('[data-test="licence-1"]')).toContainText('AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Aggregate')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-holder"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('div > .govuk-tag')).toContainText('review')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        'Test Region two-part tariff'
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText('9999400')
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-action-0"] > :nth-child(3)')).toContainText(
        '1 April to 31 March'
      )
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"]')).toContainText('1.554 ML / 1.554 ML')
      await expect(page.locator('[data-test="matched-0-issue-0"]')).toHaveCount(0)

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('Aggregate')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText('1.554 ML (9999400)')

      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText('9999400')
      await expect(page.locator('[data-test="matched-return-action-0"] > div').first()).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="matched-return-summary-0"]')).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="issues-0"]')).toContainText('Aggregate')
      await page.getByRole('link', { name: 'Go back to review licence' }).click()

      // When an aggregate is present on the charge reference, this changes the reference link from "View details" to
      // "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText(
        'Change details'
      )
      await page.getByRole('link', { name: 'Change details' }).click()

      await expect(page.locator('h1')).toContainText('Charge reference')
      await expect(page.locator('[data-test="charge-reference"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="financial-year"]')).toContainText(
        `Financial Year ${startYear} to ${endYear}`
      )
      await expect(page.locator('[data-test="charge-period"]')).toContainText(
        `Charge period 1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="total-billable-returns"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1.554 ML')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Aggregate factor (0.5 / 0.5)')
      await expect(page.locator('[data-test="adjustment-1"]')).toContainText('Charge adjustment (1 / 1)')
      await page.getByRole('link', { name: 'Change factors' }).click()

      await expect(page.locator('h1')).toContainText('Set the adjustment factors')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Two part tariff agreement')
      await expect(page.locator('#amended-aggregate')).toHaveValue('0.5')
      await expect(page.locator('#amended-charge-adjustment')).toHaveValue('1')
      // Changing the aggregate factor to 1 removes it
      await page.locator('#amended-aggregate').fill('1')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1')).toContainText('Charge reference')
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await expect(page.locator('#govuk-notification-banner-title')).toContainText('Adjustment updated')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Aggregate factor (1 / 0.5)')
      await expect(page.locator('.govuk-summary-list__actions > .govuk-link')).toContainText('Change factors')
      await page.getByRole('link', { name: 'Change factors' }).click()

      await expect(page.locator('h1')).toContainText('Set the adjustment factors')
      await expect(page.locator('[data-test="adjustment-0"]')).toContainText('Two part tariff agreement')
      await expect(page.locator('#amended-aggregate')).toHaveValue('1')
      await expect(page.locator('#amended-charge-adjustment')).toHaveValue('1')
      await page.locator('#amended-charge-adjustment').fill('0.5')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1')).toContainText('Charge reference')
      await expect(page.locator('.govuk-notification-banner')).toBeVisible()
      await expect(page.locator('#govuk-notification-banner-title')).toContainText('Adjustment updated')
      await expect(page.locator('[data-test="adjustment-1"]')).toContainText('Charge adjustment (0.5 / 1)')
    }
  )
})
