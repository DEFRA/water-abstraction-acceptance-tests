import scenarioData from '../../support/scenarios/external-user.scenario.js'
import { extractNotificationLink } from '../../support/helpers/notification.helpers.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Reset password journey (external)', () => {
  let user

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      users: [scenarioUser]
    } = scenario

    user = scenarioUser

    await setup(scenario)
  })

  test('displays the change password page when the link in the email is clicked and automatically logs in when the password is changed', async ({
    page,
    externalUrl,
    defaultPassword,
    lastNotification
  }) => {
    const newPassword = `${defaultPassword}1234`

    // Navigate to the reset your password page
    await page.goto(`${externalUrl}/reset_password`)

    // Test setting a valid email address
    await page.locator('input#email').fill(user.username)
    await page.locator('button.govuk-button.govuk-button--start').click()
    await expect(page.locator('.govuk-heading-l')).toContainText('Check your email')

    // Get last email, extract link and follow it
    const body = await lastNotification(user.username)
    const link = extractNotificationLink(body, 'reset_url', externalUrl)

    await page.goto(link)

    await expect(page.getByText('Change your password')).toBeVisible()
    await expect(page.getByText('Enter a new password')).toBeVisible()
    await expect(page.getByText('Confirm your password')).toBeVisible()

    // Enter a password and confirm
    await page.locator('#password').fill(newPassword)
    await page.locator('#confirmPassword').fill(newPassword)
    await page.locator('button.govuk-button').click()

    // Log in using the updated credentials to confirm the password has been updated
    await page.locator('#email').fill(user.username)
    await page.locator('#password').fill(newPassword)
    await page.locator('button.govuk-button').click()

    // Assert that the user is logged in and on the dashboard page
    await expect(page.getByText('View licences')).toHaveAttribute('href', '/licences')
    await expect(page.locator('.govuk-heading-l')).toContainText('Add your licences to the service')
  })
})
