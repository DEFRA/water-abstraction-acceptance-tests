'use strict'

import scenarioData from '../../../../support/scenarios/one-licence-only.js'

const scenario = scenarioData()

describe('Billing & Data permissions (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it("confirms the Billing & Data user can access bill runs and a licence's bills tab", () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/licences/${scenario.licences[0].id}/summary`)

    // confirm we are on the licence page
    cy.contains('AT/TEST/01')


    // confirm we can see the summary, contact details, returns, communications, bill runs and licence set up links
    cy.get('nav.x-govuk-sub-navigation').within(() => {
      cy.contains('a', 'Licence summary').should('be.visible')
      cy.contains('a', 'Contact details').should('be.visible')
      cy.contains('a', 'Returns').should('be.visible')
      cy.contains('a', 'Communications').should('be.visible')
      cy.contains('a', 'Bills').should('be.visible')
      cy.contains('a', 'Licence set up').should('be.visible')
    })


    // assert they can see the Bill runs page
    cy.get('#nav > ul').children().should('contain', 'Bill runs')
  })
})
