'use strict'

import scenarioData from '../../../support/scenarios/one-licence-only.js'

const scenario = scenarioData()

describe("View a licence's contacts (internal)", () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('search for a licence, select it and then view its contacts', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/licences/${scenario.licences[0].id}/contact-details`)

    // Confirm we are on the licence contact details page and expected controls are present
    cy.get('h1').should('contain.text', 'Contact details')
    cy.get('.govuk-body > .govuk-link').contains('Go to customer contacts')

    // Confirm we can see expected licence holder contact details
    cy.get('.govuk-table__row').contains('John Testerson')

    // Click the 'Go to customer contacts' link
    cy.contains('Go to customer contacts').click()

    // Confirm expected tabs are present
    cy.get('#main-content').contains('Licences')
    cy.get('#main-content').contains('Billing accounts')
    cy.get('#main-content').contains('Contacts')

    // Confirm contacts tab is selected
    cy.get('#tab_contacts').invoke('attr', 'aria-selected').should('eq', 'true')

    // Confirm contacts contains expected record
    cy.get('.govuk-table__cell').contains('Mr John Testerson')
  })
})
