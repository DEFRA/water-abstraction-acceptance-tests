'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Submit a nil return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return and mark the licence for supplementary billing', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/return-logs/${scenario.returnLogs[0].id}`)

    // Abstraction return
    // submit return
    cy.get('.govuk-button').first().click()

    // When was the return received?
    // select yesterday
    cy.get('#yesterday').click()
    cy.get('.govuk-button').click()

    // What do you want to do with this return?
    // choose Enter a nil return and continue
    cy.get('#nilReturn').click()
    cy.get('.govuk-button').click()

    // Reporting details
    // Confirm the return is nil and continue
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('Yes')
    cy.get('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel and then click the Mark for supplementary bill run button
    cy.get('.govuk-panel').should('contain.text', 'Return 9999990 submitted')
    cy.get('.govuk-button').contains('Mark for supplementary bill run').click()

    // Navigate to the Licence summary page
    cy.contains('nav a', 'Licence summary').click()

    // Summary
    // confirm the licence has been flagged for the next supplementary bill run for the old charge scheme
    cy.get('.govuk-notification-banner__content').should(
      'contain.text',
      'This licence has been marked for the next supplementary bill run for the old charge scheme.'
    )
  })
})
