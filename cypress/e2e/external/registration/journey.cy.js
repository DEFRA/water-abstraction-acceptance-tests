'use strict'

describe('User registration (external)', () => {
  beforeEach(() => {
    cy.wrap(`external.${Date.now()}@example.com`).as('userEmail')
  })

  it('can register a new user', () => {
    cy.visit(Cypress.env('externalUrl'))

    // Tap the create account button on the welcome page
    cy.get('a[href*="/start"]').click()

    // Confirm we want to create an account
    cy.contains('Create an account to manage your water abstraction licence online').should('have.class', 'govuk-heading-l')
    cy.get('a[href*="/register"]').click()

    //  Enter the email address submit
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('button.govuk-button').click()

    // Should be on the confirm your email page
    cy.contains('Confirm your email address').should('have.class', 'govuk-heading-l')

    cy.get('@userEmail').then((email) => {
      cy.lastNotification(email).then((body) => {
        cy.extractNotificationLink(body, 'link', Cypress.env('externalUrl')).then((link) => {
          cy.visit(link)
        })

        cy.get('input#password').type(Cypress.env('defaultPassword'))
        cy.get('input#confirmPassword').type(Cypress.env('defaultPassword'))
        cy.get('form').submit()
      })
    })

    //  Assert the user signed in
    cy.url().should('include', '/add-licences')
    cy.contains('Add your licences to the service').should('have.class', 'govuk-heading-l')

    //  Click Sign out Button
    cy.get('#signout').click()

    //  Assert we are signed out
    cy.contains("You're signed out").should('be.visible')
  })
})
