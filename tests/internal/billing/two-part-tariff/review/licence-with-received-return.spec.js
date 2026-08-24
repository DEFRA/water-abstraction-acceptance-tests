import { calculatedDates } from '../../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../../support/scenarios/licence-with-tpt-chg-vers-and-received-return-log.scenario.js'
import { expect, test } from '../../../../support/fixtures.js'

test.describe('Licence with a Received Return (internal)', () => {
  let endYear
  let startYear
  let licence

  test.beforeAll(async ({ setup }) => {
    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = calculatedDates()

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()
    startYear = new Date(twoPartTariffPeriod.startDate).getFullYear()

    const scenario = scenarioData()

    licence = scenario.licence

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
        description: `A test case with a similar licence to the simplest test case, with one applicable charge version, a single charge reference and one charge element. It has one matching return with a status of "received".

**Acceptance Criteria**
- The licence is flagged with the returns received but not processed issue.
- A received return is not allocated, so it is also flagged with the over abstraction issue.`
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
      await page.locator('[data-test="returns-received-not-processed"]').check()
      await page.getByRole('button', { name: 'Apply filters' }).click()
      await expect(page.locator('.govuk-table__caption')).toContainText('Showing all 1 licences')
      await page.getByRole('button', { name: 'Clear filters' }).click()

      await expect(page.locator('[data-test="licence-1"]')).toContainText(licence.licenceRef)
      await expect(page.locator('[data-test="licence-2"]')).toHaveCount(0)
      await expect(page.locator('[data-test="licence-holder-1"]')).toContainText('Big Farm Co Ltd')
      await expect(page.locator('[data-test="licence-issue-1"]')).toContainText('Multiple Issues')
      await expect(page.locator('[data-test="licence-progress-1"]')).toContainText('')
      await expect(page.locator('[data-test="licence-status-1"] > .govuk-tag')).toContainText('review')
      await page.locator('[data-test="licence-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`Licence ${licence.licenceRef}`)
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
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('received')
      // A received return is not allocated, so it shows no allocated volume and is flagged as over abstracted
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('/')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Over abstraction'
      )
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(3)')).toContainText(
        'Returns received but not processed'
      )

      await expect(page.locator('[data-test="matched-return-action-1"] > .govuk-link')).toHaveCount(0)
      await expect(page.locator('[data-test="unmatched-return-action-0"] > .govuk-link')).toHaveCount(0)

      await expect(page.locator('[data-test="charge-version-0-total-billable-returns-0"]')).toContainText(
        '0 ML / 1.554 ML'
      )
      // Without an aggregate or charge factor we should only see the "View details" link, not "Change details"
      await expect(page.locator('[data-test="charge-version-0-charge-reference-link-0"]')).toContainText('View details')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]')
      ).toContainText('')
      await expect(
        page.locator('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]')
      ).toContainText('0 ML / 1.554 ML')
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
      await expect(page.locator('[data-test="matched-return-status-0"] > .govuk-tag')).toContainText('received')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(1)')).toContainText('/')
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(2)')).toContainText(
        'Over abstraction'
      )
      await expect(page.locator('[data-test="matched-return-total-0"] > :nth-child(3)')).toContainText(
        'Returns received but not processed'
      )
      await page.getByRole('link', { name: 'Go back to review licence' }).click()
    }
  )
})
