import scenarioData from '../../support/scenarios/unregistered-licence-with-four-annual-return-logs.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'

let licence
let returnLogs
let startYear

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

    const today = new Date()
    const novemberToMarch = today.getMonth() > 9 || today.getMonth() < 3

    if (novemberToMarch) {
      await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
      await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')

      await expect(page.locator('[data-test="return-due-date-1"]')).toContainText(formatLongDate(returnLogs[0].dueDate))
      await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('void')

      await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
      await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('open')

      await expect(page.locator('[data-test="return-due-date-3"]')).toContainText(formatLongDate(returnLogs[1].dueDate))
      await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void')

      await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
      await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('open')

      await expect(page.locator('[data-test="return-due-date-5"]')).toBeEmpty()
      await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('open')

      await expect(page.locator('[data-test="return-due-date-6"]')).toContainText(formatLongDate(returnLogs[2].dueDate))
      await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText('void')

      await expect(page.locator('[data-test="return-due-date-7"]')).toContainText(formatLongDate(returnLogs[3].dueDate))
      await expect(page.locator('[data-test="return-status-7"] > .govuk-tag')).toContainText('complete')
    } else {
      await expect(page.locator('[data-test="return-due-date-0"]')).toContainText(formatLongDate(returnLogs[0].dueDate))
      await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('void')

      await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
      await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('not due yet')

      await expect(page.locator('[data-test="return-due-date-2"]')).toContainText(formatLongDate(returnLogs[1].dueDate))
      await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('void')

      await expect(page.locator('[data-test="return-due-date-3"]')).toBeEmpty()
      await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('open')

      await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
      await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('open')

      await expect(page.locator('[data-test="return-due-date-5"]')).toContainText(formatLongDate(returnLogs[2].dueDate))
      await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('void')

      await expect(page.locator('[data-test="return-due-date-6"]')).toContainText(formatLongDate(returnLogs[3].dueDate))
      await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText('complete')
    }
  })
})
