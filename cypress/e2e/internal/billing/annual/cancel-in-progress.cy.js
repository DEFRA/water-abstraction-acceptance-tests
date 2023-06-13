'use strict'

// TODO: Fix cancelling an in progress bill run that is EMPTY. The legacy test on checked it could get through the
// cancel journey. It never confirmed the bill run was actually gone at the end of the test. There is very little value
// to the test if you don't confirm the bill run is cancelled which is why we checked it and found this error.
describe.skip('Cancel an in progress annual bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('supplementary-billing')
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it("starts an annual bill run and then immediately cancels it from the 'building' page", () => {
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

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('#main-content > a.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Annual and continue
    cy.get('input#selectedBillingType').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Southern (Test replica) and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Southern (Test replica) annual bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it then select the Cancel button
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for current charge scheme')
    cy.get('.govuk-grid-column-two-thirds > .govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // confirm we are deleting the right bill run and click Cancel bill run
    cy.get('dl').within(() => {
      // date created
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Southern (Test replica)')
      // Bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Annual')
    })
    cy.get('form > .govuk-button').contains('Cancel bill run').click()

    // Bill runs
    // back on the bill runs page confirm our cancelled bill run is not present
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('#main-content > div:nth-child(5) > div > table > tbody > tr:nth-child(1)')
        .should('not.contain.text', formattedCurrentDate)
        .and('not.contain.text', 'Southern (Test replica)')
        .and('not.contain.text', 'Annual')
    })
  })
})
