'use strict'

import scenarioData from '../../../support/scenarios/internal-return-submission.js'

const scenario = scenarioData()

describe('Submit then edit an abstraction volumes return with zero quantities (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('submit a return and check that the zero values recorded are correctly carried over when editing', () => {
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
    // choose Abstraction Volumes and continue
    cy.get('#abstractionVolumes').click()
    cy.get('.govuk-button').click()

    // Which units were used?
    // choose Cubic Metres and continue
    cy.get('#cubicMetres').check()
    cy.get('.govuk-button').click()

    // Have meter details been provided?
    // choose No and continue
    cy.get('#no').click()
    cy.get('.govuk-button').click()

    // Is it a single volume?
    // choose No and continue
    cy.get('#no').click()
    cy.get('.govuk-button').click()

    // Summary of monthly volumes
    // choose enter monthly volumes for May 2020
    cy.get('[data-test="action-1"]').click()

    // Water abstracted May 2020
    // enter meter reading of 0 and continue
    cy.get('.govuk-heading-l').contains('Water abstracted May 2020')
    cy.get('.govuk-label').contains('May 2020')
    cy.get('#May2020').type('0')
    cy.get('.govuk-button').click()

    // Summary of monthly volumes
    // confirm the volumes have been updated as expected and continue
    cy.get('.govuk-notification-banner__heading').contains('Volumes have been updated')
    cy.get('[data-test="monthly-total-1"]').contains('0')
    cy.get('[data-test="total-cubic-metres"]').contains('0')
    cy.get('.govuk-button').first().click()

    // Return submitted
    // confirm we see the success panel and then click View this return
    cy.get('.govuk-panel').should('contain.text', 'Return 9999990 submitted')
    cy.get('#viewThisReturn').click()

    // Abstraction return
    // confirm the return is complete and as expected, then edit the return again to confirm zero values are retained
    cy.get('.govuk-tag').contains('complete')
    cy.get('[data-test="total"]').contains('0')
    cy.get('[data-test="monthly-total-1"]').contains('0')
    cy.get('.govuk-button').first().click()

    // Summary of monthly volumes
    // confirm the zero volume is still present then proceed to the edit page
    cy.get('[data-test="monthly-total-1"]').contains('0')
    cy.get('[data-test="total-cubic-metres"]').contains('0')
    cy.get('[data-test="action-1"]').click()

    // Water abstracted May 2020
    // confirm the zero volume is still present
    cy.get('.govuk-heading-l').contains('Water abstracted May 2020')
    cy.get('.govuk-label').contains('May 2020')
    cy.get('#May2020').should('have.value', '0')
  })
})
