import { extractNotificationLink } from '../../support/helpers/notification.helpers.js'
import { users } from '../../support/default-values.js'
import { expect, test } from '../../support/fixtures.js'

test.describe('Reset password journey (internal)', () => {
  test('displays the change password page when the link in the email is clicked and automatically logs in when the password is changed', async ({
    page,
    lastNotification,
    baseURL
  }) => {
    const newPassword = users.BASIC.password
    const userEmail = users.BASIC.username

    // Navigate to the reset your password page
    await page.goto('/')
    await page.locator('a[href*="/reset_password"]').click()

    // Enter a valid email address and submit
    await page.locator('input#email').fill(userEmail)
    await page.locator('button.govuk-button.govuk-button--start').click()
    await expect(page.locator('.govuk-heading-l')).toContainText('Check your email')

    // Get last email, extract link and follow it
    const body = await lastNotification(userEmail)
    const link = extractNotificationLink(body, 'reset_url', baseURL)
    await page.goto(link)

    // Check we are on the right page
    await expect(page.locator('.govuk-heading-l')).toContainText('Change your password')
    await expect(page.getByLabel('Enter a new password')).toBeVisible()
    await expect(page.getByLabel('Confirm your password')).toBeVisible()

    // Enter a password and confirm
    await page.locator('#password').fill(newPassword)
    await page.locator('#confirmPassword').fill(newPassword)
    await page.locator('button.govuk-button').click()

    // Log in using the updated credentials to confirm the password has been updated
    await page.locator('#email').fill(userEmail)
    await page.locator('#password').fill(newPassword)
    await page.locator('button.govuk-button').click()

    // Check we are signed in by confirming we are on the search page
    await expect(page.locator('h1')).toContainText('Search')
  })
})
