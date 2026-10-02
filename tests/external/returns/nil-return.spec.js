import { expect, test } from '../../support/fixtures.js'

test.describe('Submit a nil return (external)', () => {
  let returnLog
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-with-open-winter-return-log')

    const {
      returnLogs: [scenarioReturnLog]
    } = scenario

    returnLog = scenarioReturnLog
    user = scenario.users[1]
  })

  test.beforeEach(async ({ loginExternal }) => {
    await loginExternal(user.username)
  })

  test('login as an existing user and submit a nil return', async ({ page, externalUrl }) => {
    await page.goto(`${externalUrl}/return?returnId=${returnLog.returnId}`)

    // --> Have you extracted water in this period?
    // Click 'No' and continue
    await page.getByRole('radio', { name: 'No' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm and submit the details
    await expect(page.getByRole('heading', { name: 'Nil return' })).toBeVisible()
    await page.getByRole('button', { name: 'Submit' }).click()

    // Confirm Return submitted
    await expect(page.locator('.panel__title')).toContainText('Return submitted')
  })
})
