'use strict'

describe('Change billing account in previous financial year (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31. We then use that date to work out how many SROC billing periods we
    // expect to be calculated. We combine these results into one value for use in our tests
    cy.currentFinancialYearDate().then((currentFinancialYearInfo) => {
      cy.billingPeriodCounts(currentFinancialYearInfo.year).then((billingPeriodCount) => {
        currentFinancialYearInfo.billingPeriodCounts = billingPeriodCount
        cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')
      })

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

  it('creates both the PRESROC and SROC supplementary bill runs and once built sends the SROC bill run then adds a new charge version with a new billing account and creates a new SROC bill run and confirms previous account is credited', () => {
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
      cy.get('[data-test="date-created-1"] > .govuk-link').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-1"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-1"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="date-created-1"] > .govuk-link').click()

    // Test Region supplementary bill run
    // check the details before sending the bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const billingPeriodCount = currentFinancialYearInfo.billingPeriodCounts.sroc
      if (billingPeriodCount === 1) {
        cy.get('[data-test="bills-count"]')
          .should('contain.text', '1 Supplementary bill')
      } else {
        cy.get('[data-test="bills-count"]')
          .should('contain.text', `${billingPeriodCount} Supplementary bills`)
      }
    })
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
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region supplementary bill run
    // confirm we see it is now SENT
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'sent')

    // click the back link to go to bill runs
    cy.get('.govuk-back-link').click()

    // Bill runs
    // back on the bill runs page confirm our SROC bill run is present and listed as SENT
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-1"] > .govuk-link').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-1"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-1"]').should('contain.text', 'Supplementary')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const billingPeriodCount = currentFinancialYearInfo.billingPeriodCounts.sroc
      cy.get('[data-test="number-of-bills-1"]').should('contain.text', billingPeriodCount)
    })
    cy.get('[data-test="bill-run-status-1"] > .govuk-tag').should('contain.text', 'sent')

    // -------------------------------------------------------------------------

    // click the Search menu link
    cy.get('#nav-search').click()

    // Search
    // search for a licence and select it
    cy.get('#query').type('AT/TEST/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // click the licence set up tab
    cy.contains('Licence set up').click()

    // set up a new charge for the previous financial year to change the billing account
    cy.contains('Set up a new charge').click()
    cy.get('.govuk-radios > :nth-child(1) > #reason').click()
    cy.get('form > .govuk-button').click()

    // Set charge start date
    // set a charge start date of the 1st June in the previous financial year
    cy.get('#startDate-4').click()
    cy.currentFinancialYearDate(1, 6, -2).then((result) => {
      cy.get('#customDate-day').type(result.day)
      cy.get('#customDate-month').type(result.month)
      cy.get('#customDate-year').type(result.year)
    })
    cy.get('form > .govuk-button').click()

    // Who should the bills go to?
    // search for Big Farm Co Ltd 01
    cy.get('#account-2').click()
    cy.get('#accountSearch').type('Big Farm Co Ltd 01')
    cy.get('form > .govuk-button').click()

    // Does this account already exist?
    // choose Big Farm Co Ltd 01 and continue
    cy.get('.govuk-radios > :nth-child(1) > #companyId').click()
    cy.get('form > .govuk-button').click()

    // Select an existing address for Big Farm Co Ltd 01
    // choose the Big Farm address and continue
    cy.get('.govuk-radios > :nth-child(1) > #selectedAddress').click()
    cy.get('form > .govuk-button').click()

    // Do you need to add an FAO?
    // choose No and continue
    cy.get('#faoRequired-2').click()
    cy.get('form > .govuk-button').click()

    // Check billing account details
    // click confirm
    cy.get('form > .govuk-button').click()

    // Use abstraction data to set up the element?
    // choose Use charge information valid from 1 April 2022 and continue
    cy.get('#useAbstractionData-5').click()
    cy.get('form > .govuk-button').click()

    // Check charge information
    // click confirm
    cy.get('.govuk-button').contains('Confirm').click()

    // Charge information complete
    // click View charge information link
    cy.get(':nth-child(7) > .govuk-link').click()

    // Charge information
    // click review link
    cy.get(':nth-child(1) > :nth-child(5) > .govuk-link').click()

    // Do you want to approve this charge information?
    // choose Yes, approve and continue
    cy.get('.govuk-radios > :nth-child(1) > #reviewOutcome').click()
    cy.get('.govuk-button').contains('Continue').click()

    // click the Bill runs menu link
    cy.contains('Bill runs').click()

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

    // -------------------------------------------------------------------------
    cy.log('Confirming and sending the SROC supplementary bill run')

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
    cy.get('[data-test="credits-count"]').should('contain.text', '2 credit notes')
    cy.get('[data-test="debits-count"]').should('contain.text', '2 invoices')
    // NOTE: We cannot assert the new billing account number because it will be different in each environment and
    // unpredictable because the new number is based on existing data
    // We also can assert exactly what the total will be because it can differ year to year depending on whether we have
    // a leap year or not.
    cy.get('[data-test="billing-contact-0"]').should('contain.text', 'Big Farm Co Ltd 02')
    cy.get('[data-test="licence-0"]').should('contain.text', 'AT/TEST/02')

    cy.get('[data-test="billing-contact-1"]').should('contain.text', 'Big Farm Co Ltd 02')
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/02')

    cy.get('[data-test="billing-contact-2"]').should('contain.text', 'Big Farm Co Ltd 01')
    cy.get('[data-test="licence-2"]').should('contain.text', 'AT/TEST/02')

    cy.get('[data-test="billing-contact-3"]').should('contain.text', 'Big Farm Co Ltd 01')
    cy.get('[data-test="licence-3"]').should('contain.text', 'AT/TEST/02')
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
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region supplementary bill run
    // confirm we see it is now SENT
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'sent')

    // click the back link to go to bill runs
    cy.get('.govuk-back-link').click()

    // Bill runs
    // back on the bill runs page confirm our SROC bill run is present and listed as SENT
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="number-of-bills-0"]').should('contain.text', '4')
    cy.get('[data-test="bill-run-total-0"]').should('contain.text', '£0.00')
    cy.get('[data-test="bill-run-status-0"] > .govuk-tag').should('contain.text', 'sent')
  })
})
