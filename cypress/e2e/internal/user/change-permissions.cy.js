'use strict'

import scenarioData from '../../../support/scenarios/internal-user-only.js'

const scenario = scenarioData()

describe('Change user permissions (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.wrap(scenario.users[0].username).as('userToBeUpdatedEmail')

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('allows a billing & data user to change the permissions of another user', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/system/users')

    // search for the user by email
    cy.get('.govuk-details__summary').click()
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('#email').type(userToBeUpdatedEmail)
    })
    cy.get('.govuk-button-group > :nth-child(1)').click()

    // confirm we see the expected result then select it
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('[data-test="user-email-0"]').contains(userToBeUpdatedEmail).click()
    })

    // confirm we see the expected result then select edit
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('.govuk-caption-l').should('have.text', userToBeUpdatedEmail)
    })
    cy.get('.govuk-heading-l').should('have.text', 'User details')
    cy.get('[data-test="no-roles-msg"]').should('have.text', 'Basic access grants no additional roles.')
    cy.get('.govuk-button').click()

    // Check page
    // Click the permissions change link
    cy.get(':nth-child(2) > .govuk-summary-list__actions > .govuk-link').click()

    // Select permissions for the user
    // Change from Basic to Environment officer
    cy.get(':nth-child(3) > [name="permission"]').click()
    cy.get('.govuk-button').contains('Continue').click()

    // Check page
    // Confirm notification shown and new permission shown, then submit
    cy.get('.govuk-notification-banner__heading').contains('Permissions updated')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('Environment Officer')
    cy.get('.govuk-button').contains('Confirm').click()

    // Users page
    // Confirm notification shown and permissions updated
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('.govuk-notification-banner__heading').contains(`${userToBeUpdatedEmail} has been updated.`)
    })
    cy.get('.govuk-button-group > :nth-child(1)').click()
    cy.get('[data-test="user-permissions-0"]').contains('Environment Officer')
  })
})
