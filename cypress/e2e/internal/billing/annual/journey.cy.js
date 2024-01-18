'use strict'

describe('Create and send annual bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.setUp('sroc-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates an SROC annual bill run and once built confirms and sends it', () => {
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
    // choose Annual and continue
    cy.get('input#selectedBillingType').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('input#selectedBillingRegion-9').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Test Region Annual bill run
    // spinner page displayed whilst the bill run is 'building'. Confirm we're on it
    cy.get('#main-content > div:nth-child(2) > div > p.govuk-body-l')
      .should('contain.text', 'The bill run is being created. This may take a few minutes.')
    cy.get('#main-content > div:nth-child(7) > div > p')
      .should('contain.text', 'Gathering transactions for current charge scheme')

    // Test Region annual bill run
    // we have to wait till the bill run has finished generating. The thing we wait on is the READY label. Once that
    // is present we can check the rest of the details before confirming the bill run
    cy.get('.govuk-body > .govuk-tag', { timeout: 20000 }).should('contain.text', 'ready')
    cy.get('[data-test="bill-total"]').should('contain.text', '£2,171.00')
    cy.get('[data-test="water-companies"]').should('exist')
    cy.get('[data-test="other-abstractors"]').should('not.exist')
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
      cy.get('div:nth-child(3) > dd').should('contain.text', 'Annual')
      // status
      cy.get('div:nth-child(4) > dd').should('contain.text', 'Ready')
    })
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region annual bill run
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

    // Test Region annual bill run
    // confirm we see it is now SENT
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'sent')

    // click the back link to go to bill runs
    cy.get('.govuk-back-link').click()

    // Bill runs
    // back on the bill runs page confirm our bill run is present and listed as SENT
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('#main-content > div:nth-child(5) > div > table > tbody > tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Annual')
        .and('contain.text', '2,171.00')
        .and('contain.text', 'Sent')
    })
  })
})
