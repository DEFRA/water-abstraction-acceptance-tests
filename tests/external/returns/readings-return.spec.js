import scenarioData from '../../support/scenarios/external-return-submission.scenario.js'
import { monthlyReturnPeriods } from '../../support/helpers/date.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a readings return (external)', () => {
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

  test('login as an existing user and submit a readings return', async ({ page, externalUrl }) => {
    const [firstPeriod, secondPeriod] = monthlyReturnPeriods(returnLog.startDate, returnLog.endDate)

    await page.goto(`${externalUrl}/return?returnId=${returnLog.returnId}`)

    // --> Have you extracted water in this period?
    // Click 'Yes' and continue
    await page.locator('input[value="false"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> How are you reporting your figures?
    // Click 'Readings from a single meter' and continue
    await page.locator('input[value="oneMeter,measured"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> Did your meter reset in this abstraction period?
    // Click 'No' and continue
    await page.locator('input[value="false"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> Which units are you using?
    // Click 'Cubic metres' and continue
    // NOTE: the 'Cubic metres' radio has no accessible name in the rendered markup, unlike its siblings (Litres,
    // Megalitres, Gallons), and shares its id with the surrounding fieldset, so it can't be targeted by role/label
    // or id alone. Target it by its input value instead.
    await page.locator('input[value="m³"]').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> Enter your readings exactly as they appear on your meter
    // Enter valid readings and continue
    await page.locator('input[name="startReading"]').fill('0')
    await page.locator(`input[name="${firstPeriod.fieldName}"]`).fill('10')
    await page.locator(`input[name="${secondPeriod.fieldName}"]`).fill('20')
    await page.getByRole('button', { name: 'Continue' }).click()

    // --> Your current meter details
    // Enter valid details and continue
    await page.locator('input[name="manufacturer"]').fill('Test Water Meter')
    await page.locator('input[name="serialNumber"]').fill('Test serial number')
    await page.locator('#isMultiplier').check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm and submit the details
    await expect(page.getByRole('heading', { name: 'Confirm your return' })).toBeVisible()
    // Check the calculated total
    await expect(page.locator(':nth-child(3) > strong')).toContainText('200')
    await page.getByRole('button', { name: 'Submit' }).click()

    // Confirm Return submitted
    await expect(page.locator('.panel__title')).toContainText('Return submitted')
  })
})
