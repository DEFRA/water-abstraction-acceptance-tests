'use strict'

describe('Delete licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('sets up a new agreement for a license and then deletes it', () => {
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

    // Creating a new licence agreement is also covered with assertions in
    // cypress/e2e/internal/licence-agreements/new-licence-agreement.cy.js. But for this test we have to use the UI to
    // create a record to then delete it. So, the following also creates a new licence agreement but we strip out the
    // checks and assertions for brevity
    cy.contains('Licence set up').click()
    cy.contains('Set up a new agreement').click()
    cy.get('#financialAgreementCode-3').check()
    cy.get('form > .govuk-button').click()
    cy.get('#isDateSignedKnown-2').check()
    cy.get('form > .govuk-button').click()
    cy.get('input#isCustomStartDate').check()
    cy.get('#startDate-day').type('01')
    cy.get('#startDate-month').type('01')
    cy.get('#startDate-year').type('2018')
    cy.get('form > .govuk-button').click()
    cy.get('form > .govuk-button').click()

    // Charge information
    // back on the Charge Information tab select to delete the licence
    cy.get('#set-up').should('be.visible')
    cy.contains('Delete').click()

    // You're about to delete this agreement
    // confirm we are on the right page and it is showing the right agreement then delete it
    cy.get('.govuk-heading-l').contains("You're about to delete this agreement")

    cy.get('#main-content > table > tbody > tr').within(() => {
      // agreement
      cy.get('td:nth-child(1)').should('contain.text', 'Canal and Rivers Trust, unsupported source (S130U)')
      // date signed
      cy.get('td:nth-child(2)').should('contain.text', ' ')
      // start date
      cy.get('td:nth-child(3)').should('contain.text', '1 January 2018')
      // end date
      cy.get('td:nth-child(4)').should('contain.text', ' ')
    })
    cy.contains('Delete agreement').click()

    // Charge information
    // confirm we are back on the Charge Information tab and our licence agreement is no longer present
    cy.get('#set-up').should('be.visible')
    cy.should('contain.text', 'No agreements for this licence.')
  })
})
