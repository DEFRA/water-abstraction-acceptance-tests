import scenarioData from '../../support/scenarios/licence-with-two-return-requirements-and-historic-return-logs.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { calculatedDates } from '../../support/helpers/calculated-dates.helpers.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'

test.describe('Submit historic correction using abstraction data for licence with two purposes (internal)', () => {
  let licence
  let startYear
  let purpose400Current
  let purpose400Previous
  let purpose420Current
  let purpose420Previous

  test.beforeAll(async ({ setup }) => {
    const { currentWinterReturnCycle } = calculatedDates()

    startYear = new Date(currentWinterReturnCycle.startDate).getFullYear()

    const scenario = scenarioData()

    licence = scenario.licence

    const [purpose400CurrentLog, purpose400PreviousLog, purpose420CurrentLog, purpose420PreviousLog] =
      scenario.returnLogs

    purpose400Current = returnLogDateDetails(purpose400CurrentLog)
    purpose400Previous = returnLogDateDetails(purpose400PreviousLog)
    purpose420Current = returnLogDateDetails(purpose420CurrentLog)
    purpose420Previous = returnLogDateDetails(purpose420PreviousLog)

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new return version using abstraction data for a licence with two purposes', async ({ page }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(purpose420Current.status)
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(purpose400Current.status)
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText(purpose420Previous.status)
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText(purpose400Previous.status)

    await page.getByText('Licence set up').click()

    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up new requirements').click()

    await expect(page.locator('h1')).toContainText('Select the start date for the requirements for returns')
    await page.getByRole('radio', { name: 'Another date' }).check()
    await page.locator('#startDateDay').fill('01')
    await page.locator('#startDateMonth').fill('09')
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

    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('not due yet')
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('void') // purpose420Current now void
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void') // purpose400Current now void
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('open')
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText('open')
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText('void') // purpose420Previous now void
    await expect(page.locator('[data-test="return-status-7"] > .govuk-tag')).toContainText('open')
    await expect(page.locator('[data-test="return-status-8"] > .govuk-tag')).toContainText('void') // purpose400Previous now void
    await expect(page.locator('[data-test="return-status-9"] > .govuk-tag')).toContainText('open')
  })
})
