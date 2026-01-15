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
    cy.get('.x-govuk-sub-navigation').contains('Licences')
    cy.get('.x-govuk-sub-navigation').contains('Billing accounts')
    cy.get('.x-govuk-sub-navigation').contains('Contacts')

    // Confirm the page title and caption
    cy.get('.govuk-caption-l').should('contain.text', scenario.companies[0].name)
    cy.get('h1').should('contain.text', 'Contacts')

    // Confirm contacts contains expected record
    cy.get('.govuk-table__cell').contains('Mr J J Testerson')
  })
})
