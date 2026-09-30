import { billRunRow as findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe(
  'Create an supplementary bill run with no annual in the current year (internal)',
  { tag: ['@supplementary-billing'] },
  () => {
    let billingAccount
    let company
    let licence
    let toFinancialYearEnding

    test.beforeAll(async ({ world }) => {
      const scenario = world('licence-flagged-for-supplementary-with-no-current-annual-bill-run')

      billingAccount = scenario.billingAccount
      company = scenario.company
      licence = scenario.licence

      // The supplementary engine bases its calculation on the seeded annual bill run's own year, not the current one
      toFinancialYearEnding = scenario.billRuns[0].toFinancialYearEnding
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('creates the supplementary bill run covering every year since the last annual', async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.NORTH_EAST.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // With no annual bill run in the current year, creating a supplementary bill run also triggers the legacy
      // presroc engine, even though no licence here is flagged for it. So there is an old charge scheme run as well as
      // the current one we want
      const srocBillRunRow = findBillRunRow(page, regions.NORTH_EAST, 'Supplementary', { oldChargeScheme: false })

      await reloadUntilTextFound(page, srocBillRunRow.locator('.govuk-tag'), 'ready')
      await expect(srocBillRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(
        srocBillRunRow.getByRole('cell', { name: regions.NORTH_EAST.displayName, exact: true })
      ).toBeVisible()
      await srocBillRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_EAST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.NORTH_EAST.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="meta-data-year"]')).toContainText(
        `${toFinancialYearEnding - 1} to ${toFinancialYearEnding}`
      )

      const otherAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(otherAbstractorsTable).toBeVisible()

      const billRowMostRecentYear = otherAbstractorsTable.getByRole('row', { name: String(toFinancialYearEnding) })

      await expect(billRowMostRecentYear).toContainText(billingAccount.accountNumber)
      await expect(billRowMostRecentYear).toContainText(company.name)
      await expect(billRowMostRecentYear).toContainText(licence.licenceRef)
      await expect(billRowMostRecentYear).not.toContainText('£0.00')
      await expect(billRowMostRecentYear).toContainText(String(toFinancialYearEnding))
      await expect(billRowMostRecentYear.getByRole('link', { name: 'View' })).toBeVisible()

      // The presroc engine also gets triggered (see the comment above), but no licence here is flagged for it, so its
      // bill run ends up empty
      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')

      const presrocBillRunRow = findBillRunRow(page, regions.NORTH_EAST, 'Supplementary', { oldChargeScheme: true })

      await reloadUntilTextFound(page, presrocBillRunRow.locator('.govuk-tag'), 'empty')
      await expect(
        presrocBillRunRow.getByRole('cell', { name: regions.NORTH_EAST.displayName, exact: true })
      ).toBeVisible()
      await presrocBillRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_EAST.displayName} supplementary`)
      await expect(page.locator('#main-content .govuk-tag')).toContainText('empty')
      await expect(page.getByRole('alert')).toContainText('There are no licences ready for this bill run')
    })
  }
)
