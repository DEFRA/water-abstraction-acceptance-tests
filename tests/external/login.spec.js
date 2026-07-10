import { test, expect } from '../support/fixtures.js'

test.describe('Login and log out (external)', () => {
  test('can log in and out as an external user', async ({ page, externalUrl, defaultPassword, users }) => {
    await page.goto(externalUrl)

    // Tap the sign in button on the welcome page
    await page.locator('a[href*="/signin"]').click()

    // Enter the user name and password
    await page.locator('input#email').fill(users.external)
    await page.locator('input#password').fill(defaultPassword)

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
