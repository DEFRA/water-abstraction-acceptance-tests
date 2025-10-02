'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Record receipt for return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('record the receipt for an overdue return for a licence from its returns tab', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/return-logs?id=${scenario.returnLogs[0].id}`)

    // Abstraction return
    // submit return
    cy.get('form > .govuk-button').first().click()

    // When was the return received?
    // select today
    cy.get('label.govuk-radios__label').contains('Today').click()
    cy.get('form > .govuk-button').click()

    // What do you want to do with this return?
    // select Record receipt
    cy.get('label.govuk-radios__label').contains('Record receipt').click()
    cy.get('form > .govuk-button').click()

    // Return received
    cy.get('.govuk-panel').contains('Return 9999990 received').should('be.visible')
    cy.get('.govuk-panel').contains('AT/TEST/01').should('be.visible')
    cy.get('.govuk-panel').contains('Its all about the description').should('be.visible')
    cy.get('.govuk-panel').contains('Spray Irrigation - Storage').should('be.visible')

    // View returns for the licence (this is a different view)
    cy.get('div > a').contains('View returns for AT/TEST/01').should('be.visible').click()

    // confirm we see the received return
    cy.get('[data-test="return-status-0"] > .govuk-tag').should('be.visible').and('contain.text', 'received')
  })
})
