'use strict'

describe('Monitoring stations - Abstraction alerts (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('monitoring-stations.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('creates and then cancels an abstraction alert prior to sending for the tagged licence', () => {
    cy.visit('/')

    // Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Assert the user signed in and we're on the search page
    cy.contains('Search')

    // Search for the monitoring station and select it from the results
    cy.get('#query').type('Test Station Tagged')
    cy.get('.search__button').click()
    cy.contains('Monitoring stations')
    cy.get('.govuk-table__row').contains('Test Station Tagged').click()

    // Confirm we are on the monitoring station page
    cy.get('.govuk-caption-l').should('have.text', 'Test Catchment')
    cy.get('.govuk-heading-xl').should('have.text', 'Test Station Tagged')
    cy.get('[data-test="meta-data-grid-reference"]').should('have.text', 'ST1234567890')
    cy.get('[data-test="meta-data-wiski-id"]').should('be.empty')
    cy.get('[data-test="meta-data-station-reference"]').should('be.empty')

    // Select Create a water abstraction alert
    cy.get('.govuk-button').contains('Create a water abstraction alert').click()

    // Confirm we are on the Select the type of alert you need to send page
    cy.get('.govuk-caption-l').should('have.text', 'Test Station Tagged')
    cy.get('.govuk-fieldset__heading').contains('Select the type of alert you need to send')

    // Select the stop alert type and continue
    cy.get('[type="radio"]').check('stop')
    cy.get('.govuk-button').contains('Continue').click()

    // Confirm we are on the Which thresholds do you need to send an alert for? page
    cy.get('.govuk-caption-l').should('have.text', 'Test Station Tagged')
    cy.get('.govuk-fieldset__heading').contains('Which thresholds do you need to send an alert for?')

    // Select the threshold and continue
    cy.get('#alert-thresholds').check()
    cy.get('.govuk-button').contains('Continue').click()

    // Confirm data on Check the licence matches for the selected thresholds page is correct and continue
    cy.get('.govuk-caption-l').should('have.text', 'Test Station Tagged')
    cy.get('.govuk-heading-l').should('have.text', 'Check the licence matches for the selected thresholds')
    cy.get('[data-test="licence-ref-0"]').should('have.text', 'AT/CURR/DAILY/01')
    cy.get('[data-test="abstraction-period-0"]').should('have.text', '10 October to 11 November')
    cy.get('[data-test="restriction-0"]').should('have.text', 'Stop')
    cy.get('[data-test="threshold-0"]').should('have.text', '100m3/s')
    cy.get('[data-test="alert-0"]').should('be.empty')
    cy.get('.govuk-button').contains('Continue').click()

    // Confirm we are on the Select an email address to include in the alerts page
    cy.get('.govuk-caption-l').should('have.text', 'Test Station Tagged')
    cy.get('.govuk-fieldset__heading').contains('Select an email address to include in the alerts')
    cy.get('.govuk-radios').contains('environment.officer@wrls.gov.uk')

    // Select Use another email address, enter an email address and continue
    cy.get('[type="radio"]').check('other')
    cy.get('#other-user').type('test.user@testing.com')
    cy.get('.govuk-button').contains('Continue').click()

    // Confirm data on Check the recipients page is correct and cancel the alert
    cy.get('.govuk-caption-l').contains('Notice WAA-')
    cy.get('.govuk-heading-l').contains('Check the recipients')
    cy.get('.govuk-body').contains('Showing all 1 recipients')
    cy.get('.govuk-table__body').contains('external@example.co.uk')
    cy.get('.govuk-table__body').contains('AT/CURR/DAILY/01')
    cy.get('.govuk-table__body').contains('Email - Primary user')
    cy.get('.govuk-table__body').contains('Preview')
    cy.get('.govuk-button--secondary').contains('Cancel').click()

    // Confirm cancellation of the alert
    cy.get('.govuk-caption-l').contains('Notice WAA-')
    cy.get('.govuk-heading-xl').should('have.text', 'You are about to cancel this notice')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('Stop')
    cy.get('.govuk-button').contains('Confirm cancel').click()

    // Confirm we are back on the monitoring station page
    cy.get('.govuk-caption-l').should('have.text', 'Test Catchment')
    cy.get('.govuk-heading-xl').should('have.text', 'Test Station Tagged')
  })
})
