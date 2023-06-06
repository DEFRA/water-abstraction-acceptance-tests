'use strict'

describe('Create and send supplementary bill runs (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates both the PRESROC and SROC supplementary bill runs and once built sends them', () => {
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

    // -------------------------------------------------------------------------
    cy.log('Confirming and sending the PRESROC supplementary bill run')

    // Test Region supplementary bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can check the rest of the details before confirming the bill run
    cy.get('#main-content > div:nth-child(1) > div > p > strong', { timeout: 20000 }).should('contain.text', 'Ready')
    cy.get('#main-content > div:nth-child(2) > div > h2').should('contain.text', '£582.11')
    cy.get('#main-content > div:nth-child(4) > div > h2').should('contain.text', '4 supplementary bills')
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
        .and('contain.text', 'Supplementary')
        .and('contain.text', '£582.11')
        .and('contain.text', 'Sent')
    })

    // -------------------------------------------------------------------------
    cy.log('Confirming and sending the SROC supplementary bill run')

    // select the SROC bill run
    cy.get('tr:nth-child(2) > td:nth-child(1) > a').click()

    // Test Region supplementary bill run
    // check the details before confirming the bill run
    cy.get('#main-content > div:nth-child(1) > div > p > strong').should('contain.text', 'Ready')
    cy.get('#main-content > div:nth-child(2) > div > h2').should('contain.text', '£97.00')
    cy.get('#main-content > div:nth-child(4) > div > h2').should('contain.text', '1 supplementary bill')
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
    // confirm we see it is now SENT
    cy.get('#main-content > div:nth-child(1) > div > p > strong').should('contain.text', 'Sent')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // back on the bill runs page confirm our SROC bill run is present and listed as SENT
    cy.dayMonthYearFormattedDate().then((formattedDate) => {
      cy.get('#main-content > div:nth-child(5) > div > table > tbody > tr:nth-child(2)')
        .should('contain.text', formattedDate)
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Supplementary')
        .and('contain.text', '£97.00')
        .and('contain.text', 'Sent')
    })
  })
})