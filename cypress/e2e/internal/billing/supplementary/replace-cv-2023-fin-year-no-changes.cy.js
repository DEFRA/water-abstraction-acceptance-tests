'use strict'

describe('Replace charge version in the 2023 financial year with no changes (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-data')
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

  it('creates both the PRESROC and SROC supplementary bill runs and once built sends the SROC bill run then adds a new charge version in the 2023 FY with no changes and creates a new SROC bill run and confirms zero value bill run', () => {
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
    cy.get('input#selectedBillingType-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // we immediately select the SROC bill run. We don't expect it to be ready and to hit the spinner page but it
    // might be super quick and already done. So we do no checks at this point
    cy.get('tr:nth-child(2) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm the bill run is a credit as expected
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')

    // check the details before confirming the bill run
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const { billingPeriodCount } = currentFinancialYearInfo
      if (billingPeriodCount === 1) {
        cy.get('#main-content > div:nth-child(4) > div > h2')
          .should('contain.text', '1 supplementary bill')
      } else {
        cy.get('#main-content > div:nth-child(4) > div > h2')
          .should('contain.text', `${billingPeriodCount} supplementary bills`)
      }
    })
    cy.get('.govuk-button').contains('Confirm bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('dl').within(() => {
      // date created
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Supplementary')
      // status
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Ready')
    })
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region Supplementary bill run
    // spinner page displayed whilst the bill run is 'sending'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body > strong').should('contain.text', 'Sending')
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for current charge scheme')

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region supplementary bill run
    // confirm we see it is now SENT
    cy.get('#main-content > div:nth-child(1) > div > p > strong').should('contain.text', 'Sent')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

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
    cy.log('Setting up a new charge in 2023 Financial Year with no changes, then creating a supplementary bill run')

    // click the Search menu link
    cy.get('#navbar-view').click()

    // Search
    // search for a licence and select it
    cy.get('#query').type('AT/SROC/SUPB/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // click the Charge information link
    cy.get('#tab_charge').click()

    // set up a new charge for the 2023 financial year that doesn't change anything
    cy.get('#charge > a.govuk-button').contains('Set up a new charge').click()
    cy.get('#reason-8').click()
    cy.get('form > .govuk-button').click()

    // Set charge start date
    // set a charge start date of the 1st September 2022
    cy.get('#startDate-4').click()
    cy.get('#customDate-day').type(1)
    cy.get('#customDate-month').type(9)
    cy.get('#customDate-year').type(2022)
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
    cy.get('input#selectedBillingType-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // -------------------------------------------------------------------------
    cy.log('Confirming and sending the SROC supplementary bill run')

    // Bill runs
    // we immediately select the SROC bill run. We don't expect it to be finished and to hit the spinner page but it
    // might be super quick and already done. So we do no checks at this point
    cy.get(':nth-child(1) > :nth-child(1) > .govuk-link').click()

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm the bill run is as expected
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')

    // check the details and then click Confirm bill run
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
    cy.get(':nth-child(2) > .govuk-grid-column-two-thirds').should('contain.text', '£0.00')
    cy.get('.govuk-heading-l').should('contain.text', '1 supplementary bill')
    cy.get('.govuk-table__body > .govuk-table__row > :nth-child(1)').should('contain.text', 'S00000007A')
    cy.get('.govuk-table__body > .govuk-table__row > :nth-child(2)').should('contain.text', 'Big Farm Co Ltd 02')
    cy.get('.govuk-table__body > .govuk-table__row > :nth-child(3)').should('contain.text', 'AT/SROC/SUPB/02')
    cy.get('.govuk-table__body > .govuk-table__row > :nth-child(4)').should('contain.text', '2023')
    cy.get('.govuk-table__body > .govuk-table__row > :nth-child(5)').should('contain.text', '£0.00')
    cy.get('.govuk-button').contains('Confirm bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('dl').within(() => {
      // date created
      cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
        cy.get('div:nth-child(1) > dd').should('contain.text', formattedCurrentDate)
      })
      // region
      cy.get('div:nth-child(2) > dd').should('contain.text', 'Test Region')
      // bill run type
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Supplementary')
      // status
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Ready')
    })
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region Supplementary bill run
    // spinner page displayed whilst the bill run is 'sending'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body > strong').should('contain.text', 'Sending')
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for current charge scheme')

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region supplementary bill run
    // confirm we see it is now SENT
    cy.get('#main-content > div:nth-child(1) > div > p > strong').should('contain.text', 'Sent')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // back on the bill runs page confirm our zero value SROC bill run is present and listed as SENT
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('.govuk-table__body > :nth-child(1) > :nth-child(1)').should('contain.text', formattedCurrentDate)
    })
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(2)').should('contain.text', 'Test Region')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(3)').should('contain.text', 'Supplementary')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(4)').should('contain.text', '0')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(5)').should('contain.text', '£0.00')
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(6)').should('contain.text', 'Sent')
  })
})
