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

    // Set permissions
    // confirm we are on the permissions page then change the user's permissions from basic user to National
    // Permitting Service and submit
    cy.get('.govuk-heading-l').eq(1).should('have.text', 'Set permissions')
    cy.get('.govuk-radios > :nth-child(1) > #permission').should('be.checked')
    cy.get('#permission-4').check()
    cy.get('form > .govuk-button').click()

    // Account permissions are updated
    // confirm we are back on the user details page with the updated permissions
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('.govuk-caption-l').should('have.text', userToBeUpdatedEmail)
    })
    cy.get('.govuk-heading-l').should('have.text', 'User details')
    cy.get('[data-test="meta-data-permissions"]').should('have.text', 'National Permitting Service')
    cy.get('[data-test="no-roles-msg"]').should('not.exist')
  })
})
