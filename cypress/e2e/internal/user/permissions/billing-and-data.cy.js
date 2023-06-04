'use strict'

describe('Billing & Data permissions (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it("confirms the Billing & Data user can access bill runs and a licence's bills tab", () => {
    cy.visit('/')

    //  enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  assert the user signed in and we're on the search page
    cy.contains('Search')

    // assert they can see the Bill runs page
    cy.get('#nav > ul').children().should('contain', 'Bill runs')

    // search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // confirm we are on the licence page
    cy.contains('AT/CURR/DAILY/01')

    // confirm we can see the summary, contacts, returns, communications, bill runs and charge information tabs
    cy.get('#tab_summary').should('have.text', 'Summary')
    cy.get('#tab_returns').should('have.text', 'Returns')
    cy.get('#tab_communications').should('have.text', 'Communications')
    cy.get('#tab_bills').should('have.text', 'Bills')
    cy.get('#tab_charge').should('have.text', 'Charge information')
  })
})
