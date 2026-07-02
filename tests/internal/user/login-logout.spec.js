import { test, expect } from '../../support/fixtures.js'

test.describe('Login and log out (internal)', () => {
  test('can log in and out as an internal user', async ({ page, login, users }) => {
    await login(users.billingAndData)

    // Confirm the user signed in
    await expect(page.locator('body')).toContainText('Enter a licence number, licence holder name, returns ID')

    // Click Sign out button
    await page.locator('a', { hasText: 'Sign out' }).click()

    // Confirm we are signed out
    await expect(page.getByText("You're signed out")).toBeVisible()
  })
})
