'use strict'

describe('Create and send supplementary bill runs (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31. We then use that date to work out how many SROC billing periods we
    // expect to be calculated. We then deduct a year because the engine will bump the financial to the year of the last
    // sent annual bill run. In other tests our SROC test fixture creates an annual bill run in the current year. For
    // this test we use a fixture that creates it in the previous year. We then combine these results into one value for
    // use in our tests.
    cy.currentFinancialYearDate().then((currentFinancialYearInfo) => {
      cy.numberOfSrocBillingPeriods(currentFinancialYearInfo.year).then((numberOfBillingPeriods) => {
        currentFinancialYearInfo.billingPeriodCount = numberOfBillingPeriods - 1
        cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')
      })

      cy.fixture('sroc-billing.json').then((fixture) => {
        // Update the bill run in the fixture to be in the 'previous' financial year
        fixture.billRuns[0].fromFinancialYearEnding = currentFinancialYearInfo.year - 2
        fixture.billRuns[0].toFinancialYearEnding = currentFinancialYearInfo.year - 1

        cy.load(fixture)
      })
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates both the PRESROC and SROC supplementary bill runs in the current year where no annual exists', () => {
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

    // Bill runs
    //
    // The bill run we created will be the second from top result. We expect it's status to be BUILDING. Building might
    // take a few seconds though so to avoid the test failing we use our custom Cypress command to look for the status
    // READY, and if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-1"] > .govuk-tag', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-1"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-1"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-1"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="date-created-1"] > .govuk-link').click()

    // Test Region supplementary bill run
    // check the the financial end year is not the current year
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
      cy.get('[data-test="meta-data-year"]')
        .should('contain.text', `${currentFinancialYearInfo.year - 2} to ${currentFinancialYearInfo.year - 1}`)
    })
  })
})
