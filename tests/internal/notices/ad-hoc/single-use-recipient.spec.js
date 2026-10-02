import { expect, test } from '../../../support/fixtures.js'

test.describe('Ad-hoc notice single-use recipient journey (internal)', () => {
  let licence
  let primaryUser
  let user

  test.beforeAll(async ({ world }) => {
    const scenario = world('registered-licence-for-single-use-recipient')

    licence = scenario.licence
    primaryUser = scenario.users[1]
    user = scenario.users[0]
  })

  test.beforeEach(async ({ login, page }) => {
    await login(user.username)

    await page.goto('/system/notices')
    await page.getByRole('button', { name: 'Create an ad-hoc notice' }).click()

    await page.getByRole('radio', { name: 'Returns invitation' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // NOTE: the licence number textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#licenceRef').fill(licence.licenceRef)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.locator('[data-test="licence-number"]')).toContainText(licence.licenceRef)
    await expect(page.locator('[data-test="notice-type"]')).toContainText('Returns invitation')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.getByText('Showing all 1 recipients')).toBeVisible()

    await page.getByRole('button', { name: 'Manage recipients' }).click()
    await page.getByRole('link', { name: 'Set up a single use address or email address' }).click()
  })

  test('adds a single-use recipient with an address found by postcode lookup', async ({ page }) => {
    await page.getByRole('radio', { name: 'Post' }).check()
    await page.getByLabel('Name').fill('Lookup recipient')
    await page.getByRole('button', { name: 'Continue' }).click()

    // NOTE: the postcode textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#postcode').fill('BS1 5AH')
    await page.getByRole('button', { name: 'Find addresses' }).click()

    // NOTE: both the lookup and selecting the address call the address facade, which refuses calls less than 2 seconds
    // apart. Hence we wait before selecting the address.
    await page.waitForTimeout(2000)
    await page.getByRole('combobox', { name: 'Address' }).selectOption('340116')
    await page.getByRole('button', { name: 'Continue' }).click()

    const noticeReference = (await page.locator('.govuk-caption-l', { hasText: 'Notice' }).innerText()).trim()

    await expect(page.getByText('Showing all 2 recipients')).toBeVisible()
    await expect(page.locator('[data-test^="recipient-contact"]')).toHaveCount(2)

    const userRow = page.getByRole('row').filter({ hasText: primaryUser.username })
    await expect(userRow.locator('[data-test^="recipient-licence-numbers"]')).toContainText(licence.licenceRef)
    await expect(userRow.locator('[data-test^="recipient-method"]')).toContainText('Email - primary user')
    await expect(userRow.locator('[data-test^="recipient-action"]')).toContainText('Preview')

    const lookupRow = page.getByRole('row').filter({ hasText: 'Lookup recipient' })
    await expect(lookupRow).toContainText('ENVIRONMENT AGENCY')
    await expect(lookupRow).toContainText('HORIZON HOUSE DEANERY ROAD')
    await expect(lookupRow).toContainText('BRISTOL')
    await expect(lookupRow).toContainText('BS1 5AH')
    await expect(lookupRow.locator('[data-test^="recipient-licence-numbers"]')).toContainText(licence.licenceRef)
    await expect(lookupRow.locator('[data-test^="recipient-method"]')).toContainText('Letter - single use')
    await expect(lookupRow.locator('[data-test^="recipient-action"]')).toContainText('Preview')

    await lookupRow.getByText('Preview').click()

    await expect(page.getByText('Returns invitation ad-hoc')).toBeVisible()
    await expect(page.getByText('Lookup recipient').first()).toBeVisible()
    await page.locator('.govuk-back-link').click()

    await page.getByRole('button', { name: 'Send' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Returns invitations sent', { timeout: 15000 })
    await page.getByRole('link', { name: 'View notice' }).click()

    await expect(page.locator('.govuk-caption-l', { hasText: noticeReference })).toBeVisible()
    await expect(page.getByText('Showing all 2 notifications')).toBeVisible()

    await expect(page.locator('[data-test^="notification-recipient"]')).toHaveCount(2)
    await expect(page.locator('[data-test^="notification-recipient"]', { hasText: primaryUser.username })).toBeVisible()

    const lookupNotification = page.locator('[data-test^="notification-recipient"]', { hasText: 'Lookup recipient' })
    await expect(lookupNotification).toContainText('ENVIRONMENT AGENCY')
    await expect(lookupNotification).toContainText('HORIZON HOUSE DEANERY ROAD')
    await expect(lookupNotification).toContainText('BRISTOL')
    await expect(lookupNotification).toContainText('BS1 5AH')
  })

  test('adds a single-use recipient with a manually entered address', async ({ page }) => {
    await page.getByRole('radio', { name: 'Post' }).check()
    await page.getByLabel('Name').fill('Manual Recipient')
    await page.getByRole('button', { name: 'Continue' }).click()

    // NOTE: the postcode textbox has no accessible label in the rendered markup, so it can't be targeted by
    // role/label. Target it by its id instead.
    await page.locator('#postcode').fill('BS1 5AH')
    await page.getByRole('button', { name: 'Find addresses' }).click()

    await page.getByRole('link', { name: 'I cannot find the address in the list' }).click()

    await page.locator('#addressLine1').fill('4 Privet drive')
    await page.locator('#addressLine2').fill('Little Whinging')
    await page.locator('#addressLine3').fill('Surrey')
    await page.locator('#postcode').fill('WD25 7LR')
    await page.getByRole('button', { name: 'Continue' }).click()

    const noticeReference = (await page.locator('.govuk-caption-l', { hasText: 'Notice' }).innerText()).trim()

    await expect(page.getByText('Showing all 2 recipients')).toBeVisible()
    await expect(page.locator('[data-test^="recipient-contact"]')).toHaveCount(2)

    const manualRow = page.getByRole('row').filter({ hasText: 'Manual Recipient' })
    await expect(manualRow).toContainText('4 Privet drive')
    await expect(manualRow).toContainText('Little Whinging')
    await expect(manualRow).toContainText('Surrey')
    await expect(manualRow).toContainText('WD25 7LR')
    await expect(manualRow.locator('[data-test^="recipient-licence-numbers"]')).toContainText(licence.licenceRef)
    await expect(manualRow.locator('[data-test^="recipient-method"]')).toContainText('Letter - single use')
    await expect(manualRow.locator('[data-test^="recipient-action"]')).toContainText('Preview')

    await page.getByRole('button', { name: 'Send' }).click()

    await expect(page.locator('.govuk-panel__title')).toContainText('Returns invitations sent', { timeout: 15000 })
    await page.getByRole('link', { name: 'View notice' }).click()

    await expect(page.locator('.govuk-caption-l', { hasText: noticeReference })).toBeVisible()
    await expect(page.getByText('Showing all 2 notifications')).toBeVisible()

    await expect(page.locator('[data-test^="notification-recipient"]')).toHaveCount(2)

    const manualNotification = page.locator('[data-test^="notification-recipient"]', { hasText: 'Manual Recipient' })
    await expect(manualNotification).toContainText('4 Privet drive')
    await expect(manualNotification).toContainText('Little Whinging')
    await expect(manualNotification).toContainText('Surrey')
    await expect(manualNotification).toContainText('WD25 7LR')
  })
})
