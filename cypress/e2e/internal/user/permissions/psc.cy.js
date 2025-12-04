'use strict'

import scenarioData from '../../../../support/scenarios/one-licence-only.js'

const scenario = scenarioData()

describe('PSC permissions (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('psc').as('userEmail')
  })

  it("confirms the PSC user cannot access bill runs and a licence's bills tab", () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/licences/${scenario.licences[0].id}/summary`)

    // confirm we are on the licence page
    cy.contains('AT/TE/ST/01/01')

    // confirm we can see the summary, contact details, returns, communications and licence set up tabs
    cy.get('nav.x-govuk-sub-navigation').within(() => {
      cy.contains('a', 'Licence summary').should('be.visible')
      cy.contains('a', 'Contact details').should('be.visible')
      cy.contains('a', 'Returns').should('be.visible')
      cy.contains('a', 'Communications').should('be.visible')
    })

    // confirm we cannot see the bills link
    cy.get('nav.x-govuk-sub-navigation').should('not.contain', 'Bills')
  })
})
