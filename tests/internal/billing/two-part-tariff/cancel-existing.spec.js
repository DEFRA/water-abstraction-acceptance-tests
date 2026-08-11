import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { test, expect } from '../../../support/fixtures.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Cancel an existing two-part tariff bill run (internal)', () => {
  test.beforeAll(async ({ tearDown }) => {
    await tearDown()
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('cancels a PRESROC two-part tariff bill run that has already finished building', async ({ page }) => {
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
    await page.getByRole('radio', { name: '2020 to 2021' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the season')
    await page.getByRole('radio', { name: 'Winter and All year' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunsTable = page.locator('table.govuk-table')
    const billRunRow = billRunsTable.getByRole('row', { name: 'Test Region' })

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'empty')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Test Region', exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Two-part tariff' })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText('Test Region two-part tariff')
    await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
    await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff winter and all year')
    await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Old')
    await page.getByRole('button', { name: 'Cancel bill run' }).click()

    await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
    await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
    await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff winter and all year')
    await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Old')
    await page.getByRole('button', { name: 'Cancel bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')
  })
})
