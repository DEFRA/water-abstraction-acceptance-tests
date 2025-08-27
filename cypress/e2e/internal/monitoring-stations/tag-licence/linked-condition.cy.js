'use strict'

describe('Monitoring stations - Tag a licence (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('monitoring-stations.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('tags a licence linked to a condition, the user selects the condition which pre-populates the abs period', () => {
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
    cy.get('#query').type('Test Station 500')
    cy.get('.search__button').click()
    cy.contains('Monitoring stations')
    cy.get('.govuk-table__row').contains('Test Station 500').click()

    // Confirm we are on the monitoring station page
    cy.get('.govuk-heading-xl').should('have.text', 'Test Station 500')
    cy.get('[data-test="meta-data-grid-reference"]').should('have.text', 'ST5820172718')
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
    cy.get('#licence-ref').type('AT/CURR/DAILY/01')
    cy.get('.govuk-button').contains('Continue').click()

    // The licence has a condition recorded against it. Select "The condition is not listed for this licence"
    cy.get('.govuk-heading-l').contains('Select the full condition for licence AT/CURR/DAILY/01')
    cy.get('#condition').check()
    cy.get('.govuk-button').contains('Continue').click()

    // Check the restriction details
    cy.get(':nth-child(1) > .govuk-summary-list__value').contains('123mBOD')
    cy.get(':nth-child(2) > .govuk-summary-list__value').contains('Stop')
    cy.get(':nth-child(3) > .govuk-summary-list__value').contains('AT/CURR/DAILY/01')
    cy.get(':nth-child(4) > .govuk-summary-list__value').contains('Level cessation condition 1: Test condition notes')
    cy.get(':nth-child(5) > .govuk-summary-list__value').contains('1 April to 31 March')
    cy.get(':nth-child(5) > .govuk-summary-list__actions > .govuk-link')
      .should('have.text', '\n                ')
      .and('have.attr', 'href', '')
    cy.get('.govuk-button').contains('Confirm').click()

    // Confirm we are back on the monitoring station page and the licence is tagged
    cy.get('.govuk-notification-banner__heading').should('have.text', 'Tag for licence AT/CURR/DAILY/01 added')
    cy.get('.govuk-heading-xl').should('have.text', 'Test Station 500')
    cy.get('[data-test="licence-ref-0"]').should('have.text', 'AT/CURR/DAILY/01')
    cy.get('[data-test="abstraction-period-0"]').should('have.text', '1 April to 31 March')
    cy.get('[data-test="restriction-0"]').should('have.text', 'Stop')
    cy.get('[data-test="threshold-0"]').should('have.text', '123mBOD')
    cy.get('[data-test="alert-0"]').should('be.empty')
    cy.get('[data-test="alert-date-0"]').should('be.empty')
    cy.get('[data-test="action-0"]').should('have.text', 'View')

    // Confirm the licence is linked to the monitoring station in the licence summary
    cy.get('[data-test="licence-ref-0"]').contains('AT/CURR/DAILY/01').click()
    cy.get('.govuk-heading-l').contains('Licence number AT/CURR/DAILY/01')
    cy.get('.govuk-list').contains('Test Station 500')
  })
})
