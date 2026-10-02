import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'
import {
  SROC_FIRST_FINANCIAL_YEAR,
  billingPeriodCounts,
  formatLongDate
} from '../../../support/helpers/date.helpers.js'
import { expect, test } from '../../../support/fixtures.js'
import { findBillRunRow, findBillRunRowByLink } from '../../../support/helpers/bill-run.helpers.js'
import { regions, srocStartDate } from '../../../support/default-values.js'
import { summaryValue, tableRow } from '../../../support/helpers/govuk.helpers.js'

test.describe(
  'Sroc supplementary bill runs after charge changes (internal)',
  { tag: ['@supplementary-billing'] },
  () => {
    test.describe.configure({ mode: 'serial' })

    let billingAccounts
    let billingPeriodCount
    let companies
    let licences
    let licenceVersionPurposes
    let toFinancialYearEnding
    let user

    test.beforeAll(async ({ browser, loginCookies, logoutCookies, world }) => {
      const scenario = world('licences-flagged-for-supplementary')

      billingAccounts = scenario.billingAccounts
      companies = scenario.companies
      licences = scenario.licences
      licenceVersionPurposes = scenario.licenceVersionPurposes
      user = scenario.user

      toFinancialYearEnding = scenario.billRuns[0].toFinancialYearEnding
      billingPeriodCount = billingPeriodCounts(toFinancialYearEnding)

      const sessionCookies = await loginCookies(user)
      const context = await browser.newContext()

      await context.addCookies(sessionCookies)

      const page = await context.newPage()
      const formattedCurrentDate = formatLongDate(new Date())
      const billCount = billingPeriodCount.sroc * licences.length

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.NORTH_WEST.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // Creating a supplementary bill run always attempts the presroc engine too, which finds nothing to bill for this
      // sroc-only scenario and shows as an empty old charge scheme bill run alongside the one we want
      const billRunRow = findBillRunRow(page, regions.NORTH_WEST, 'Supplementary', {
        oldChargeScheme: false,
        sent: false
      })

      await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
      await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(billRunRow.getByRole('cell', { name: regions.NORTH_WEST.displayName, exact: true })).toBeVisible()
      await billRunRow.getByRole('link').click()

      const billRunUrl = page.url()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_WEST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.NORTH_WEST.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="bills-count"]')).toContainText(`${billCount} Supplementary bills`)
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(summaryValue(page, 'Region')).toContainText(regions.NORTH_WEST.displayName)
      await expect(summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_WEST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      const sentBillRunRow = findBillRunRowByLink(page, billRunUrl)

      await expect(sentBillRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(sentBillRunRow.locator('[data-test^="number-of-bills-"]')).toContainText(String(billCount))
      await expect(sentBillRunRow.locator('.govuk-tag')).toContainText('sent')

      await context.close()
      await logoutCookies(sessionCookies)
    })

    test.beforeEach(async ({ login }) => {
      await login(user)
    })

    test('makes a licence non-chargeable, then confirms a credit is raised in the next supplementary bill run', async ({
      page
    }) => {
      const [licence] = licences
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('link', { name: 'Search' }).click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row').getByRole('link', { name: licence.licenceRef }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await page.getByRole('link', { name: 'Licence set up' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('button', { name: 'Make licence non-chargeable' }).click()

      await expect(page.locator('h1')).toContainText('Why is this licence not chargeable?')
      // The "Abatement (S126)" radio's label isn't correctly associated in the markup, so it has no accessible name
      await page.locator('input#reason').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Enter effective date')
      await page.getByRole('radio', { name: 'Another date' }).check()
      await page.locator('#customDate-day').fill('30')
      await page.locator('#customDate-month').fill('6')
      await page.locator('#customDate-year').fill(String(new Date().getUTCFullYear()))
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await expect(summaryValue(page, 'Reason')).toContainText('Abatement (S126)')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(page.getByRole('link', { name: 'Review' })).toHaveCount(0)

      await page.getByRole('link', { name: 'Bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.NORTH_WEST.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      const billRunRow = findBillRunRow(page, regions.NORTH_WEST, 'Supplementary', {
        oldChargeScheme: false,
        sent: false
      })

      await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
      await expect(billRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(billRunRow.getByRole('cell', { name: regions.NORTH_WEST.displayName, exact: true })).toBeVisible()
      await billRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_WEST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText(regions.NORTH_WEST.displayName)
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="credits-count"]')).toContainText('1 credit note')
      await expect(page.locator('[data-test="debits-count"]')).toContainText('0 invoices')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
    })

    test('replaces the charge version in the 2023 financial year with no changes, then confirms the zero value bill', async ({
      page
    }) => {
      test.setTimeout(60000)

      const [, licence] = licences
      const [, company] = companies
      const [, billingAccount] = billingAccounts
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('link', { name: 'Search' }).click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row').getByRole('link', { name: licence.licenceRef }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await page.getByRole('link', { name: 'Licence set up' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('button', { name: 'Set up a new charge' }).click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio').first().check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { name: 'Another date' }).check()
      // The 1st of September 2022, within the 2023 sroc financial year, so the split falls on the earliest sroc
      // period there's any charge history for
      const newChargeStartDate = new Date(srocStartDate)

      newChargeStartDate.setUTCMonth(newChargeStartDate.getUTCMonth() + 5)

      await page.locator('#customDate-day').fill(String(newChargeStartDate.getUTCDate()))
      await page.locator('#customDate-month').fill(String(newChargeStartDate.getUTCMonth() + 1))
      await page.locator('#customDate-year').fill(String(newChargeStartDate.getUTCFullYear()))
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText(`Select an existing billing account for ${company.name}`)
      // The first radio's label isn't correctly associated in the markup, so it has no accessible name
      await page.locator('input#billingAccountId').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.getByRole('radio', { name: 'Use charge information valid' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(page.getByRole('link', { name: 'Review' })).toHaveCount(0)

      await page.getByRole('link', { name: 'Bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.NORTH_WEST.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      const billRunRow = findBillRunRow(page, regions.NORTH_WEST, 'Supplementary', {
        oldChargeScheme: false,
        sent: false
      })

      await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
      await billRunRow.getByRole('link').click()

      const billRunUrl = page.url()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_WEST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="bill-total"]')).toContainText('£0.00')
      await expect(page.locator('[data-test="bills-count"]')).toContainText(
        '0 Supplementary bills and 1 zero value bill'
      )

      const abstractorsTable = page.locator('[data-test="other-abstractors"]')
      const billRow = abstractorsTable.getByRole('row', { name: billingAccount.accountNumber })

      await expect(billRow).toContainText(company.name)
      await expect(billRow).toContainText(licence.licenceRef)
      await expect(billRow).toContainText(String(SROC_FIRST_FINANCIAL_YEAR))
      await expect(billRow).toContainText('£0.00')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })
      await page.getByRole('link', { name: 'Go to bill run' }).click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_WEST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('sent')

      await page.getByRole('link', { name: 'Go back to bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      const sentBillRunRow = findBillRunRowByLink(page, billRunUrl)

      await expect(sentBillRunRow.getByRole('cell', { name: formattedCurrentDate })).toBeVisible()
      await expect(sentBillRunRow.locator('[data-test^="number-of-bills-"]')).toContainText('0')
      await expect(sentBillRunRow.locator('[data-test^="bill-run-total-"]')).toContainText('£0.00')
      await expect(sentBillRunRow.locator('.govuk-tag')).toContainText('sent')
    })

    test('replaces the charge version in the current financial year with changes, then confirms the new bill', async ({
      page
    }) => {
      test.setTimeout(60000)

      const [, , licence] = licences
      const [, , company] = companies
      const [, , billingAccount] = billingAccounts
      const [, , licenceVersionPurpose] = licenceVersionPurposes

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('link', { name: 'Search' }).click()
      await page.locator('#query').fill(licence.licenceRef)
      await page.locator('#search-button').click()
      await page.locator('.searchresult-row').getByRole('link', { name: licence.licenceRef }).click()

      await expect(page.locator('h1')).toContainText(`Licence summary ${licence.licenceRef}`)
      await page.getByRole('link', { name: 'Licence set up' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('button', { name: 'Set up a new charge' }).click()

      await expect(page.locator('h1')).toContainText('Select reason for new charge information')
      await page.getByRole('radio').first().check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Set charge start date')
      await page.getByRole('radio', { name: 'Another date' }).check()
      // The 1st of September, within the current financial year
      await page.locator('#customDate-day').fill('1')
      await page.locator('#customDate-month').fill('9')
      await page.locator('#customDate-year').fill(String(toFinancialYearEnding - 1))
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText(`Select an existing billing account for ${company.name}`)
      // The first radio's label isn't correctly associated in the markup, so it has no accessible name
      await page.locator('input#billingAccountId').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Use abstraction data to set up the element?')
      await page.getByRole('radio', { name: 'Use charge information valid' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page
        .locator('.govuk-summary-list__row', { hasText: 'Volume' })
        .getByRole('link', { name: 'Change' })
        .click()

      await expect(page.locator('h1')).toContainText('Enter the total quantity to use for this charge reference')
      // A value clearly different from the abstraction data's own volume, so the bill breakdown shows two distinct
      // periods either side of the split
      const newVolume = ((licenceVersionPurpose.annualQuantity * 10) / 1000).toFixed(3)

      await page.locator('#volume').fill(newVolume)
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page
        .locator('.govuk-summary-list__row', { hasText: 'Additional charges apply' })
        .getByRole('link', { name: 'Change' })
        .click()

      await expect(page.locator('h1')).toContainText('Do additional charges apply?')
      // Same markup defect as the billing account radio above
      await page.locator('input#isAdditionalCharges').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Is abstraction from a supported source?')
      // Same markup defect as the billing account radio above
      await page.locator('input#isSupportedSource').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the name of the supported source')
      await page.getByRole('radio', { name: 'Earl Soham - Deben' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page
        .locator('.govuk-summary-list__row', { hasText: 'Adjustments apply' })
        .getByRole('link', { name: 'Change' })
        .click()

      await expect(page.locator('h1')).toContainText('Do adjustments apply?')
      // Same markup defect as the billing account radio above
      await page.locator('input#isAdjustments').check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Which adjustments apply?')
      // The scenario's charge reference defaults to a two-part tariff agreement adjustment; swap it for a winter
      // discount so there's exactly one adjustment to assert on afterwards
      await page.getByRole('checkbox', { name: 'Two-part tariff agreement' }).uncheck()
      await page.getByRole('checkbox', { name: 'Winter discount' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check charge information')
      await page.getByRole('button', { name: 'Confirm' }).click()

      await expect(page.locator('h1').last()).toContainText('Charge information complete')
      await page.getByRole('link', { name: 'View charge information' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await page.getByRole('link', { name: 'Review' }).click()

      await expect(page.locator('h1').last()).toContainText('Do you want to approve this charge information?')
      await page.locator('#reviewOutcome').nth(1).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Licence set up')
      await expect(page.getByRole('link', { name: 'Review' })).toHaveCount(0)

      await page.getByRole('link', { name: 'Bill runs' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: regions.NORTH_WEST.displayName }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      const billRunRow = findBillRunRow(page, regions.NORTH_WEST, 'Supplementary', {
        oldChargeScheme: false,
        sent: false
      })

      await reloadUntilTextFound(page, billRunRow.locator('.govuk-tag'), 'ready')
      await billRunRow.getByRole('link').click()

      await expect(page.locator('h1')).toContainText(`${regions.NORTH_WEST.displayName} supplementary`)
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="bills-count"]')).toContainText('1 Supplementary bill')

      const abstractorsTable = page.locator('[data-test="other-abstractors"]')
      const billRow = abstractorsTable.getByRole('row', { name: billingAccount.accountNumber })

      await expect(billRow).toContainText(company.name)
      await expect(billRow).toContainText(licence.licenceRef)
      await billRow.getByRole('link', { name: 'View' }).click()

      await expect(page.locator('h1')).toContainText(`Billing account ${billingAccount.accountNumber}`)
      const chargeReferenceRow = tableRow(page, 'Supported source Earl Soham - Deben')
      await expect(chargeReferenceRow.locator('[data-test^="additional-charges-"]')).toContainText(
        'Supported source Earl Soham - Deben'
      )
      await expect(chargeReferenceRow.locator('[data-test^="adjustments-"]')).toContainText('Winter discount')
    })
  }
)
