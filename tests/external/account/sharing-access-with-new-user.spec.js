import scenarioData from '../../support/scenarios/registered-licence.scenario.js'
import { extractNotificationLink } from '../../support/helpers/notification.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Sharing licence access with a new user (external)', () => {
  let firstUser
  let licence

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence],
      users: [scenarioFirstUser]
    } = scenario

    licence = scenarioLicence
    firstUser = scenarioFirstUser

    await setup(scenario)
  })

  test.beforeEach(async ({ loginExternal }) => {
    await loginExternal(firstUser.username)
  })

  test('allows a user to grant access to a licence to a new user', async ({
    page,
    externalUrl,
    defaultPassword,
    lastNotification
  }) => {
    const newUserEmail = 'external.new@example.com'

    await page.goto(`${externalUrl}/manage_licences`)

    await page.getByRole('link', { name: 'Give or remove access to your licence information' }).click()
    await page.locator('.govuk-button', { hasText: 'Give access' }).click()
    await page.locator('input#email').fill(newUserEmail)
    await page.locator('#returns').check()
    await page.locator('.form > .govuk-button').click()

    // First user logs out
    await page.locator('.govuk-link', { hasText: 'Return to give access' }).click()
    await page.locator('#signout').click()

    // Second user registers using link in email received
    const body = await lastNotification(newUserEmail)
    const link = extractNotificationLink(body, 'link', externalUrl)

    await page.goto(link)

    await page.locator('input#password').fill(defaultPassword)
    await page.locator('input#confirmPassword').fill(defaultPassword)
    await page.locator('button.govuk-button').click()

    // Second user logs in using the new account to confirm the registration was successful
    await page.locator('#email').fill(newUserEmail)
    await page.locator('#password').fill(defaultPassword)
    await page.locator('button.govuk-button').click()

    // Assert they can see the same licence
    await expect(page.locator('.licence-result__column > a')).toContainText(licence.licenceRef)

    // Sign out
    await page.locator('#signout').click()
  })
})
