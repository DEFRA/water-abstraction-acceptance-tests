'use strict'

describe('mBOD abstraction alert journey (internal)', () => {
  before(() => {
    cy.tearDown()
    cy.setUp('barebones')
    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('tags a licence to a monitoring station, sends a warning and then removes the tag', () => {
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
    cy.get('#query').type('Test Station 500')
    cy.get('.search__button').click()
    cy.contains('Monitoring stations')
    cy.get('.govuk-table__row').contains('Test Station 500').click()

    // Tag a licence to the monitoring station
    cy.get('.govuk-button').contains('Tag a licence').click()

    cy.get('#threshold').type(104)
    cy.get('#unit').select('mBOD')
    cy.get('form > .govuk-button').contains('Continue').click()

    cy.get('[type="radio"]').check('stop')
    cy.get('form > .govuk-button').contains('Continue').click()

    cy.get('#licenceNumber').type('AT/CURR/WEEKLY/01')
    cy.get('form > .govuk-button').contains('Continue').click()

    cy.get('[type="radio"]').check()
    cy.get('form > .govuk-button').contains('Continue').click()

    cy.get('#startDate-day').type('10')
    cy.get('#startDate-month').type('10')
    cy.get('#endDate-day').type('11')
    cy.get('#endDate-month').type('11')
    cy.get('form > .govuk-button').contains('Continue').click()

    cy.get('form > .govuk-button').contains('Confirm').click()
    cy.get('.govuk-panel').contains('Licence added to monitoring station')

    // Return to the monitoring station
    cy.get('.govuk-link').contains('Return to monitoring station').click()

    // Issue a stop warning
    cy.get('.govuk-grid-column-full').contains('Create a water abstraction alert').click()
    cy.get('.govuk-radios__input[value="warning"]').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    cy.get('.govuk-checkboxes__label').contains('104 mBOD').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    cy.get('.govuk-button').contains('Continue').click()

    cy.get('.govuk-radios__input[value="true"]').click()
    cy.get('.govuk-button').contains('Continue').click()

    cy.get('.govuk-button').contains('Confirm and send').click()

    // Return to the monitoring station
    cy.get('.govuk-link').contains('Return to monitoring station').click()

    // Remove the tagged licence
    cy.get('a.govuk-button.govuk-button--secondary').contains('Remove a tag').click()

    cy.get('.govuk-radios__item > #selectedLicence').check()
    cy.get('form > .govuk-button').click()

    cy.get('form > .govuk-button').contains('Confirm').click()

    cy.get('.govuk-heading-l').contains('Test Station 500').should('be.visible')
    cy.get('.govuk-body').contains('There are no licences tagged with restrictions for this monitoring station').should('be.visible')
    cy.get('.govuk-button').contains('Tag a licence').should('be.visible')
  })
})
