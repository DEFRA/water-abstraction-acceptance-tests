'use strict'

describe('Create and send PRESROC two-part tariff bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('five-year-two-part-tariff-bill-runs')
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
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
    cy.get('.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Two-part tariff then continue
    cy.get('label.govuk-radios__label').contains('Two-part tariff').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the financial year
    // choose 2021 to 2022 and continue
    cy.get('label.govuk-radios__label').contains('2021 to 2022').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the season
    // choose Winter and All year and continue
    cy.get('label.govuk-radios__label').contains('Winter and All year').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Bill runs
    //
    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status REVIEW, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'review')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Two-part tariff winter and all year')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Review data issues
    // check the rest of the details before completing the review
    cy.get('#main-content > div.govuk-grid-row > div > p > strong').should('contain.text', 'Review')
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
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
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
    cy.get('.govuk-body > .govuk-tag', { timeout: 20000 }).should('contain.text', 'ready')
    cy.get('[data-test="bill-total"]').should('contain.text', '£660.24')
    cy.get('[data-test="bills-count"]').should('contain.text', '1 Two-part tariff winter and all year bill')
    cy.get('.govuk-button').contains('Send bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Two-part tariff winter and all year')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Old')
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region two-part tariff bill run
    //
    // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this step
    // is so fast the test will fail because it doesn't see the element

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region two-part tariff bill run
    // confirm we see it is now SENT
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'sent')

    // click the back link to go to bill runs
    cy.get('.govuk-back-link').click()

    // Bill runs
    // back on the bill runs page confirm our PRESROC bill run is present and listed as SENT
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate).and('contain.text', 'Old charge scheme')
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Two-part tariff winter and all year')
    cy.get('[data-test="number-of-bills-0"]').should('contain.text', '1')
    cy.get('[data-test="bill-run-status-0"] > .govuk-tag').should('contain.text', 'sent')
  })
})
