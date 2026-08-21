import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../support/scenarios/licence-flagged-for-supplementary-with-full-sroc-history-and-current-annual-bill-run.scenario.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { billingPeriodCounts, formatLongDate } from '../../../support/helpers/date.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe(
  'Replace charge version in the current financial year, changing the charge reference and adding adjustments and additional charges (internal)',
  { tag: '@supplementary-billing' },
  () => {
    let billingAccount
    let billingPeriodCount
    let company
    let licence
    let licenceVersionPurpose
    let toFinancialYearEnding

    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

      billingAccount = scenario.billingAccount
      company = scenario.company
      licence = scenario.licence
      licenceVersionPurpose = scenario.licenceVersionPurpose

      toFinancialYearEnding = scenario.billRun.toFinancialYearEnding
      billingPeriodCount = billingPeriodCounts(toFinancialYearEnding)

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('sends the sroc supplementary bill run, replaces the charge version in the current financial year with changes, then confirms the new bill', async ({
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

      const expectedBillsText =
        billingPeriodCount.sroc === 1 ? '1 Supplementary bill' : `${billingPeriodCount.sroc} Supplementary bills`

      await expect(page.locator('[data-test="bills-count"]')).toContainText(expectedBillsText)
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
      await expect(page.locator('[data-test="number-of-bills-1"]')).toContainText(String(billingPeriodCount.sroc))
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
      // The 1st of September, within the current financial year
      await page.locator('#customDate-day').fill('1')
      await page.locator('#customDate-month').fill('9')
      await page.locator('#customDate-year').fill(String(toFinancialYearEnding - 1))
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText(`Select an existing billing account for ${company.name}`)
      // The first radio's label isn't correctly associated in the markup, so it has no accessible name
      await page.locator('input#billingAccountId').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.getByRole('radio', { name: 'Use charge information valid' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page
        .locator('.govuk-summary-list__row', { hasText: 'Volume' })
        .getByRole('link', { name: 'Change' })
        .click()

      await expect(page.locator('h1')).toContainText('Enter the total quantity to use for this charge reference')
      // A value clearly different from the abstraction data's own volume, so the bill breakdown shows two distinct
      // periods either side of the split
      const newVolume = ((licenceVersionPurpose.annualQuantity * 10) / 1000).toFixed(3)

      await page.locator('#volume').fill(newVolume)
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page
        .locator('.govuk-summary-list__row', { hasText: 'Additional charges apply' })
        .getByRole('link', { name: 'Change' })
        .click()

      await expect(page.locator('h1')).toContainText('Do additional charges apply?')
      // Same markup defect as the billing account radio above
      await page.locator('input#isAdditionalCharges').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Is abstraction from a supported source?')
      // Same markup defect as the billing account radio above
      await page.locator('input#isSupportedSource').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the name of the supported source')
      await page.getByRole('radio', { name: 'Earl Soham - Deben' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page
        .locator('.govuk-summary-list__row', { hasText: 'Adjustments apply' })
        .getByRole('link', { name: 'Change' })
        .click()

      await expect(page.locator('h1')).toContainText('Do adjustments apply?')
      // Same markup defect as the billing account radio above
      await page.locator('input#isAdjustments').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Which adjustments apply?')
      // The scenario's charge reference defaults to a two-part tariff agreement adjustment; swap it for a winter
      // discount so there's exactly one adjustment to assert on afterwards
      await page.getByRole('checkbox', { name: 'Two-part tariff agreement' }).uncheck()
      await page.getByRole('checkbox', { name: 'Winter discount' }).check()
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
      await expect(page.locator('[data-test="bills-count"]')).toContainText('1 Supplementary bill')

      const abstractorsTable = page.locator('[data-test="other-abstractors"]')
      const billRow = abstractorsTable.getByRole('row', { name: billingAccount.accountNumber })

      await expect(billRow).toContainText(company.name)
      await expect(billRow).toContainText(licence.licenceRef)
      await billRow.getByRole('link', { name: 'View' }).click()

      await expect(page.locator('h1')).toContainText(`Billing account ${billingAccount.accountNumber}`)
      await expect(page.locator('[data-test="additional-charges-0"]')).toContainText(
        'Supported source Earl Soham - Deben'
      )
      await expect(page.locator('[data-test="adjustments-0"]')).toContainText('Winter discount')
    })
  }
)

function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
