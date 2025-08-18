'use strict'

describe('Cancel existing supplementary bill runs (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.currentFinancialYear().then((currentFinancialYearInfo) => {
      cy.fixture('sroc-billing.json').then((fixture) => {
        // Update the bill run in the fixture to be in the 'current' financial year
        fixture.billRuns[0].fromFinancialYearEnding = currentFinancialYearInfo.end.year - 1
        fixture.billRuns[0].toFinancialYearEnding = currentFinancialYearInfo.end.year

        cy.load(fixture)
      })
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('cancels both the PRESROC and SROC supplementary bill runs once they have finished building', () => {
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

    // -------------------------------------------------------------------------
    cy.log('Deleting the PRESROC supplementary bill run')

    // Bill runs
    //
    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status READY, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate).and('contain.text', 'Old charge scheme')
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Test Region supplementary bill run
    // quick test that the display is as expected and then click Cancel bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Old')
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // check the details then click Cancel bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Old')
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // Bill runs
    // confirm we are back on the bill runs page
    cy.get('.govuk-heading-l').should('contain.text', 'Bill runs')

    // -------------------------------------------------------------------------
    cy.log('Deleting the SROC supplementary bill run')

    // Bill runs
    //
    // The bill run we created will be the top result. We expect it's status to be CANCELLING. Cancelling might take a
    // few seconds though so to avoid the test failing we use our custom Cypress command to look for the status READY,
    // and if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'ready')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Test Region supplementary bill run
    // quick test that the display is as expected and then click Cancel bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // check the details then click Cancel bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // Bill runs
    // confirm we are back on the bill runs page
    cy.get('.govuk-heading-l').should('contain.text', 'Bill runs')
  })
})
