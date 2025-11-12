'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Submit a meter readings return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return and check the values', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/return-logs/${scenario.returnLogs[0].returnId}`)

    // Abstraction return
    // submit return
    cy.get('.govuk-button').first().click()

    // When was the return received?
    // select today
    cy.get('#today').click()
    cy.get('.govuk-button').click()

    // What do you want to do with this return?
    // choose Enter and submit and continue
    cy.get('#enterReturn').click()
    cy.get('.govuk-button').click()

    // How was this return reported?
    // choose Meter Readings and continue
    cy.get('#meterReadings').click()
    cy.get('.govuk-button').click()

    // Enter the start meter reading
    // choose Meter Readings and continue
    cy.get('#startReading').type('100')
    cy.get('.govuk-button').click()

    // Which units were used?
    // choose Megalitres and continue
    cy.get('#megalitres').check()
    cy.get('.govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    cy.get('#no').click()
    cy.get('.govuk-button').click()

    // Check details and enter new volumes or readings
    // choose enter monthly readings
    cy.get('[data-test="action-0"]').click()

    // Water abstracted April 2020
    // enter meter reading of 120 and continue
    cy.get('.govuk-heading-l').contains('Water abstracted April 2020')
    cy.get('.govuk-label').contains('April 2020')
    cy.get('#April2020').type('120')
    cy.get('.govuk-button').click()

    // Check details and enter new volumes or readings
    // confirm the readings have been updated as expected and continue
    cy.get('.govuk-notification-banner__heading').contains('Readings have been updated')
    cy.get('[data-test="reading-0"]').contains('120')
    cy.get('[data-test="unit-total-0"]').contains('20')
    cy.get('[data-test="monthly-total-0"]').contains('20,000')
    cy.get('[data-test="total-quantity"]').contains('20')
    cy.get('[data-test="total-cubic-metres"]').contains('20,000')
    cy.get('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel and then click the Mark for supplementary bill run button
    cy.get('.govuk-panel').should('contain.text', 'Return 9999990 submitted')
    cy.get('#viewThisReturn').click()

    // Abstraction return
    // confirm the return is complete and the total is as expected
    cy.get('.govuk-tag').contains('complete')
    cy.get('[data-test="total"]').contains('20,000')
  })
})
