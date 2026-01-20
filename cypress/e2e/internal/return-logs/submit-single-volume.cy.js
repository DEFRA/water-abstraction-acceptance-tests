'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Submit a single volume return (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return by entering a single abstraction volume and mark the licence for supplementary billing', () => {
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
    // choose Yes, enter 100 cubic metres and continue
    cy.get('#yes').click()
    cy.get('#singleVolumeQuantity').type('100')
    cy.get('.govuk-button').click()

    // What period was used for this volume?
    // choose Default abstraction period and continue
    cy.get('#default').click()
    cy.get('.govuk-button').click()

    // Volumes
    // we leave the defaulted values of 50CM, which are 100CM split by the number of months in the abstraction
    // period (2) and continue
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
