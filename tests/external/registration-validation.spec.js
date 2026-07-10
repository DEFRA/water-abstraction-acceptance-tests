import { extractNotificationLink } from '../support/helpers/notification.helpers.js'
import { test, expect } from '../support/fixtures.js'

test.describe('User registration validation (external)', () => {
  test('validates the password in the create account page', async ({ page, externalUrl, lastNotification }) => {
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

    // Test submitting no passwords
    await page.locator('button.govuk-button').click()
    await expect(page.locator('.govuk-error-summary__title')).toContainText('There is a problem')

    // Test submitting passwords that are too short
    await page.locator('input#password').fill('short')
    await page.locator('input#confirmPassword').fill('short')
    await page.locator('button.govuk-button').click()
    await expect(page.locator('.govuk-error-summary__title')).toContainText('There is a problem')
    await page.locator('input#password').clear()
    await page.locator('input#confirmPassword').clear()

    // Test submitting passwords that are numbers only
    await page.locator('input#password').fill('12345678')
    await page.locator('input#confirmPassword').fill('12345678')
    await page.locator('button.govuk-button').click()
    await expect(page.locator('.govuk-error-summary__title')).toContainText('There is a problem')
    await page.locator('input#password').clear()
    await page.locator('input#confirmPassword').clear()

    // Test submitting passwords that are symbols only
    await page.locator('input#password').fill('$$$$$$$$')
    await page.locator('input#confirmPassword').fill('$$$$$$$$')
    await page.locator('button.govuk-button').click()
    await expect(page.locator('.govuk-error-summary__title')).toContainText('There is a problem')
    await page.locator('input#password').clear()
    await page.locator('input#confirmPassword').clear()

    // Test submitting passwords that are capitals only
    await page.locator('input#password').fill('ABCDEFGH')
    await page.locator('input#confirmPassword').fill('ABCDEFGH')
    await page.locator('button.govuk-button').click()
    await expect(page.locator('.govuk-error-summary__title')).toContainText('There is a problem')
    await page.locator('input#password').clear()
    await page.locator('input#confirmPassword').clear()

    // Test submitting passwords that do not match
    await page.locator('input#password').fill('A12345678$')
    await page.locator('input#confirmPassword').fill('A123456789$')
    await page.locator('button.govuk-button').click()
    await expect(page.locator('.govuk-error-summary__title')).toContainText('There is a problem')
    await page.locator('input#password').clear()
    await page.locator('input#confirmPassword').clear()
  })
})
