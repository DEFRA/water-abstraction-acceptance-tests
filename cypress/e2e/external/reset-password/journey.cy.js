'use strict'

describe('Reset password journey (external)', () => {
  before(() => {
    cy.tearDown()
    cy.setUp('barebones')
  })

  beforeEach(() => {
    cy.fixture('users.json').its('external').as('userEmail')
  })

  it('displays the change password page when the link in the email is clicked and automatically logs in when the password is changed', () => {
    // Navigate to the signin page
    cy.visit(Cypress.env('externalUrl'))
    cy.get('a[href*="/signin"]').click()

    // Navigate to the reset your password page
    cy.get('a[href*="/reset_password').click()

    // Test setting a valid email address
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Check your email').should('have.class', 'govuk-heading-l')

    cy.get('@userEmail').then((userEmail) => {
      cy.lastNotification(userEmail).then((body) => {
        let resetUrl = body.data[0].personalisation.reset_url
        resetUrl = resetUrl.replace((/^https?:\/\/[^/]+\//g).exec(resetUrl), Cypress.env('externalUrl') + '/')
        cy.log(resetUrl)
        cy.visit(resetUrl)

        cy.contains('Change your password').should('be.visible')
        cy.contains('Enter a new password').should('be.visible')
        cy.contains('Confirm your password').should('be.visible')

        const newPassword = `${Cypress.env('defaultPassword')}1234`
        cy.get('[id=password]').type(newPassword)
        cy.get('[id=confirmPassword]').type(newPassword)
        cy.get('button.govuk-button').click()

        cy.contains('View licences').should('have.attr', 'href', '/licences')
        cy.contains('Manage returns').should('have.attr', 'href', '/returns')
        cy.contains('Add licences or give access').should('have.attr', 'href', '/manage_licences')
        cy.contains('Your licences').should('have.class', 'govuk-heading-l')
      })
    })
  })
})
