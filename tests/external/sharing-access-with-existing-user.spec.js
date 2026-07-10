import scenarioData from '../support/scenarios/external-sharing-access.scenario.js'
import { test, expect } from '../support/fixtures.js'

test.describe('Sharing licence access with another user (external)', () => {
  let firstUser
  let licence
  let secondUser

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      licences: [scenarioLicence],
      users: [scenarioFirstUser, scenarioSecondUser]
    } = scenario

    licence = scenarioLicence
    firstUser = scenarioFirstUser
    secondUser = scenarioSecondUser

    await setup(scenario)
  })

  test('allows a user to grant access to a licence to another user', async ({
    page,
    externalUrl,
    defaultPassword,
    loginExternal
  }) => {
    // First user logs in
    await loginExternal(firstUser.username)
    await page.goto(`${externalUrl}/manage_licences`)

    await page.getByRole('link', { name: 'Give or remove access to your licence information' }).click()
    await page.locator('.govuk-button', { hasText: 'Give access' }).click()
    await page.locator('input#email').fill(secondUser.username)
    await page.locator('.form > .govuk-button').click()

    // First user logs out
    await page.locator('.govuk-link', { hasText: 'Return to give access' }).click()
    await page.locator('#signout').click()

    // Second user logs in
    await page.goto(externalUrl)
    await page.locator('a[href*="/signin"]').click()
    await page.locator('input#email').fill(secondUser.username)
    await page.locator('input#password').fill(defaultPassword)
    await page.locator('.govuk-button.govuk-button--start').click()

    // Assert they can see the same licence
    await expect(page.locator('.licence-result__column > a')).toContainText(licence.licenceRef)
  })
})
