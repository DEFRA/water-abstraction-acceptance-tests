import scenarioData from '../../support/scenarios/core-licence.js'
import { test, expect } from '../../support/fixtures.js'

const scenario = scenarioData()
const { id: companyId, name: companyName } = scenario.companies[0]
const { licenceRef, startDate } = scenario.licences[0]

test.describe('Licence holder (internal)', () => {
  test.beforeEach(async ({ login, users }) => {
    await login(users.super)
  })

  test('can navigate between pages using the sub-navigation', async ({ page }) => {
    await page.goto(`/system/companies/${companyId}/licences`)

    await page.locator('.x-govuk-sub-navigation__link', { hasText: 'History' }).click()
    await expect(page.locator('h1')).toContainText('History')

    await page.locator('.x-govuk-sub-navigation__link', { hasText: 'Billing accounts' }).click()
    await expect(page.locator('h1')).toContainText('Billing accounts')

    await page.locator('.x-govuk-sub-navigation__link', { hasText: 'Contacts' }).click()
    await expect(page.locator('h1')).toContainText('Contacts')

    await page.locator('.x-govuk-sub-navigation__link', { hasText: 'Licences' }).click()
    await expect(page.locator('h1')).toContainText('Licences')
  })

  test('can view the licences page', async ({ page }) => {
    await page.goto(`/system/companies/${companyId}/licences`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText(['Licences', 'History', 'Billing accounts', 'Contacts'])

    await expect(page.locator('.govuk-caption-l')).toContainText(companyName)
    await expect(page.locator('h1')).toContainText('Licences')

    await expect(page.locator('[data-test="licence-ref-0"]')).toContainText(licenceRef)
    await expect(page.locator('[data-test="licence-holder-0"]')).toContainText(companyName)
  })

  test('can view the contacts page', async ({ page }) => {
    await page.goto(`/system/companies/${companyId}/contacts`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText(['Licences', 'History', 'Billing accounts', 'Contacts'])

    await expect(page.locator('.govuk-caption-l')).toContainText(companyName)
    await expect(page.locator('h1')).toContainText('Contacts')

    await expect(page.locator('[data-test="contact-name-0"]')).toContainText(companyName)
  })

  test('can view the history page', async ({ page }) => {
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

    await page.goto(`/system/companies/${companyId}/history`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText(['Licences', 'History', 'Billing accounts', 'Contacts'])

    await expect(page.locator('.govuk-caption-l')).toContainText(companyName)
    await expect(page.locator('h1')).toContainText('History')

    await expect(page.locator('[data-test="licence-ref-0"]')).toContainText(licenceRef)
    await expect(page.locator('[data-test="start-date-0"]')).toContainText(formattedStartDate)
  })

  test('can view the billing accounts page', async ({ page }) => {
    await page.goto(`/system/companies/${companyId}/billing-accounts`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText(['Licences', 'History', 'Billing accounts', 'Contacts'])

    await expect(page.locator('.govuk-caption-l')).toContainText(companyName)
    await expect(page.locator('h1')).toContainText('Billing accounts')

    await expect(page.locator('#main-content p')).toContainText('No billing accounts for this customer.')
  })
})
