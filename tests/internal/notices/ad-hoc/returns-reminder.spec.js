import scenarioData from '../../../support/scenarios/licence-with-due-return-log.js'
import { test, expect } from '../../../support/fixtures.js'

test.describe('Ad-hoc returns reminder journey (internal)', () => {
  test.beforeAll(async ({ tearDown, calculatedDates, load }) => {
    await tearDown()

    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    await load(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('invites a customer to submit returns', async ({ page }) => {
    // Navigate to the Notices page
    await page.goto('/system/notices')

    // Start the ad-hoc notice journey
    await page.getByRole('button', { name: 'Create an ad-hoc notice' }).click()

    // Select the notice type
    await page.getByRole('radio', { name: 'Returns reminder' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter a licence number
    // NOTE: the licence number textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#licenceRef').fill('AT/TE/ST/01/01')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the notice type
    await expect(page.locator('[data-test="licence-number"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="notice-type"]')).toContainText('Returns reminder')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Capture the notice reference so we can verify it later
    const noticeReference = (await page.locator('.govuk-caption-l', { hasText: 'Notice' }).innerText()).trim()

    // Recipients count
    await expect(page.getByText('Showing all 1 recipients')).toBeVisible()

    // Add an additional recipient
    await page.getByRole('button', { name: 'Manage recipients' }).click()
    await page.getByRole('link', { name: 'Set up a single use address or email address' }).click()

    // Select 'post' and add the contacts name
    await page.getByRole('radio', { name: 'Post' }).check()
    await page.getByLabel('Name').fill('Lookup recipient')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter the postcode
    // NOTE: the postcode textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#postcode').fill('BS1 5AH')
    await page.getByRole('button', { name: 'Find addresses' }).click()

    // Select the address returned from the lookup (rate limited so pause briefly)
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen too quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    await page.waitForTimeout(1000)
    await page.getByRole('combobox', { name: 'Address' }).selectOption('340116')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Recipients count
    await expect(page.getByText('Showing all 2 recipients')).toBeVisible()

    // Additional recipient is shown in the list
    await expect(page.locator('[data-test^="recipient-contact"]')).toHaveCount(2)

    await expect(page.locator('[data-test="recipient-contact-0"]')).toContainText('external@example.com')
    await expect(page.locator('[data-test="recipient-licence-numbers-0"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="recipient-method-0"]')).toContainText('Email - primary user')
    await expect(page.locator('[data-test="recipient-action-0"]')).toContainText('Preview')

    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('Lookup recipient')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('ENVIRONMENT AGENCY')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('HORIZON HOUSE DEANERY ROAD')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('BRISTOL')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('BS1 5AH')
    await expect(page.locator('[data-test="recipient-licence-numbers-1"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="recipient-method-1"]')).toContainText('Letter - single use')
    await expect(page.locator('[data-test="recipient-action-1"]')).toContainText('Preview')

    await page.locator('[data-test="recipient-action-1"]').getByText('Preview').click()

    // Preview contains the contact name and address
    await expect(page.getByText('Returns reminder ad-hoc')).toBeVisible()
    await expect(page.getByText('Lookup recipient').first()).toBeVisible()
    await page.locator('.govuk-back-link').click()

    // Check the recipients
    await page.getByRole('button', { name: 'Send' }).click()

    // Notice confirmation
    await expect(page.locator('.govuk-panel__title')).toContainText('Returns reminders sent', { timeout: 15000 })
    await page.getByRole('link', { name: 'View notice' }).click()

    // Notice page contains the recipients
    await expect(page.locator('.govuk-caption-l', { hasText: noticeReference })).toBeVisible()

    await expect(page.getByText('Showing all 2 notifications')).toBeVisible()

    await expect(page.locator('[data-test^="notification-recipient"]')).toHaveCount(2)
    await expect(page.locator('[data-test="notification-recipient0"]')).toContainText('external@example.com')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('Lookup recipient')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('ENVIRONMENT AGENCY')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('HORIZON HOUSE DEANERY ROAD')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('BRISTOL')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('BS1 5AH')
  })
})
