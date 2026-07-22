import scenarioData from '../../support/scenarios/licence-with-agreement-and-bill-run.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Recalculate bills link (internal)', () => {
  let licence
  let billRun

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence],
      billRuns: [scenarioBillRun]
    } = scenario

    licence = scenarioLicence
    billRun = scenarioBillRun

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
    await page.locator('[data-test="pre-sroc-years"]').click()
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
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
