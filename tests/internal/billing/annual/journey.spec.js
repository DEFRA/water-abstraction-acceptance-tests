import { findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { summaryValue } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'
import { reloadUntilGone, reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Annual bill run (internal)', () => {
  test.describe.configure({ mode: 'serial' })

  let user

  test.beforeAll(({ world }) => {
    const scenario = world('licence-with-charge-version')

    user = scenario.user
  })

  test.beforeEach(async ({ login }) => {
    await login(user.username)
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
    await page.getByRole('radio', { name: regions.ANGLIAN.displayName }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunRow = findBillRunRow(page, regions.ANGLIAN, 'Annual')

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: regions.ANGLIAN.displayName, exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Annual', exact: true })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText(`${regions.ANGLIAN.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
    await page.getByRole('button', { name: 'Cancel bill run' }).click()

    await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
    await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
    await expect(summaryValue(page, 'Region')).toContainText(regions.ANGLIAN.displayName)
    await expect(summaryValue(page, 'Bill run type')).toContainText('Annual')
    await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
    await page.getByRole('button', { name: 'Cancel bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')
    await reloadUntilGone(page, billRunRow)
  })

  test('creates an SROC annual bill run and once built confirms and sends it', async ({ page }) => {
    const formattedCurrentDate = formatLongDate(new Date())

    await page.goto('/system/bill-runs')

    await expect(page.locator('h1')).toContainText('Bill runs')
    await page.getByRole('button', { name: 'Create a bill run' }).click()

    await expect(page.locator('h1')).toContainText('Select the bill run type')
    await page.getByRole('radio', { name: 'Annual' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the region')
    await page.getByRole('radio', { name: regions.ANGLIAN.displayName }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunRow = findBillRunRow(page, regions.ANGLIAN, 'Annual')

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: regions.ANGLIAN.displayName, exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Annual', exact: true })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText(`${regions.ANGLIAN.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await expect(page.locator('h1')).toContainText("You're about to send this bill run")
    await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
    await expect(summaryValue(page, 'Region')).toContainText(regions.ANGLIAN.displayName)
    await expect(summaryValue(page, 'Bill run type')).toContainText('Annual')
    await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
    await page.locator('#main-content > div > div > p:nth-child(4) > a').click()

    await expect(page.locator('h1')).toContainText(`${regions.ANGLIAN.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

    await page.getByRole('link', { name: 'Go back to bill runs' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: regions.ANGLIAN.displayName, exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Annual', exact: true })).toBeVisible()
    await expect(billRunRow.locator('.govuk-tag')).toContainText('sent')
  })
})
