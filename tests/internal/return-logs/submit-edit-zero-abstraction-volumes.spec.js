import scenarioData from '../../support/scenarios/unregistered-licence-with-due-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit then edit an abstraction volumes return with zero quantities (internal)', () => {
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

  test('submit a return and check that the zero values recorded are correctly carried over when editing', async ({
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
    // choose Abstraction Volumes and continue
    await page.locator('#abstractionVolumes').click()
    await page.locator('.govuk-button').click()

    // Which units were used?
    // choose Cubic Metres and continue
    await page.locator('#cubicMetres').check()
    await page.locator('.govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    await page.locator('#no').click()
    await page.locator('.govuk-button').click()

    // Is it a single volume?
    // choose No and continue
    await page.locator('#no').click()
    await page.locator('.govuk-button').click()

    // Summary of monthly volumes
    // choose enter monthly volumes
    await page.locator('[data-test="action-1"]').click()

    // Water abstracted
    // enter meter reading of 0 and continue
    await expect(page.locator('.govuk-heading-l')).toContainText('Water abstracted')
    await page.locator('.govuk-input').fill('0')
    await page.locator('.govuk-button').click()

    // Summary of monthly volumes
    // confirm the volumes have been updated as expected and continue
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Volumes have been updated')
    await expect(page.locator('[data-test="monthly-total-1"]')).toContainText('0')
    await expect(page.locator('[data-test="total-cubic-metres"]')).toContainText('0')
    await page.locator('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel and then click View this return
    await expect(page.locator('.govuk-panel')).toContainText(`Return ${returnLog.returnReference} submitted`)
    await page.locator('#viewThisReturn').click()

    // Abstraction return
    // confirm the return is complete and as expected, then edit the return again to confirm zero values are retained
    await expect(page.locator('main .govuk-tag')).toContainText('complete')
    await expect(page.locator('[data-test="total"]')).toContainText('0')
    await expect(page.locator('[data-test="monthly-total-1"]')).toContainText('0')
    await page.locator('.govuk-button').first().click()

    // Summary of monthly volumes
    // confirm the zero volume is still present then proceed to the edit page
    await expect(page.locator('[data-test="monthly-total-1"]')).toContainText('0')
    await expect(page.locator('[data-test="total-cubic-metres"]')).toContainText('0')
    await page.locator('[data-test="action-1"]').click()

    // Water abstracted
    // confirm the zero volume is still present
    await expect(page.locator('.govuk-heading-l')).toContainText('Water abstracted')
    await expect(page.locator('.govuk-input')).toHaveValue('0')
  })
})
