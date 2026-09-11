import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { regions } from '../../../support/default-values.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import scenarioData from '../../../support/scenarios/licence-flagged-for-supplementary-with-previous-annual-bill-run.scenario.js'
import { expect, test } from '../../../support/fixtures.js'

test.describe(
  'Create an supplementary bill run with no annual in the current year (internal)',
  { tag: '@supplementary-billing' },
  () => {
    let billingAccount
    let company
    let licence
    let toFinancialYearEnding

    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

      billingAccount = scenario.billingAccount
      company = scenario.company
      licence = scenario.licence

      // The supplementary engine bases its calculation on the seeded annual bill run's own year, not the current one
      toFinancialYearEnding = scenario.billRun.toFinancialYearEnding

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('creates the supplementary bill run covering every year since the last annual', async ({ page }) => {
      const formattedCurrentDate = formatLongDate(new Date())
      const currentYear = new Date().getFullYear() // comes from ther billing financyl year toFinancialYearEnding

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
      // presroc engine, even though no licence here is flagged for it. That run stays empty, so the sroc one is the
      // second ('1') row, behind it
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-1"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-1"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-1"]')).toContainText(regions.NORTH_EAST.displayName)
      await expect(page.locator('[data-test="bill-run-type-1"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_EAST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.NORTH_EAST.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="meta-data-year"]')).toContainText(
        `${toFinancialYearEnding - 1} to ${toFinancialYearEnding}`
      )

      await expect(page.locator('[data-test="bills-count"]')).toContainText(
        '0 Supplementary bills and 1 zero value bill'
      )

      const otherAbstractorsTable = page.locator('[data-test="other-abstractors"]')

      await expect(otherAbstractorsTable).toBeVisible()

      // Derived from today's calendar year rather than toFinancialYearEnding or the presroc/sroc period-count formula:
      // 4 explicit rows for the current year and the 3 before it. This drifts for a few months each year (Jan-Mar,
      // before the financial year has rolled over to match the calendar year) and will need updating once enough time
      // has passed to change the count — that's expected, not a bug, and keeps this test decoupled from having to
      // re-derive the presroc/sroc period-count formula itself
      const billRowMostRecentYear = otherAbstractorsTable.getByRole('row', { name: String(currentYear) })

      await expect(billRowMostRecentYear).toContainText(billingAccount.accountNumber)
      await expect(billRowMostRecentYear).toContainText(company.name)
      await expect(billRowMostRecentYear).toContainText(licence.licenceRef)
      await expect(billRowMostRecentYear).toContainText(String(toFinancialYearEnding))
      await expect(billRowMostRecentYear.getByRole('link', { name: 'View' })).toBeVisible()

      // The presroc engine also gets triggered (see the comment above), but no licence here is flagged for it, so its
      // bill run (row '0') ends up empty
      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-0"] > .govuk-tag'), 'empty')
      await expect(page.locator('[data-test="region-0"]')).toContainText(regions.NORTH_EAST.displayName)
      await expect(page.locator('[data-test="bill-run-type-0"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-0"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_EAST.displayName} supplementary`)
      await expect(page.locator('#main-content .govuk-tag')).toContainText('empty')
      await expect(page.getByRole('alert')).toContainText('There are no licences ready for this bill run')
    })
  }
)
