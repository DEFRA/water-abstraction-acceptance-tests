'use strict'

describe('Paper returns journey (internal)', () => {
  before(() => {
    cy.tearDown()
    cy.setUp('bulk-return')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('generates a paper form sent by Notify to the licensee', () => {
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

    // Navigate to the paper returns flow
    cy.get('#navbar-notifications').click()
    cy.get('a[href="/returns-notifications/forms"]').click()

    // Select a licence to generate paper returns for
    cy.get('#licenceNumbers').type('AT/CURR/MONTHLY/02')
    cy.get('button.govuk-button').click()

    // Select a return
    cy.get('a[href*="select-returns"]').click()
    cy.get('#returnIds').check()
    cy.get('button.govuk-button').click()

    // Send the paper form
    cy.get('button.govuk-button').contains('Send paper forms').click()

    // Paper return forms sent
    cy.get('.govuk-panel__title', { timeout: 10000 }).contains('Paper return forms sent')
  })
})
