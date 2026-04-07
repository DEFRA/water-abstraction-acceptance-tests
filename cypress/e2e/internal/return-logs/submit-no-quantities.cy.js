'use strict'

import scenarioData from '../../../support/scenarios/licence-with-due-return-log.js'

describe('Submit a return with no quantities - validation errors (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.calculatedDates().then((body) => {
      const scenario = scenarioData(body.firstReturnPeriod)

      cy.load(scenario)

      cy.wrap(scenario.returnLogs[0].id).as('returnId')
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('attempt to submit a return without entering any quantities', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.get('@returnId').then((returnId) => {
      cy.visit(`/system/return-logs/${returnId}`)
    })

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
    // choose Abstraction volumes and continue
    cy.get('#abstractionVolumes').click()
    cy.get('.govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    cy.get('#cubicMetres').check()
    cy.get('.govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    cy.get('#no').click()
    cy.get('.govuk-button').click()

    // Is it a single volume?
    // choose No
    cy.get('#no').click()
    cy.get('.govuk-button').click()

    // Check details and enter new volumes or readings
    // attempt to confirm the return without entering any volumes
    cy.get('.govuk-button').first().click()

    // Validation error
    // it should not be possible to submit a return without entering at least one volume, even if it is a zero
    cy.get('.govuk-error-summary').contains('At least one return line must contain a value.')
  })
})
