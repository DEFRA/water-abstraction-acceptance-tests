import { expect, test } from '../../../support/fixtures.js'

test.describe('Ad-hoc returns invitation journey (internal)', { tag: '@sequential' }, () => {
  let licence
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-with-open-winter-return-log')

    licence = scenario.licence
    user = scenario.user
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('create an ad-hoc returns invitation notice', async ({ page }) => {
    // Navigate to the Notices page
    await page.goto('/system/notices')

    // Start the ad-hoc notice journey
    await page.getByRole('button', { name: 'Create an ad-hoc notice' }).click()

    // Select the notice type
    await page.getByRole('radio', { name: 'Returns invitation' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter a licence number
    // NOTE: the licence number textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#licenceRef').fill(licence.licenceRef)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the notice type
    await expect(page.locator('[data-test="licence-number"]')).toContainText(licence.licenceRef)
    await expect(page.locator('[data-test="notice-type"]')).toContainText('Returns invitation')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Capture the notice reference so we can verify it later
    const noticeReference = (await page.locator('.govuk-caption-l', { hasText: 'Notice' }).innerText()).trim()

    // Recipients count
    await expect(page.getByText('Showing all 1 recipients')).toBeVisible()

    await expect(page.locator('[data-test^="recipient-contact"]')).toHaveCount(1)

    const userRow = page.getByRole('row').filter({ hasText: user.username })
    await expect(userRow.locator('[data-test^="recipient-licence-numbers"]')).toContainText(licence.licenceRef)
    await expect(userRow.locator('[data-test^="recipient-method"]')).toContainText('Email - primary user')
    await expect(userRow.locator('[data-test^="recipient-action"]')).toContainText('Preview')

    await userRow.getByText('Preview').click()

    // Preview contains the notice type
    await expect(page.getByText('Returns invitation ad-hoc')).toBeVisible()
    await page.locator('.govuk-back-link').click()

    // Check the recipients
    await page.getByRole('button', { name: 'Send' }).click()

    // Notice confirmation
    await expect(page.locator('.govuk-panel__title')).toContainText('Returns invitations sent', { timeout: 15000 })
    await page.getByRole('link', { name: 'View notice' }).click()

    // Notice page contains the recipients
    await expect(page.locator('.govuk-caption-l', { hasText: noticeReference })).toBeVisible()

    await expect(page.getByText('Showing all 1 notifications')).toBeVisible()

    await expect(page.locator('[data-test^="notification-recipient"]')).toHaveCount(1)
    await expect(page.locator('[data-test^="notification-recipient"]', { hasText: user.username })).toBeVisible()
  })
})
