import scenarioData from '../../support/scenarios/unregistered-licence-with-due-return-log.scenario.js'
import { summaryRow } from '../../support/helpers/govuk.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a nil return (internal)', () => {
  let returnLog

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      returnLogs: [scenarioReturnLog]
    } = scenario

    returnLog = scenarioReturnLog

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('submit a return and mark the licence for supplementary billing', async ({ page }) => {
    await page.goto(`/system/return-logs/${returnLog.id}/details`)

    // Abstraction return
    // submit return
    await page.locator('.govuk-button').first().click()

    // When was the return received?
    // select yesterday
    await page.locator('#yesterday').click()
    await page.locator('.govuk-button').click()

    // What do you want to do with this return?
    // choose Enter a nil return and continue
    await page.locator('#nilReturn').click()
    await page.locator('.govuk-button').click()

    // Reporting details
    // Confirm the return is nil and continue
    await expect(summaryRow(page, 'Nil return').locator('.govuk-summary-list__value')).toContainText('Yes')
    await page.locator('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel and then click the Mark for supplementary bill run button
    await expect(page.locator('.govuk-panel')).toContainText(`Return ${returnLog.returnReference} submitted`)
    await page.locator('.govuk-button', { hasText: 'Mark for supplementary bill run' }).click()

    // Navigate to the Licence summary page
    await page.locator('nav a', { hasText: 'Licence summary' }).click()

    // Summary
    // confirm the licence has been flagged for the next supplementary bill run
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
      'This licence has been marked for the next supplementary bill run.'
    )
  })
})
