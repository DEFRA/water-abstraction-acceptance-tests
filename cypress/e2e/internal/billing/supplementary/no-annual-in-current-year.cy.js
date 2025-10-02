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
    cy.currentFinancialYear().then((currentFinancialYearInfo) => {
      // NOTE: We minus 1 here to reflect that, for example, 2025/26 might be the current financial year, but because
      // the annual has not been generated the financial year to use for the counts is 2024/25
      cy.billingPeriodCounts(currentFinancialYearInfo.end.year - 1).then((billingPeriodCount) => {
        currentFinancialYearInfo.billingPeriodCounts = billingPeriodCount
        cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')
      })

      cy.fixture('sroc-billing.json').then((fixture) => {
        // Update the bill run in the fixture to be in the 'previous' financial year
        fixture.billRuns[0].fromFinancialYearEnding = currentFinancialYearInfo.end.year - 2
        fixture.billRuns[0].toFinancialYearEnding = currentFinancialYearInfo.end.year - 1

        cy.load(fixture)
      })
    })

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates both the PRESROC and SROC supplementary bill runs in the current year where no annual exists', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/system/bill-runs')

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
    cy.get('#main-content > p > .govuk-tag').should('contain.text', 'ready')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const billingPeriodCount = currentFinancialYearInfo.billingPeriodCounts.sroc
      if (billingPeriodCount === 1) {
        cy.get('[data-test="bills-count"]')
          .should('contain.text', '1 Supplementary bill')
      } else {
        cy.get('[data-test="bills-count"]')
          .should('contain.text', `${billingPeriodCount} Supplementary bills`)
      }
      cy.get('[data-test="meta-data-year"]')
        .should('contain.text', `${currentFinancialYearInfo.end.year - 2} to ${currentFinancialYearInfo.end.year - 1}`)
    })
  })
})
