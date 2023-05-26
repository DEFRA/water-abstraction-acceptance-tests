'use strict'

describe('View returns (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('barebones')
    cy.fixture('users.json').its('external').as('userEmail')
  })

  it('login as an existing user and view returns', () => {
    cy.visit(Cypress.env('externalUrl'))

    // tap the sign in button on the welcome page
    cy.get('a[href*="/signin"]').click()

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Confirm the licences are listed
    cy.contains('AT/CURR/DAILY/01').should('be.visible')
    cy.contains('AT/CURR/WEEKLY/01').should('be.visible')
    cy.contains('AT/CURR/MONTHLY/01').should('be.visible')
    cy.contains('AT/CURR/MONTHLY/02').should('be.visible')
  })
})
