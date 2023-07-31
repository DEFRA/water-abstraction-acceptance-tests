'use strict'

describe('Reissue PRESROC bill in supplementary bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates both the PRESROC and SROC supplementary bill runs, confirms and sends PRESROC bill run, marks a bills in it for reissue then creates another supplementary bill run to confirm it has been reissued', () => {
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
    cy.log('Create, confirm and send a PRESROC supplementary bill run')

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

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we confirm the bill run
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('.govuk-button').contains('Confirm bill run').click()

    // You're about to send this bill run
    // click Send bill run
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region Supplementary bill run
    // spinner page displayed whilst the bill run is 'sending'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body > strong').should('contain.text', 'Sending')
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for old charge scheme')

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // -------------------------------------------------------------------------
    cy.log('Marking a bill for reissue')

    // Test Region supplementary bill run
    // confirm we see it is now SENT then click view for the first bill
    cy.get('#main-content > div:nth-child(1) > div > p > strong').should('contain.text', 'Sent')
    cy.get(':nth-child(1) > :nth-child(6) > .govuk-link').click()

    // Bill for Big Farm Co Ltd 02
    // expand the billing account details section and then click to view the billing account
    cy.get('div > details > summary > span').click()
    cy.get('div > details > div > p > a').click()

    // Billing account for Big Farm Co Ltd 02
    // confirm we can see the bill runs we just sent and then click Reissue a bill
    cy.get('div > table > caption').should('contain.text', 'Sent bills')
    cy.get('tbody > tr').should('have.length', 4)
    cy.get('p > a').contains('Reissue a bill').click()

    // What date do you need to reissue a bill from?
    // we use the current date to demonstrate the date is based on when the bill was created, not the billing period
    // the bill is for then click continue
    const currentDate = new Date()
    cy.get('input#fromDate-day').type(currentDate.getDate())
    cy.get('input#fromDate-month').type(currentDate.getMonth() + 1)
    cy.get('input#fromDate-year').type(currentDate.getFullYear())
    cy.get('.govuk-button').contains('Continue').click()

    // There are 4 bills available for reissue to Big Farm Co Ltd 02
    // confirm all 4 bills are returned then click the change link
    cy.get('#main-content > div > div > h1').should('contain.text', 'There are 4 bills available for reissue')
    cy.get('div:nth-child(2) > dd.govuk-summary-list__actions > a').contains('Change').click()

    // Select the bills you need to reissue
    // for the purposes of this test we only need to reissue one bill. Any more and we are just slowing down the
    // test. Untick the last 3 and continue
    cy.get('input#selectedBillIds-2').uncheck()
    cy.get('input#selectedBillIds-3').uncheck()
    cy.get('input#selectedBillIds-4').uncheck()
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
    cy.log('Create, confirm and send the PRESROC supplementary bill run that will reissue the bill')

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

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can check the rest of the details before confirming the bill run
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('#main-content > div:nth-child(2) > div > h2').should('contain.text', '£0.00')
    cy.get('.govuk-heading-l').should('contain.text', '2 supplementary bills')
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
      .should('contain.text', 'Gathering transactions for old charge scheme')

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region supplementary bill run
    // confirm we see it is now SENT then click view for the first bill
    cy.get('#main-content > div:nth-child(1) > div > p > strong').should('contain.text', 'Sent')
    cy.get(':nth-child(1) > :nth-child(6) > .govuk-link').click()

    // -------------------------------------------------------------------------
    cy.log('Confirm link to previous bill is displayed')

    // Bill for Big Farm Co Ltd 02
    // confirm we see the reissue section when viewing the bill
    cy.get('.govuk-inset-text > .govuk-heading-m').should('contain.text', 'This bill is linked to a reissue')
  })
})
