import scenarioData from '../../support/scenarios/licence-with-open-winter-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a meter readings return (internal)', () => {
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

  test('submit a return and check the values', async ({ page }) => {
    await page.goto(`/system/return-logs/${returnLog.id}/details`)

    // Abstraction return
    // submit return
    await page.locator('.govuk-button').first().click()

    // When was the return received?
    // select today
    await page.locator('#today').click()
    await page.locator('.govuk-button').click()

    // What do you want to do with this return?
    // choose Enter and submit and continue
    await page.locator('#enterReturn').click()
    await page.locator('.govuk-button').click()

    // How was this return reported?
    // choose Meter Readings and continue
    await page.locator('#meterReadings').click()
    await page.locator('.govuk-button').click()

    // Enter the start meter reading
    // choose Meter Readings and continue
    await page.locator('#startReading').fill('100')
    await page.locator('.govuk-button').click()

    // Which units were used?
    // choose Megalitres and continue
    await page.locator('#megalitres').check()
    await page.locator('.govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    await page.locator('#no').click()
    await page.locator('.govuk-button').click()

    // Summary of monthly readings
    // choose enter monthly readings for
    await page.locator('[data-test="action-0"]').click()

    // Water abstracted
    // enter meter reading of 120 and continue
    await expect(page.locator('.govuk-heading-l')).toContainText('Water abstracted')
    await page.locator('.govuk-input').fill('120')
    await page.locator('.govuk-button').click()

    // Summary of monthly readings
    // confirm the readings have been updated as expected and continue
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Readings have been updated')
    await expect(page.locator('[data-test="reading-0"]')).toContainText('120')
    await expect(page.locator('[data-test="unit-total-0"]')).toContainText('20')
    await expect(page.locator('[data-test="monthly-total-0"]')).toContainText('20,000')
    await expect(page.locator('[data-test="total-quantity"]')).toContainText('20')
    await expect(page.locator('[data-test="total-cubic-metres"]')).toContainText('20,000')
    await page.locator('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel and then click View this return
    await expect(page.locator('.govuk-panel')).toContainText(`Return ${returnLog.returnReference} submitted`)
    await page.locator('#viewThisReturn').click()

    // Abstraction return
    // confirm the return is complete and the total is as expected
    await expect(page.locator('main .govuk-tag')).toContainText('complete')
    await expect(page.locator('[data-test="total"]')).toContainText('20,000')
  })
})
