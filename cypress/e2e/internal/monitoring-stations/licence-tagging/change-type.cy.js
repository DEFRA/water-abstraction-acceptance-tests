'use strict'

import scenarioData from '../../../../support/scenarios/monitoring-station-untagged.js'

const scenario = scenarioData()

describe('Tag a licence but attempt to change the tag type during the journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('tags a licence then changes the type from "Stop" to "Reduce"', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit(`/system/monitoring-stations/${scenario.monitoringStations[0].id}`)

    // Confirm we are on the monitoring station page
    cy.get('.govuk-caption-l').should('have.text', 'Test Catchment')
    cy.get('.govuk-heading-l').should('have.text', 'Test Station')
    cy.get('[data-test="meta-data-grid-reference"]').should('have.text', 'ST1234567890')
    cy.get('[data-test="meta-data-wiski-id"]').should('be.empty')
    cy.get('[data-test="meta-data-station-reference"]').should('be.empty')

    // Tag a licence to the monitoring station
    cy.get('.govuk-button').contains('Tag a licence').click()

    // Select meters below ordnance datum (mBOD) and enter threshold
    cy.get('#unit-6').check()
    cy.get('#threshold-mBOD').type('123')
    cy.get('.govuk-button').contains('Continue').click()

    // Select stop flow
    cy.get('[type="radio"]').check('stop')
    cy.get('.govuk-button').contains('Continue').click()

    // Enter the licence number this threshold applies to
    cy.get('#licence-ref').type('AT/TEST/01')
    cy.get('.govuk-button').contains('Continue').click()

    // The licence has no conditions recorded against it, confirm manual entry of abstraction period
    cy.get('.govuk-heading-l').contains('There are no flow or level cessation conditions for licence AT/TEST/01')
    cy.get('.govuk-button').contains('Continue').click()

    // Enter the abstraction period for the licence
    cy.get('.govuk-heading-l').contains('Enter an abstraction period for licence AT/TEST/01')
    cy.get('#abstractionPeriodStartDay').type('10')
    cy.get('#abstractionPeriodStartMonth').type('10')
    cy.get('#abstractionPeriodEndDay').type('11')
    cy.get('#abstractionPeriodEndMonth').type('11')
    cy.get('.govuk-button').contains('Continue').click()

    // Check the restriction details
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('123mBOD')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('Stop')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('AT/TEST/01')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('None')
    cy.get(':nth-child(5) > .govuk-summary-list__value').contains('10 October to 11 November')

    // Change the restriction type
    cy.get(':nth-child(2) > .govuk-summary-list__actions > .govuk-link').click()

    // Select reduce flow
    cy.get('[type="radio"]').check('reduce')
    cy.get('[type="radio"]').check('yes')
    cy.get('.govuk-button').contains('Continue').click()

    // Check the restriction type has changed
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('Reduce with a maximum volume limit')
    cy.get('.govuk-button').contains('Confirm').click()

    // Confirm we are back on the monitoring station page and the licence is tagged
    cy.get('.govuk-notification-banner__heading').contains('Tag for licence AT/TEST/01 added')
    cy.get('.govuk-heading-l').should('have.text', 'Test Station')
    cy.get('[data-test="licence-ref-0"]').should('have.text', 'AT/TEST/01')
    cy.get('[data-test="abstraction-period-0"]').should('have.text', '10 October to 11 November')
    cy.get('[data-test="restriction-0"]').should('have.text', 'Stop or reduce')
    cy.get('[data-test="threshold-0"]').should('have.text', '123mBOD')
    cy.get('[data-test="alert-0"]').should('be.empty')
    cy.get('[data-test="alert-date-0"]').should('be.empty')
    cy.get('[data-test="action-0"]').should('have.text', 'View')
  })
})
