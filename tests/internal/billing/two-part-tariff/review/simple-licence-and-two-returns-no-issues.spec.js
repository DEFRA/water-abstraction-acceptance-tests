import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-vers-and-two-completed-return-logs.scenario.js'
import { test, expect } from '../../../../support/fixtures.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'

test.describe('Simple Licence and Two Returns with No Issues (internal)', () => {
  let endYear
  let licence
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

    licence = scenario.licence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test(
    'creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns and allocated quantities',
    {
      annotation: {
        type: 'tpt-review',
        description: `A test case with a single charge reference but two charge elements, only one of which is 2pt. It also has two returns, one 2pt and one not, fully allocated without issues.

**Acceptance Criteria**
- No issues are reported on the licence, the returns or the charging information.
- The return fully allocates to the charge element.`
      }
    },
    async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto(`/system/licences/${licence.id}/summary`)

      // Confirm there are no flags already on the licence
      await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)
      await page.locator('#nav-bill-runs').click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Two-part tariff', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      // The most recent year is the one the scenario seed data is set up for
      await expect(page.locator('h1')).toContainText('Select the financial year')
      await page.locator(`input[value="${endYear}"]`).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      // The bill run we created will be the top result. We expect its status to be BUILDING. Building might take a few
      // seconds though so to avoid the test failing we look for the status REVIEW, and if not found reload the page and
      // try again. We then select it using the link on the date created
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'review')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Two-part tariff')
      await expect(page.locator('[data-test="bill-run-total-0"]')).toContainText('')
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
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
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

      // Confirm there are no other returns
      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="financial-year"]')).toContainText(
        `Financial year ${startYear} to ${endYear}`
      )
      await expect(page.locator('#charge-version-0 > .govuk-heading-l')).toContainText(
        `Charge periods 1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(page.locator('[data-test="charge-version-0-details"]')).toContainText(
        '1 charge reference with 1 two-part tariff charge element'
      )
      await expect(page.locator('.govuk-details__summary-text')).toContainText(
        'Big Farm Co Ltd billing account details'
      )
      await page.locator('.govuk-details__summary').click()
      await expect(page.locator('[data-test="billing-account"]')).toContainText('S99999991A')
      await expect(page.locator('[data-test="account-name"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="charge-version-0-reference-0"]')).toContainText('Charge reference 4.6.1')
      await expect(page.locator('[data-test="charge-version-0-charge-description-0"]')).toContainText(
        'High loss, non-tidal, up to and including 15 ML/yr'
      )
      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '1.554 ML / 3.108 ML'
      )
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-0"]')).toContainText(
        'Element 1 of 1'
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-element-description-0"]')
      ).toContainText('Spray Irrigation - Direct')
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-dates-0"]')).toContainText(
        `1 April ${startYear} to 31 March ${endYear}`
      )
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('1.554 ML / 1.554 ML')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]')
      ).toContainText('1.554 ML (9999400)')

      // Confirm there is only one charge version, charge reference and charge element
      await expect(page.locator('#charge-version-1 > .govuk-heading-l')).toHaveCount(0)
      await expect(page.locator('[data-test="charge-version-0-reference-1"]')).toHaveCount(0)
      await expect(page.locator('[data-test="charge-version-0-charge-reference-0-element-count-1"]')).toHaveCount(0)
      await page.locator('[data-test="charge-version-0-charge-reference-link-0"]').click()
    }
  )
})
