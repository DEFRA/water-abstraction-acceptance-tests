'use strict'

describe('Login validation (external)', () => {
  before(() => {
    cy.fixture('users.json').its('external').as('userEmail')
  })

  it('validates the input in the email and password fields on the login screen are valid', () => {
    // Navigate to the signin page
    cy.visit(Cypress.env('externalUrl'))
    cy.get('a[href*="/signin"]').click()

    // Test submitting nothing
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Enter an email address').should('have.attr', 'href', '#email')

    // Test submitting an invalid email address
    cy.get('input#email').type('invalid....email')
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Enter an email address in the correct format').should('have.attr', 'href', '#email')
    cy.get('input#email').clear()

    // Test submitting a blank password
    cy.get('input#email').type('name@example.com')
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Enter your password').should('have.attr', 'href', '#password')

    // Test submitting an unknown email and password
    cy.get('input#password').type('letmeinnow123')
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Check your email address').should('have.attr', 'href', '#email')
    cy.contains('Check your password').should('have.attr', 'href', '#password')
  })
})
