import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-vers-and-return-straddling-two-elements.scenario.js'
import { test, expect } from '../../../../support/fixtures.js'
import { calculatedDates } from '../../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'

test.describe('Simple Licence with a Return Straddling Two Charge Elements (internal)', () => {
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
    'creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched return straddling both charge elements and the over-authorised warning',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with one applicable charge version, a single charge reference and two charge elements covering different parts of the year. Its only return is two-part tariff and its volume straddles both elements, fully allocating to each.

**Acceptance Criteria**
- The return fully allocates across both charge elements, so the licence is ready with no issues.
- Reducing the charge reference's authorised volume below the sum of the allocated elements shows the over-authorised warning.`
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

      await expect(page.locator('[data-test="licence-1"]')).toContainText('AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="licence-issue-1"]')).toBeEmpty()
      await expect(page.locator('[data-test="licence-progress-1"]')).toBeEmpty()
      // The return fully allocates across both elements, so the licence has no issues and is ready to bill
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('ready')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await expect(page.locator('[data-test="licence-holder"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('div > .govuk-tag')).toContainText('ready')
      await expect(page.locator(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l')).toContainText(
        'Test Region two-part tariff'
      )
      await expect(page.locator('.govuk-list > li > .govuk-link')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )

      await expect(page.locator('.govuk-table__caption')).toContainText('Matched returns')
      await expect(page.locator('[data-test="matched-return-action-0"] > .govuk-link')).toContainText('9999400')
      await expect(page.locator('[data-test="matched-return-summary-0"] > div')).toContainText(
        'Spray Irrigation - Direct'
      )
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('completed')
      await expect(page.locator('[data-test="matched-0-issue-0"]')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 2 two-part tariff charge elements'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 1.554 ML'
      )
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText(
        'Change details'
      )

      // First element ~ April to October, filled to its authorised 0.9065 ML
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-0"]')).toContainText(
        `1 April ${startYear} to 31 October ${startYear}`
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toBeEmpty()
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('0.9065 ML / 0.9065 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText('1.554 ML (9999400)')

      // Second element ~ November to March, filled to its authorised 0.6475 ML
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-1"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-1"]')).toContainText(
        `1 November ${startYear} to 31 March ${endYear}`
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-1"]')
      ).toBeEmpty()
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-1"]')
      ).toContainText('0.6475 ML / 0.6475 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-1"]')
      ).toContainText('1.554 ML (9999400)')

      // Drive the over-authorised warning: drop the first element's billable returns, reduce the reference's authorised
      // volume below the combined element volume, then restore the element so the elements together exceed the reference
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await page.getByRole('button', { name: 'Edit the billable returns' }).click()

      await expect(page.locator('h1')).toContainText('Set the billable returns quantity for this bill run')
      await page.locator('#custom-quantity-selector').check()
      await page.locator('#custom-quantity').fill('0.1')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('[data-test="billable-returns"]')).toContainText('0.1 ML')
      await page.locator('.govuk-back-link').click()

      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await page.locator('[data-test="charge-version-0-charge-reference-link-0"]').click()

      await expect(page.locator('[data-test="charge-reference"]')).toContainText('Charge reference 4.6.1')
      await page.getByRole('button', { name: 'Change the authorised volume' }).click()

      await expect(page.locator('h1')).toContainText('Set the authorised volume')
      await page.locator('#amended-authorised-volume').fill('1')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('[data-test="authorised-volume"]')).toContainText('1 ML')
      await page.locator('.govuk-back-link').click()

      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()

      await expect(page.locator('h1')).toContainText('Spray Irrigation - Direct')
      await page.getByRole('button', { name: 'Edit the billable returns' }).click()

      await expect(page.locator('h1')).toContainText('Set the billable returns quantity for this bill run')
      await page.locator('#authorised-quantity').check()
      await page.getByRole('button', { name: 'Confirm' }).click()
      await page.locator('.govuk-back-link').click()

      // With both elements back at their authorised volumes they now exceed the reference's reduced authorised volume
      await expect(page.locator('h1')).toContainText('Licence AT/TE/ST/01/01')
      await expect(page.locator('.govuk-warning-text__icon')).toBeVisible()
      await expect(page.locator('.govuk-warning-text__text')).toContainText(
        'The total billable return volume exceeds the total authorised volume'
      )
    }
  )
})
