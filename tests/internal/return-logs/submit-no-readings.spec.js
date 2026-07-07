import scenarioData from '../../support/scenarios/registered-licence-with-due-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a return with no meter readings - validation errors (internal)', () => {
  let returnLog

  test.beforeAll(async ({ tearDown, calculatedDates, load }) => {
    await tearDown()

    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      returnLogs: [scenarioReturnLog]
    } = scenario

    returnLog = scenarioReturnLog

    await load(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('attempt to submit a return without entering any readings', async ({ page }) => {
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
    // enter a start meter reading of zero and continue
    await page.locator('#startReading').fill('0')
    await page.locator('.govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    await page.locator('#cubicMetres').click()
    await page.locator('.govuk-button').click()

    // Have meter details been provided?
    // choose Yes and continue
    await page.locator('#yes').click()
    await page.locator('.govuk-button').click()

    // Meter details
    // enter the meter details and continue
    await page.locator('#meterMake').fill('test make')
    await page.locator('#meterSerialNumber').fill('12345')
    await page.locator('#no').click()
    await page.locator('.govuk-button').click()

    // Check details and enter new volumes or readings
    // attempt to confirm the return without entering any readings
    await page.locator('.govuk-button').first().click()

    // Validation error
    // it should not be possible to submit a return without entering at least one reading, even if it is a zero
    await expect(page.locator('.govuk-error-summary')).toContainText('At least one return line must contain a value.')
  })
})
