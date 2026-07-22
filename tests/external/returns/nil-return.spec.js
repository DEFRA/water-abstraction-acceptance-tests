import scenarioData from '../../support/scenarios/external-return-submission.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Submit a nil return (external)', () => {
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

  test('login as an existing user and submit a nil return', async ({ page, externalUrl }) => {
    await page.goto(`${externalUrl}/return?returnId=${returnLog.returnId}`)

    // --> Have you extracted water in this period?
    // Click 'No' and continue
    await page.locator('input[value="true"]').check()
    await page.locator('form > .govuk-button').click()

    // Confirm and submit the details
    await expect(page.locator('h2.govuk-heading-l')).toContainText('Nil return')
    await page.locator('form > .govuk-button').click()

    // Confirm Return submitted
    await expect(page.locator('.panel__title')).toContainText('Return submitted')
  })
})
