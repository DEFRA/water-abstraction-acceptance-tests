import scenarioData from '../../../support/scenarios/licence-with-previous-return-log.scenario.js'
import { test, expect } from '../../../support/fixtures.js'

test.describe('Ad-hoc Paper returns journey (internal)', () => {
  test.beforeAll(async ({ tearDown, calculatedDates, load }) => {
    await tearDown()

    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    await load(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('generates a paper return sent by Notify to the licensee', async ({ page }) => {
    // Navigate to the Notices page
    await page.goto('/system/notices')

    // Start the ad-hoc notice journey
    await page.getByRole('button', { name: 'Create an ad-hoc notice' }).click()

    // Select the notice type
    await page.getByRole('radio', { name: 'Paper return' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter a licence number
    // NOTE: the licence number textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#licenceRef').fill('AT/TE/ST/01/01')
    await page.locator('button.govuk-button').click()

    // Select the returns for the paper return
    await page.getByRole('checkbox').first().check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the notice type
    await expect(page.locator('[data-test="licence-number"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="notice-type"]')).toContainText('Paper return')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Capture the notice reference so we can verify it later
    const noticeReference = (await page.locator('.govuk-caption-l', { hasText: 'Notice' }).innerText()).trim()

    // Recipients count
    await expect(page.getByText('Showing all 1 recipients')).toBeVisible()

    // Add an additional recipient
    await page.getByRole('button', { name: 'Manage recipients' }).click()
    await page.getByRole('link', { name: 'Set up a single use address' }).click()

    // Enter the recipient's name
    await page.locator('#name').fill('Manual Recipient')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter a UK postcode
    // NOTE: the postcode textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#postcode').fill('BS1 5AH')
    await page.getByRole('button', { name: 'Find addresses' }).click()

    // Select the address returned from the lookup (rate limited so pause briefly)
    // we have to wait a second. Both the lookup and selecting the address result in a call to the address facade which
    // has rate monitoring protection. Because we're automating the calls, they happen too quickly so the facade rejects
    // the second call. Hence we need to wait a second.
    await page.waitForTimeout(1000)
    await page.getByRole('link', { name: 'I cannot find the address in the list' }).click()

    // Enter the address
    await page.locator('#addressLine1').fill('4 Privet drive')
    await page.locator('#addressLine2').fill('Little Whinging')
    await page.locator('#addressLine3').fill('Surrey')
    await page.locator('#postcode').fill('WD25 7LR')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Recipients count
    await expect(page.getByText('Showing all 2 recipients')).toBeVisible()

    // Additional recipient is shown in the list
    await expect(page.locator('[data-test^="recipient-contact"]')).toHaveCount(2)
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('Manual Recipient')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('4 Privet drive')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('Little Whinging')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('Surrey')
    await expect(page.locator('[data-test="recipient-contact-1"]')).toContainText('WD25 7LR')
    await expect(page.locator('[data-test="recipient-licence-numbers-1"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="recipient-method-1"]')).toContainText('Letter - single use')
    await expect(page.locator('[data-test="recipient-action-1"]')).toContainText('Preview')

    // Check the recipients
    await page.getByRole('button', { name: 'Send' }).click()

    // Notice confirmation
    await expect(page.locator('.govuk-panel__title')).toContainText('Paper returns sent', { timeout: 15000 })
    await page.getByRole('link', { name: 'View notice' }).click()

    // Notice page contains the recipients
    await expect(page.locator('.govuk-caption-l', { hasText: noticeReference })).toBeVisible()

    await expect(page.getByText('Showing all 2 notifications')).toBeVisible()

    await expect(page.locator('[data-test^="notification-recipient"]')).toHaveCount(2)
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('Manual Recipient')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('4 Privet drive')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('Little Whinging')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('Surrey')
    await expect(page.locator('[data-test="notification-recipient1"]')).toContainText('WD25 7LR')
  })
})
