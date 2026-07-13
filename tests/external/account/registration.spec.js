import { extractNotificationLink } from '../../support/helpers/notification.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('User registration (external)', () => {
  test('can register a new user', async ({ page, externalUrl, defaultPassword, lastNotification }) => {
    const userEmail = `external.${Date.now()}@example.com`

    await page.goto(externalUrl)

    // Tap the create account button on the welcome page
    await page.locator('a[href*="/start"]').click()

    // Confirm we want to create an account
    await expect(page.locator('.govuk-heading-l')).toContainText(
      'Create an account to manage your water abstraction licence online'
    )
    await page.locator('a[href*="/register"]').click()

    // Enter the email address and submit
    await page.locator('input#email').fill(userEmail)
    await page.locator('button.govuk-button').click()

    // Should be on the confirm your email page
    await expect(page.locator('.govuk-heading-l')).toContainText('Confirm your email address')

    // Get last email, extract link and follow it
    const body = await lastNotification(userEmail)
    const link = extractNotificationLink(body, 'link', externalUrl)

    await page.goto(link)

    // Set a password
    await page.locator('input#password').fill(defaultPassword)
    await page.locator('input#confirmPassword').fill(defaultPassword)
    await page.locator('button.govuk-button').click()

    // Log in using the new account to confirm the registration was successful
    await page.locator('#email').fill(userEmail)
    await page.locator('#password').fill(defaultPassword)
    await page.locator('button.govuk-button').click()

    // Confirm the user signed in
    await expect(page).toHaveURL(/\/add-licences/)
    await expect(page.locator('.govuk-heading-l')).toContainText('Add your licences to the service')

    // Click Sign out button
    await page.locator('#signout').click()

    // Confirm we are signed out
    await expect(page.getByText("You're signed out")).toBeVisible()
  })
})
