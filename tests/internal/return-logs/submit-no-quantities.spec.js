import scenarioData from '../../support/scenarios/unregistered-licence-with-open-winter-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a return with no quantities - validation errors (internal)', () => {
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

  test('attempt to submit a return without entering any quantities', async ({ page }) => {
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
    // choose Abstraction volumes and continue
    await page.locator('#abstractionVolumes').click()
    await page.locator('.govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    await page.locator('#cubicMetres').check()
    await page.locator('.govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    await page.locator('#no').click()
    await page.locator('.govuk-button').click()

    // Is it a single volume?
    // choose No
    await page.locator('#no').click()
    await page.locator('.govuk-button').click()

    // Check details and enter new volumes or readings
    // attempt to confirm the return without entering any volumes
    await page.locator('.govuk-button').first().click()

    // Validation error
    // it should not be possible to submit a return without entering at least one volume, even if it is a zero
    await expect(page.locator('.govuk-error-summary')).toContainText('At least one return line must contain a value.')
  })
})
