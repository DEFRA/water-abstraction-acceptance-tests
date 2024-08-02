'use strict'

describe('Login and log out (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('can log in and out as an internal user', () => {
    cy.visit('/')

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in
    cy.contains('Enter a licence number, customer name')

    //  Click Sign out Button
    cy.get('#signout').click()

    //  Assert we are signed out
    cy.contains("You're signed out").should('be.visible')
  })
})
