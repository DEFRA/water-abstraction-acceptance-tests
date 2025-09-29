'use strict'

import externalUserOnly from '../../../support/scenarios/external-user-only.js'

const externalUserOnlyScenario = externalUserOnly()

describe('Reset password journey (external)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.load(externalUserOnlyScenario)
    cy.wrap(externalUserOnlyScenario.users[0].username).as('userEmail')
  })

  it('displays the change password page when the link in the email is clicked and automatically logs in when the password is changed', () => {
    // Navigate to the reset your password page
    cy.visit(`${Cypress.env('externalUrl')}/reset_password`)

    // Test setting a valid email address
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Check your email').should('have.class', 'govuk-heading-l')

    cy.get('@userEmail').then((userEmail) => {
      cy.lastNotification(userEmail).then((body) => {
        cy.extractNotificationLink(body, 'reset_url', Cypress.env('externalUrl')).then((link) => {
          cy.visit(link)
        })

        cy.contains('Change your password').should('be.visible')
        cy.contains('Enter a new password').should('be.visible')
        cy.contains('Confirm your password').should('be.visible')

        const newPassword = `${Cypress.env('defaultPassword')}1234`
        cy.get('[id=password]').type(newPassword)
        cy.get('[id=confirmPassword]').type(newPassword)
        cy.get('button.govuk-button').click()

        cy.contains('View licences').should('have.attr', 'href', '/licences')
        cy.contains('Add your licences to the service').should('have.class', 'govuk-heading-l')
      })
    })
  })
})
