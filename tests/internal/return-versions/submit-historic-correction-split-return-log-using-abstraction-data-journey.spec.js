import scenarioData from '../../support/scenarios/unregistered-licence-with-two-annual-return-logs.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { dueDateStatusLabel, formatLongDate, previousPeriod, today } from '../../support/helpers/date.helpers.js'

let licence
let returnLogs
let startYear
let splitEndDate
let quarterEndDates

test.describe('Submit historic correction that splits a return log using abstraction data (internal)', () => {
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

    // The new return version starts a year ago, in September - partway through returnLogs[1]'s annual period - so
    // that log is expected to split. The portion before the new start date (up to this date) remains open under
    // the old requirement
    splitEndDate = new Date(Date.UTC(startYear - 1, 7, 31))

    // The licence's abstraction data resolves to quarterly requirements, anchored on the same quarter four boundary
    // as the existing winter and all year cycle. We work backwards from there to get each quarter's end date, so we
    // can determine whether it's 'open' or 'not due yet' without hardcoding dates that would drift over time
    let quarter = {
      startDate: `${new Date(dates.currentWinterReturnCycle.endDate).getFullYear()}-01-01`,
      endDate: dates.currentWinterReturnCycle.endDate,
      quarterly: true
    }

    quarterEndDates = [quarter.endDate]

    for (let i = 0; i < 6; i++) {
      quarter = previousPeriod(quarter)
      quarterEndDates.push(quarter.endDate)
    }

    await load(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a return requirement using abstraction data and approves the requirement', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    // confirm we are on the licence returns tab and that there are previous return logs
    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-due-date-0"]')).toContainText(formatLongDate(returnLogs[0].dueDate))
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(
      dueDateStatusLabel(returnLogs[0].dueDate)
    )

    await expect(page.locator('[data-test="return-due-date-1"]')).toContainText(formatLongDate(returnLogs[1].dueDate))
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('complete')

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

    // choose the approve return requirement button
    await page.getByText('Approve returns requirement').click()

    // confirm we are on the approved page
    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')

    // click link to return to licence set up and the returns tabs
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Returns')

    // The licence's abstraction data resolves to quarterly requirements. Because the new version starts partway
    // through returnLogs[1]'s annual period, that log splits: the portion before the new start date remains open
    // under the old requirement (row 8), and the portion from the new start date onwards is covered by seven new
    // quarterly return logs running back from quarter four of the current winter and all year cycle (rows 0-3 and
    // 5-7). returnLogs[0] and returnLogs[1] themselves are entirely superseded and become void (rows 4 and 9)
    const quarterStatus = (index) => {
      return today() > new Date(quarterEndDates[index]) ? 'open' : 'not due yet'
    }

    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(quarterStatus(0))

    await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(quarterStatus(1))

    await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText(quarterStatus(2))

    await expect(page.locator('[data-test="return-due-date-3"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText(quarterStatus(3))

    await expect(page.locator('[data-test="return-due-date-4"]')).toContainText(formatLongDate(returnLogs[0].dueDate))
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-5"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText(quarterStatus(4))

    await expect(page.locator('[data-test="return-due-date-6"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText(quarterStatus(5))

    await expect(page.locator('[data-test="return-due-date-7"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-7"] > .govuk-tag')).toContainText(quarterStatus(6))

    await expect(page.locator('[data-test="return-due-date-8"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-8"] > .govuk-tag')).toContainText(
      today() > splitEndDate ? 'open' : 'not due yet'
    )

    await expect(page.locator('[data-test="return-due-date-9"]')).toContainText(formatLongDate(returnLogs[1].dueDate))
    await expect(page.locator('[data-test="return-status-9"] > .govuk-tag')).toContainText('void')
  })
})
