'use strict'

import scenarioData from '../../../../support/scenarios/company-contact.js'

const scenario = scenarioData()

describe("View a licence's contacts (internal)", () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('can remove a contact', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/companies/${scenario.companies[0].id}/contacts`)

    const contact = scenario.contacts[0]

    // Confirm the contacts exists
    cy.get('[data-test="contact-name-0"]').should('contain.text', scenario.companies[0].name)
    cy.get('[data-test="contact-type-0"]').should('contain.text', 'Licence holder')

    cy.get('[data-test="contact-name-1"]').should('contain.text', contact.department)
    cy.get('[data-test="contact-type-1"]').should('contain.text', 'Additional contact')

    // View the contact details
    cy.contains('.govuk-table__row', contact.department).within(() => {
      cy.get('a').click()
    })

    cy.get('h1.govuk-heading-l').should('have.text', `Contact details for ${contact.department}`)

    // Remove the contact
    cy.get('.govuk-button').contains('Remove').click()

    // Confirm the removal
    cy.get('h1').should('contain.text', 'You\'re about to remove this contact')

    cy.contains('.govuk-summary-list__row', 'Name').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', contact.department)
    })

    cy.contains('.govuk-summary-list__row', 'Email address').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', 'test.contact@example.com')
    })

    cy.contains('.govuk-summary-list__row', 'Water abstraction alerts').within(() => {
      cy.get('.govuk-summary-list__value').should('include.text', 'No')
    })

    cy.get('.govuk-button').contains('Remove this contact').click()

    // Confirm the notification banner shows the correct success message
    cy.get('.govuk-notification-banner').within(() => {
      cy.get('.govuk-notification-banner__title').should('contain.text', 'Contact removed')
      cy.get('.govuk-notification-banner__heading').should('contain.text', `${contact.department} was removed from this company`)
    })

    // Confirm the contacts table no longer contains the removed contact
    cy.get('.govuk-table__cell').contains(contact.department).should('not.exist')

    cy.get('[data-test="contact-name-0"]').should('contain.text', scenario.companies[0].name)
    cy.get('[data-test="contact-type-0"]').should('contain.text', 'Licence holder')
  })
})
