import scenarioData from '../../support/scenarios/internal-user.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()

const {
  users: [userToUpdate]
} = scenario

test.describe('Change user permissions (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('allows a billing & data user to change the permissions of another user', async ({ page }) => {
    await page.goto('/system/users')

    // Search for the user by email
    await page.locator('.govuk-details__summary').click()
    await page.locator('#email').fill(userToUpdate.username)
    await page.locator('.govuk-button-group > :nth-child(1)').click()

    // Confirm we see the expected result then select it
    await expect(page.locator('[data-test="user-email-0"]')).toContainText(userToUpdate.username)
    await page.locator('[data-test="user-email-0"] a').click()

    // Confirm we see the expected result then select edit
    await expect(page.locator('.govuk-caption-l')).toHaveText(userToUpdate.username)
    await expect(page.locator('.govuk-heading-l')).toHaveText('User details')
    await expect(page.locator('[data-test="no-roles-msg"]')).toHaveText('Basic access grants no additional roles.')
    await page.locator('.govuk-button').click()

    // Click the permissions change link
    await page.locator(':nth-child(2) > .govuk-summary-list__actions > .govuk-link').click()

    // Select permissions for the user
    // Change from Basic to Environment officer
    await page.locator(':nth-child(3) > [name="permission"]').click()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Confirm notification shown and new permission shown, then submit
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Permissions updated')
    await expect(page.locator(':nth-child(2) > .govuk-summary-list__value')).toContainText('Environment Officer')
    await page.locator('.govuk-button', { hasText: 'Confirm' }).click()

    // Confirm notification shown and permissions updated
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText(
      `${userToUpdate.username} has been updated.`
    )
    await page.locator('.govuk-button-group > :nth-child(1)').click()
    await expect(page.locator('[data-test="user-permissions-0"]')).toContainText('Environment Officer')
  })
})
