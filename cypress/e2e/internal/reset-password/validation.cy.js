'use strict'

describe('Reset password validation (internal)', () => {
  beforeEach(() => {
    cy.fixture('users.json').its('psc').as('userEmail')
  })

  it('validates the input in the reset password email screen before redirecting to the success page if valid', () => {
    // Navigate to the reset your password page
    cy.visit('/')
    cy.get('a[href*="/reset_password').click()

    // Confirm we are on the right page
    cy.contains('Reset your password').should('have.class', 'govuk-heading-l')
    cy.contains('Email address').should('have.class', 'govuk-label')

    // Test submitting nothing
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Enter an email address').should('have.attr', 'href', '#email')

    // Test submitting an invalid email address
    cy.get('input#email').type('invalid....email')
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Enter an email address in the correct format').should('have.attr', 'href', '#email')
    cy.get('input#email').clear()

    // Test setting a valid email address
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Check your email').should('have.class', 'govuk-heading-l')
    cy.contains('Has the email not arrived?').should('have.attr', 'href', '/reset_password_resend_email')
  })
})
