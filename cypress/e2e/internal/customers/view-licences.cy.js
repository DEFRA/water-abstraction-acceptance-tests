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

    cy.visit(`/system/customers/${scenario.companies[0].id}/licences`)

    // Confirm expected tabs are present
    cy.get('.x-govuk-sub-navigation').contains('Licences')
    cy.get('.x-govuk-sub-navigation').contains('Billing accounts')
    cy.get('.x-govuk-sub-navigation').contains('Contacts')

    // Confirm the page title and caption
    cy.get('.govuk-caption-l').should('contain.text', scenario.companies[0].name)
    cy.get('h1').should('contain.text', 'Licences')

    // Confirm contacts contains expected record
    cy.get('.govuk-table__cell').contains(scenario.licences[0].licenceRef)
    cy.get('.govuk-table__cell').contains(scenario.licenceDocumentHeaders[0].licence_name)
  })
})
