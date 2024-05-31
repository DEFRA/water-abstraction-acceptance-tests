'use strict'

describe('Create a empty SROC twp-part tariff bill run (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    cy.fixture('users.json').its('billingAndData1').as('userEmail')

    cy.fixture('sroc-two-part-tariff.json').then((fixture) => {
      cy.load(fixture)
    })

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates an empty SROC two-part tariff bill run and cancels it', () => {
    cy.visit('/')

    // Enter the user name and password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })

    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // Click the Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    //  Assert the user signed in and we're on the search page
    cy.contains('Search')

    // click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

    // Bill runs
    // click the Create a bill run button
    cy.get('.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // choose Two-part tariff then continue
    cy.get('label.govuk-radios__label').contains('Two-part tariff').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the financial year
    // choose 2021 to 2022 and continue
    cy.get('label.govuk-radios__label').contains('2023 to 2024').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status EMPTY, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'empty')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Two-part tariff')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Test Region two-part tariff bill run
    // quick test that the display is as expected and then click Cancel bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'empty')
    cy.get('[data-test="error-notification"]').should('exist')
    cy.get('[data-test="error-notification"]').should('contain.text', 'There are no licences ready for this bill run')
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // You're about to cancel this bill run
    // check the details then click Cancel bill run
    cy.get('h1').should('contain.text', "You're about to cancel this bill run")
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Two-part tariff')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('.govuk-button').contains('Cancel bill run').click()

    // Bill runs
    // confirm we are back on the bill runs page
    cy.get('.govuk-heading-xl').should('contain.text', 'Bill runs')
    cy.get('.govuk-notification-banner__heading').should('contain.text', 'Bill runs are currently busy building and cancelling.')
  })
})
