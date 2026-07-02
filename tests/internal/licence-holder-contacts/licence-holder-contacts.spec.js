import scenarioData from '../../support/scenarios/company-contact.js'
import { test, expect } from '../../support/fixtures.js'
import { formatLongDate } from '../../support/helpers/date.helpers.js'

const scenario = scenarioData()

const {
  companies: [company],
  licences: [licence],
  contacts: [contact]
} = scenario

function summaryValue(page, label) {
  return page.locator('.govuk-summary-list__row', { hasText: label }).locator('.govuk-summary-list__value')
}

test.describe('Licence holder contacts (internal)', () => {
  test.beforeEach(async ({ setup, login, users }) => {
    await setup(scenario)
    await login(users.super)
  })

  test('can create an additional contact with no abstraction alerts', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/contacts`)

    // Confirm the page title and caption
    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1')).toContainText('Contacts')

    // Set up a contact with no abstraction alerts (an additional contact)
    await page.locator('.govuk-button', { hasText: 'Set up a new contact' }).click()

    await page.locator('#name').fill('Test Contact No Licences')
    await page.locator('button.govuk-button').click()

    await page.locator('#email').fill('test.contact.none@example.com')
    await page.locator('button.govuk-button').click()

    await page.locator('input[name="abstractionAlerts"][value="no"]').check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    await expect(summaryValue(page, 'Name')).toContainText('Test Contact No Licences')
    await expect(summaryValue(page, 'Water abstraction alerts')).toContainText('No')

    await page.locator('.govuk-button', { hasText: 'Confirm' }).click()

    const banner = page.locator('.govuk-notification-banner')
    await expect(banner.locator('.govuk-notification-banner__title')).toContainText('Contact added')
    await expect(banner.locator('.govuk-notification-banner__heading')).toContainText(
      'Test Contact No Licences was added to this company'
    )

    // Confirm the contacts table contains the expected records
    await expect(page.locator('[data-test="contact-name-0"]')).toContainText(company.name)
    await expect(page.locator('[data-test="contact-type-0"]')).toContainText('Licence holder')

    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Additional contact')

    await expect(page.locator('[data-test="contact-name-2"]')).toContainText('Test Contact No Licences')
    await expect(page.locator('[data-test="contact-type-2"]')).toContainText('Additional contact')
  })

  test('can create a contact with abstraction alerts for all licences', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/contacts`)

    // Confirm the page title and caption
    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1')).toContainText('Contacts')

    // Set up a contact with abstraction alerts for all licences
    await page.locator('.govuk-button', { hasText: 'Set up a new contact' }).click()

    await page.locator('#name').fill('Test Contact All Licences')
    await page.locator('button.govuk-button').click()

    await page.locator('#email').fill('test.contact.all@example.com')
    await page.locator('button.govuk-button').click()

    await page.locator('input[name="abstractionAlerts"][value="yes"]').check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    await expect(summaryValue(page, 'Name')).toContainText('Test Contact All Licences')
    await expect(summaryValue(page, 'Water abstraction alerts')).toContainText('Yes, for all licences')

    await page.locator('.govuk-button', { hasText: 'Confirm' }).click()

    const banner = page.locator('.govuk-notification-banner')
    await expect(banner.locator('.govuk-notification-banner__title')).toContainText('Contact added')
    await expect(banner.locator('.govuk-notification-banner__heading')).toContainText(
      'Test Contact All Licences was added to this company'
    )

    // Confirm the contacts table contains the expected records
    await expect(page.locator('[data-test="contact-name-0"]')).toContainText(company.name)
    await expect(page.locator('[data-test="contact-type-0"]')).toContainText('Licence holder')

    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Additional contact')

    await expect(page.locator('[data-test="contact-name-2"]')).toContainText('Test Contact All Licences')
    await expect(page.locator('[data-test="contact-type-2"]')).toContainText('Abstraction alerts')
  })

  test('can create a contact with abstraction alerts for some licences', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/contacts`)

    // Confirm the page title and caption
    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1')).toContainText('Contacts')

    // Set up a contact with abstraction alerts for some licences
    await page.locator('.govuk-button', { hasText: 'Set up a new contact' }).click()

    await page.locator('#name').fill('Test Contact Some Licences')
    await page.locator('button.govuk-button').click()

    await page.locator('#email').fill('test.contact.some@example.com')
    await page.locator('button.govuk-button').click()

    await page.locator('input[name="abstractionAlerts"][value="some"]').check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Select at least one licence on the select licences page
    await page.locator('input[type="checkbox"]').first().check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    await expect(summaryValue(page, 'Name')).toContainText('Test Contact Some Licences')

    const someLicencesAlertsValue = summaryValue(page, 'Water abstraction alerts')
    await expect(someLicencesAlertsValue).toContainText('Yes, for some licences')
    await expect(someLicencesAlertsValue).toContainText(licence.licenceRef)

    await page.locator('.govuk-button', { hasText: 'Confirm' }).click()

    const banner = page.locator('.govuk-notification-banner')
    await expect(banner.locator('.govuk-notification-banner__title')).toContainText('Contact added')
    await expect(banner.locator('.govuk-notification-banner__heading')).toContainText(
      'Test Contact Some Licences was added to this company'
    )

    // Confirm the contacts table contains the expected records
    await expect(page.locator('[data-test="contact-name-0"]')).toContainText(company.name)
    await expect(page.locator('[data-test="contact-type-0"]')).toContainText('Licence holder')

    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Additional contact')

    await expect(page.locator('[data-test="contact-name-2"]')).toContainText('Test Contact Some Licences')
    await expect(page.locator('[data-test="contact-type-2"]')).toContainText('Abstraction alerts')
  })

  test('can edit a contact to change its abstraction alerts', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/contacts`)

    // Confirm the seeded contact exists
    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Additional contact')

    // View the contact details
    await page.locator('.govuk-table__row', { hasText: contact.department }).locator('a').click()

    await expect(page.locator('h1.govuk-heading-l')).toHaveText(`Contact details for ${contact.department}`)

    await expect(summaryValue(page, 'Name')).toContainText(contact.department)
    await expect(summaryValue(page, 'Email address')).toContainText(contact.email)
    await expect(summaryValue(page, 'Water abstraction alerts')).toContainText('No')

    // Edit the contact
    await page.locator('.govuk-button', { hasText: 'Edit contact' }).click()

    await expect(summaryValue(page, 'Name')).toContainText(contact.department)
    await expect(summaryValue(page, 'Email address')).toContainText(contact.email)
    await expect(summaryValue(page, 'Water abstraction alerts')).toContainText('No')

    // Change the abstraction alerts to yes, for some licences
    await page
      .locator('.govuk-summary-list__row', { hasText: 'Water abstraction alerts' })
      .locator('a', { hasText: 'Change' })
      .click()

    await page.locator('input[name="abstractionAlerts"][value="some"]').check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Select at least one licence on the select licences page
    await page.locator('input[type="checkbox"]').first().check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Check the change has been applied on the check contact page
    const pendingAlertsValue = summaryValue(page, 'Water abstraction alerts')
    await expect(pendingAlertsValue).toContainText('Yes, for some licences')
    await expect(pendingAlertsValue).toContainText(licence.licenceRef)

    // Confirm the change
    await page.locator('.govuk-button', { hasText: 'Confirm' }).click()

    // Check the contact details page reflects the change
    await expect(page.locator('.govuk-caption-l')).toContainText(company.name)
    await expect(page.locator('h1.govuk-heading-l')).toHaveText(`Contact details for ${contact.department}`)

    await expect(summaryValue(page, 'Name')).toContainText(contact.department)
    await expect(summaryValue(page, 'Email address')).toContainText(contact.email)

    const updatedAlertsValue = summaryValue(page, 'Water abstraction alerts')
    await expect(updatedAlertsValue).toContainText('Yes, for some licences')
    await expect(updatedAlertsValue).toContainText(licence.licenceRef)

    await expect(summaryValue(page, 'Last updated')).toContainText(formatLongDate(new Date()))

    // Confirm the main contacts page reflects the change
    await page.goto(`/system/companies/${company.id}/contacts`)

    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Abstraction alerts')
  })

  test('can remove a contact', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/contacts`)

    // Confirm the contacts exists
    await expect(page.locator('[data-test="contact-name-0"]')).toContainText(company.name)
    await expect(page.locator('[data-test="contact-type-0"]')).toContainText('Licence holder')

    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Additional contact')

    // View the contact details
    await page.locator('.govuk-table__row', { hasText: contact.department }).locator('a').click()

    await expect(page.locator('h1.govuk-heading-l')).toHaveText(`Contact details for ${contact.department}`)

    // Remove the contact
    await page.locator('.govuk-button', { hasText: 'Remove' }).click()

    // Confirm the removal
    await expect(page.locator('h1')).toContainText("You're about to remove this contact")

    await expect(summaryValue(page, 'Name')).toContainText(contact.department)
    await expect(summaryValue(page, 'Email address')).toContainText('test.contact@example.com')
    await expect(summaryValue(page, 'Water abstraction alerts')).toContainText('No')

    await page.locator('.govuk-button', { hasText: 'Remove this contact' }).click()

    // Confirm the notification banner shows the correct success message
    const banner = page.locator('.govuk-notification-banner')
    await expect(banner.locator('.govuk-notification-banner__title')).toContainText('Contact removed')
    await expect(banner.locator('.govuk-notification-banner__heading')).toContainText(
      `${contact.department} was removed from this company`
    )

    // Confirm the contacts table no longer contains the removed contact
    await expect(page.locator('.govuk-table__cell', { hasText: contact.department })).toHaveCount(0)

    await expect(page.locator('[data-test="contact-name-0"]')).toContainText(company.name)
    await expect(page.locator('[data-test="contact-type-0"]')).toContainText('Licence holder')
  })

  test('warns when re-creating a contact that was previously removed', async ({ page }) => {
    await page.goto(`/system/companies/${company.id}/contacts`)

    // Confirm the seeded contact exists
    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Additional contact')

    // Remove the contact
    await page.locator('.govuk-table__row', { hasText: contact.department }).locator('a').click()

    await expect(page.locator('h1.govuk-heading-l')).toHaveText(`Contact details for ${contact.department}`)

    await page.locator('.govuk-button', { hasText: 'Remove' }).click()

    await expect(page.locator('h1')).toContainText("You're about to remove this contact")
    await page.locator('.govuk-button', { hasText: 'Remove this contact' }).click()

    const banner = page.locator('.govuk-notification-banner')
    await expect(banner.locator('.govuk-notification-banner__title')).toContainText('Contact removed')
    await expect(banner.locator('.govuk-notification-banner__heading')).toContainText(
      `${contact.department} was removed from this company`
    )

    await expect(page.locator('.govuk-table__cell', { hasText: contact.department })).toHaveCount(0)

    // Set up a new contact using the same name and email as the removed contact
    await page.locator('.govuk-button', { hasText: 'Set up a new contact' }).click()

    await page.locator('#name').fill(contact.department)
    await page.locator('button.govuk-button').click()

    await page.locator('#email').fill(contact.email)
    await page.locator('button.govuk-button').click()

    await page.locator('input[name="abstractionAlerts"][value="yes"]').check()
    await page.locator('.govuk-button', { hasText: 'Continue' }).click()

    // Confirm a warning is shown that a deleted contact with this name and email already exists
    const warningText = page.locator('.govuk-warning-text__text')
    await expect(warningText).toContainText('A deleted contact with this name and email already exists.')
    await expect(warningText).toContainText('Change the name or email, or restore the existing contact.')

    await expect(summaryValue(page, 'Name')).toContainText(contact.department)

    await page.locator('.govuk-button', { hasText: 'Restore' }).click()

    // Confirm the contact was restored
    await expect(page.locator('h1.govuk-heading-l')).toHaveText('You are about to restore this contact')

    await expect(summaryValue(page, 'Name')).toContainText(contact.department)
    await expect(summaryValue(page, 'Email address')).toContainText(contact.email)
    await expect(summaryValue(page, 'Water abstraction alerts')).toContainText('Yes')

    await page.locator('.govuk-button', { hasText: 'Confirm restore' }).click()

    // Confirm the notification banner shows the contact was restored
    await expect(banner.locator('.govuk-notification-banner__title')).toContainText('Contact')
    await expect(banner.locator('.govuk-notification-banner__heading')).toContainText(
      `${contact.department} was restored`
    )

    await expect(page.locator('[data-test="contact-name-1"]')).toContainText(contact.department)
    await expect(page.locator('[data-test="contact-type-1"]')).toContainText('Abstraction alerts')
  })
})
