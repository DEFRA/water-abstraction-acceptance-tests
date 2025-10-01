'use strict'

import scenarioData from '../../../support/scenarios/return-notices.js'

describe('Send returns reminder to customer (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.calculatedDates().then((body) => {
      cy.log(body)

      const scenario = scenarioData(body.firstReturnPeriod)

      cy.load(scenario)
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('reminds a customer to submit returns', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })

    // Navigate to the returns invitations flow.
    cy.visit('/system/manage')
    cy.get('a[href="/system/notices/setup/standard?noticeType=reminders"]').click()

    // Select the returns periods for the standard
    // Select the first radio button and continue
    cy.get('[type="radio"]').first().check()
    cy.get('form > .govuk-button').click()

    // Send returns reminders
    // spinner page appears here. Because this takes some time we need to amend the timeout in the next command
    cy.get('h1').contains('Check the recipients')
    cy.get('.govuk-button').contains('Send').click()

    // Return reminders sent
    cy.get('.govuk-panel__title').should('contain', 'Returns reminders sent')
    cy.get('p > a').contains('View notifications report').should('be.visible').click()

    // Returns: reminder
    // it can take some time to generate the report hence the extra timeout
    cy.get('h1').contains('Notification report')
  })
})
