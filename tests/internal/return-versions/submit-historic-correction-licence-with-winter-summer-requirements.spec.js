import scenarioData from '../../support/scenarios/licence-with-winter-and-summer-return-requirements.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { returnLogDateDetails } from '../../support/helpers/date.helpers.js'

test.describe('Submit historic correction for licence with both a winter and summer return requirement (internal)', () => {
  let licence
  let startYear
  let winterCurrent
  let summerCurrent
  let winterPrevious
  let summerPrevious

  test.beforeAll(async ({ calculatedDates, setup }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    licence = scenario.licence
    startYear = new Date(dates.currentWinterReturnCycle.startDate).getFullYear()

    const [winterCurrentLog, winterPreviousLog, summerCurrentLog, summerPreviousLog] = scenario.returnLogs

    winterCurrent = returnLogDateDetails(winterCurrentLog)
    summerCurrent = returnLogDateDetails(summerCurrentLog)
    winterPrevious = returnLogDateDetails(winterPreviousLog)
    summerPrevious = returnLogDateDetails(summerPreviousLog)

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('adds a new return version using copy existing for a licence with existing winter and summer return requirement', async ({
    page
  }) => {
    await page.goto(`/system/licences/${licence.id}/returns`)

    await expect(page.locator('h1')).toContainText('Returns')

    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText(winterCurrent.status)
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText(summerCurrent.status)
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText(winterPrevious.status)
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText(summerPrevious.status)

    await page.getByText('Licence set up').click()

    await expect(page.locator('h1')).toContainText('Licence set up')
    await page.getByText('Set up new requirements').click()

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
    await page.getByText('Approve returns requirement').click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Requirements for returns approved')
    await page.getByText('Return to licence set up').click()
    await page.getByRole('link', { name: 'Returns' }).click()

    await expect(page.locator('h1')).toContainText('Returns')
    await expect(page.locator('[data-test="return-status-0"] > .govuk-tag')).toContainText('not due yet')
    await expect(page.locator('[data-test="return-status-1"] > .govuk-tag')).toContainText('not due yet')
    await expect(page.locator('[data-test="return-status-2"] > .govuk-tag')).toContainText('void') // summerCurrent now void
    await expect(page.locator('[data-test="return-status-3"] > .govuk-tag')).toContainText('void') // winterCurrent now void
    await expect(page.locator('[data-test="return-status-4"] > .govuk-tag')).toContainText('open')
    await expect(page.locator('[data-test="return-status-5"] > .govuk-tag')).toContainText(summerPrevious.status)
    await expect(page.locator('[data-test="return-status-6"] > .govuk-tag')).toContainText(winterPrevious.status)
  })
})
