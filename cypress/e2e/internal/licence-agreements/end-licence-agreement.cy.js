'use strict'

describe('End licence agreement journey (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('barebones.json').then((fixture) => {
      cy.load(fixture)
    })
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('sets up a new agreement for a license and then ends it using a valid date', () => {
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
    // create a record to then end it. So, the following also creates a new licence agreement but we strip out the
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
    // back on the Charge Information tab select to end the licence
    cy.get('#set-up').should('be.visible')
    cy.get(':nth-child(12) > .govuk-table__body > .govuk-table__row > :nth-child(5)').contains('End').click()

    // Set agreement end date
    // first check the validation for invalid dates is working
    cy.get('#endDate-day').type('01')
    cy.get('#endDate-month').type('01')
    cy.get('#endDate-year').type('2021')
    cy.get('form > .govuk-button').click()
    cy.get('.govuk-error-summary').contains('You must enter an end date that matches some existing charge information or is 31 March.You cannot use a date that is before the agreement start date.').should('be.visible')

    // then repeat using a valid date
    cy.get('#endDate-day').clear().type('31')
    cy.get('#endDate-month').clear().type('03')
    cy.get('#endDate-year').clear().type('2022')
    cy.get('form > .govuk-button').click()

    // You're about to end this agreement
    // confirm the details match what was entered and continue
    cy.get('#main-content > table > tbody > tr').within(() => {
      // agreement
      cy.get('td:nth-child(1)').should('contain.text', 'Canal and Rivers Trust, unsupported source (S130U)')
      // date signed
      cy.get('td:nth-child(2)').should('contain.text', ' ')
      // start date
      cy.get('td:nth-child(3)').should('contain.text', '1 January 2018')
      // end date
      cy.get('td:nth-child(4)').should('contain.text', '31 March 2022')
    })
    cy.get('form > .govuk-button').contains('End agreement').click()

    // Charge information
    // confirm we are back on the licence set up tab and our licence agreement is present with an end date and only
    // the delete action available
    cy.get('#set-up').should('be.visible')

    cy.get(':nth-child(12) > .govuk-table__body > .govuk-table__row').within(() => {
      // start date
      cy.get(':nth-child(1)').should('contain.text', '1 January 2018')
      // end date
      cy.get(':nth-child(2)').should('contain.text', '31 March 2022')
      // agreement
      cy.get(':nth-child(3)').should('contain.text', 'Canal and Rivers Trust, unsupported source (S130U)')
      // date signed
      cy.get(':nth-child(4)').should('contain.text', '')
      // actions
      cy.get(':nth-child(5) > a:nth-child(1)').should('contain.text', 'Delete')
      cy.get(':nth-child(5) > a:nth-child(2)').should('not.exist')
    })
  })
})
