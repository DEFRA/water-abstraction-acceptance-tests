'use strict'

describe('Cancel an existing two-part tariff bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('two-part-tariff-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('cancels a PRESROC two-part tariff bill run that has already finished building', () => {
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
    // choose Two-part tariff and summer and then continue
    cy.get('input#selectedBillingType-3').click()
    cy.get('input#twoPartTariffSeason').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the financial year
    // the years displayed are dynamic based on the current year. So, we choose the last one displayed, which will
    // always be the oldest year.
    cy.get('.govuk-radios__item').last().children().first().click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Test Region Two-part tariff bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for old charge scheme')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // the bill run we created will be the top result. We expect it's status to be EMPTY based on the test data we
    // used. Building might take a second though so to avoid the test failing we use our custom Cypress command to look
    // for the status EMPTY, and if not found reload the page and try a few more times. We then select it using the link
    cy.reloadUntilTextFound('tr:nth-child(1) > td:nth-child(6) > strong', 'Empty')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Old charge scheme')
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Two-part tariff')
    })
    cy.get('tr:nth-child(1) > td:nth-child(1) > a').click()

    // Test Region two-part tariff bill run
    // quick test that the display is as expected and then click Cancel bill run
    cy.get('dl').within(() => {
      // date created
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Two-part tariff summer')
      // charge scheme
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Old')
    })
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // confirm we are deleting the right bill run and click Cancel bill run
    cy.get('dl').within(() => {
      // date created
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Two-part tariff summer')
    })
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // Bill runs
    // back on the bill runs page confirm our cancelled bill run is not present
    cy.get('#main-content > div:nth-child(5) > div > table > tbody > tr:nth-child(1)')
      .should('not.contain.text', 'Test Region')
  })
})
