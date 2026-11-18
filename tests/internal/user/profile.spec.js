import { expect, test } from '../../support/fixtures.js'

test.describe('Update profile journey (internal)', () => {
  test('navigates to the "Profile details" page and adds additional details for the current user', async ({
    page,
    users
  }) => {
    const userEmail = users.basic

    // Navigate to the reset your password page
    await page.goto('/')
    await page.locator('a[href*="/system/users/me/profile-details"]').click()

    // Enter a valid email address and submit
    await page.locator('input#name').fill('Urma Tester')
    await page.locator('input#jobTitle').fill('QA')
    await page.locator('input#email').fill(userEmail)
    await page.locator('input#tel').fill('0117 496 0000')
    await page.locator('input#address').fill(`ENVIRONMENT AGENCY
HORIZON HOUSE
DEANERY LANE
BRISTOL
BS1 5AH
`)
    await page.locator('form > .govuk-button').click()

  })
})
