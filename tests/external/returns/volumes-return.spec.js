import scenarioData from '../../support/scenarios/external-return-submission.scenario.js'
import { monthlyReturnPeriods } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a volumes return (external)', () => {
  let returnLog
  let user

  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    const {
      returnLogs: [scenarioReturnLog],
      users: [scenarioUser]
    } = scenario

    returnLog = scenarioReturnLog
    user = scenarioUser

    await setup(scenario)
  })

  test.beforeEach(async ({ loginExternal }) => {
    await loginExternal(user.username)
  })

  test('login as an existing user and submit a volumes return', async ({ page, externalUrl }) => {
    // Enter volumes for the first 9 months of the return period, skipping one to leave a gap
    const periodsWithGaps = monthlyReturnPeriods(returnLog.startDate, returnLog.endDate)
      .slice(0, 9)
      .filter((_period, index) => {
        return index !== 7
      })

    await page.goto(`${externalUrl}/return?returnId=${returnLog.returnId}`)

    // --> Have you extracted water in this period?
    // Click 'Yes' and continue
    await page.locator('input[value="false"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> How are you reporting your figures?
    // Click 'Volumes from one or more meters' and continue
    await page.locator('input[value="abstractionVolumes,measured"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> Which units are you using?
    // Click 'Gallons' and continue
    await page.getByRole('radio', { name: 'Gallons' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> Your abstraction volumes
    // Enter valid volumes with some gaps and continue
    for (const period of periodsWithGaps) {
      await page.locator(`input[name="${period.fieldName}"]`).fill('1')
    }
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> Your current meter details
    await page.locator('input[name="manufacturer"]').fill('Test Water Meter')
    await page.locator('input[name="serialNumber"]').fill('Test serial number')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm and submit the details
    await expect(page.getByRole('heading', { name: 'Confirm your return' })).toBeVisible()
    // Check the calculated total
    await expect(page.locator(':nth-child(3) > strong')).toContainText('0.036')
    await page.getByRole('button', { name: 'Submit' }).click()

    // Confirm Return submitted
    await expect(page.locator('.panel__title')).toContainText('Return submitted')
  })
})
