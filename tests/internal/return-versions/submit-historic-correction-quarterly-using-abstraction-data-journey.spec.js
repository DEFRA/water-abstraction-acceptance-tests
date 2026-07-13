import scenarioData from '../../support/scenarios/water-company-licence-with-open-winter-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'

test.describe('Submit historic correction changing to quarterly on new return version (internal)', () => {
  let licence
  let returnLogs
  let startYear
  let expectedReturnLogs

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      licences: [scenarioLicence],
      returnLogs: scenarioReturnLogs
    } = scenario

    licence = scenarioLicence
    returnLogs = scenarioReturnLogs
    startYear = new Date(dates.currentFinancialYear.startDate).getFullYear()

    expectedReturnLogs = {
      currentFourthPeriod: returnLogDateDetails({
        startDate: new Date(`${startYear + 1}-01-01`),
        endDate: new Date(`${startYear + 1}-03-31`)
      }),
      currentThirdPeriod: returnLogDateDetails({
        startDate: new Date(`${startYear}-10-01`),
        endDate: new Date(`${startYear}-12-31`)
      }),
      currentSecondPeriod: returnLogDateDetails({
        startDate: new Date(`${startYear}-07-01`),
        endDate: new Date(`${startYear}-09-30`)
      }),
      currentFirstPeriod: returnLogDateDetails({
        startDate: new Date(`${startYear}-04-01`),
        endDate: new Date(`${startYear}-06-30`)
      }),
      fourthPeriod: returnLogDateDetails({
        startDate: new Date(`${startYear}-01-01`),
        endDate: new Date(`${startYear}-03-31`)
      }),
      thirdPeriod: returnLogDateDetails({
        startDate: new Date(`${startYear - 1}-10-01`),
        endDate: new Date(`${startYear - 1}-12-31`)
      }),
      splitSecondPeriod: returnLogDateDetails({
        startDate: new Date(`${startYear - 1}-09-01`),
        endDate: new Date(`${startYear - 1}-09-30`)
      }),
      splitWinter: returnLogDateDetails({
        startDate: new Date(`${startYear - 1}-04-01`),
        endDate: new Date(`${startYear - 1}-08-31`)
      }),
      existingCurrent: returnLogDateDetails(returnLogs[1]),
      existingPrevious: returnLogDateDetails(returnLogs[0])
    }

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new quarterly return version to a licence part way through the previous winter cycle resulting in both split-logs and new quarterly return logs', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    // confirm we are on the licence returns tab and that there are previous return logs
    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('open')

    // click licence set up tab
    await page.getByText('Licence set up').click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // click set up new requirements
    await page.getByText('Set up new requirements').click()

    // set the start date to be 1 year in the past, and mid-way through the existing return log's
    // period so that it splits rather than aligning with the period's start
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('09')
    await page.locator('#startDateYear').fill(`${startYear - 1}`)
    await page.locator('form > .govuk-button').click()

    // confirm we are on the reason page
    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    await page.locator('#newLicence').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    await page.locator('#useAbstractionData').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // click on the change link for additional submission options
    await page.locator('[data-test="change-additional-submission-options"]').click()

    // click Continue
    await page.locator('form > .govuk-button').click()

    // choose the approve return requirement button
    await page.getByText('Approve returns requirement').click()

    // confirm we are on the approved page
    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Returns')

    // Confirm the return logs have been updated and created as expected
    await expect(page.locator('[data-test="return-reference-0"]')).toContainText(
      expectedReturnLogs.currentFourthPeriod.dateString
    )
    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentFourthPeriod.status
    )

    await expect(page.locator('[data-test="return-reference-1"]')).toContainText(
      expectedReturnLogs.currentThirdPeriod.dateString
    )
    await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentThirdPeriod.status
    )

    await expect(page.locator('[data-test="return-reference-2"]')).toContainText(
      expectedReturnLogs.currentSecondPeriod.dateString
    )
    await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentSecondPeriod.status
    )

    await expect(page.locator('[data-test="return-reference-3"]')).toContainText(
      expectedReturnLogs.currentFirstPeriod.dateString
    )
    await expect(page.locator('[data-test="return-due-date-3"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentFirstPeriod.status
    )

    await expect(page.locator('[data-test="return-reference-4"]')).toContainText(
      expectedReturnLogs.existingCurrent.dateString
    )
    await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-reference-5"]')).toContainText(
      expectedReturnLogs.fourthPeriod.dateString
    )
    await expect(page.locator('[data-test="return-due-date-5"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText(
      expectedReturnLogs.fourthPeriod.status
    )

    await expect(page.locator('[data-test="return-reference-6"]')).toContainText(
      expectedReturnLogs.thirdPeriod.dateString
    )
    await expect(page.locator('[data-test="return-due-date-6"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText(
      expectedReturnLogs.thirdPeriod.status
    )

    await expect(page.locator('[data-test="return-reference-7"]')).toContainText(
      expectedReturnLogs.splitSecondPeriod.dateString
    )
    await expect(page.locator('[data-test="return-due-date-7"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-7"] > .govuk-tag')).toContainText(
      expectedReturnLogs.splitSecondPeriod.status
    )

    await expect(page.locator('[data-test="return-reference-8"]')).toContainText(
      expectedReturnLogs.existingPrevious.dateString
    )
    await expect(page.locator('[data-test="return-due-date-8"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-8"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-reference-9"]')).toContainText(
      expectedReturnLogs.splitWinter.dateString
    )
    await expect(page.locator('[data-test="return-due-date-9"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-9"] > .govuk-tag')).toContainText(
      expectedReturnLogs.splitWinter.status
    )
  })
})
