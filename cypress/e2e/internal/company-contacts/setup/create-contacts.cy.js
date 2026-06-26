'use strict'

import scenarioData from '../../../../support/scenarios/company-contact.js'

const scenario = scenarioData()

describe('Create licence holder contacts (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('can create an abstraction alert contact for all licences and some licences, and an additional contact', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/companies/${scenario.companies[0].id}/contacts`)

    // Confirm the page title and caption
    cy.get('.govuk-caption-l').should('contain.text', scenario.companies[0].name)
    cy.get('h1').should('contain.text', 'Contacts')

    // Confirm contacts contains expected record
    cy.get('.govuk-table__cell').contains(scenario.companies[0].name)
    cy.get('.govuk-table__cell').contains('Licence holder')

    // Set up a contact with abstraction alerts for all licences
    cy.get('.govuk-button').contains('Set up a new contact').click()

    cy.get('#name').type('Test Contact All Licences')
    cy.get('button.govuk-button').click()

    cy.get('#email').type('test.contact.all@example.com')
    cy.get('button.govuk-button').click()

    cy.get('input[name="abstractionAlerts"][value="yes"]').check()
    cy.contains('Continue').click()

    cy.contains('.govuk-summary-list__key', 'Name')
      .next('.govuk-summary-list__value')
      .should('include.text', 'Test Contact All Licences')

    cy.contains('.govuk-summary-list__key', 'Water abstraction alerts')
      .next('.govuk-summary-list__value')
      .should('include.text', 'Yes, for all licences')

    cy.contains('Confirm').click()

    cy.get('.govuk-notification-banner').within(() => {
      cy.get('.govuk-notification-banner__title').should('contain.text', 'Contact added')
      cy.get('.govuk-notification-banner__heading').should('contain.text', 'Test Contact All Licences was added to this company')
    })

    // Set up a contact with abstraction alerts for some licences
    cy.get('.govuk-button').contains('Set up a new contact').click()

    cy.get('#name').type('Test Contact Some Licences')
    cy.get('button.govuk-button').click()

    cy.get('#email').type('test.contact.some@example.com')
    cy.get('button.govuk-button').click()

    cy.get('input[name="abstractionAlerts"][value="some"]').check()
    cy.contains('Continue').click()

    // Select at least one licence on the select licences page
    cy.get('input[type="checkbox"]').first().check()
    cy.contains('Continue').click()

    cy.contains('.govuk-summary-list__key', 'Name')
      .next('.govuk-summary-list__value')
      .should('include.text', 'Test Contact Some Licences')

    cy.contains('.govuk-summary-list__key', 'Water abstraction alerts')
      .next('.govuk-summary-list__value')
      .should('include.text', 'Yes, for some licences')
      .and('include.text', scenario.licences[0].licenceRef)

    cy.contains('Confirm').click()

    cy.get('.govuk-notification-banner').within(() => {
      cy.get('.govuk-notification-banner__title').should('contain.text', 'Contact added')
      cy.get('.govuk-notification-banner__heading').should('contain.text', 'Test Contact Some Licences was added to this company')
    })

    // Set up a contact with no abstraction alerts (an additional contact)
    cy.get('.govuk-button').contains('Set up a new contact').click()

    cy.get('#name').type('Test Contact No Licences')
    cy.get('button.govuk-button').click()

    cy.get('#email').type('test.contact.none@example.com')
    cy.get('button.govuk-button').click()

    cy.get('input[name="abstractionAlerts"][value="no"]').check()
    cy.contains('Continue').click()

    cy.contains('.govuk-summary-list__key', 'Name')
      .next('.govuk-summary-list__value')
      .should('include.text', 'Test Contact No Licences')

    cy.contains('.govuk-summary-list__key', 'Water abstraction alerts')
      .next('.govuk-summary-list__value')
      .should('include.text', 'No')

    cy.contains('Confirm').click()

    cy.get('.govuk-notification-banner').within(() => {
      cy.get('.govuk-notification-banner__title').should('contain.text', 'Contact added')
      cy.get('.govuk-notification-banner__heading').should('contain.text', 'Test Contact No Licences was added to this company')
    })

    // Confirm the contacts table contains all four expected records
    cy.get('[data-test="contact-name-0"]').should('contain.text', scenario.companies[0].name)
    cy.get('[data-test="contact-type-0"]').should('contain.text', 'Licence holder')

    cy.get('[data-test="contact-name-1"]').should('contain.text', scenario.contacts[0].department)
    cy.get('[data-test="contact-type-1"]').should('contain.text', 'Additional contact')

    cy.get('[data-test="contact-name-2"]').should('contain.text', 'Test Contact All Licences')
    cy.get('[data-test="contact-type-2"]').should('contain.text', 'Abstraction alerts')

    cy.get('[data-test="contact-name-3"]').should('contain.text', 'Test Contact No Licences')
    cy.get('[data-test="contact-type-3"]').should('contain.text', 'Additional contact')

    cy.get('[data-test="contact-name-4"]').should('contain.text', 'Test Contact Some Licences')
    cy.get('[data-test="contact-type-4"]').should('contain.text', 'Abstraction alerts')
  })
})
