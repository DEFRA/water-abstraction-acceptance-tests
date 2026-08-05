import scenarioData from '../../../support/scenarios/water-company-licence-with-charge-version.scenario.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { test, expect } from '../../../support/fixtures.js'
import { reloadUntilGone, reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Cancel an existing annual bill run (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('cancels an annual bill run that has already finished building', async ({ page }) => {
    const formattedCurrentDate = formatLongDate(new Date())

    await page.goto('/system/bill-runs')

    await expect(page.locator('h1')).toContainText('Bill runs')
    await page.getByRole('button', { name: 'Create a bill run' }).click()

    await expect(page.locator('h1')).toContainText('Select the bill run type')
    await page.getByRole('radio', { name: 'Annual' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the region')
    await page.getByRole('radio', { name: 'Test Region' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunsTable = page.locator('table.govuk-table')
    const billRunRow = billRunsTable.getByRole('row', { name: 'Test Region' })

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Test Region', exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Annual', exact: true })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText('Test Region annual')
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
    await expect(page.locator('[data-test="water-companies"]')).toBeVisible()
    await expect(page.locator('[data-test="other-abstractors"]')).toHaveCount(0)
    await page.getByRole('button', { name: 'Cancel bill run' }).click()

    await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
    await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
    await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Annual')
    await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
    await page.getByRole('button', { name: 'Cancel bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')
    await reloadUntilGone(page, billRunsTable.getByRole('row', { name: 'Test Region' }))
  })
})
