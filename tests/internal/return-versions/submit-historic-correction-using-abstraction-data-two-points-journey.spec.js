import scenarioData from '../../support/scenarios/licence-with-two-return-requirements-and-historic-return-logs.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'

test.describe('Submit historic correction using abstraction data for two abstraction points (internal)', () => {
  let licence
  let startYear
  let current
  let previous

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    licence = scenario.licence
    startYear = new Date(dates.currentWinterReturnCycle.startDate).getFullYear()

    const [currentLog, previousLog] = scenario.returnLogs

    current = returnLogDateDetails(currentLog)
    previous = returnLogDateDetails(previousLog)

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a return requirement using abstraction data and approves the requirement', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-due-date-0"]')).toContainText(current.dueDateString)
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(current.status)

    await expect(page.locator('[data-test="return-due-date-1"]')).toContainText(current.dueDateString)
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(current.status)

    await expect(page.locator('[data-test="return-due-date-2"]')).toContainText(previous.dueDateString)
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('complete')

    await expect(page.locator('[data-test="return-due-date-3"]')).toContainText(previous.dueDateString)
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('complete')

    await page.getByText('Licence set up').click()

    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up new requirements').click()

    await expect(page.locator('h1')).toContainText('Select the start date for the requirements for returns')
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('11')
    await page.locator('#startDateYear').fill(`${startYear - 1}`)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Select the reason for the requirements for returns')
    await page.locator('#newLicence').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('How do you want to set up the requirements for returns?')
    await page.locator('#useAbstractionData').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Check the requirements for returns for Big Farm Co Ltd')
    await page.getByText('Approve returns requirement').click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-due-date-0"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')

    await expect(page.locator('[data-test="return-due-date-1"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('not due yet')

    await expect(page.locator('[data-test="return-due-date-2"]')).toContainText(current.dueDateString)
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-3"]')).toContainText(current.dueDateString)
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-4"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('open')

    await expect(page.locator('[data-test="return-due-date-5"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('open')

    await expect(page.locator('[data-test="return-due-date-6"]')).toContainText(previous.dueDateString)
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-7"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-7"] > .govuk-tag')).toContainText('open')

    await expect(page.locator('[data-test="return-due-date-8"]')).toContainText(previous.dueDateString)
    await expect(page.locator('[data-test="return-status-8"] > .govuk-tag')).toContainText('void')

    await expect(page.locator('[data-test="return-due-date-9"]')).toBeEmpty()
    await expect(page.locator('[data-test="return-status-9"] > .govuk-tag')).toContainText('open')
  })
})
