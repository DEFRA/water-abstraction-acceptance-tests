import scenarioData from '../../support/scenarios/unregistered-licence-with-open-winter-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Record receipt for return (internal)', () => {
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

  test('record the receipt for an overdue return for a licence from its returns tab', async ({ page }) => {
    await page.goto(`/system/return-logs/${returnLog.id}/details`)

    // Abstraction return
    // submit return
    await page.locator('.govuk-button').first().click()

    // When was the return received?
    // select today
    await page.locator('label.govuk-radios__label', { hasText: 'Today' }).click()
    await page.locator('.govuk-button').click()

    // What do you want to do with this return?
    // select Record receipt
    await page.locator('label.govuk-radios__label', { hasText: 'Record receipt' }).click()
    await page.locator('.govuk-button').click()

    // Return received
    await expect(page.locator('.govuk-panel')).toContainText(`Return ${returnLog.returnReference} received`)
    await expect(page.locator('.govuk-panel')).toContainText(returnLog.licenceRef)
    await expect(page.locator('.govuk-panel')).toContainText(returnLog.metadata.description)
    await expect(page.locator('.govuk-panel')).toContainText(returnLog.metadata.purposes[0].tertiary.description)

    // View returns for the licence (this is a different view)
    await page.locator('#viewReturns', { hasText: `View returns for ${returnLog.licenceRef}` }).click()

    // confirm we see the received return
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('received')
  })
})
