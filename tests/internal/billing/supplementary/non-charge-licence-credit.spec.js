import scenarioData from '../../../support/scenarios/licence-flagged-for-supplementary-with-current-annual-bill-run.scenario.js'
import { test, expect } from '../../../support/fixtures.js'
import { formatLongDate } from '../../../support/helpers/date.helpers.js'
import { summaryRow } from '../../../support/helpers/govuk.helpers.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe(
  'Make licence non-chargeable then see credit in next bill run (internal)',
  { tag: '@supplementary-billing' },
  () => {
    let licence

    test.beforeAll(async ({ setup }) => {
      const scenario = scenarioData()

      licence = scenario.licence

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('creates and sends the supplementary bill run, makes the licence non-chargeable, then confirms a credit is raised in the next one', async ({
      page
    }) => {
      const formattedCurrentDate = formatLongDate(new Date())

      await page.goto('/system/bill-runs')

      await expect(page.locator('h1')).toContainText('Bill runs')
      await page.getByRole('button', { name: 'Create a bill run' }).click()

      await expect(page.locator('h1')).toContainText('Select the bill run type')
      await page.getByRole('radio', { name: 'Supplementary', exact: true }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Select the region')
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      // Creating a supplementary bill run always attempts the presroc engine too, which finds nothing to bill for
      // this sroc-only scenario and shows as an empty bill run at index 0
      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-1"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-1"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-1"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-1"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('h1')).toContainText("You're about to send this bill run")
      await expect(_summaryValue(page, 'Date created')).toContainText(formattedCurrentDate)
      await expect(_summaryValue(page, 'Region')).toContainText('Test Region')
      await expect(_summaryValue(page, 'Bill run type')).toContainText('Supplementary')
      await expect(_summaryValue(page, 'Charge scheme')).toContainText('Current')
      await page.getByRole('button', { name: 'Send bill run' }).click()

      await expect(page.locator('.govuk-panel__title')).toContainText('Bill run sent', { timeout: 20000 })

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
      await expect(_summaryValue(page, 'Reason')).toContainText('Abatement (S126)')
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
      await page.getByRole('radio', { name: 'Test Region' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()

      await expect(page.locator('h1')).toContainText('Check the bill run to be created')
      await page.getByRole('button', { name: 'Create bill run' }).click()

      await expect(page.locator('h1')).toContainText('Bill runs')

      await reloadUntilTextFound(page, page.locator('[data-test="bill-run-status-1"] > .govuk-tag'), 'ready')
      await expect(page.locator('[data-test="date-created-1"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="region-1"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="bill-run-type-1"]')).toContainText('Supplementary')
      await page.locator('[data-test="date-created-1"] > .govuk-link').click()

      await expect(page.locator('h1')).toContainText('Test Region supplementary')
      await expect(page.locator('#main-content > p > .govuk-tag')).toContainText('ready')
      await expect(page.locator('[data-test="meta-data-created"]')).toContainText(formattedCurrentDate)
      await expect(page.locator('[data-test="meta-data-region"]')).toContainText('Test Region')
      await expect(page.locator('[data-test="meta-data-type"]')).toContainText('Supplementary')
      await expect(page.locator('[data-test="meta-data-scheme"]')).toContainText('Current')
      await expect(page.locator('[data-test="credits-count"]')).toContainText('1 credit note')
      await expect(page.locator('[data-test="debits-count"]')).toContainText('0 invoices')
    })
  }
)

function _summaryValue(page, label) {
  return summaryRow(page, label).locator('.govuk-summary-list__value')
}
