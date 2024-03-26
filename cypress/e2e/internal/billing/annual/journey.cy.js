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
    cy.get('label.govuk-radios__label').contains('Annual').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

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
        .and('contain.text', 'Annual')
    })
    cy.get('tr:nth-child(1) > td:nth-child(1) > a').click()

    // Test Region annual bill run
    // quick test that the display is as expected and then click Send bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="bill-total"]').should('contain.text', '£2,171.00')
    cy.get('[data-test="water-companies"]').should('exist')
    cy.get('[data-test="other-abstractors"]').should('not.exist')
    cy.get('.govuk-button').contains('Send bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Annual')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region annual bill run
    //
    // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this step
    // is so fast the test will fail because it doesn't see the element

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 60000 }).should('contain.text', 'Bill run sent')
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
