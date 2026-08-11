import scenarioData from '../../../support/scenarios/sroc-billing.scenario.js'
import { test, expect } from '../../../support/fixtures.js'
import { billingPeriodCounts, formatLongDate } from '../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Create supplementary bill runs with no annual in the current year (internal)', () => {
  let billingPeriodCount
  let startYear
  let endYear

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()

    endYear = new Date(dates.currentFinancialYear.endDate).getUTCFullYear()
    startYear = endYear - 2

    // The annual bill run seeded by the scenario is for the previous year, not the current one. So, the financial
    // year the supplementary engine bases its calculation on is the previous year, not the current one
    billingPeriodCount = billingPeriodCounts(endYear - 1)

    const scenario = scenarioData()

    // Shift the fixture's seeded annual bill run out of the current year and into the previous one, so this test's
    // supplementary bill run has no annual in the current year to pick up from
    scenario.billRuns[0].fromFinancialYearEnding = startYear
    scenario.billRuns[0].toFinancialYearEnding = endYear - 1

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates both the presroc and sroc supplementary bill runs in the current year where no annual exists', async ({
    page
  }) => {
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

    // With no annual bill run in the current year, creating a supplementary bill run triggers both a presroc and a
    // sroc supplementary bill run. The sroc one takes longer to build, so it's the second ('1') row, behind the
    // presroc one
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
    await expect(page.locator('[data-test="meta-data-year"]')).toContainText(`${startYear} to ${endYear - 1}`)
  })
})
