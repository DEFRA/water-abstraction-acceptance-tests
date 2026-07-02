import { test, expect } from '../../support/fixtures.js'

test.describe('Creating a user (internal)', () => {
  test.beforeEach(async ({ login, users }) => {
    await login(users.super)
  })

  test('can create an internal user', async ({ page }) => {
    await page.goto('/account/create-user')

    // Enter a generated email address to avoid duplicates on subsequent runs of the test
    const newEmail = `regression.tests.${Date.now()}@defra.gov.uk`

    await expect(page.locator('.govuk-label')).toContainText('Enter a gov.uk email address')
    await page.locator('input#email').fill(newEmail)
    await page.locator('form > .govuk-button').click()

    // Confirm we see 8 permission types. Then pick one for our user
    await expect(page.locator('div.govuk-radios').locator('> *')).toHaveCount(8)
    await page.locator('[type="radio"][value="basic"]').check()
    await page.locator('form > .govuk-button').click()

    // Confirm we see confirmation of the new account created
    await expect(page.locator('h1.govuk-heading-l')).toContainText('New account created')
    await expect(page.locator("span[class='govuk-!-font-weight-bold']")).toContainText(newEmail)
  })
})
