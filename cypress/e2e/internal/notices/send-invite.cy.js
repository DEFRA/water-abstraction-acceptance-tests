'use strict'

import scenarioData from '../../../support/scenarios/return-notices.js'

describe('Send returns invite to customer (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.calculatedDates().then((body) => {
      cy.log(body)

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

    // Navigate to the returns invitations flow.
    cy.visit('/system/notices/setup/standard?noticeType=invitations')

    // Select the returns periods for the standard
    // Select the first radio button and continue
    cy.get('[type="radio"]').first().check()
    cy.get('form > .govuk-button').click()

    // Check the recipients
    cy.get('h1').contains('Check the recipients')
    cy.get('.govuk-button').contains('Send').click()

    // Returns invitations sent
    cy.get('.govuk-panel__title').should('contain', 'Returns invitations sent')
    cy.get('p > a').contains('View notifications report').should('be.visible').click()

    // Returns: invitation
    cy.get('h1').contains('Notification report')
  })
})
