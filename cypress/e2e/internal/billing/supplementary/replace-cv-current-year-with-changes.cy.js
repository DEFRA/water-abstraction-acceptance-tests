'use strict'

describe('Replace charge version in current financial year change the charge reference and add adjustments and additional charges (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-supplementary-current')
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31. We then use that date to work out how many SROC billing periods we
    // expect to be calculated. We combine these results into one value for use in our tests
    cy.currentFinancialYearDate().then((currentFinancialYearInfo) => {
      cy.numberOfSrocBillingPeriods(currentFinancialYearInfo.year).then((numberOfBillingPeriods) => {
        currentFinancialYearInfo.billingPeriodCount = numberOfBillingPeriods
        cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')
      })
    })
  })

  it('creates both the PRESROC and SROC supplementary bill runs and once built sends the SROC bill run then adds a new charge version in the current FY with changes, creates a new SROC bill run and confirms details of bill run', () => {
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
    cy.log('Replacing initial Charge Version')
    // There is currently an issue with the initial Charge Version that is created by the service that prevents it from
    // being replaced with the same billing account, which is essential for this test. As a work around the initial
    // charge version that was created in the test data is going to be replaced entirely before the initial bill run.
    // This will then enable the subsequent Charge Version to be created with the same billing account.

    // click the Search menu link
    cy.get('#navbar-view').click()

    // Search
    // search for a licence and select it
    cy.get('#query').type('AT/SROC/SUPB/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // click the Charge information link
    cy.get('#tab_charge').click()

    // set up a new replacement charge making no changes. This will correct the issue with the billing account
    cy.get('#charge > a.govuk-button').contains('Set up a new charge').click()
    cy.get('#reason-8').click()
    cy.get('form > .govuk-button').click()

    // Set charge start date
    // set a charge start date of the 1st April 2022 to replace the existing charge
    cy.get('#startDate-4').click()
    cy.get('#customDate-day').type(1)
    cy.get('#customDate-month').type(4)
    cy.get('#customDate-year').type(2022)
    cy.get('form > .govuk-button').click()

    // Who should the bills go to?
    // select the current contact Big Farm Co Ltd 02
    cy.get('.govuk-radios > :nth-child(1) > #account').click()
    cy.get('form > .govuk-button').click()

    // Select an existing address for Big Farm Co Ltd 02
    // select the Big Farm address
    cy.get('.govuk-radios > :nth-child(1) > #selectedAddress').click()
    cy.get('form > .govuk-button').click()

    // Do you need to add an FAO?
    // select No
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

    // -------------------------------------------------------------------------
    cy.log('Creating, confirming and sending the SROC supplementary bill run')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('#main-content > a.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Supplementary and continue
    cy.get('label.govuk-radios__label').contains('Supplementary').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Bill runs
    //
    // The bill run we created will be the second from top result. We expect it's status to be BUILDING. Building might
    // take a few seconds though so to avoid the test failing we use our custom Cypress command to look for the status
    // READY, and if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('tr:nth-child(2) > td:nth-child(6) > .govuk-tag', 'Ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Supplementary')
    })
    cy.get('tr:nth-child(2) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // check the details before sending the bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const { billingPeriodCount } = currentFinancialYearInfo
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
    cy.get('#main-content > div:nth-child(5) > div > table > tbody > tr:nth-child(2)').within(() => {
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('td:nth-child(1)').should('contain.text', formattedCurrentDate)
      })

      cy.get('td:nth-child(2)').should('contain.text', 'Test Region')
      cy.get('td:nth-child(3)').should('contain.text', 'Supplementary')

      cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
        cy.get('td:nth-child(4)').should('contain.text', currentFinancialYearInfo.billingPeriodCount)
      })

      cy.get('td:nth-child(6)').should('contain.text', 'Sent')
    })

    // -------------------------------------------------------------------------
    cy.log('Setting up a new charge changing the charge volume and adding adjustments and additional charges then creating a supplementary bill run')

    // click the Search menu link
    cy.get('#navbar-view').click()

    // Search
    // search for a licence and select it
    cy.get('#query').type('AT/SROC/SUPB/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // click the Charge information link
    cy.get('#tab_charge').click()

    // set up a new charge for the current FY changing the charge and adding adjustments and additional charges
    cy.get('#charge > a.govuk-button').contains('Set up a new charge').click()
    cy.get('#reason-8').click()
    cy.get('form > .govuk-button').click()

    // Set charge start date
    // set a charge start date of the 1st April in the current financial year
    cy.get('#startDate-4').click()
    cy.currentFinancialYearDate(1, 9, -1).then((result) => {
      cy.get('#customDate-day').type(result.day)
      cy.get('#customDate-month').type(result.month)
      cy.get('#customDate-year').type(result.year)
    })
    cy.get('form > .govuk-button').click()

    // Select an existing billing account for Big Farm Co Ltd 02
    // select the current billing account S00000007A - Big Farm Co Ltd 02
    cy.get('.govuk-radios > :nth-child(1) > #billingAccountId').click()
    cy.get('form > .govuk-button').click()

    // Use abstraction data to set up the element?
    // choose Use charge information valid from 1 April 2022 and continue
    cy.get('#useAbstractionData-5').click()
    cy.get('form > .govuk-button').click()

    // Check charge information
    // click the change link for Volume
    cy.get(':nth-child(5) > :nth-child(5) > .govuk-summary-list__actions > .govuk-link').click()

    // Enter the total quantity to use for this charge reference
    // change the volume from 100ML to 1000ML by adding a zero
    cy.get('#volume').type(0)
    cy.get('form > .govuk-button').click()

    // Check charge information
    // click the change link for Additional charges apply
    cy.get(':nth-child(8) > .govuk-summary-list__actions > .govuk-link').click()

    // Do additional charges apply?
    // choose Yes and continue
    cy.get('.govuk-radios > :nth-child(1) > #isAdditionalCharges').click()
    cy.get('form > .govuk-button').click()

    // Is abstraction from a supported source?
    // choose Yes and continue
    cy.get('.govuk-radios > :nth-child(1) > #isSupportedSource').click()
    cy.get('form > .govuk-button').click()

    // Select the name of the supported source
    // choose Earl Soham - Deben and continue
    cy.get('#supportedSourceId-2').click()
    cy.get('form > .govuk-button').click()

    // Is abstraction for the supply of public water?
    // choose No and continue
    cy.get('#isSupplyPublicWater-2').click()
    cy.get('form > .govuk-button').click()

    // Check charge information
    // click the change link for Adjustments apply
    cy.get(':nth-child(9) > .govuk-summary-list__actions > .govuk-link').click()

    // Do adjustments apply?
    // choose Yes and continue
    cy.get('.govuk-radios > :nth-child(1) > #isAdjustments').click()
    cy.get('form > .govuk-button').click()

    // Which adjustments apply?
    // select Winter discount and continue
    cy.get('#adjustments-3').click()
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
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('#main-content > a.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Supplementary and continue
    cy.get('label.govuk-radios__label').contains('Supplementary').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // -------------------------------------------------------------------------
    cy.log('Confirming and sending the SROC supplementary bill run')

    // Bill runs
    //
    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status READY, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('tr:nth-child(1) > td:nth-child(6) > .govuk-tag', 'Ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Supplementary')
    })
    cy.get('tr:nth-child(1) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm the bill run is as expected
    cy.get('.govuk-body > .govuk-tag', { timeout: 20000 }).should('contain.text', 'ready')

    // Test Region supplementary bill run
    // check the details before sending the bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('[data-test="bill-total"]').should('contain.text', '£3,567.70')
    cy.get('[data-test="bills-count"]').should('contain.text', '1 Supplementary bill')
    // NOTE: We cannot assert the new billing account number because it will be different in each environment and
    // unpredictable because the new number is based on existing data
    cy.get('[data-test="billing-contact-0"]').should('contain.text', 'Big Farm Co Ltd 02')
    cy.get('[data-test="licence-0"]').should('contain.text', 'AT/SROC/SUPB/02')
    cy.currentFinancialYearDate().then((result) => {
      cy.get('[data-test="financial-year-0"]').should('contain.text', result.year)
    })
    cy.get('[data-test="total-0"]').should('contain.text', '£3,567.70')
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
      cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain.text', formattedCurrentDate)
    })
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(2)').should('contain.text', 'Test Region')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(3)').should('contain.text', 'Supplementary')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(4)').should('contain.text', '1')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(5)').should('contain.text', '£3,567.70')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(6)').should('contain.text', 'Sent')

    // select the bill run to check the adjustments and additional charges have been applied
    cy.get(':nth-child(1) > :nth-child(1) > .govuk-link').click()

    // Test Region supplementary bill run
    // click the View link
    cy.get(':nth-child(6) > .govuk-link').click()

    // Bill for Big Farm Co Ltd 02
    // check the debits, credits, adjustments and additional charges have been applied
    cy.get('[data-test="credits-total"]').should('contain.text', '£97.00')
    cy.get('[data-test="debits-total"]').should('contain.text', '£3,664.70')
    cy.get('[data-test="bill-total"]').should('contain.text', '£3,567.70')
    cy.get('[data-test="additional-charges-0"]').should('contain.text', 'Supported source Earl Soham - Deben (£10696.00)')
    cy.get('[data-test="adjustments-0"]').should('contain.text', 'Winter discount (0.5)')

    cy.get('[data-test="billable-days-0"]').should('contain.text', '212/365')
    cy.get('[data-test="quantity-0"]').should('contain.text', '1000ML')
    cy.get('[data-test="debit-0"]').should('contain.text', '£3,624.04')

    cy.get('[data-test="billable-days-1"]').should('contain.text', '365/365')
    cy.get('[data-test="quantity-1"]').should('contain.text', '100ML')
    cy.get('[data-test="credit-1"]').should('contain.text', '£97.00')

    cy.get('[data-test="billable-days-2"]').should('contain.text', '153/365')
    cy.get('[data-test="quantity-2"]').should('contain.text', '100ML')
    cy.get('[data-test="debit-2"]').should('contain.text', '£40.66')
  })
})
