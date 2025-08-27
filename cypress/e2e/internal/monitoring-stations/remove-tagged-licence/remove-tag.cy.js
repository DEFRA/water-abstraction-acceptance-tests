'use strict'

describe('Monitoring stations - Remove a tag (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('monitoring-stations.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('removes the tagged licence from the monitoring station', () => {
    cy.visit('/')

    //  Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    //  Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in and we're on the search page
    cy.contains('Search')

    // Search for the monitoring station and select it from the results
    cy.get('#query').type('Test Station Tagged')
    cy.get('.search__button').click()
    cy.contains('Monitoring stations')
    cy.get('.govuk-table__row').contains('Test Station Tagged').click()

    // Confirm we are on the monitoring station page
    cy.get('.govuk-heading-xl').contains('Test Station Tagged')
    cy.get('[data-test="meta-data-grid-reference"]').should('have.text', 'ST1234567890')
    cy.get('[data-test="meta-data-wiski-id"]').should('be.empty')
    cy.get('[data-test="meta-data-station-reference"]').should('be.empty')

    // View the tag for the linked licence
    cy.get('[data-test="action-0"] > .govuk-link').contains('View').click()

    // Confirm we are viewing the tag details
    cy.get('.govuk-caption-l').should('have.text', 'Test Station Tagged')
    cy.get('.govuk-heading-xl').should('have.text', 'Details for AT/CURR/DAILY/01')
    cy.get('.govuk-summary-card__title').contains('Stop tag')
    cy.get('[data-test="threshold-0"]').should('have.text', '100m3/s')
    cy.get('[data-test="type-0"]').should('have.text', 'Stop')
    cy.get('[data-test="linked-condition-0"]').should('have.text', 'Not linked to a condition')

    // Remove the tag
    cy.get('.govuk-summary-card__actions > .govuk-link').contains('Remove tag').click()

    // Confirm we are on the confirm tag removal page
    cy.get('.govuk-caption-l').should('have.text', 'Licence AT/CURR/DAILY/01')
    cy.get('.govuk-heading-l').should('have.text', 'You’re about to remove the tag for this licence')
    cy.get('.govuk-heading-m').should('have.text', 'Hands off flow threshold')
    cy.get('.govuk-warning-text__text').contains(
      'You will not be able to send a water abstraction alert for the licence at this restriction type and threshold.'
    )
    cy.get('[data-test="watercourse"]').should('have.text', 'Test Catchment')
    cy.get('[data-test="station"]').should('have.text', 'Test Station Tagged')
    cy.get('[data-test="threshold"]').should('have.text', '100m3/s')
    cy.get('[data-test="type"]').should('have.text', 'Stop')
    cy.get('[data-test="linked-condition"]').should('have.text', 'Not linked to a condition')

    // Confirm removal of the tag
    cy.get('.govuk-button').contains('Confirm').click()

    // Confirm we are back on the monitoring station page and the tag has been removed
    cy.get('.govuk-notification-banner__heading').contains('Tag removed for AT/CURR/DAILY/01')
    cy.get('.govuk-heading-xl').should('have.text', 'Test Station Tagged')
    cy.get('p.govuk-body').should(
      'have.text', 'There are no licences tagged with restrictions for this monitoring station'
    )
  })
})
