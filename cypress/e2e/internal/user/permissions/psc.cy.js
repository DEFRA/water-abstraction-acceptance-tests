'use strict'

import oneLicenceOnly from '../../../../support/scenarios/one-licence-only.js'

const oneLicenceOnlyScenario = oneLicenceOnly()

describe('PSC permissions (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.load(oneLicenceOnlyScenario)
    cy.fixture('users.json').its('psc').as('userEmail')
  })

  it("confirms the PSC user cannot access bill runs and a licence's bills tab", () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    // assert they cannot see the Bill runs page
    cy.get('#nav > ul').children().should('not.contain', 'Bill runs')

    // search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // confirm we are on the licence page
    cy.contains('AT/CURR/DAILY/01')

    // confirm we can see the summary, contact details, returns, communications and licence set up tabs
    cy.get('.govuk-tabs__list-item--selected > .govuk-tabs__tab').should('contain.text', 'Summary')
    cy.get(':nth-child(2) > .govuk-tabs__tab').should('contain.text', 'Contact details')
    cy.get(':nth-child(3) > .govuk-tabs__tab').should('contain.text', 'Returns')
    cy.get(':nth-child(4) > .govuk-tabs__tab').should('contain.text', 'Communications')
    cy.get(':nth-child(5) > .govuk-tabs__tab').should('contain.text', 'Licence set up')

    // confirm we cannot see the bills tab
    cy.get('.govuk-tabs__list').should('not.contain', 'Bills')
  })
})
