'use strict'

describe('Reissue SROC bill in supplementary bill run (internal)', () => {
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

  it('creates both the PRESROC and SROC supplementary bill runs and once built sends the SROC bill run then adds a new charge version with a new billing account and creates a new SROC bill run and confirms previous account is credited', () => {
    cy.visit('/')

    // Enter the user name and Password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })
    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // Click Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Assert the user signed in and we're on the search page
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

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // we immediately select the SROC bill run. We don't expect it to be ready and to hit the spinner page but it
    // might be super quick and already done. So we do no checks at this point
    cy.get('tr:nth-child(2) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can confirm the bill run is a credit as expected
    cy.get('.govuk-body > .govuk-tag', { timeout: 20000 }).should('contain.text', 'ready')

    // check the details before confirming the bill run
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

    // click the Search menu link
    cy.get('#navbar-view').click()

    // Search
    // search for a licence and select it
    cy.get('#query').type('AT/SROC/SUPB/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row > :nth-child(1) > a').click()

    // [title]
    // Select the bills tab
    cy.get('#tab_bills').click()

    // Select the billing account
    cy.get('.govuk-table__body > :nth-child(1) > :nth-child(3) > a').click()

    // Reissue the bill
    cy.get('p > .govuk-button').click()

    // What date do you need to reissue a bill from?
    // we use the current date to demonstrate the date is based on when the bill was created, not the billing period
    // the bill is for then click continue
    const currentDate = new Date()
    cy.get('input#fromDate-day').type(currentDate.getDate())
    cy.get('input#fromDate-month').type(currentDate.getMonth() + 1)
    cy.get('input#fromDate-year').type(currentDate.getFullYear())
    cy.get('.govuk-button').contains('Continue').click()

    // There are 2 bills available for reissue to Big Farm Co Ltd 02
    // confirm both bills are returned then click the change link
    cy.get('#main-content > div > div > h1').should('contain.text', 'There are 2 bills available for reissue')
    cy.get('div:nth-child(2) > dd.govuk-summary-list__actions > a').contains('Change').click()

    // Select the bills you need to reissue
    // for the purposes of this test we only need to reissue one bill. Any more and we are just slowing down the
    // test. Untick the second one and continue
    cy.get('input#selectedBillIds-2').uncheck()
    cy.get('.govuk-button').contains('Continue').click()

    // There is 1 bill available for reissue to Big Farm Co Ltd 02
    // confirm just 1 bill is now selected then click confirm
    cy.get('#main-content > div > div > h1').should('contain.text', 'There is 1 bill available for reissue')
    cy.get('.govuk-button').contains('Confirm').click()

    // You’ve marked 1 bill for reissue
    // confirmation that we have selected 1 bill for reissue. Click create a supplementary bill run
    cy.get('#main-content > div > div > div > h1').should('contain.text', 'You’ve marked 1 bill for reissue')
    cy.get('#main-content > div > div > a').contains('Create a supplementary bill run').click()

    // -------------------------------------------------------------------------
    cy.log('Create, confirm and send the SROC supplementary bill run that will reissue the bill')

    // Which kind of bill run do you want to create?
    // choose Supplementary and continue
    cy.get('input#selectedBillingType-2').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // "There is already a bill run in progress for this region" -- which is the old scheme bill run
    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // The sroc bill run we created should be the top result. Once it has finished building its status will be `Ready`
    // so we reload until the text is present.
    cy.reloadUntilTextFound('tr:nth-child(1) > td:nth-child(6) > strong', 'Ready')

    // We verify the row contains the expected data then click to continue.
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Supplementary')
        .and('contain.text', '2')
        .and('contain.text', '£0.00')
    })
    cy.get('tr:nth-child(1) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can check the rest of the details before confirming the bill run
    cy.get('.govuk-body > .govuk-tag', { timeout: 20000 }).should('contain.text', 'ready')
    cy.get('[data-test="bill-total"]').should('contain.text', '£0.00')
    cy.get('[data-test="bills-count"]').should('contain.text', '2 Supplementary bills')
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
    // confirm we see it is now SENT then click view for the first bill
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'sent')
    cy.get(':nth-child(1) > :nth-child(6) > .govuk-link').click()
  })
})
