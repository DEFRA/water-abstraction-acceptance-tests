'use strict'

describe('Attempt set up of abstraction alert with no thresholds (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('monitoring-stations.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('will not create a Reduce alert as there are no thresholds with the reduce restriction type', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/')

    // Search for the monitoring station and select it from the results
    cy.get('#query').type('Test Station Tagged')
    cy.get('.search__button').click()
    cy.contains('Monitoring stations')
    cy.get('.govuk-table__row').contains('Test Station Tagged').click()

    // Confirm we are on the monitoring station page
    cy.get('.govuk-caption-l').should('have.text', 'Test Catchment')
    cy.get('.govuk-heading-l').should('have.text', 'Test Station Tagged')
    cy.get('[data-test="meta-data-grid-reference"]').should('have.text', 'ST1234567890')
    cy.get('[data-test="meta-data-wiski-id"]').should('be.empty')
    cy.get('[data-test="meta-data-station-reference"]').should('be.empty')

    // Select Create a water abstraction alert
    cy.get('.govuk-button').contains('Create a water abstraction alert').click()

    // Confirm we are on the Select the type of alert you need to send page
    cy.get('.govuk-caption-l').should('have.text', 'Test Station Tagged')
    cy.get('.govuk-fieldset__heading').contains('Select the type of alert you need to send')

    // Select the reduce alert type and continue
    cy.get('[type="radio"]').check('reduce')
    cy.get('.govuk-button').contains('Continue').click()

    // Confirm that a validation error has been generated
    cy.get('.govuk-error-summary').contains('There is a problem')
    cy.get('.govuk-error-summary').contains('There are no thresholds with the reduce restriction type, Select the type of alert you need to send')
    cy.get('#alert-type-error').contains('There are no thresholds with the reduce restriction type, Select the type of alert you need to send')
  })
})
