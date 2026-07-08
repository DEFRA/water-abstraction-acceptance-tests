import scenarioData from '../../support/scenarios/unregistered-licence-with-four-quarterly-return-logs.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { dueDateStatusLabel, formatLongDate, today } from '../../support/helpers/date.helpers.js'

let licence
let returnLogs
let startYear

test.describe('Submit quarterly historic correction using abstraction data (internal)', () => {
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

    await expect(page.locator('[data-test="return-due-date-2"]')).toContainText(formatLongDate(returnLogs[2].dueDate))
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('complete')

    await expect(page.locator('[data-test="return-due-date-3"]')).toContainText(formatLongDate(returnLogs[3].dueDate))
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('complete')

    // click licence set up tab
    await page.getByText('Licence set up').click()

    // confirm we are on the licence set up tab
    await expect(page.locator('h1')).toContainText('Licence set up')

    // click set up new requirements
    await page.getByText('Set up new requirements').click()

    // set the start date to be at the start of the all year return cycle
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('04')
    await page.locator('#startDateYear').fill(`${startYear}`)
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

    // The new quarterly return version starts at the same date as the existing one, so every existing return log is
    // superseded (voided), while the new version's own quarters show as 'open' or 'not due yet' depending on whether
    // their end date has passed today.
    const placeholderStatus = (index) => {
      return today() > new Date(returnLogs[index].endDate) ? 'open' : 'not due yet'
    }

    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(placeholderStatus(0))

    await expect(page.locator('[data-test="return-due-date-1"]')).toContainText(formatLongDate(returnLogs[0].dueDate))
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText(placeholderStatus(1))

    await expect(page.locator('[data-test="return-due-date-3"]')).toContainText(formatLongDate(returnLogs[1].dueDate))
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText(placeholderStatus(2))

    await expect(page.locator('[data-test="return-due-date-5"]')).toContainText(formatLongDate(returnLogs[2].dueDate))
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-6"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText(placeholderStatus(3))

    await expect(page.locator('[data-test="return-due-date-7"]')).toContainText(formatLongDate(returnLogs[3].dueDate))
    await expect(page.locator('[data-test="return-status-7"] > .govuk-tag')).toContainText('void')
  })
})
