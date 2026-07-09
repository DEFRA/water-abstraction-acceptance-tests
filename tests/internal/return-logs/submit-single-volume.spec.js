import scenarioData from '../../support/scenarios/unregistered-licence-with-due-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a single volume return (internal)', () => {
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

  test('submit a return by entering a single abstraction volume and mark the licence for supplementary billing', async ({
    page
  }) => {
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
    // choose Yes, enter 100 cubic metres and continue
    await page.locator('#yes').click()
    await page.locator('#singleVolumeQuantity').fill('100')
    await page.locator('.govuk-button').click()

    // What period was used for this volume?
    // choose Default abstraction period and continue
    await page.locator('#default').click()
    await page.locator('.govuk-button').click()

    // Volumes
    // we leave the defaulted values of 50CM, which are 100CM split by the number of months in the abstraction
    // period (2) and continue
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
