import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../support/scenarios/licences-with-different-billing-accounts.scenario.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe('Remove a bill from an annual bill run that has not been sent (internal)', () => {
  let scenario

  test.beforeAll(async ({ setup }) => {
    scenario = scenarioData()

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates an annual bill run then removes bill from the bill run and confirms it is not included', async ({
    page
  }) => {
    const formattedCurrentDate = formatLongDate(new Date())
    const [, licenceToRemove] = scenario.licences
    const [, billingAccountToRemove] = scenario.billingAccounts

    await page.goto(`/system/licences/${licenceToRemove.id}/summary`)

    await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)

    await page.getByRole('link', { name: 'Bill runs' }).click()

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

    const otherAbstractorsTable = page.locator('[data-test="other-abstractors"]')

    await otherAbstractorsTable.getByRole('row', { name: licenceToRemove.licenceRef }).getByRole('link').click()

    await expect(page.locator('h1')).toContainText(`Transactions for ${licenceToRemove.licenceRef}`)
    await page.getByRole('button', { name: 'Remove bill' }).click()

    await expect(page.locator('h1')).toContainText(
      `You're about to remove the bill for ${billingAccountToRemove.accountNumber} from the bill run`
    )
    await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
    await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
    await expect(_summaryValue(page, 'Bill run type')).toContainText('Annual')
    await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
    await page.getByRole('button', { name: 'Remove this bill' }).click()

    await expect(page.locator('h1')).toContainText('Test Region annual')
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready', { timeout: 20000 })
    await expect(otherAbstractorsTable.locator('tbody > tr')).toHaveCount(1)

    await page.getByRole('link', { name: 'Search' }).click()
    await page.locator('#query').fill(licenceToRemove.licenceRef)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator('.searchresult-row', { hasText: licenceToRemove.licenceRef }).getByRole('link').click()

    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run.'
    )
  })
})

/**
 * Locates the value cell of a govuk-summary-list row identified by its label
 *
 * @private
 */
function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
