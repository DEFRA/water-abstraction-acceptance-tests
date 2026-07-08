import scenarioData from '../../support/scenarios/unregistered-licence-with-due-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { formatLongDate, today } from '../../support/helpers/date.helpers.js'

let licence
let returnLogs
let startYear
let gapEndDate
let newVersionPeriod0EndDate
let newVersionPeriod1EndDate

test.describe('Submit changing return cycle type on new return version (internal)', () => {
  test.beforeAll(async ({ tearDown, calculatedDates, load }) => {
    await tearDown()

    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      licences: [scenarioLicence],
      returnLogs: scenarioReturnLogs
    } = scenario

    licence = scenarioLicence
    returnLogs = scenarioReturnLogs
    startYear = new Date(dates.currentFinancialYear.startDate).getFullYear()

    // The new return version starts 2 years ago, in November - so returnLogs[0] (entirely within the new version's
    // coverage) is superseded and becomes void. The old requirement's annual cycle also implies one further period
    // before returnLogs[0], which isn't backed by a real return log; the portion of it before the new start date
    // shows as an open gap under the old requirement
    gapEndDate = new Date(Date.UTC(startYear - 2, 9, 31))

    // The new version uses the summer cycle (November to October). It starts exactly on a cycle boundary, so it
    // produces two full annual periods rather than a partial one
    newVersionPeriod0EndDate = new Date(Date.UTC(startYear - 1, 9, 31))
    newVersionPeriod1EndDate = new Date(Date.UTC(startYear, 9, 31))

    await load(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a return requirement manually, changes the return cycle type and approves the requirement', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    // confirm we are on the licence returns tab and that there are previous return logs
    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-due-date-0"]')).toContainText(formatLongDate(returnLogs[0].dueDate))

    // click licence set up tab
    await page.getByText('Licence set up').click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // click set up new requirements
    await page.getByText('Set up new requirements').click()

    // set the start date to be 2 years in the past
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('11')
    await page.locator('#startDateYear').fill(`${startYear - 2}`)
    await page.locator('form > .govuk-button').click()

    // confirm we are on the reason page
    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')

    // choose reason (new licence) and click continue
    await page.locator('#newLicence').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the set up page
    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    // choose the start by using abstraction data checkbox and continue
    await page.locator('#setUpManually').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the purpose page
    await expect(page.locator('h1')).toContainText('Select the purpose for the requirements for returns')

    // choose a purpose and add a purpose description for the requirement and continue
    await page.locator('[data-test="purpose-0"]').check()
    await page.locator('[data-test="purpose-alias-0"]').fill('This is a purpose description')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the points page
    await expect(page.locator('h1')).toContainText('Select the points for the requirements for returns')

    // choose a points for the requirement and continue
    await page.locator('#points').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the abstraction period page
    await expect(page.locator('h1')).toContainText('Enter the abstraction period for the requirements for returns')

    // enter start and end dates for the abstraction period and click continue
    await page.locator('#abstractionPeriodStartDay').fill('01')
    await page.locator('#abstractionPeriodStartMonth').fill('12')
    await page.locator('#abstractionPeriodEndDay').fill('03')
    await page.locator('#abstractionPeriodEndMonth').fill('09')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the returns cycle page
    await expect(page.locator('h1')).toContainText('Select the returns cycle for the requirements for returns')

    // choose a returns cycle and continue
    await page.locator('#summer').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the site description page
    await expect(page.locator('h1')).toHaveText('Enter a site description for the requirements for returns')

    // enter a site description and continue
    await page.locator('#siteDescription').fill('This is a valid site description')
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings collected page
    await expect(page.locator('h1')).toContainText('Select how often readings or volumes are collected')

    // choose a collected time frame and continue
    await page.locator('#frequencyCollectedDay').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the readings reported page
    await expect(page.locator('h1')).toContainText('Select how often readings or volumes are reported')

    // choose a reporting time frame and continue
    await page.locator('#frequencyReportedDay').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the agreements and exceptions page
    await expect(page.locator('h1')).toContainText('Select agreements and exceptions for the requirements for returns')

    // choose an agreement and exception and continue
    await page.locator('#gravityFill').check()
    await page.locator('form > .govuk-button').click()

    // confirm we are on the check page
    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    // choose the approve return requirement button
    await page.getByText('Approve returns requirement').click()

    // confirm we are on the approved page
    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Returns')

    // returnLogs[0] is entirely within the new version's coverage, so it's superseded and becomes void (row 0). The
    // new version itself starts on a summer cycle boundary (1 November), so it produces two full annual return logs
    // rather than a partial one (rows 1-2). The old requirement's annual cycle implies a further period before
    // returnLogs[0] that isn't backed by a real return log; the part of it before the new start date shows as an
    // open gap under the old requirement (row 3)
    const periodStatus = (endDate) => {
      return today() > endDate ? 'open' : 'not due yet'
    }

    await expect(page.locator('[data-test="return-due-date-0"]')).toContainText(formatLongDate(returnLogs[0].dueDate))
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(
      periodStatus(newVersionPeriod1EndDate)
    )

    await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText(
      periodStatus(newVersionPeriod0EndDate)
    )

    await expect(page.locator('[data-test="return-due-date-3"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText(periodStatus(gapEndDate))
  })
})
