import scenarioData from '../../support/scenarios/unregistered-licence-with-open-winter-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'

test.describe('Submit historic correction changing return cycle type on new return version (internal)', () => {
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
      newSummer: returnLogDateDetails({
        startDate: new Date(`${startYear - 1}-11-01`),
        endDate: new Date(`${startYear}-10-31`)
      }),
      splitSummer: returnLogDateDetails({
        startDate: new Date(`${startYear - 1}-09-01`),
        endDate: new Date(`${startYear - 1}-10-31`)
      }),
      splitWinter: returnLogDateDetails({
        startDate: new Date(`${startYear - 1}-04-01`),
        endDate: new Date(`${startYear - 1}-08-31`)
      }),
      existingCurrent: returnLogDateDetails({
        startDate: returnLogs[1].startDate,
        endDate: returnLogs[1].endDate
      }),
      existingPrevious: returnLogDateDetails({
        startDate: returnLogs[0].startDate,
        endDate: returnLogs[0].endDate
      })
    }

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new summer return version to a licence part way through the previous winter cycle resulting in both a split-log and new summer return logs', async ({
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

    // choose reason (minor change) and click continue
    await page.locator('#minorChange').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    // choose to copy the existing requirements and continue
    await page.locator('#useExistingRequirements').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the existing requirements page
    await expect(page.locator('h1')).toContainText('Use previous requirements for returns')

    // choose the existing requirement to copy and continue
    await page.locator('#existing').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // click the change link for the returns cycle
    await page.locator('[data-test="change-returns-cycle-0"]').click()

    // confirm we are on the returns cycle page
    await expect(page.locator('h1')).toContainText('Select the returns cycle for the requirements for returns')

    // choose the summer returns cycle and continue
    await page.locator('#summer').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are back on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // confirm we see the returns cycle we changed to
    await expect(page.locator('[data-test="returns-cycle-0"]')).toContainText('Summer')

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
      expectedReturnLogs.existingCurrent.dateString
    )
    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-reference-1"]')).toContainText(
      expectedReturnLogs.newSummer.dateString
    )
    await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(
      expectedReturnLogs.newSummer.status
    )

    await expect(page.locator('[data-test="return-reference-2"]')).toContainText(
      expectedReturnLogs.splitSummer.dateString
    )
    await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText(
      expectedReturnLogs.splitSummer.status
    )

    await expect(page.locator('[data-test="return-reference-3"]')).toContainText(
      expectedReturnLogs.existingPrevious.dateString
    )
    await expect(page.locator('[data-test="return-due-date-3"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-reference-4"]')).toContainText(
      expectedReturnLogs.splitWinter.dateString
    )
    await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText(
      expectedReturnLogs.splitWinter.status
    )
  })
})
