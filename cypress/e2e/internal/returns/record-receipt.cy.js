'use strict'

describe('Record receipt for return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('record the receipt for an overdue return for a licence from its returns tab', () => {
    cy.visit('/')

    // enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // assert the user signed in and we're on the search page
    cy.contains('Search')

    // search for a licence
    cy.get('#query').type('AT/CURR/MONTHLY/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/CURR/MONTHLY/02').click()

    // confirm we are on the licence page and select returns tab
    cy.contains('AT/CURR/MONTHLY/02')
    cy.get('[data-test="#tab_returns"]').click()

    // confirm we are on the tab page
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    // confirm we see the overdue return
    cy.get('#returns').within(() => {
      cy.get('.govuk-table__row:nth-child(5)').should('be.visible').and('contain.text', '9999990')
      cy.get('.govuk-table__row:nth-child(5)').should('be.visible').and('contain.text', 'overdue')

      cy.get('.govuk-table__row:nth-child(5) a').contains('9999990').click()
    })

    // What do you want to do with this return?
    // select record receipt
    cy.get('#action-2').check()
    cy.get('form > .govuk-button').click()

    // When was the return received?
    // leave defaulted current date
    cy.get('form > .govuk-button').click()

    // Return received
    cy.get('.panel').contains('Return received Licence number AT/CURR/MONTHLY/02').should('be.visible')

    // View returns for the licence (this is a different view)
    cy.get('p > a').contains('View returns for AT/CURR/MONTHLY/02').should('be.visible').click()

    // confirm we see the received return
    cy.get('.govuk-table > .govuk-table__body').within(() => {
      cy.get('.govuk-table__row:nth-child(5)').should('be.visible').and('contain.text', 'January 2019 to December 2019')
      cy.get('.govuk-table__row:nth-child(5)').should('be.visible').and('contain.text', 'received')
    })
  })
})
