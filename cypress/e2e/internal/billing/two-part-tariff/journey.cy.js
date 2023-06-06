'use strict'

describe('Create and send PRESROC two-part tariff bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('five-year-two-part-tariff-bill-runs')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a PRESROC two-part tariff bill run and once built confirms and sends it', () => {
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
    // choose Two-part tariff and winter and all year and then continue
    cy.get('input#selectedBillingType-3').click()
    cy.get('input#twoPartTariffSeason-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the financial year
    // select the option prior to the current year (which will always be the first radio button) and continue
    cy.get('input#select-financial-year-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Test Region Two-part tariff bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for old charge scheme')

    // Review data issues
    // we have to wait till the bill run has determined a review is needed. The thing we wait on is the REVIEW label.
    // Once that is present we can check the rest of the details before completing the review
    cy.get('#main-content > div.govuk-grid-row > div > p > strong', { timeout: 20000 }).should('contain.text', 'Review')
    cy.get('#main-content > section > div > p')
      .should('contain.text', 'You need to review 1 licence with returns data issues before you can continue')
    cy.get('#dataIssues > table > tbody > tr:nth-child(1)').within(() => {
      // licence
      cy.get('td:nth-child(1)').should('contain.text', 'L1')
      // billing contact
      cy.get('td:nth-child(2)').should('contain.text', 'Big Farm Co Ltd')
      // issue
      cy.get('td:nth-child(3)').should('contain.text', 'No returns received')
      // billable returns edited
      cy.get('td:nth-child(4)').should('contain.text', ' ')
      // action
      cy.get('td:nth-child(5)').should('contain.text', 'Review')

      cy.get('td:nth-child(5) > a').contains('Review').click()
    })

    // Review data issues for L1
    // confirm we see 0Ml billable returns and then click Change
    cy.get('tbody > tr:nth-child(2) > td:nth-child(2)').should('contain.text', '0Ml')
    cy.get('td:nth-child(3) > a').contains('Change').click()

    // Set the billable returns quantity for this bill run
    // choose Authorised (30Ml) and confirm
    cy.get('input#quantity').click()
    cy.get('.govuk-button').contains('Confirm').click()

    // Review data issues
    // confirm we see all issues resolved and then click to continue
    cy.get('#main-content > section > p')
      .should('contain.text', 'You have resolved all returns data issues. Continue to generate bills.')
    cy.get('a.govuk-button').contains('Continue').click()

    // You're about to generate the two-part tariff bills
    // confirm the details and click confirm
    cy.get('dl').within(() => {
      // date created
      cy.dayMonthYearFormattedDate().then((formattedDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Two-part tariff winter and all year')
      // status
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Review')
    })
    cy.get('.govuk-button').contains('Confirm').click()

    // Test Region two-part tariff bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can check the rest of the details before confirming the bill run
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('#main-content > div:nth-child(2) > div > h2').should('contain.text', '£660.24')
    cy.get('#main-content > div:nth-child(4) > div > h2').should('contain.text', '1 two-part tariff bill')
    cy.get('.govuk-button').contains('Confirm bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('dl').within(() => {
      // date created
      cy.dayMonthYearFormattedDate().then((formattedDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Two-part tariff winter and all year')
      // status
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Ready')
    })
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region two-part tariff bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for old charge scheme')

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region two-part tariff bill run
    // confirm we see it is now SENT
    cy.get('#main-content > div:nth-child(1) > div > p > strong').should('contain.text', 'Sent')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // back on the bill runs page confirm our PRESROC bill run is present and listed as SENT
    cy.dayMonthYearFormattedDate().then((formattedDate) => {
      cy.get('#main-content > div:nth-child(5) > div > table > tbody > tr:nth-child(1)')
        .should('contain.text', formattedDate)
        .and('contain.text', 'Old charge scheme')
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Two-part tariff')
        .and('contain.text', '£660.24')
        .and('contain.text', 'Sent')
    })
  })
})
