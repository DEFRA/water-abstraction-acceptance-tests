'use strict'

describe('View returns and their status (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('barebones')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('lists the returns for a licence and their status', () => {
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
    cy.get('#tab_returns').click()

    // confirm we are on the tab page
    cy.get('#returns > .govuk-heading-l').contains('Returns')

    // confirm we see the expected returns and their statuses
    cy.get('section#returns > .govuk-table > .govuk-table__body').within(() => {
      cy.get('.govuk-table__row:nth-child(1)').should('be.visible').and('contain.text', '9999992')
      cy.get('.govuk-table__row:nth-child(1)').should('be.visible').and('contain.text', 'Due')

      cy.get('.govuk-table__row:nth-child(2)').should('be.visible').and('contain.text', '9999993')
      cy.get('.govuk-table__row:nth-child(2)').should('be.visible').and('contain.text', 'Void')

      cy.get('.govuk-table__row:nth-child(3)').should('be.visible').and('contain.text', '9999991')
      cy.get('.govuk-table__row:nth-child(3)').should('be.visible').and('contain.text', 'Overdue')

      cy.get('.govuk-table__row:nth-child(4)').should('be.visible').and('contain.text', '9999992')
      cy.get('.govuk-table__row:nth-child(4)').should('be.visible').and('contain.text', 'Complete')

      cy.get('.govuk-table__row:nth-child(5)').should('be.visible').and('contain.text', '9999990')
      cy.get('.govuk-table__row:nth-child(5)').should('be.visible').and('contain.text', 'Overdue')
    })
  })
})
