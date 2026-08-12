import scenarioData from '../../../support/scenarios/licence-flagged-for-supplementary-with-full-sroc-history-and-current-annual-bill-run.scenario.js'
import { test, expect } from '../../../support/fixtures.js'
import { formatLongDate, SROC_FIRST_FINANCIAL_YEAR } from '../../../support/helpers/date.helpers.js'
import { srocStartDate } from '../../../support/default-values.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe(
  'Replace charge version in the 2023 financial year with no changes (internal)',
  { tag: '@supplementary-billing' },
  () => {
    let billingAccount
    let company
    let licence

    test.beforeAll(async ({ setup, calculatedDates }) => {
      const dates = await calculatedDates()
      const scenario = scenarioData(dates)

      billingAccount = scenario.billingAccount
      company = scenario.company
      licence = scenario.licence

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('sends the sroc supplementary bill run, replaces the charge version in the 2023 financial year with no changes, then confirms the zero value bill', async ({
      page
    }) => {
      test.setTimeout(60000)

      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // Creating a supplementary bill run always attempts the presroc engine too, which finds nothing to bill for this
      // sroc-only scenario and shows as an empty bill run at index 0
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-1"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-1"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-1"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-1"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await expect(page.locator('[data-test="date-created-1"] > .govuk-link')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="bill-run-status-1"] > .govuk-tag')).toContainText('sent')

      await page.getByRole('link', { name: 'Search' }).click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row').getByRole('link', { name: licence.licenceRef }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await page.getByRole('link', { name: 'Licence set up' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('button', { name: 'Set up a new charge' }).click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio').first().check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { name: 'Another date' }).check()
      // The 1st of September 2022, within the 2023 sroc financial year, so the split falls on the earliest sroc
      // period there's any charge history for
      const newChargeStartDate = new Date(srocStartDate)

      newChargeStartDate.setUTCMonth(newChargeStartDate.getUTCMonth() + 5)

      await page.locator('#customDate-day').fill(String(newChargeStartDate.getUTCDate()))
      await page.locator('#customDate-month').fill(String(newChargeStartDate.getUTCMonth() + 1))
      await page.locator('#customDate-year').fill(String(newChargeStartDate.getUTCFullYear()))
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText(`Select an existing billing account for ${company.name}`)
      // The first radio's label isn't correctly associated in the markup, so it has no accessible name
      await page.locator('input#billingAccountId').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.getByRole('radio', { name: 'Use charge information valid' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(page.getByRole('link', { name: 'Review' })).toHaveCount(0)

      await page.getByRole('link', { name: 'Bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-1"] > .govuk-tag'), 'ready')
      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="bill-total"]')).toContainText('£0.00')
      await expect(page.locator('[data-test="bills-count"]')).toContainText(
        '0 Supplementary bills and 1 zero value bill'
      )

      const abstractorsTable = page.locator('[data-test="other-abstractors"]')
      const billRow = abstractorsTable.getByRole('row', { name: billingAccount.accountNumber })

      await expect(billRow).toContainText(company.name)
      await expect(billRow).toContainText(licence.licenceRef)
      await expect(billRow).toContainText(String(SROC_FIRST_FINANCIAL_YEAR))
      await expect(billRow).toContainText('£0.00')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await expect(page.locator('[data-test="date-created-1"] > .govuk-link')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="number-of-bills-1"]')).toContainText('0')
      await expect(page.locator('[data-test="bill-run-total-1"]')).toContainText('£0.00')
      await expect(page.locator('[data-test="bill-run-status-1"] > .govuk-tag')).toContainText('sent')
    })
  }
)

function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
