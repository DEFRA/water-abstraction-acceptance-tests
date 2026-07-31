import scenarioData from '../../support/scenarios/licence-with-open-winter-return-log.scenario.js'
import { summaryRow } from '../../support/helpers/govuk.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a nil return (internal)', () => {
  let returnLog

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    returnLog = scenario.returnLogs[0]

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('submit a nil return', async ({ page }) => {
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
    // confirm we see the success panel
    await expect(page.locator('.govuk-panel')).toContainText(`Return ${returnLog.returnReference} submitted`)

    // Navigate to the Return page
    // Confirm the return is a nil return
    await page.getByRole('link', { name: 'View this return' }).click()
    await expect(page.locator('[data-test="total"]')).toContainText('Nil return')
  })
})
