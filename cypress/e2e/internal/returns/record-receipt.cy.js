'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Record receipt for return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('record the receipt for an overdue return for a licence from its returns tab', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // confirm we are on the licence page and select returns tab
    cy.contains('AT/CURR/DAILY/01')
    cy.get('[data-test="#tab_returns"]').click()

    // confirm we are on the tab page
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    // Select the return log to record a receipt
    cy.get('[data-test="return-reference-0"] > .govuk-link').click()

    // Abstraction return
    // submit return
    cy.get('form > .govuk-button').first().click()

    // When was the return received?
    // select today
    cy.get('label.govuk-radios__label').contains('Today').click()
    cy.get('form > .govuk-button').click()

    // What do you want to do with this return?
    // select Record receipt
    cy.get('label.govuk-radios__label').contains('Record receipt').click()
    cy.get('form > .govuk-button').click()

    // Return received
    cy.get('.govuk-panel').contains('Return 9999990 received').should('be.visible')
    cy.get('.govuk-panel').contains('AT/CURR/DAILY/01').should('be.visible')
    cy.get('.govuk-panel').contains('Its all about the description').should('be.visible')
    cy.get('.govuk-panel').contains('Spray Irrigation - Storage').should('be.visible')

    // View returns for the licence (this is a different view)
    cy.get('div > a').contains('View returns for AT/CURR/DAILY/01').should('be.visible').click()

    // confirm we see the received return
    cy.get('[data-test="return-status-0"] > .govuk-tag').should('be.visible').and('contain.text', 'received')
  })
})
