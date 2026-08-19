import scenarioData from '../../../support/scenarios/presroc-licence-flagged-for-supplementary-with-current-annual-bill-run.scenario.js'
import { test, expect } from '../../../support/fixtures.js'
import {
  billingPeriodCounts,
  formatLongDate,
  PRESROC_LAST_FINANCIAL_YEAR
} from '../../../support/helpers/date.helpers.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe(
  'Create and send supplementary bill runs (internal)',
  { tag: ['@presroc', '@supplementary-billing'] },
  () => {
    let billingPeriodCount
    let company
    let licence
    let presrocBillingAccount
    let presrocToFinancialYearEnding
    let srocBillingAccount
    let toFinancialYearEnding

    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

      const {
        companies: [companyFromScenario],
        licences: [licenceFromScenario]
      } = scenario
      const [presrocBillingAccountFromScenario, srocBillingAccountFromScenario] = scenario.billingAccounts

      company = companyFromScenario
      licence = licenceFromScenario
      presrocBillingAccount = presrocBillingAccountFromScenario
      srocBillingAccount = srocBillingAccountFromScenario

      toFinancialYearEnding = scenario.billRun.toFinancialYearEnding
      billingPeriodCount = billingPeriodCounts(toFinancialYearEnding)
      presrocToFinancialYearEnding = Math.min(toFinancialYearEnding, PRESROC_LAST_FINANCIAL_YEAR)

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('creates both the presroc and sroc supplementary bill runs and once built sends them', async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto(`/system/licences/${licence.id}/summary`)

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next supplementary bill runs for the current and old charge schemes.'
      )

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

      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')

      const expectedPresrocBillsText =
        billingPeriodCount.presroc === 1 ? '1 Supplementary bill' : `${billingPeriodCount.presroc} Supplementary bills`

      await expect(page.locator('[data-test="bills-count"]')).toContainText(expectedPresrocBillsText)

      const presrocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(presrocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.presroc; index++) {
        const billedFinancialYear = presrocToFinancialYearEnding - index
        const billRow = presrocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(presrocBillingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
      await expect(_summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Old')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      const sentPresrocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(sentPresrocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.presroc; index++) {
        const billedFinancialYear = presrocToFinancialYearEnding - index
        const billRow = sentPresrocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(presrocBillingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="number-of-bills-0"]')).toContainText(String(billingPeriodCount.presroc))
      await expect(page.locator('[data-test="bill-run-status-0"] > .govuk-tag')).toContainText('sent')

      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')

      const expectedSrocBillsText =
        billingPeriodCount.sroc === 1 ? '1 Supplementary bill' : `${billingPeriodCount.sroc} Supplementary bills`

      await expect(page.locator('[data-test="bills-count"]')).toContainText(expectedSrocBillsText)

      const srocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(srocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.sroc; index++) {
        const billedFinancialYear = toFinancialYearEnding - index
        const billRow = srocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(srocBillingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
      await expect(_summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      const sentSrocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(sentSrocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.sroc; index++) {
        const billedFinancialYear = toFinancialYearEnding - index
        const billRow = sentSrocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(srocBillingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await expect(page.locator('[data-test="date-created-1"] > .govuk-link')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-1"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-1"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="number-of-bills-1"]')).toContainText(String(billingPeriodCount.sroc))
      await expect(page.locator('[data-test="bill-run-status-1"] > .govuk-tag')).toContainText('sent')

      await page.getByRole('link', { name: 'Search' }).click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row').getByRole('link', { name: licence.licenceRef }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)
    })
  }
)

/**
 * Locates the value cell of a govuk-summary-list row identified by its label
 */
function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
