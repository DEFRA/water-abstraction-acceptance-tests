'use strict'

describe('Change user email address (external)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('change-email-user.json').then((fixture) => {
      cy.load(fixture)

      cy.wrap(fixture.users[0].username).as('userEmail')
    })
  })

  it('can allow authenticated users to change their email address including verification by them with a code', () => {
    // Navigate to the signin page
    cy.visit(Cypress.env('externalUrl'))
    cy.get('a[href*="/signin"]').click()

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Click Account settings link
    cy.get('#account-settings').click()

    // Account settings
    // Check we see current email address then click Change your email address link
    cy.get('@userEmail').then((userEmail) => {
      cy.get('#main-content > div > div > div > p').should('contain.text', userEmail)
    })
    cy.get('a').contains('Change your email address').click()

    // For security, confirm your password first
    // Enter password and continue
    cy.get('input#password').type(Cypress.env('defaultPassword'))
    cy.get('button.govuk-button').contains('Continue').click()

    // Change your email address
    cy.get('#email').type('new.me@example.com')
    cy.get('#confirm-email').type('new.me@example.com')
    cy.get('button.govuk-button').contains('Continue').click()

    // Verify your email address
    cy.get('#main-content > div:nth-child(2) > div:nth-child(2) > p > span').should('contain.text', 'new.me@example.com')
    cy.get('[data-test="security-code"]').invoke('text').then((code) => {
      cy.get('#verificationCode').type(code)
      cy.get('button.govuk-button').contains('Continue').click()
    })

    // Your email address is changed
    cy.get('h1.govuk-heading-l').should('contain.text', 'Your email address is changed')

    // Click Account settings link
    cy.get('#account-settings').click()

    // Account settings
    // Confirm we see the new email address applied
    cy.get('#main-content > div > div > div > p').should('contain.text', 'new.me@example.com')
  })
})
