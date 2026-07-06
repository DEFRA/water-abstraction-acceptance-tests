import scenarioData from '../../support/scenarios/licence.scenario.js'
import { test, expect } from '../../support/fixtures.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'

const scenario = scenarioData()

const {
  companies: [company],
  licences: [licence]
} = scenario

test.describe('Licence holder (internal)', () => {
  test.beforeAll(async ({ setup }) => {
    await setup(scenario)
  })

  test.beforeEach(async ({ login, users }) => {
    await login(users.super)
  })

  test('can navigate between pages using the sub-navigation', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/licences`)

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
    await page.goto(`/system/companies/${company.id}/licences`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText([
      'Licences',
      'History',
      'Billing accounts',
      'Contacts'
    ])

    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1')).toContainText('Licences')

    await expect(page.locator('[data-test="licence-ref-0"]')).toContainText(licence.licenceRef)
    await expect(page.locator('[data-test="licence-holder-0"]')).toContainText(company.name)
  })

  test('can view the contacts page', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/contacts`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText([
      'Licences',
      'History',
      'Billing accounts',
      'Contacts'
    ])

    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1')).toContainText('Contacts')

    await expect(page.locator('[data-test="contact-name-0"]')).toContainText(company.name)
  })

  test('can view the history page', async ({ page }) => {
    const formattedStartDate = formatLongDate(licence.startDate)

    await page.goto(`/system/companies/${company.id}/history`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText([
      'Licences',
      'History',
      'Billing accounts',
      'Contacts'
    ])

    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1')).toContainText('History')

    await expect(page.locator('[data-test="licence-ref-0"]')).toContainText(licence.licenceRef)
    await expect(page.locator('[data-test="start-date-0"]')).toContainText(formattedStartDate)
  })

  test('can view the billing accounts page', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/billing-accounts`)

    await expect(page.locator('.x-govuk-sub-navigation__link')).toContainText([
      'Licences',
      'History',
      'Billing accounts',
      'Contacts'
    ])

    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1')).toContainText('Billing accounts')

    await expect(page.locator('#main-content p')).toContainText('No billing accounts for this customer.')
  })
})
