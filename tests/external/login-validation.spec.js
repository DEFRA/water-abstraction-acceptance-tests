import { test, expect } from '../support/fixtures.js'

test.describe('Login validation (external)', () => {
  test('validates the input in the email and password fields on the login screen are valid', async ({
    page,
    externalUrl
  }) => {
    // Navigate to the signin page
    await page.goto(externalUrl)
    await page.locator('a[href*="/signin"]').click()

    // Test submitting nothing
    await page.locator('button.govuk-button.govuk-button--start').click()
    await expect(page.getByRole('link', { name: 'Enter an email address' })).toHaveAttribute('href', '#email')

    // Test submitting an invalid email address
    await page.locator('input#email').fill('invalid....email')
    await page.locator('button.govuk-button.govuk-button--start').click()
    await expect(page.getByRole('link', { name: 'Enter an email address in the correct format' })).toHaveAttribute(
      'href',
      '#email'
    )
    await page.locator('input#email').clear()

    // Test submitting a blank password
    await page.locator('input#email').fill('name@example.com')
    await page.locator('button.govuk-button.govuk-button--start').click()
    await expect(page.getByRole('link', { name: 'Enter your password' })).toHaveAttribute('href', '#password')

    // Test submitting an unknown email and password
    await page.locator('input#password').fill('letmeinnow123')
    await page.locator('button.govuk-button.govuk-button--start').click()
    await expect(page.getByRole('link', { name: 'Check your email address' })).toHaveAttribute('href', '#email')
    await expect(page.getByRole('link', { name: 'Check your password' })).toHaveAttribute('href', '#password')
  })
})
