import { findBillRunRow } from '../../../support/helpers/bill-run.helpers.js'
import { regions } from '../../../support/default-values.js'
import { summaryValue } from '../../../support/helpers/govuk.helpers.js'
import {
  PRESROC_LAST_FINANCIAL_YEAR,
  billingPeriodCounts,
  formatLongDate
} from '../../../support/helpers/date.helpers.js'
import { expect, test } from '../../../support/fixtures.js'
import { reloadUntilGone, reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe(
  'Presroc and sroc supplementary bill runs (internal)',
  { tag: ['@presroc', '@supplementary-billing'] },
  () => {
    test.describe.configure({ mode: 'serial' })

    let billingPeriodCount
    let company
    let licence
    let billingAccount
    let presrocToFinancialYearEnding
    let toFinancialYearEnding
    let user

    test.beforeAll(({ world }) => {
      const scenario = world('presroc-licence-flagged-for-supplementary')

      company = scenario.company
      licence = scenario.licence
      billingAccount = scenario.billingAccount

      toFinancialYearEnding = scenario.billRuns[0].toFinancialYearEnding
      user = scenario.user
      billingPeriodCount = billingPeriodCounts(toFinancialYearEnding)
      presrocToFinancialYearEnding = Math.min(toFinancialYearEnding, PRESROC_LAST_FINANCIAL_YEAR)
    })

    test.beforeEach(async ({ login }) => {
      await login(user.username)
    })

    test('cancels both the presroc and sroc supplementary bill runs once built', async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.SOUTHERN.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      const presrocBillRunRow = findBillRunRow(page, regions.SOUTHERN, 'Supplementary', { oldChargeScheme: true })
      const srocBillRunRow = findBillRunRow(page, regions.SOUTHERN, 'Supplementary', { oldChargeScheme: false })

      await reloadUntilTextFound(page, presrocBillRunRow.locator('.govuk-tag'), 'ready')
      await expect(presrocBillRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(
        presrocBillRunRow.getByRole('cell', { name: regions.SOUTHERN.displayName, exact: true })
      ).toBeVisible()
      await presrocBillRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.SOUTHERN.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Old')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.SOUTHERN.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Old')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      await reloadUntilTextFound(page, srocBillRunRow.locator('.govuk-tag'), 'ready')
      await srocBillRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.SOUTHERN.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to cancel this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.SOUTHERN.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Cancel bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await reloadUntilGone(page, findBillRunRow(page, regions.SOUTHERN, 'Supplementary'))
    })

    test('creates both the presroc and sroc supplementary bill runs and once built sends them', async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto(`/system/licences/${licence.id}/summary`)

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next supplementary bill runs for the current and old charge schemes.'
      )

      await page.getByRole('link', { name: 'Bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.SOUTHERN.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      const presrocBillRunRow = findBillRunRow(page, regions.SOUTHERN, 'Supplementary', { oldChargeScheme: true })
      const srocBillRunRow = findBillRunRow(page, regions.SOUTHERN, 'Supplementary', { oldChargeScheme: false })

      await reloadUntilTextFound(page, presrocBillRunRow.locator('.govuk-tag'), 'ready')
      await expect(presrocBillRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(
        presrocBillRunRow.getByRole('cell', { name: regions.SOUTHERN.displayName, exact: true })
      ).toBeVisible()
      await presrocBillRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')

      const presrocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(presrocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.presroc; index++) {
        const billedFinancialYear = presrocToFinancialYearEnding - index
        const billRow = presrocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(billingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.SOUTHERN.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Old')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      const sentPresrocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(sentPresrocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.presroc; index++) {
        const billedFinancialYear = presrocToFinancialYearEnding - index
        const billRow = sentPresrocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(billingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await expect(presrocBillRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(
        presrocBillRunRow.getByRole('cell', { name: regions.SOUTHERN.displayName, exact: true })
      ).toBeVisible()
      await expect(presrocBillRunRow.locator('[data-test^="number-of-bills-"]')).toContainText(String(0))
      await expect(presrocBillRunRow.locator('.govuk-tag')).toContainText('sent')

      await srocBillRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')

      const srocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(srocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.sroc; index++) {
        const billedFinancialYear = toFinancialYearEnding - index
        const billRow = srocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(billingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.SOUTHERN.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 30000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText(`${regions.SOUTHERN.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      const sentSrocAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(sentSrocAbstractorsTable).toBeVisible()

      for (let index = 0; index < billingPeriodCount.sroc; index++) {
        const billedFinancialYear = toFinancialYearEnding - index
        const billRow = sentSrocAbstractorsTable.getByRole('row', { name: String(billedFinancialYear) })

        await expect(billRow).toContainText(billingAccount.accountNumber)
        await expect(billRow).toContainText(company.name)
        await expect(billRow).toContainText(licence.licenceRef)
        await expect(billRow).not.toContainText('£0.00')
        await expect(billRow.getByRole('link', { name: 'View' })).toBeVisible()
      }

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await expect(srocBillRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(srocBillRunRow.getByRole('cell', { name: regions.SOUTHERN.displayName, exact: true })).toBeVisible()
      await expect(srocBillRunRow.locator('[data-test^="number-of-bills-"]')).toContainText(
        String(billingPeriodCount.sroc)
      )
      await expect(srocBillRunRow.locator('.govuk-tag')).toContainText('sent')

      await page.getByRole('link', { name: 'Search' }).click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row').getByRole('link', { name: licence.licenceRef }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await expect(page.locator('.govuk-notification-banner__content')).toHaveCount(0)
    })
  }
)
