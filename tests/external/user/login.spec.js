import scenarioData from '../../support/scenarios/external-user.scenario.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('Login and log out (external)', () => {
  let user

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    user = scenario.user

    await setup(scenario)
  })

  test('can log in and out as an external user', async ({ page, externalUrl, defaultPassword, users }) => {
    await page.goto(externalUrl)

    // Tap the sign in button on the welcome page
    await page.locator('a[href*="/signin"]').click()

    // Enter the user name and password
    await page.locator('input#email').fill(user.username)
    await page.locator('input#password').fill(user.password)

    // Click Sign in button
    await page.locator('.govuk-button.govuk-button--start').click()

    // Confirm the user signed in
    await expect(page.locator('#navbar-view')).toBeVisible()

    // Click Sign out button
    await page.locator('#signout').click()

    // Confirm we are signed out
    await expect(page.getByText("You're signed out")).toBeVisible()
  })
})
