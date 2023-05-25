'use strict'

describe("View a licence's contacts (internal)", () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('billing-data')
    cy.fixture('users.json').its('super').as('userEmail')
  })

  it('search for a licence, select it and then view its contacts', () => {
    cy.visit('/')

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in and we're on the search page
    cy.contains('Search')

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // Confirm we are on the licence page and select contact details tab
    cy.contains('AT/CURR/DAILY/01')
    cy.get('#tab_contacts').click()

    // Confirm we are on the tab page and expected controls are present
    cy.get('#contacts > .govuk-heading-l').contains('Contact detail')
    cy.get('#contacts').contains('Go to customer contacts')

    // Confirm we can see expected licence holder contact details
    cy.get('.govuk-table__row').contains('John Testerson')

    // Click the 'Go to customer contacts' link
    cy.get('#contacts > :nth-child(2) > a').click()

    // Confirm expected tabs are present
    cy.get('#main-content').contains('Licences')
    cy.get('#main-content').contains('Billing accounts')
    cy.get('#main-content').contains('Contacts')

    // Confirm contacts tab is selected
    cy.get('#tab_contacts').invoke('attr', 'aria-selected').should('eq', 'true')

    // Confirm contacts contains expected record
    cy.get('.govuk-table__cell').contains('Mr John Testerson')
  })
})
