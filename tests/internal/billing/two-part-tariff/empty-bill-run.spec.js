import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { test, expect } from '../../../support/fixtures.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Create a empty two-part tariff bill run (internal)', () => {
  let endYear

  test.beforeAll(async ({ tearDown, calculatedDates }) => {
    const dates = await calculatedDates()

    const {
      billingPeriods: {
        twoPartTariff: [twoPartTariffPeriod]
      }
    } = dates

    endYear = new Date(twoPartTariffPeriod.endDate).getFullYear()

    await tearDown()
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates an empty two-part tariff bill run', async ({ page }) => {
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

    const billRunsTable = page.locator('table.govuk-table')
    const billRunRow = billRunsTable.getByRole('row', { name: 'Test Region' })

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'empty')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Test Region', exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Two-part tariff', exact: true })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText('Test Region two-part tariff')
    await expect(page.locator('#main-content .govuk-tag')).toContainText('empty')
    await expect(page.getByRole('alert')).toContainText('There are no licences ready for this bill run')
  })
})
