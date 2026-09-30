import { billRunRow as findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import { summaryValue } from '../../../support/helpers/govuk.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe('Remove a bill and a licence from an annual bill run (internal)', () => {
  test.describe.configure({ mode: 'serial' })

  let billRunUrl
  let scenario

  test.beforeAll(({ world }) => {
    scenario = world('licences-for-annual-bill-run-removals')
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates an annual bill run then removes a bill from it and confirms it is not included', async ({ page }) => {
    const formattedCurrentDate = formatLongDate(new Date())
    const [licenceToKeep, licenceToRemove] = scenario.licences
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
    await page.getByRole('radio', { name: regions.WALES.displayName }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunRow = findBillRunRow(page, regions.WALES, 'Annual')

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: regions.WALES.displayName, exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Annual', exact: true })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText(`${regions.WALES.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')

    billRunUrl = page.url()

    const otherAbstractorsTable = page.locator('[data-test="other-abstractors"]')

    await otherAbstractorsTable.getByRole('row', { name: licenceToRemove.licenceRef }).getByRole('link').click()

    await expect(page.locator('h1')).toContainText(`Transactions for ${licenceToRemove.licenceRef}`)
    await page.getByRole('button', { name: 'Remove bill' }).click()

    await expect(page.locator('h1')).toContainText(
      `You're about to remove the bill for ${billingAccountToRemove.accountNumber} from the bill run`
    )
    await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
    await expect(summaryValue(page, 'Region')).toContainText(regions.WALES.displayName)
    await expect(summaryValue(page, 'Bill run type')).toContainText('Annual')
    await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
    await page.getByRole('button', { name: 'Remove this bill' }).click()

    await expect(page.locator('h1')).toContainText(`${regions.WALES.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready', { timeout: 20000 })
    await expect(otherAbstractorsTable.getByRole('row', { name: licenceToRemove.licenceRef })).toHaveCount(0)
    await expect(otherAbstractorsTable.getByRole('row', { name: licenceToKeep.licenceRef })).toBeVisible()

    await page.getByRole('link', { name: 'Search' }).click()
    await page.locator('#query').fill(licenceToRemove.licenceRef)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator('.searchresult-row', { hasText: licenceToRemove.licenceRef }).getByRole('link').click()

    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run.'
    )
  })

  test('removes a licence from a shared bill and confirms it is not included', async ({ page }) => {
    const formattedCurrentDate = formatLongDate(new Date())
    const [, , licenceToRemove, remainingLicenceOnSharedAccount] = scenario.licences
    const [, , sharedBillingAccount] = scenario.billingAccounts
    const [, , companyOnSharedBillingAccount] = scenario.companies

    await page.goto(billRunUrl)

    await expect(page.locator('h1')).toContainText(`${regions.WALES.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')

    const otherAbstractorsTable = page.locator('[data-test="other-abstractors"]')
    const sharedBillingAccountRow = otherAbstractorsTable.getByRole('row', {
      name: sharedBillingAccount.accountNumber
    })

    await expect(sharedBillingAccountRow).toContainText(licenceToRemove.licenceRef)
    await expect(sharedBillingAccountRow).toContainText(remainingLicenceOnSharedAccount.licenceRef)

    await sharedBillingAccountRow.getByRole('link', { name: 'View' }).click()

    await expect(page.locator('h1')).toContainText(sharedBillingAccount.accountNumber)

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
    await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
    await expect(summaryValue(page, 'Region')).toContainText(regions.WALES.displayName)
    await expect(summaryValue(page, 'Bill run type')).toContainText('Annual')
    await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
    await expect(summaryValue(page, 'Billing account')).toContainText(sharedBillingAccount.accountNumber)
    await expect(summaryValue(page, 'Bill for')).toContainText(companyOnSharedBillingAccount.name)
    await page.getByRole('button', { name: 'Remove this licence' }).click()

    await reloadUntilTextFound(page, page.locator('#main-content .govuk-tag'), 'ready')
    await expect(page.locator('h1')).toContainText(`Transactions for ${remainingLicenceOnSharedAccount.licenceRef}`)
    await page.getByRole('link', { name: /Go back to bill run/ }).click()

    await expect(page.locator('h1')).toContainText(`${regions.WALES.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
    await expect(sharedBillingAccountRow).not.toContainText(licenceToRemove.licenceRef)
    await expect(sharedBillingAccountRow).toContainText(remainingLicenceOnSharedAccount.licenceRef)
  })

  test('sends the bill run and confirms the removed bill and licence are not included', async ({ page }) => {
    const [licenceToKeep, removedBillLicence, removedLicence, remainingLicenceOnSharedAccount] = scenario.licences
    const [, , sharedBillingAccount] = scenario.billingAccounts

    await page.goto(billRunUrl)

    await expect(page.locator('h1')).toContainText(`${regions.WALES.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await expect(page.locator('h1')).toContainText("You're about to send this bill run")
    await page.getByRole('button', { name: 'Send bill run' }).click()

    await reloadUntilTextFound(page, page.locator('h1'), 'Bill run sent')
    await page.getByRole('link', { name: 'Go to bill run' }).click()

    await expect(page.locator('h1')).toContainText(`${regions.WALES.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

    const otherAbstractorsTable = page.locator('[data-test="other-abstractors"]')
    const sharedBillingAccountRow = otherAbstractorsTable.getByRole('row', {
      name: sharedBillingAccount.accountNumber
    })

    await expect(otherAbstractorsTable.getByRole('row', { name: licenceToKeep.licenceRef })).toBeVisible()
    await expect(otherAbstractorsTable.getByRole('row', { name: removedBillLicence.licenceRef })).toHaveCount(0)
    await expect(sharedBillingAccountRow).not.toContainText(removedLicence.licenceRef)
    await expect(sharedBillingAccountRow).toContainText(remainingLicenceOnSharedAccount.licenceRef)
  })
})
