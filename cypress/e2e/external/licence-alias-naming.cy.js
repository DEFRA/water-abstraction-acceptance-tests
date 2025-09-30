'use strict'

import scenarioData from '../../support/scenarios/sharing-access.js'

const scenario = scenarioData()

describe('View Licences as external user', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.wrap(scenario.users[0].username).as('userEmail')
  })

  it('Create the alias name for the licences user is holding', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail,
        external: true
      })
    })
    cy.visit(`${Cypress.env('externalUrl')}/licences`)

    cy.get('.licence-result__column').contains('AT/CURR/DAILY/01').click()
    cy.get('.govuk-summary-list__value > a').contains('Rename this licence').click()
    cy.get('#name').clear()

    // Check it validates for empty alias
    cy.get('#name').type('   ')
    cy.get('form > .govuk-button').contains('Save').click()
    cy.get('.govuk-error-summary').contains('There is a problem').should('be.visible')

    // Enter the new name
    cy.get('#name').type('the new daily cupcake licence')
    cy.get('form > .govuk-button').contains('Save').click()
    cy.get('#summary').contains('the new daily cupcake licence').should('be.visible')
  })
})
