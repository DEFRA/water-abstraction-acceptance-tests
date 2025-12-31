'use strict'

import scenarioData from '../../../../support/scenarios/monitoring-station-tagged.js'

const scenario = scenarioData()

describe('Tag a licence linked to a condition. The abstraction period is derived from the condition (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.load(scenario)

    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('tags a licence linked to a condition, the user selects the condition which pre-populates the abs period', () => {
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
    cy.get('#threshold-mBOD').type('200')
    cy.get('.govuk-button').contains('Continue').click()

    // Select stop flow
    cy.get('[type="radio"]').check('reduce')
    cy.get('[type="radio"]').check('no')
    cy.get('.govuk-button').contains('Continue').click()

    // Enter the licence number this threshold applies to
    cy.get('#licence-ref').type('AT/TE/ST/01/01')
    cy.get('.govuk-button').contains('Continue').click()

    // The licence has a condition recorded against it. Select "The condition is not listed for this licence"
    cy.get('.govuk-heading-l').contains('Select the full condition for licence AT/TE/ST/01/01')
    cy.get('#condition').check()
    cy.get('.govuk-button').contains('Continue').click()

    // Check the restriction details
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('200mBOD')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('Reduce')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('AT/TE/ST/01/01')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('Level cessation condition 1: Test condition notes')
    cy.get(':nth-child(5) > .govuk-summary-list__value').contains('1 April to 31 March')
    cy.get(':nth-child(5) > .govuk-summary-list__actions > .govuk-link')
      .should('have.text', '\n                ')
      .and('have.attr', 'href', '')
    cy.get('.govuk-button').contains('Confirm').click()

    // Confirm we are back on the monitoring station page and the licence is tagged
    cy.get('.govuk-notification-banner__heading').should('have.text', 'Tag for licence AT/TE/ST/01/01 added')
    cy.get('.govuk-heading-l').should('have.text', 'Test Station')
    cy.get('[data-test="licence-ref-0"]').should('have.text', 'AT/TE/ST/01/01')
    cy.get('[data-test="abstraction-period-0"]').should('have.text', '1 April to 31 March')
    cy.get('[data-test="restriction-0"]').should('have.text', 'Reduce')
    cy.get('[data-test="threshold-0"]').should('have.text', '200mBOD')
    cy.get('[data-test="alert-0"]').should('be.empty')
    cy.get('[data-test="alert-date-0"]').should('be.empty')
    cy.get('[data-test="action-0"]').should('have.text', 'View')
  })
})
