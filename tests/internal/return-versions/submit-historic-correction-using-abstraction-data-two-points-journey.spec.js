import scenarioData from '../../support/scenarios/licence-with-two-requirements-and-historic-return-logs.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'

test.describe('Submit historic correction using abstraction data for two abstraction points (internal)', () => {
  let licence
  let startYear
  let expectedReturnLogs

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    licence = scenario.licence
    startYear = new Date(dates.currentFinancialYear.startDate).getFullYear()

    const [currentLogOne, currentLogTwo, previousLogOne, previousLogTwo, twoYearsAgoLogOne, twoYearsAgoLogTwo] =
      scenario.returnLogs

    expectedReturnLogs = {
      currentOne: returnLogDateDetails(currentLogOne),
      currentTwo: returnLogDateDetails(currentLogTwo),
      previousOne: returnLogDateDetails(previousLogOne),
      previousTwo: returnLogDateDetails(previousLogTwo),
      previousNewFragment: returnLogDateDetails({
        startDate: previousLogOne.startDate,
        endDate: previousLogOne.endDate
      }),
      twoYearsAgoOne: returnLogDateDetails(twoYearsAgoLogOne),
      twoYearsAgoTwo: returnLogDateDetails(twoYearsAgoLogTwo),
      twoYearsAgoNewFragment: returnLogDateDetails({
        startDate: new Date(`${startYear - 2}-11-01`),
        endDate: twoYearsAgoLogOne.endDate
      }),
      twoYearsAgoOldFragment: returnLogDateDetails({
        startDate: twoYearsAgoLogOne.startDate,
        endDate: new Date(`${startYear - 2}-10-31`)
      })
    }

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a return version using abstraction data and approves it', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentOne.status
    )
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentTwo.status
    )
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('complete')
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('complete')
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('complete')
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('complete')

    await page.getByText('Licence set up').click()

    await expect(page.locator('h1')).toContainText('Licence set up')

    await page.getByText('Set up new requirements').click()

    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('11')
    await page.locator('#startDateYear').fill(`${startYear - 2}`)
    await page.locator('form > .govuk-button').click()

    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')

    await page.locator('#newLicence').check()
    await page.locator('form > .govuk-button').click()

    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')

    await page.locator('#useAbstractionData').check()
    await page.locator('form > .govuk-button').click()

    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')

    await page.getByText('Approve returns requirement').click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')

    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentOne.status
    )

    await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentTwo.status
    )

    await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-3"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText(
      expectedReturnLogs.previousNewFragment.status
    )

    await expect(page.locator('[data-test="return-due-date-5"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText(
      expectedReturnLogs.previousNewFragment.status
    )

    await expect(page.locator('[data-test="return-due-date-6"]')).toContainText(
      expectedReturnLogs.previousOne.dueDateString
    )
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-7"]')).toContainText(
      expectedReturnLogs.previousTwo.dueDateString
    )
    await expect(page.locator('[data-test="return-status-7"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-8"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-8"] > .govuk-tag')).toContainText(
      expectedReturnLogs.twoYearsAgoNewFragment.status
    )

    await expect(page.locator('[data-test="return-due-date-9"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-9"] > .govuk-tag')).toContainText(
      expectedReturnLogs.twoYearsAgoNewFragment.status
    )

    await expect(page.locator('[data-test="return-due-date-10"]')).toContainText(
      expectedReturnLogs.twoYearsAgoOne.dueDateString
    )
    await expect(page.locator('[data-test="return-status-10"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-11"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-11"] > .govuk-tag')).toContainText(
      expectedReturnLogs.twoYearsAgoOldFragment.status
    )

    await expect(page.locator('[data-test="return-due-date-12"]')).toContainText(
      expectedReturnLogs.twoYearsAgoTwo.dueDateString
    )
    await expect(page.locator('[data-test="return-status-12"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-13"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-13"] > .govuk-tag')).toContainText(
      expectedReturnLogs.twoYearsAgoOldFragment.status
    )
  })
})
