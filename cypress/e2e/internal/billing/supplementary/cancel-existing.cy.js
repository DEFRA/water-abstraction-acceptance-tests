'use strict'

describe('Cancel existing supplementary bill runs (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    // NOTE: Using 2PT test data in this test is intended. The supplementary test data inserts an Annual bill run that
    // confuses this test and its assertion that all bill runs for the test region have been deleted. The 2PT test data
    // doesn't add any bill runs so the test works
    cy.setUp('two-part-tariff-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('cancels both the PRESROC and SROC supplementary bill runs once they have finished building', () => {
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
    // choose Supplementary and continue
    cy.get('input#selectedBillingType-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Test Region Supplementary bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for old charge scheme')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // -------------------------------------------------------------------------
    cy.log('Deleting the PRESROC supplementary bill run')

    // Bill runs
    // the bill runs we create will be the top 2 results. We expect their status to be EMPTY based on the test data we
    // used. Building might take a second though so to avoid the test failing we use our custom Cypress command to look
    // for a status of EMPTY, and if not found reload the page and try a few more times. We then select the first one
    // using its link
    cy.reloadUntilTextFound('tr:nth-child(1) > td:nth-child(6) > strong', 'Empty')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Old charge scheme')
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Supplementary')
    })
    cy.get('tr:nth-child(1) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // quick test that the display is as expected and then click Cancel bill run
    cy.get('dl').within(() => {
      // date created
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Supplementary')
      // charge scheme
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Old')
    })
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // click Cancel bill run
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // -------------------------------------------------------------------------
    cy.log('Deleting the SROC supplementary bill run')

    // Bill runs
    // Select the SROC bill run (now first in the list using its link
    cy.reloadUntilTextFound('tr:nth-child(1) > td:nth-child(6) > strong', 'Empty')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Supplementary')
    })
    cy.get('tr:nth-child(1) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // quick test that the display is as expected and then click Cancel bill run
    cy.get('dl').within(() => {
      // date created
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Supplementary')
      // charge scheme
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Current')
    })
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // click Cancel bill run
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // Bill runs
    // back on the bill runs page confirm our cancelled bill run is not present
    cy.get('#main-content')
      .then((mainContent) => {
        if (mainContent.find('tr').length) {
          return '#main-content > div:nth-child(5) > div > table > tbody > tr:nth-child(1)'
        }

        return '#main-content'
      })
      .then((selector) => {
        cy.get(selector)
          .should('not.contain.text', 'Test Region')
          .and('not.contain.text', 'Supplementary')
      })
  })
})
