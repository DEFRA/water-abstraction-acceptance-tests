'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Submit a return with no quantities - validation errors (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('attempt to submit a return for a licence from its returns tab without entering any quantities', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/return-logs/${scenario.returnLogs[0].returnId}`)

    // Abstraction return
    // submit return
    cy.get('form > .govuk-button').first().click()

    // When was the return received?
    // select today
    cy.get('#today').click()
    cy.get('form > .govuk-button').click()

    // What do you want to do with this return?
    // choose Enter and submit and continue
    cy.get('#enterReturn').click()
    cy.get('form > .govuk-button').click()

    // How was this return reported?
    // choose Abstraction volumes and continue
    cy.get('#abstractionVolumes').click()
    cy.get('form > .govuk-button').click()

    // Which units were used?
    // choose Cubic metres and continue
    cy.get('#cubicMetres').check()
    cy.get('form > .govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    cy.get('#no').click()
    cy.get('form > .govuk-button').click()

    // Is it a single volume?
    // choose No
    cy.get('#no').click()
    cy.get('form > .govuk-button').click()

    // Check details and enter new volumes or readings
    // attempt to confirm the return without entering any quantities
    cy.get('button.govuk-button').click()

    // Validation error
    // it should not be possible to submit a return without entering at least one quantity, even if it is a zero
    cy.get('.govuk-error-summary').contains('At least one return line must contain a value.')
  })
})
