'use strict'

import scenarioData from '../../../support/scenarios/licence-with-agreement.js'

const scenario = scenarioData()

describe('Delete licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('deletes a licence agreement and check its flags the licence for supplementary billing', () => {
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

    // Charge information
    // back on the Charge Information tab select to delete the licence
    cy.get('#set-up').should('be.visible')
    cy.contains('Delete').click()

    // You're about to delete this agreement
    // confirm we are on the right page and it is showing the right agreement then delete it
    cy.get('.govuk-heading-l').contains("You're about to delete this agreement")

    cy.get('#main-content > table > tbody > tr').within(() => {
      // agreement
      cy.get('td:nth-child(1)').should('contain.text', 'Two-part tariff')
      // date signed
      cy.get('td:nth-child(2)').should('contain.text', ' ')
      // start date
      cy.get('td:nth-child(3)').should('contain.text', '1 January 2018')
      // end date
      cy.get('td:nth-child(4)').should('contain.text', ' ')
    })
    cy.contains('Delete agreement').click()

    // Charge information
    // confirm we are back on the Charge Information tab and our licence agreement is no longer present
    cy.get('#set-up').should('be.visible')
    cy.should('contain.text', 'No agreements for this licence.')

    // Check the new licence agreement has flagged the licence for supplementary billing
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill run for the old charge scheme.')
  })
})
