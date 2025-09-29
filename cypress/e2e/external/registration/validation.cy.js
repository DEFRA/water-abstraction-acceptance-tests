'use strict'

import usersData from '../../../support/fixture-builder/users.js'

describe('User registration validation (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.wrap(usersData().external.username).as('userEmail')
  })

  it('validates the password in the create account page', () => {
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

        // Test submitting no passwords
        cy.get('form').submit()
        cy.contains('There is a problem').should('have.class', 'govuk-error-summary__title')

        // Test submitting passwords that are too short
        cy.get('input#password').type('short')
        cy.get('input#confirmPassword').type('short')
        cy.get('form').submit()
        cy.contains('There is a problem').should('have.class', 'govuk-error-summary__title')
        cy.get('input#password').clear()
        cy.get('input#confirmPassword').clear()

        // Test submitting passwords that are numbers only
        cy.get('input#password').type('12345678')
        cy.get('input#confirmPassword').type('12345678')
        cy.get('form').submit()
        cy.contains('There is a problem').should('have.class', 'govuk-error-summary__title')
        cy.get('input#password').clear()
        cy.get('input#confirmPassword').clear()

        // Test submitting passwords that are symbols only
        cy.get('input#password').type('$$$$$$$$')
        cy.get('input#confirmPassword').type('$$$$$$$$')
        cy.get('form').submit()
        cy.contains('There is a problem').should('have.class', 'govuk-error-summary__title')
        cy.get('input#password').clear()
        cy.get('input#confirmPassword').clear()

        // Test submitting passwords that are capitals only
        cy.get('input#password').type('ABCDEFGH')
        cy.get('input#confirmPassword').type('ABCDEFGH')
        cy.get('form').submit()
        cy.contains('There is a problem').should('have.class', 'govuk-error-summary__title')
        cy.get('input#password').clear()
        cy.get('input#confirmPassword').clear()

        // Test submitting passwords that do not match
        cy.get('input#password').type('A12345678$')
        cy.get('input#confirmPassword').type('A123456789$')
        cy.get('form').submit()
        cy.contains('There is a problem').should('have.class', 'govuk-error-summary__title')
        cy.get('input#password').clear()
        cy.get('input#confirmPassword').clear()
      })
    })
  })
})
