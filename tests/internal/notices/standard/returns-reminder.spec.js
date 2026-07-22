import scenarioData from '../../../support/scenarios/licence-with-due-return-log-for-first-period.scenario.js'
import { test, expect } from '../../../support/fixtures.js'

test.describe('Standard returns reminder journey (internal)', () => {
  test.beforeAll(async ({ setup, calculatedDates }) => {
    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('creates a standard returns reminder notice', async ({ page }) => {
    // Navigate to the Notices page
    await page.goto('/system/notices')

    // Start the standard notice journey
    await page.getByRole('button', { name: 'Create a standard notice' }).click()

    // Select the notice type
    await page.getByRole('radio', { name: 'Returns reminder' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select the returns periods for the invitations
    await page.getByRole('radio').first().check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the notice type
    await expect(page.locator('[data-test="notice-type"]')).toContainText('Returns reminder')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Capture the notice reference so we can verify it later
    const noticeReference = (await page.locator('.govuk-caption-l', { hasText: 'Notice' }).innerText()).trim()

    // Check the recipients
    await page.getByRole('button', { name: 'Send' }).click()

    // Notice confirmation
    await expect(page.locator('.govuk-panel__title')).toContainText('Returns reminders sent', { timeout: 15000 })
    await page.getByRole('link', { name: 'View notice' }).click()

    // Notice page contains our seeded recipient
    await expect(page.locator('.govuk-caption-l', { hasText: noticeReference })).toBeVisible()

    await page.locator('#main-content > details > summary > span').click()
    await page.locator('[data-test="filter-licence"]').fill('AT/TE/ST/01/01')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.locator('[data-test="notification-licences-0"]')).toContainText('AT/TE/ST/01/01')
  })
})
