'use strict'

describe('Reset password journey (internal)', () => {
  beforeEach(() => {
    cy.fixture('users.json').its('basic').as('userEmail')
  })

  it('displays the change password page when the link in the email is clicked and automatically logs in when the password is changed', () => {
    // Navigate to the reset your password page
    cy.visit('/')
    cy.get('a[href*="/reset_password').click()

    // Enter a valid email address and submit
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Check your email').should('have.class', 'govuk-heading-l')

    cy.get('@userEmail').then((userEmail) => {
      // Get last email, extract link and follow it
      cy.lastNotification(userEmail).then((body) => {
        cy.extractNotificationLink(body, 'reset_url', Cypress.config('baseUrl')).then((link) => {
          cy.visit(link)
        })

        // Check we are on the right page
        cy.contains('Change your password').should('be.visible')
        cy.contains('Enter a new password').should('be.visible')
        cy.contains('Confirm your password').should('be.visible')

        // Enter a password and confirm
        cy.get('[id=password]').type(Cypress.env('defaultPassword'))
        cy.get('[id=confirmPassword]').type(Cypress.env('defaultPassword'))
        cy.get('button.govuk-button').click()

        // Check we are signed in by confirming we are on the search page
        cy.contains('Search').should('be.visible')
      })
    })
  })
})
