'use strict'

describe('mBOD abstraction alert validation (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then(cy.load)
    cy.fixture('users.json').its('environmentOfficer').as('userEmail')
  })

  it('validates tagging a licence to a monitoring station, sending a warning and then removing the tag', () => {
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

    // Validations
    // What is the licence hands-off flow or level threshold?
    cy.get('#unit option').last().contains('SLD')
    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary').contains('There is a problem').should('be.visible')
    cy.get('.govuk-error-summary').contains('Enter a number in digits and no other characters other than a decimal point').should('be.visible')

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

    cy.get('.govuk-heading-l').contains('Check the restriction details')
    cy.get('.govuk-summary-list__row:nth-child(1) .govuk-summary-list__value:nth-child(2)').contains('104mBOD')
    cy.get('.govuk-summary-list__row:nth-child(3) .govuk-summary-list__value:nth-child(2)').contains('AT/CURR/WEEKLY/01')
    cy.get('form > .govuk-button').contains('Confirm').click()
    cy.get('.govuk-panel').contains('Licence added to monitoring station')

    // Returning to the monitoring station and check details
    cy.get('.govuk-link').contains('Return to monitoring station').click()
    cy.get('.govuk-table__body')
      .children()
      .should('contain', 'AT/CURR/WEEKLY/01')
      .should('contain', '10 October to 11 November')
      .should('contain', 'Stop')
      .should('contain', '104')
      .should('contain', 'mBOD')

    // Issue a stop warning
    cy.get('.govuk-grid-column-full').contains('Create a water abstraction alert').click()

    // Validations
    // Select the type of alert you need to send?
    cy.get('.govuk-radios').children().should('have.lengthOf', 4)
    cy.get('.govuk-radios').children(0).should('contain', 'Warning')
    cy.get('.govuk-radios').children(1).should('contain', 'Reduce')
    cy.get('.govuk-radios').children(2).should('contain', 'Stop')
    cy.get('.govuk-radios').children(3).should('contain', 'Resume')

    cy.get('form > .govuk-button').contains('Continue').click()
    cy.get('.govuk-error-summary').contains('Select the type of the alert')
    cy.get('.govuk-radios__input[value="warning"]').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Which thresholds do you need to send an alert for?
    cy.get('.govuk-checkboxes').children().should('have.lengthOf', 1)
    cy.get('.govuk-checkboxes__label').contains('104 mBOD').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check the licence matches for the selected thresholds
    cy.get('.govuk-table__row').children(0).should('have.lengthOf', 5)
    cy.get('.govuk-table__body > tr').children(1).should('contain.text', 'AT/CURR/WEEKLY/01')
    cy.get('.govuk-button').contains('Continue').click()

    // Select an email address to include in the alerts
    cy.get('.govuk-radios').children().should('have.lengthOf', 4)
    // 4 children, which is comprised of two radios, a divider, and a conditional input box
    cy.get('.govuk-radios').children(0).should('contain', '@example.com')
    cy.get('.govuk-radios').children(1).should('contain', 'or')
    cy.get('.govuk-radios').children(2).should('contain', 'Use another email address')
    cy.get('.govuk-radios__input[value="true"]').click()
    cy.get('.govuk-button').contains('Continue').click()

    // Processing notifications
    cy.get('h1').contains('Processing notifications')

    // Check the alert for each licence and send
    // spinner page was the previous page. Because this takes some time we need to amend the timeout in the next command
    cy.get('table > caption', { timeout: 30000 }).contains("You're sending this alert for 1 licence.")

    cy.get('.govuk-button').contains('Confirm and send').click()
    cy.get('h1').contains('Alert sent')
    cy.get('.govuk-panel__body').contains('You sent a warning alert')

    // Return to the monitoring station
    cy.get('.govuk-link').contains('Return to monitoring station').click()

    // Remove the tagged licence
    cy.get('a.govuk-button.govuk-button--secondary').contains('Remove a tag').click()

    // Which licence do you want to remove a tag from?
    cy.get('.govuk-heading-l').contains('Which licence do you want to remove a tag from?')
    cy.get('.govuk-radios__item > #selectedLicence').check()
    cy.get('form > .govuk-button').click()

    // You are about to remove tags from this licence
    cy.get('.govuk-fieldset__heading').contains('You are about to remove tags from this licence').should('be.visible')
    cy.get('form > .govuk-button').contains('Confirm').click()

    cy.get('.govuk-heading-l').contains('Test Station 500').should('be.visible')
    cy.get('.govuk-body').contains('There are no licences tagged with restrictions for this monitoring station').should('be.visible')
    cy.get('.govuk-button').contains('Tag a licence').should('be.visible')
  })
})
