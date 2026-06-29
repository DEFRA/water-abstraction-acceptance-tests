'use strict'

import scenarioData from '../../../../support/scenarios/company-contact.js'

const scenario = scenarioData()

describe('Restore a licence holder contact (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('warns when re-creating a contact that was previously removed', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/companies/${scenario.companies[0].id}/contacts`)

    const contact = scenario.contacts[0]

    // Confirm the seeded contact exists
    cy.get('[data-test="contact-name-1"]').should('contain.text', contact.department)
    cy.get('[data-test="contact-type-1"]').should('contain.text', 'Additional contact')

    // Remove the contact
    cy.contains('.govuk-table__row', contact.department).within(() => {
      cy.get('a').click()
    })

    cy.get('h1.govuk-heading-l').should('have.text', `Contact details for ${contact.department}`)

    cy.get('.govuk-button').contains('Remove').click()

    cy.get('h1').should('contain.text', "You're about to remove this contact")
    cy.get('.govuk-button').contains('Remove this contact').click()

    cy.get('.govuk-notification-banner').within(() => {
      cy.get('.govuk-notification-banner__title').should('contain.text', 'Contact removed')
      cy.get('.govuk-notification-banner__heading').should(
        'contain.text',
        `${contact.department} was removed from this company`
      )
    })

    cy.get('.govuk-table__cell').contains(contact.department).should('not.exist')

    // Set up a new contact using the same name and email as the removed contact
    cy.get('.govuk-button').contains('Set up a new contact').click()

    cy.get('#name').type(contact.department)
    cy.get('button.govuk-button').click()

    cy.get('#email').type(contact.email)
    cy.get('button.govuk-button').click()

    cy.get('input[name="abstractionAlerts"][value="yes"]').check()
    cy.contains('Continue').click()

    // Confirm a warning is shown that a deleted contact with this name and email already exists
    cy.get('.govuk-warning-text__text')
      .should('include.text', 'A deleted contact with this name and email already exists.')
      .and('include.text', 'Change the name or email, or restore the existing contact.')

    cy.contains('.govuk-summary-list__key', 'Name')
      .next('.govuk-summary-list__value')
      .should('include.text', contact.department)

    cy.contains('Restore').click()

    // Confirm the contact was restored
    cy.get('h1.govuk-heading-l').should('have.text', 'You are about to restore this contact')

    cy.contains('.govuk-summary-list__key', 'Name')
      .next('.govuk-summary-list__value')
      .should('include.text', contact.department)

    cy.contains('.govuk-summary-list__key', 'Email address')
      .next('.govuk-summary-list__value')
      .should('include.text', contact.email)

    cy.contains('.govuk-summary-list__key', 'Water abstraction alerts')
      .next('.govuk-summary-list__value')
      .should('include.text', 'Yes')

    cy.get('.govuk-button').contains('Confirm restore').click()

    // Confirm the notification banner shows the contact was restored
    cy.get('.govuk-notification-banner').within(() => {
      cy.get('.govuk-notification-banner__title').should('contain.text', 'Contact')
      cy.get('.govuk-notification-banner__heading').should('contain.text', `${contact.department} was restored`)
    })

    cy.get('[data-test="contact-name-1"]').should('contain.text', contact.department)
    cy.get('[data-test="contact-type-1"]').should('contain.text', 'Abstraction alerts')
  })
})
