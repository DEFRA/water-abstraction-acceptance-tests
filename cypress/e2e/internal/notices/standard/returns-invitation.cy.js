'use strict'

import scenarioData from '../../../../support/scenarios/return-notices.js'

describe('Standard returns invitation journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body.firstReturnPeriod)

      cy.load(scenario)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('invites a customer to submit returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the Notices page
    cy.visit('/system/notices')

    // Start the standard notice journey
    cy.get('.govuk-button').contains('Create a standard notice').click()

    // Select the notice type
    cy.get('#noticeType').check()
    cy.contains('Continue').click()

    // Select the returns periods for the invitations
    cy.get('#returnsPeriod').check()
    cy.contains('Continue').click()

    // Check the notice type
    cy.get('[data-test="returns-notice-type"]').should('contain.text', 'Returns invitation')
    cy.contains('Confirm').click()

    // Check the recipients
    cy.contains('Send').click()

    // Notice confirmation
    cy.get('.govuk-panel__title', { timeout: 15000 }).contains('Returns invitations sent')
  })
})
