import scenarioData from '../../support/scenarios/external-user.scenario.js'
import { test, expect } from '../../support/fixtures.js'

test.describe('Change user email address (external)', () => {
  let user

  test.beforeAll(async ({ setup }) => {
    const scenario = scenarioData()

    const {
      users: [scenarioUser]
    } = scenario

    user = scenarioUser

    await setup(scenario)
  })

  test.beforeEach(async ({ loginExternal }) => {
    await loginExternal(user.username)
  })

  test('can allow authenticated users to change their email address including verification by them with a code', async ({
    page,
    externalUrl,
    defaultPassword
  }) => {
    const newEmail = 'new.me@example.com'

    await page.goto(`${externalUrl}/account`)

    // Account settings
    // Check we see current email address then click Change your email address link
    await expect(page.locator('#main-content > div > div > div > p')).toContainText(user.username)
    await page.locator('a', { hasText: 'Change your email address' }).click()

    // For security, confirm your password first
    // Enter password and continue
    await page.locator('input#password').fill(defaultPassword)
    await page.locator('button.govuk-button', { hasText: 'Continue' }).click()

    // Change your email address
    await page.locator('#email').fill(newEmail)
    await page.locator('#confirm-email').fill(newEmail)
    await page.locator('button.govuk-button', { hasText: 'Continue' }).click()

    // Verify your email address
    // NOTE: no accessible hook for this element in the rendered markup, so it's targeted by its DOM position,
    // matching the original Cypress selector.
    await expect(page.locator('#main-content > div:nth-child(2) > div:nth-child(2) > p > span')).toContainText(newEmail)

    const code = await page.locator('[data-test="security-code"]').innerText()

    await page.locator('#verificationCode').fill(code)
    await page.locator('button.govuk-button', { hasText: 'Continue' }).click()

    // Your email address is changed
    await expect(page.locator('h1.govuk-heading-l')).toContainText('Your email address is changed')

    // Click Account settings link
    await page.locator('#account-settings').click()

    // Account settings
    // Confirm we see the new email address applied
    await expect(page.locator('#main-content > div > div > div > p')).toContainText(newEmail)
  })
})
