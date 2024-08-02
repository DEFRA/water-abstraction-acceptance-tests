'use strict'

describe('Login and log out (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('external').as('userEmail')
  })

  it('can log in and out as an external user', () => {
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

    //  Assert the user signed in
    cy.contains('Add licences or give access')

    //  Click Sign out Button
    cy.get('#signout').click()

    //  Assert we are signed out
    cy.contains("You're signed out").should('be.visible')
  })
})
