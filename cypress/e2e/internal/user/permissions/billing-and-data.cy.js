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

    // confirm we can see the summary, contact details, returns, communications, bill runs and licence set up tabs
    cy.get('.govuk-tabs__list-item--selected > .govuk-tabs__tab').should('contain.text', 'Summary')
    cy.get(':nth-child(2) > .govuk-tabs__tab').should('contain.text', 'Contact details')
    cy.get(':nth-child(3) > .govuk-tabs__tab').should('contain.text', 'Returns')
    cy.get(':nth-child(4) > .govuk-tabs__tab').should('contain.text', 'Communications')
    cy.get(':nth-child(5) > .govuk-tabs__tab').should('contain.text', 'Bills')
    cy.get(':nth-child(6) > .govuk-tabs__tab').should('contain.text', 'Licence set up')

    // assert they can see the Bill runs page
    cy.get('#nav > ul').children().should('contain', 'Bill runs')
  })
})
