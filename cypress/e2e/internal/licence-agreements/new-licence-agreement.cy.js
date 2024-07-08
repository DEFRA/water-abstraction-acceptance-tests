'use strict'

describe('New licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('barebones')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('setup a new agreement for a license and then view it', () => {
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

    // Search for the licence and select it from the results
    cy.get('#query').type('AT/CURR/DAILY/01')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/CURR/DAILY/01').click()

    // Confirm we are on the licence page and select the licence set up tab
    cy.contains('AT/CURR/DAILY/01')
    cy.contains('Licence set up').click()

    // Confirm we are on the tab page and then click Set up a new agreement
    cy.contains('Charge information')
    cy.contains('Set up a new agreement').click()

    // Select agreement
    // select Canal and Rivers Trust, unsupported source (S130U) then continue
    cy.get('#financialAgreementCode-3').check()
    cy.get('form > .govuk-button').click()

    // Do you know the date the agreement was signed?
    // select No and continue
    cy.get('#isDateSignedKnown-2').check()
    cy.get('form > .govuk-button').click()

    // Check agreement start date
    // select Yes to set a different agreement start date. A section appears allowing the user to enter the custom
    // date then continue
    cy.get('input#isCustomStartDate').check()
    cy.get('#startDate-day').type('01')
    cy.get('#startDate-month').type('01')
    cy.get('#startDate-year').type('2018')
    cy.get('form > .govuk-button').click()

    // Check agreement details
    // confirm the details match what was entered and continue
    cy.get('.govuk-heading-l').contains('Check agreement details').should('be.visible')
    cy.get('.govuk-summary-list__value').contains('Canal and Rivers Trust, unsupported source (S130U)').should('be.visible')
    cy.get('form > .govuk-button').click()

    // Charge information
    // confirm we are back on the Charge Information tab and our licence agreement is present
    cy.get('#set-up').should('be.visible')

    cy.get(':nth-child(12) > .govuk-table__body > .govuk-table__row').within(() => {
      // start date
      cy.get(':nth-child(1)').should('contain.text', '1 January 2018')
      // end date
      cy.get(':nth-child(2)').should('contain.text', '')
      // agreement
      cy.get(':nth-child(3)').should('contain.text', 'Canal and Rivers Trust, unsupported source (S130U)')
      // date signed
      cy.get(':nth-child(4)').should('contain.text', '')
      // actions
      cy.get(':nth-child(5) > a:nth-child(1)').should('contain.text', 'Delete')
      cy.get(':nth-child(5) > a:nth-child(2)').should('contain.text', 'End')
    })
  })
})
