import { findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe('Create an annual bill run with a licence and a water company licence (internal)', () => {
  let scenario

  test.beforeAll(async ({ world }) => {
    scenario = world('licence-and-water-company-licence')
  })

  test.beforeEach(async ({ login }) => {
    await login(scenario.users[0].username)
  })

  test('creates an annual bill run and bills a licence and a water company licence', async ({ page }) => {
    const formattedCurrentDate = formatLongDate(new Date())
    const [licence, waterCompanyLicence] = scenario.licences
    const [billingAccount, waterCompanyBillingAccount] = scenario.billingAccounts
    const [company, waterCompanyCompany] = scenario.companies

    await page.goto('/system/bill-runs')

    await expect(page.locator('h1')).toContainText('Bill runs')
    await page.getByRole('button', { name: 'Create a bill run' }).click()

    await expect(page.locator('h1')).toContainText('Select the bill run type')
    await page.getByRole('radio', { name: 'Annual' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the region')
    await page.getByRole('radio', { name: regions.MIDLANDS.displayName }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the bill run to be created')
    await page.getByRole('button', { name: 'Create bill run' }).click()

    await expect(page.locator('h1')).toContainText('Bill runs')

    const billRunRow = findBillRunRow(page, regions.MIDLANDS, 'Annual')

    await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
    await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: regions.MIDLANDS.displayName, exact: true })).toBeVisible()
    await expect(billRunRow.getByRole('cell', { name: 'Annual', exact: true })).toBeVisible()
    await billRunRow.getByRole('link').click()

    await expect(page.locator('h1')).toContainText(`${regions.MIDLANDS.displayName} annual`)
    await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')

    const waterCompaniesTable = page.locator('[data-test="water-companies"]')
    const waterCompanyLicenceRow = waterCompaniesTable.getByRole('row', { name: waterCompanyLicence.licenceRef })

    await expect(waterCompanyLicenceRow).toContainText(waterCompanyCompany.name)
    await expect(waterCompanyLicenceRow).toContainText(waterCompanyBillingAccount.accountNumber)

    const otherAbstractorsTable = page.locator('[data-test="other-abstractors"]')
    const licenceRow = otherAbstractorsTable.getByRole('row', { name: licence.licenceRef })

    await expect(licenceRow).toContainText(company.name)
    await expect(licenceRow).toContainText(billingAccount.accountNumber)
  })
})
