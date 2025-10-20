'use strict'

import scenarioData from '../../../../support/scenarios/return-notices.js'

describe('Ad-hoc Paper returns journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body.firstReturnPeriod)

      cy.load(scenario)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('generates a paper return sent by Notify to the licensee', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the Notices page
    cy.visit('/system/notices')

    // Start the ad-hoc notice journey
    cy.get('.govuk-button').contains('Create an ad-hoc notice').click()

    // Enter a licence number
    cy.get('#licenceRef').type('AT/TEST/01')
    cy.get('button.govuk-button').click()

    // Select the notice type
    cy.get('#noticeType-3').check()
    cy.contains('Continue').click()

    // Select the returns for the paper return
    cy.get('#returns').check()
    cy.contains('Continue').click()

    // Check the notice type
    cy.get('[data-test="licence-number"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="returns-notice-type"]').should('contain.text', 'Paper return')
    cy.contains('Confirm').click()

    // Check the recipients
    cy.contains('Send').click()

    // Notice confirmation
    cy.get('.govuk-panel__title', { timeout: 15000 }).contains('Paper returns sent')
  })
})
