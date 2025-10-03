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
    cy.visit('/')

    // search for the user by email
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('#query').type(userToBeUpdatedEmail)
    })
    cy.get('.search__button').click()

    // confirm we see the expected result then select it
    cy.get('.govuk-grid-column-full > .govuk-heading-m').should('have.text', 'Users')
    cy.get('@userToBeUpdatedEmail').then((userToBeUpdatedEmail) => {
      cy.get('.govuk-list > li').should('contain.text', userToBeUpdatedEmail)
    })
    cy.get('.govuk-list .govuk-link').click()

    // Set permissions
    // confirm we are on the permissions page then change the user's permissions from basic user to National
    // Permitting Service and submit
    cy.get('.govuk-heading-l').eq(1).should('have.text', 'Set permissions')
    cy.get('.govuk-radios > :nth-child(1) > #permission').should('be.checked')
    cy.get('#permission-4').check()
    cy.get('form > .govuk-button').click()

    // Account permissions are updated
    // confirm we see the confirmation page and what permissions have now been applied
    cy.get('.govuk-heading-l').should('contain.text', 'Account permissions are updated')
    cy.get('p.govuk-body').eq(1).should('contain', 'National Permitting Service permissions')
  })
})
