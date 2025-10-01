'use strict'

import scenarioData from '../../../support/scenarios/return-statuses.js'

const scenario = scenarioData()

describe('View returns and their status (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('lists the returns for a licence and their status', () => {
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

    // confirm we see the expected returns and their statuses
    cy.get('[data-test="return-reference-0"]').should('be.visible').and('contain.text', '9999990')
    cy.get('[data-test="return-status-0"] > .govuk-tag').should('be.visible').and('contain.text', 'not due yet')

    cy.get('[data-test="return-reference-1"]').should('be.visible').and('contain.text', '9999995')
    cy.get('[data-test="return-status-1"] > .govuk-tag').should('be.visible').and('contain.text', 'overdue')

    cy.get('[data-test="return-reference-2"]').should('be.visible').and('contain.text', '9999994')
    cy.get('[data-test="return-status-2"] > .govuk-tag').should('be.visible').and('contain.text', 'due')

    cy.get('[data-test="return-reference-3"]').should('be.visible').and('contain.text', '9999993')
    cy.get('[data-test="return-status-3"] > .govuk-tag').should('be.visible').and('contain.text', 'open')

    cy.get('[data-test="return-reference-4"]').should('be.visible').and('contain.text', '9999992')
    cy.get('[data-test="return-status-4"] > .govuk-tag').should('be.visible').and('contain.text', 'void')

    cy.get('[data-test="return-reference-5"]').should('be.visible').and('contain.text', '9999991')
    cy.get('[data-test="return-status-5"] > .govuk-tag').should('be.visible').and('contain.text', 'complete')
  })
})
