'use strict'

describe('Cancel an existing annual bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()
    // NOTE: Using 2PT test data in this test is intended. The supplementary test data inserts an Annual bill run that
    // confuses this test and its assertion that all bill runs for the test region have been deleted. The 2PT test data
    // doesn't add any bill runs so the test works
    cy.setUp('two-part-tariff-billing-data')
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('cancels an annual bill run that has already finished building', () => {
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
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status EMPTY, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('tr:nth-child(1) > td:nth-child(6) > .govuk-tag', 'Empty')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('tr:nth-child(1)')
        .should('contain.text', formattedCurrentDate)
        .and('contain.text', 'Test Region')
        .and('contain.text', 'Annual')
    })
    cy.get('tr:nth-child(1) > td:nth-child(1) > a').click()

    // Test Region annual bill run
    // quick test that the display is as expected and then click Cancel bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'empty')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Annual')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // check the details then click Cancel bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Annual')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // Bill runs
    // confirm we are back on the bill runs page
    cy.get('h1.govuk-heading-l').should('contain.text', 'Bill runs')
  })
})
