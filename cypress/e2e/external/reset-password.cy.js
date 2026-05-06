'use strict'

import scenarioData from '../../support/scenarios/external-user-only.js'

const scenario = scenarioData()

describe('Reset password journey (external)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.wrap(scenario.users[0].username).as('userEmail')
  })

  it('displays the change password page when the link in the email is clicked and automatically logs in when the password is changed', () => {
    // Navigate to the reset your password page
    cy.env(['externalUrl']).then(({ externalUrl }) => {
      cy.visit(`${externalUrl}/reset_password`)
    })

    // Test setting a valid email address
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('button.govuk-button.govuk-button--start').click()
    cy.contains('Check your email').should('have.class', 'govuk-heading-l')

    cy.get('@userEmail').then((userEmail) => {
      cy.lastNotification(userEmail).then((body) => {
        cy.env(['externalUrl']).then(({ externalUrl }) => {
          cy.extractNotificationLink(body, 'reset_url', externalUrl).then((link) => {
            cy.visit(link)
          })
        })

        cy.contains('Change your password').should('be.visible')
        cy.contains('Enter a new password').should('be.visible')
        cy.contains('Confirm your password').should('be.visible')

        cy.env(['defaultPassword']).then(({ defaultPassword }) => {
          const newPassword = `${defaultPassword}1234`
          cy.get('[id=password]').type(newPassword)
          cy.get('[id=confirmPassword]').type(newPassword)
          cy.get('button.govuk-button').click()

          // Log in using the updated credentials to confirm the password has been updated
          cy.get('#email').type(userEmail)
          cy.get('#password').type(newPassword)
          cy.get('button.govuk-button').click()
        })

        // Assert that the user is logged in and on the dashboard page
        cy.contains('View licences').should('have.attr', 'href', '/licences')
        cy.contains('Add your licences to the service').should('have.class', 'govuk-heading-l')
      })
    })
  })
})
