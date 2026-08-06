import scenarioData from '../../support/scenarios/licence-with-agreement-and-bill-run.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe(
  'Recalculate bills link (internal)',
  {
    tag: ['@supplementary-billing'],
    annotation: {
      type: 'description',
      description:
        'When a user recalculates bills for a licence and includes a presroc year, the licence should be flagged for supplementary billing for the old charge scheme.'
    }
  },
  () => {
    let licence
    let billRun

    test.beforeAll(async ({ setup, calculatedDates }) => {
      const dates = await calculatedDates()
      const scenario = scenarioData(dates)

      licence = scenario.licence
      billRun = scenario.billRun

      await setup(scenario)
    })

    test.beforeEach(async ({ login, users }) => {
      await login(users.billingAndData)
    })

    test('flags the licence for supplementary billing', async ({ page }) => {
      await page.goto(`/system/licences/${licence.id}/set-up`)

      // Click the recalculate bills link
      await page.locator('a.govuk-button', { hasText: 'Recalculate bills' }).click()
      await page.locator('.govuk-caption-l', { hasText: licence.licenceRef }).click()
      await page.locator(`[data-test="sroc-years-${billRun.toFinancialYearEnding}"]`).click()
      await page.locator('.govuk-button').click()

      // You've marked this licence for the next supplementary bill run
      // confirm we see the success panel and then click the link to return to the licence
      await expect(page.locator('.govuk-panel')).toContainText(
        "You've marked this licence for the next supplementary bill run"
      )
      await page.locator('.govuk-body > .govuk-link').click()

      // Navigate to back to the Licence summary page
      await page.locator('nav a', { hasText: 'Licence summary' }).click()

      // Check the new licence agreement has flagged the licence for supplementary billing
      await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        'This licence has been marked for the next supplementary bill run.'
      )
    })
  }
)

// TODO: add these tests and fix this one
// Add presroc - no bill run - just a lcience sleectr the pre sroc - it'll flag anyway -
// Add sroc - with with chrage version (no bill run)
