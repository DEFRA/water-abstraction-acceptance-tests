import { findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { calculatedDates } from '../../../support/helpers/calculated-dates.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions, users } from '../../../support/default-values.js'
import { expect, test } from '../../../support/fixtures.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Create a empty two-part tariff bill run (internal)', () => {
  let endYear

  test.beforeAll(() => {
    const { currentFinancialYear } = calculatedDates()

    // The year before the current two-part tariff year ends before any seeded Midlands licence starts, so it is empty
    endYear = currentFinancialYear.endDate.getFullYear() - 2
  })

  test.beforeEach(async ({ login }) => {
    await login(users.BILLING_AND_DATA)
  })

  test('creates an empty two-part tariff bill run', async ({ page }) => {
    const formattedCurrentDate = formatLongDate(new Date())

    await page.goto('/system/bill-runs')

    await expect(page.locator('h1')).toContainText('Bill runs')
    await page.getByRole('button', { name: 'Create a bill run' }).click()

    await expect(page.locator('h1')).toContainText('Select the bill run type')
    await page.getByRole('radio', { exact: true, name: 'Two-part tariff' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the region')
    await page.getByRole('radio', { name: regions.MIDLANDS.displayName }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the financial year')
    await page.getByRole('radio', { name: `${endYear - 1} to ${endYear}` }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunRow = findBillRunRow(page, regions.MIDLANDS, 'Two-part tariff', { sent: false })

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'empty')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { exact: true, name: regions.MIDLANDS.displayName })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { exact: true, name: 'Two-part tariff' })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText(`${regions.MIDLANDS.displayName} two-part tariff`)
    await expect(page.locator('#main-content .govuk-tag')).toContainText('empty')
    await expect(page.getByRole('alert')).toContainText('There are no licences ready for this bill run')
  })
})
