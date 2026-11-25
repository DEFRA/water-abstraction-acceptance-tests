import { generateExternalEmailAddress } from 'water-abstraction-engine/test/generators.js'

import { password } from '../../support/default-values.js'
import { expect, test } from '../../support/fixtures.js'
import { extractNotificationLink } from '../../support/helpers/notification.helpers.js'

test.describe('User registration (external)', () => {
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('external-user')

    user = scenario.user
  })

  test('can register a new user', async ({ page, externalUrl, lastNotification }) => {
    const userEmail = generateExternalEmailAddress()

    await page.goto(`${externalUrl}/ext/users/register`)

    await expect(page.locator('h1')).toContainText('Create an account to manage your water abstraction licence online')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.locator('h1')).toContainText('Create an account')
    await page.locator('#email').fill(userEmail)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Confirm your email address')

    const body = await lastNotification(userEmail)

    await page.goto(extractNotificationLink(body, 'link', externalUrl))

    await expect(page.locator('h1')).toContainText('Create a password')
    await page.locator('#password').fill(password)
    await page.locator('#confirmPassword').fill(password)
    await page.getByRole('button', { name: 'Set password' }).click()

    await expect(page.locator('h1')).toContainText('Sign in')
    await page.locator('#email').fill(userEmail)
    await page.locator('#password').fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.locator('h1')).toContainText('Add your licences to the service')
    await page.locator('#signout').click()

    await expect(page.locator('h1')).toContainText("You're signed out")
  })

  test('sends an existing user a link to reset their password', async ({ page, externalUrl, lastNotification }) => {
    const newPassword = `${password}1234`

    await page.goto(`${externalUrl}/ext/users/register`)

    await expect(page.locator('h1')).toContainText('Create an account to manage your water abstraction licence online')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.locator('h1')).toContainText('Create an account')
    await page.locator('#email').fill(user.username)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('h1')).toContainText('Confirm your email address')

    const body = await lastNotification(user.username)

    expect(extractNotificationLink(body, 'link', externalUrl)).toEqual(`${externalUrl}/signin`)

    await page.goto(extractNotificationLink(body, 'resetLink', externalUrl))

    await expect(page.locator('h1')).toContainText('Change your password')
    await page.locator('#password').fill(newPassword)
    await page.locator('#confirmPassword').fill(newPassword)
    await page.getByRole('button', { name: 'Set password' }).click()

    await expect(page.locator('h1')).toContainText('Sign in')
    await page.locator('#email').fill(user.username)
    await page.locator('#password').fill(newPassword)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.locator('h1')).toContainText('Add your licences to the service')
  })
})
