import scenarioData from '../../../support/scenarios/licences-with-shared-billing-account.scenario.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { test, expect } from '../../../support/fixtures.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Remove a licence from an annual bill run that has not been sent (internal)', () => {
  let scenario

  test.beforeAll(async ({ setup }) => {
    scenario = scenarioData()

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates an annual bill run then removes a licence from the bill run and confirms it is not included', async ({
    page
  }) => {
    const formattedCurrentDate = formatLongDate(new Date())
    const [licenceToRemove, remainingLicenceOnSharedAccount] = scenario.licences
    const [billingAccountToRemove] = scenario.billingAccounts

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
    const sharedBillingAccountRow = otherAbstractorsTable.getByRole('row', {
      name: billingAccountToRemove.accountNumber
    })

    await expect(sharedBillingAccountRow).toContainText(licenceToRemove.licenceRef)
    await expect(sharedBillingAccountRow).toContainText(remainingLicenceOnSharedAccount.licenceRef)

    await sharedBillingAccountRow.getByRole('link', { name: 'View' }).click()

    await expect(page.locator('h1')).toContainText(billingAccountToRemove.accountNumber)

    const billLicencesTable = page.locator('[data-test="licences"]')

    await billLicencesTable
      .getByRole('row', { name: licenceToRemove.licenceRef })
      .getByRole('link', { name: 'View transactions' })
      .click()

    await expect(page.locator('h1')).toContainText(`Transactions for ${licenceToRemove.licenceRef}`)
    await page.getByRole('button', { name: 'Remove licence' }).click()

    await expect(page.locator('h1')).toContainText(
      `You're about to remove ${licenceToRemove.licenceRef} from the bill run`
    )

    const [companyOnSharedBillingAccount] = scenario.companies

    await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
    await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
    await expect(_summaryValue(page, 'Bill run type')).toContainText('Annual')
    await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
    await expect(_summaryValue(page, 'Billing account')).toContainText(billingAccountToRemove.accountNumber)
    await expect(_summaryValue(page, 'Bill for')).toContainText(companyOnSharedBillingAccount.name)
    await page.getByRole('button', { name: 'Remove this licence' }).click()

    await reloadUntilTextFound(page, page.locator('#main-content .govuk-tag'), 'ready')
    await expect(page.locator('h1')).toContainText(`Transactions for ${remainingLicenceOnSharedAccount.licenceRef}`)
    await page.getByRole('link', { name: /Go back to bill run/ }).click()

    await expect(page.locator('h1')).toContainText('Test Region annual')
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await expect(page.locator('h1')).toContainText("You're about to send this bill run")
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await reloadUntilTextFound(page, page.locator('h1'), 'Bill run sent')
    await page.getByRole('link', { name: 'Go to bill run' }).click()

    await expect(page.locator('h1')).toContainText('Test Region annual')
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

    await expect(sharedBillingAccountRow).not.toContainText(licenceToRemove.licenceRef)
    await expect(sharedBillingAccountRow).toContainText(remainingLicenceOnSharedAccount.licenceRef)
  })
})

/**
 * Locates the value cell of a govuk-summary-list row identified by its label
 */
function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
