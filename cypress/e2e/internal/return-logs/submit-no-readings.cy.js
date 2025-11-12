'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Submit a return with no meter readings - validation errors (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('attempt to submit a return without entering any readings', () => {
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
    // enter a start meter reading of zero and continue
    cy.get('#startReading').type('0')
    cy.get('.govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    cy.get('#cubicMetres').click()
    cy.get('.govuk-button').click()

    // Have meter details been provided?
    // choose Yes and continue
    cy.get('#yes').click()
    cy.get('.govuk-button').click()

    // Meter details
    // enter the meter details and continue
    cy.get('#meterMake').type('test make')
    cy.get('#meterSerialNumber').type('12345')
    cy.get('#no').click()
    cy.get('.govuk-button').click()

    // Check details and enter new volumes or readings
    // attempt to confirm the return without entering any readings
    cy.get('.govuk-button').first().click()

    // Validation error
    // it should not be possible to submit a return without entering at least one quantity, even if it is a zero
    cy.get('.govuk-error-summary').contains('At least one return line must contain a value.')
  })
})
