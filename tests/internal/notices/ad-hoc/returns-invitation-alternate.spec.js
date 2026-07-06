import scenarioData from '../../../support/scenarios/registered-licence-with-open-return-log-bad-primary-user.scenario.js'
import { formatLongDate, relativeToToday } from '../../../support/helpers/date.helpers.js'
import { test, expect } from '../../../support/fixtures.js'
import { reloadUntilTextFound } from '../../../support/helpers/wait.helpers.js'

test.describe('Ad-hoc returns invitation alternate journey (internal)', () => {
  test.beforeAll(async ({ tearDown, calculatedDates, load }) => {
    await tearDown()

    const dates = await calculatedDates()
    const scenario = scenarioData(dates)

    await load(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.billingAndData)
  })

  test('sends a return invite to a "bad" primary user, triggering the alternate notification to the licence, which when confirmed will set the "due date" on the OPEN return log', async ({
    page,
    triggerJob
  }) => {
    test.setTimeout(180000)

    const expectedDueDate = formatLongDate(relativeToToday(29))

    // Navigate to the Notices page
    await page.goto('/system/notices')

    // Start the standard notice journey
    await page.getByRole('button', { name: 'Create an ad-hoc notice' }).click()

    // Select the notice type
    await page.getByRole('radio', { name: 'Returns invitation' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Enter a licence number
    // NOTE: the licence number textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#licenceRef').fill('AT/TE/ST/01/01')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Check the notice type
    await expect(page.locator('[data-test="licence-number"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="notice-type"]')).toContainText('Returns invitation')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Capture the notice reference so we can verify it later
    const noticeReference = (await page.locator('.govuk-caption-l', { hasText: 'Notice' }).innerText()).trim()

    // Check the recipients
    await expect(page.getByText('Showing all 1 recipients')).toBeVisible()

    // Bad primary user is shown in the list
    await expect(page.locator('[data-test^="recipient-contact"]')).toHaveCount(1)

    await expect(page.locator('[data-test="recipient-contact-0"]')).toContainText('iwill-fail@e')
    await expect(page.locator('[data-test="recipient-licence-numbers-0"]')).toContainText('AT/TE/ST/01/01')
    await expect(page.locator('[data-test="recipient-method-0"]')).toContainText('Email - primary user')
    await expect(page.locator('[data-test="recipient-action-0"]')).toContainText('Preview')

    await page.getByRole('button', { name: 'Send' }).click()

    // Notice confirmation
    await expect(page.locator('.govuk-panel__title')).toContainText('Returns invitations sent', { timeout: 15000 })
    await page.getByRole('link', { name: 'View notice' }).click()

    // Notice page contains the recipients
    await expect(page.locator('.govuk-caption-l', { hasText: noticeReference })).toBeVisible()

    await expect(page.getByText('Showing all 1 notifications')).toBeVisible()

    await expect(page.locator('[data-test^="notification-recipient"]')).toHaveCount(1)
    await expect(page.locator('[data-test="notification-recipient0"]')).toContainText('iwill-fail@e')

    // Wait for notification to be flagged as errored. We know the service will pause for 5 seconds between sending
    // and then checking the email's status
    await reloadUntilTextFound(page, page.locator('#main-content > :nth-child(3) > .govuk-tag'), 'error')

    // Go back to the Notices page and wait for the alternate notice to appear as pending
    await page.locator('.govuk-back-link').click()
    await reloadUntilTextFound(page, page.locator('[data-test="notice-status-0"] > .govuk-tag'), 'pending')

    // Confirm it _is_ the alternate and not the notice we created!
    await expect(page.locator('[data-test="notice-reference-0"]')).not.toContainText(noticeReference)

    await page.locator('[data-test="notice-date-created-0"] > .govuk-link').click()

    await expect(page.locator('[data-test="notification-recipient0"]')).toContainText('Big Farm Co Ltd')
    await expect(page.locator('[data-test="notification-recipient0"]')).toContainText('HORIZON HOUSE')
    await expect(page.locator('[data-test="notification-recipient0"]')).toContainText('DEANERY ROAD')
    await expect(page.locator('[data-test="notification-recipient0"]')).toContainText('BRISTOL')
    await expect(page.locator('[data-test="notification-recipient0"]')).toContainText('BS1 5AH')

    // Trigger the notification status job and then wait for Notify to confirm the letter was successful
    await triggerJob('notification-status')
    await reloadUntilTextFound(page, page.locator('#main-content > :nth-child(3) > .govuk-tag'), 'sent')

    // Search for the licence so we can check the 'OPEN' return now has a due date assigned
    await page.locator('#nav-search').click()
    await page.locator('[name="query"]').fill('AT/TE/ST/01/01')
    await page.locator('#search-button').click()
    await page.locator('.searchresult-link', { hasText: 'AT/TE/ST/01/01' }).click()
    await page.locator(':nth-child(4) > .x-govuk-sub-navigation__link').click()
    await expect(page.locator('[data-test="return-reference-0"] > .govuk-link')).toContainText('9999990')

    await expect(page.locator('[data-test="return-due-date-0"]')).toContainText(expectedDueDate)
  })
})
