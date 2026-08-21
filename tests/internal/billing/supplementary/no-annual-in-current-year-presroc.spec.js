import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../support/scenarios/presroc-licence-flagged-for-supplementary-with-previous-annual-bill-run.scenario.js'
import {
  PRESROC_LAST_FINANCIAL_YEAR,
  billingPeriodCounts,
  formatLongDate
} from '../../../support/helpers/date.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe(
  'Create a presroc supplementary bill run with no annual in the current year (internal)',
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

      const [presrocBillingAccountFromScenario, srocBillingAccountFromScenario] = scenario.billingAccounts
      const {
        companies: [companyFromScenario],
        licences: [licenceFromScenario]
      } = scenario

      company = companyFromScenario
      licence = licenceFromScenario
      presrocBillingAccount = presrocBillingAccountFromScenario
      srocBillingAccount = srocBillingAccountFromScenario

      // The supplementary engine bases its calculation on the seeded annual bill run's own year, not the current one.
      // The presroc engine then caps that at 2022, the last presroc financial year
      toFinancialYearEnding = scenario.billRun.toFinancialYearEnding
      billingPeriodCount = billingPeriodCounts(toFinancialYearEnding)
      presrocToFinancialYearEnding = Math.min(toFinancialYearEnding, PRESROC_LAST_FINANCIAL_YEAR)

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('creates the presroc supplementary bill run covering every year since the last annual', async ({ page }) => {
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

      // The presroc engine's bill run is the first ('0') row, ahead of the modern sroc engine's ('1')
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-0"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-0"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Old')
      await expect(page.locator('[data-test="meta-data-year"]')).toContainText(
        `${presrocToFinancialYearEnding - 1} to ${presrocToFinancialYearEnding}`
      )

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

      // The modern sroc engine also gets triggered (see the scenario comment), giving us coverage of both engines
      // running side by side, not just the presroc one
      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-1"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-1"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-1"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-1"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')

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
    })
  }
)
