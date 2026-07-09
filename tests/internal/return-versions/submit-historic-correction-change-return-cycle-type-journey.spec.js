import scenarioData from '../../support/scenarios/unregistered-licence-with-not-due-yet-return-log.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { formatLongDate, today } from '../../support/helpers/date.helpers.js'

let licence
let returnLogs
let startYear
let newVersionPeriod0EndDate

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

    // The new return version starts on the same date as returnLogs[0] (1 April, the start of the current financial
    // year), so returnLogs[0] is superseded and becomes void with no gap before it. The new version uses the summer
    // cycle (November to October), which doesn't align with that start date, so it produces one partial period
    // running up to the next cycle boundary
    newVersionPeriod0EndDate = new Date(Date.UTC(startYear, 9, 31))

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

    // set the start date to be aligned with the start of returnLogs[0]'s period (1 April, the current financial year)
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

    // The new version starts on the same date as returnLogs[0]'s period, so that log is entirely superseded and
    // becomes void with no gap before it (row 1). The new version's summer cycle doesn't align with that start
    // date, so it produces a single partial period running up to the next cycle boundary (row 0)
    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(
      today() > newVersionPeriod0EndDate ? 'open' : 'not due yet'
    )

    await expect(page.locator('[data-test="return-due-date-1"]')).toContainText(formatLongDate(returnLogs[0].dueDate))
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('void')
  })
})
