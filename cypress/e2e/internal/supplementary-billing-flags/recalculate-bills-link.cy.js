'use strict'

import recalculateBillsLink from '../../../support/scenarios/recalculate-bills-link.js'

const recalculateBillsLinkScenario = recalculateBillsLink()

describe('Recalculate Bills Link (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(recalculateBillsLinkScenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('flags the licence for supplementary billing', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()
    cy.contains('Licence set up').click()

    // Click the recalculate bills link
    cy.get('#set-up > div > .govuk-button').click()
    cy.get('.govuk-caption-l').contains('AT/CURR/DAILY/01').click()
    cy.get('[data-test="sroc-years-2024"]').click()
    cy.get('[data-test="pre-sroc-years"]').click()
    cy.get('.govuk-button').click()

    // You've marked this licence for the next supplementary bill run
    // confirm we see the success panel and then click the link to return to the licence
    cy.get('.govuk-panel').should('contain.text', "You've marked this licence for the next supplementary bill run")
    cy.get(':nth-child(4) > .govuk-link').click()

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next two-part tariff supplementary bill run and the supplementary bill run for the old charge scheme.')
  })
})
