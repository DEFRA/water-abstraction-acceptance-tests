import scenarioData from '../../support/scenarios/internal-user.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Change user permissions (internal)', () => {
  let userToUpdate

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      users: [scenarioUserToUpdate]
    } = scenario

    userToUpdate = scenarioUserToUpdate

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
    await page.getByRole('button', { name: 'Apply filters' }).click()

    // Confirm we see the expected result then select it
    await expect(page.locator('[data-test="user-email-0"]')).toContainText(userToUpdate.username)
    await page.locator('[data-test="user-email-0"] a').click()

    // Confirm we see the expected result then select edit
    await expect(page.locator('.govuk-caption-l')).toHaveText(userToUpdate.username)
    await expect(page.locator('.govuk-heading-l')).toHaveText('User details')
    await expect(page.locator('[data-test="no-roles-msg"]')).toHaveText('Basic access grants no additional roles.')
    await page.locator('.govuk-button').click()

    // Click the permissions change link
    await _summaryRow(page, 'Permission').getByRole('link', { name: 'Change' }).click()

    // Select permissions for the user
    // Change from Basic to Environment officer
    await page.getByRole('radio', { name: 'Environment Officer' }).check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Confirm notification shown and new permission shown, then submit
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText('Permissions updated')
    await expect(_summaryRow(page, 'Permission').locator('.govuk-summary-list__value')).toContainText(
      'Environment Officer'
    )
    await page.locator('.govuk-button', { hasText: 'Confirm' }).click()

    // Confirm notification shown and permissions updated
    await expect(page.locator('.govuk-notification-banner__heading')).toContainText(
      `${userToUpdate.username} has been updated.`
    )
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.locator('[data-test="user-permissions-0"]')).toContainText('Environment Officer')
  })
})

/**
 * Locates the govuk-summary-list row whose label matches the given text
 */
function _summaryRow(page, label) {
  return page.locator('.govuk-summary-list__row', { hasText: label })
}
