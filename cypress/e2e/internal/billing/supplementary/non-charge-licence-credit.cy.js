'use strict'

describe('Make licence non-chargeable then see credit in next bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.currentFinancialYearDate().then((currentFinancialYearInfo) => {
      cy.fixture('sroc-billing.json').then((fixture) => {
        // Update the bill run in the fixture to be in the 'current' financial year
        fixture.billRuns[0].fromFinancialYearEnding = currentFinancialYearInfo.year - 1
        fixture.billRuns[0].toFinancialYearEnding = currentFinancialYearInfo.year

        cy.load(fixture)
      })
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('create a SROC supplementary bill run, confirm and send it then make a licence non-chargeable using an SROC period date. Then create another SROC supplementary bill run and confirm a credit has been raised for the licence', () => {
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

    // -------------------------------------------------------------------------
    cy.log('Create, confirm and send the initial SROC supplementary bill run')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Supplementary and continue
    cy.get('label.govuk-radios__label').contains('Supplementary').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check the bill run
    cy.get('.govuk-button').contains('Create bill run').click()

    // Bill runs
    //
    // The bill run we created will be the second from top result. We expect it's status to be BUILDING. Building might
    // take a few seconds though so to avoid the test failing we use our custom Cypress command to look for the status
    // READY, and if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-1"] > .govuk-tag', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-1"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-1"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-1"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="date-created-1"] > .govuk-link').click()

    // Test Region supplementary bill run
    // check the details before sending the bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Send bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region Supplementary bill run spinner page
    //
    // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this step
    // is so fast the test will fail because it doesn't see the element

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')

    // -------------------------------------------------------------------------
    cy.log('Make the licence non-chargeable')

    // Search
    // search for the licence and select it from the results
    cy.get('#navbar-view').click()
    cy.get('#query').type('AT/TEST/02')
    cy.get('.search__button').click()
    cy.contains('Licences')
    cy.get('.govuk-table__row').contains('AT/TEST/02').click()

    // Charge information
    // confirm we are on the licence page and select licence set up tab. Then click to make the licence
    // non-chargeable
    cy.contains('AT/TEST/02')
    cy.contains('Licence set up').click()
    cy.get('.govuk-button').contains('Make licence non-chargeable').click()

    // Why is this licence not chargeable?
    // choose Abatement (S126) and continue
    cy.get('input#reason').click()
    cy.get('.govuk-button').contains('Continue').click()

    // Enter effective date
    // choose another date, enter 30 June for the current financial year so only the last bill needs crediting (avoids
    // slowing the test down with unnecessary calculations for previous years) and continue
    cy.get('input#startDate-4').click()
    cy.currentFinancialYearDate(30, 6, -1).then((result) => {
      cy.get('input#customDate-day').type(result.day)
      cy.get('input#customDate-month').type(result.month)
      cy.get('input#customDate-year').type(result.year)
    })
    cy.get('.govuk-button').contains('Continue').click()

    // Check charge information
    // confirm the details and then click Confirm
    cy.get('dl').should('contain.text', 'This licence was made non-chargeable on')
    cy.get('dl > div > dd.govuk-summary-list__value').should('contain.text', 'Abatement (S126)')
    cy.get('.govuk-button').contains('Confirm').click()

    // Charge information complete
    // confirm the charge information is submitted and then click to view it
    cy.get('.govuk-panel__title').should('contain', 'Charge information complete')
    cy.get('a[href*="licences/"]').contains('View charge information').click()

    // Charge information
    // select to review it
    cy.contains('Review').click()

    // Check charge information
    // approve the new charge version
    cy.get('strong.govuk-tag--orange').should('contain.text', 'Review')
    cy.get('input#reviewOutcome').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Charge information
    // confirm our new charge information is APPROVED and that the licence has been flagged for the next supplementary
    // bill run
    cy.contains('Review').should('not.exist')

    // -------------------------------------------------------------------------
    cy.log('Create the second SROC supplementary bill run and confirm credit generated')

    // click the Bill runs menu link
    cy.contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Supplementary and continue
    cy.get('label.govuk-radios__label').contains('Supplementary').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check the bill run
    cy.get('.govuk-button').contains('Create bill run').click()

    // Bill runs
    //
    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status READY, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Test Region supplementary bill run
    // check the details before sending the bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('[data-test="credits-count"]').should('contain.text', '1 credit note')
    cy.get('[data-test="debits-count"]').should('contain.text', '0 invoices')
  })
})
