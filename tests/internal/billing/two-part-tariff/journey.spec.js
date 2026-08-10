import scenarioData from '../../../support/scenarios/presroc-licence-with-agreement-and-due-return.scenario.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { test, expect } from '../../../support/fixtures.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Create and send PRESROC two-part tariff bill run (internal)', () => {
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    licence = scenario.licence

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a PRESROC two-part tariff bill run and once built confirms and sends it', async ({ page }) => {
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
    await page.getByRole('radio', { name: '2021 to 2022' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the season')
    await page.getByRole('radio', { name: 'Winter and all year' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunsTable = page.locator('table.govuk-table')
    const billRunRow = billRunsTable.getByRole('row', { name: 'Test Region' })

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'review')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Test Region', exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Two-part tariff winter and all year' })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText('Review data issues')
    await expect(page.locator('#main-content')).toContainText(
      'You need to review 1 licence with returns data issues before you can continue'
    )

    const dataIssuesTable = page.locator('#dataIssues')

    await expect(dataIssuesTable.getByRole('cell', { name: licence.licenceRef })).toBeVisible()
    await expect(dataIssuesTable.getByRole('cell', { name: 'Big Farm Co Ltd' })).toBeVisible()
    await expect(dataIssuesTable.getByRole('cell', { name: 'No returns received' })).toBeVisible()
    await dataIssuesTable.getByRole('link', { name: 'Review' }).click()

    await expect(page.locator('h1')).toContainText(`Review data issues for ${licence.licenceRef}`)
    await expect(page.locator('tbody')).toContainText('0Ml')
    await page.getByRole('link', { name: 'Change element' }).click()

    await expect(page.locator('h1')).toContainText('Set the billable returns quantity for this bill run')
    await page.locator('input#quantity').check()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.locator('#main-content')).toContainText(
      'You have resolved all returns data issues. Continue to generate bills.'
    )
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText("You're about to generate the two-part tariff bills")
    await expect(_definitionValue(page, 'Date created')).toContainText(formattedCurrentDate)
    await expect(_definitionValue(page, 'Region')).toContainText('Test Region')
    await expect(_definitionValue(page, 'Bill run type')).toContainText('Two-part tariff winter and all year')
    await expect(_definitionValue(page, 'Status')).toContainText('Review')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready', { timeout: 20000 })
    await expect(page.locator('[data-test="bills-count"]')).toContainText('1 Two-part tariff winter and all year bill')
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await expect(page.locator('h1')).toContainText("You're about to send this bill run")
    await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
    await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
    await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Two-part tariff winter and all year')
    await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Old')
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
    await page.getByRole('link', { name: 'Go to bill run' }).click()

    await expect(page.locator('h1')).toContainText('Test Region two-part tariff')
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

    await page.getByRole('link', { name: 'Go back to bill runs' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toContainText('Old charge scheme')
    await expect(billRunRow.getByRole('cell', { name: 'Test Region', exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Two-part tariff winter and all year' })).toBeVisible()
    await expect(billRunRow.locator('[data-test^="number-of-bills-"]')).toContainText('1')
    await expect(billRunRow.locator('.govuk-tag')).toContainText('sent')
  })
})

/**
 * Locates the `dd` value following the `dt` term matching the given label
 */
function _definitionValue(page, label) {
  return page.locator(`dt:text-is("${label}") + dd`)
}
