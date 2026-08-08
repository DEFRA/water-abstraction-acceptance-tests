import scenarioData from '../../support/scenarios/licence-with-winter-and-summer-return-requirements.scenario.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit historic correction using previous return requirements across winter and summer cycles (internal)', () => {
  let licence
  let startYear
  let expectedReturnLogs

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const [currentWinterReturnLog, currentSummerReturnLog, previousWinterReturnLog, previousSummerReturnLog] =
      scenario.returnLogs

    licence = scenario.licence
    startYear = new Date(dates.currentFinancialYear.startDate).getFullYear()
    expectedReturnLogs = {
      currentWinter: returnLogDateDetails(currentWinterReturnLog),
      newSummerFragment: returnLogDateDetails({
        startDate: new Date(`${startYear}-04-01`),
        endDate: currentSummerReturnLog.endDate
      }),
      oldSummerFragment: returnLogDateDetails({
        startDate: currentSummerReturnLog.startDate,
        endDate: new Date(`${startYear}-03-31`)
      }),
      oldSummerFull: returnLogDateDetails(currentSummerReturnLog),
      previousSummer: returnLogDateDetails(previousSummerReturnLog),
      previousWinter: returnLogDateDetails(previousWinterReturnLog)
    }

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a return version by copying the existing winter and summer return requirements and approves it', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentWinter.status
    )
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(
      expectedReturnLogs.oldSummerFull.status
    )
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('complete')
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('complete')
    await page.getByRole('link', { name: 'Licence set up' }).click()

    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByRole('button', { name: 'Set up new requirements' }).click()

    await expect(page.locator('h1')).toContainText('Select the start date for the requirements for returns')
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('04')
    await page.locator('#startDateYear').fill(`${startYear}`)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')
    await page.locator('#newLicence').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')
    await page.locator('#useExistingRequirements').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Use previous requirements for returns')
    await page.locator('#existing').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await page.getByRole('button', { name: 'Approve returns requirements' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')
    await page.getByRole('link', { name: 'Return to licence set up' }).click()

    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByRole('link', { name: 'Returns' }).click()

    await expect(page.locator('h1')).toContainText('Returns')
    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(
      expectedReturnLogs.currentWinter.status
    )
    await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(
      expectedReturnLogs.newSummerFragment.status
    )
    await expect(page.locator('[data-test="return-due-date-2"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-3"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText(
      expectedReturnLogs.oldSummerFragment.status
    )
    await expect(page.locator('[data-test="return-due-date-5"]')).toContainText(
      expectedReturnLogs.previousWinter.dueDateString
    )
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('complete')
    await expect(page.locator('[data-test="return-due-date-6"]')).toContainText(
      expectedReturnLogs.previousSummer.dueDateString
    )
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText('complete')
  })
})
