'use strict'

describe('Create and send supplementary bill runs (internal)', () => {
  beforeEach(() => {
    cy.tearDown()

    // Work out current financial year info using the current date. So, what the end year will be. As we don't override
    // day and month we'll get back 20XX-03-31. We then use that date to work out how many SROC billing periods we
    // expect to be calculated. We combine these results into one value for use in our tests
    cy.currentFinancialYear().then((currentFinancialYearInfo) => {
      cy.billingPeriodCounts(currentFinancialYearInfo.end.year).then((billingPeriodCount) => {
        currentFinancialYearInfo.billingPeriodCounts = billingPeriodCount
        cy.wrap(currentFinancialYearInfo).as('currentFinancialYearInfo')
      })

      cy.fixture('sroc-billing.json').then((fixture) => {
        // Update the bill run in the fixture to be in the 'current' financial year
        fixture.billRuns[0].fromFinancialYearEnding = currentFinancialYearInfo.end.year - 1
        fixture.billRuns[0].toFinancialYearEnding = currentFinancialYearInfo.end.year

        cy.wrap(fixture.licences[1].id).as('licenceId')

        cy.load(fixture)
      })
    })

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates both the PRESROC and SROC supplementary bill runs and once built sends them', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.get('@licenceId').then((licenceId) => {
      cy.visit(`/system/licences/${licenceId}/summary`)
    })

    // Confirm the licence has the correct flags (we will check these have been removed after the bill runs have been sent)
    cy.get('.govuk-notification-banner__content')
      .should('contain.text', 'This licence has been marked for the next supplementary bill runs for the current and old charge schemes.')

    // click the Bill runs menu link
    cy.get('#nav-bill-runs').contains('Bill runs').click()

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
    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status READY, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'ready')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // -------------------------------------------------------------------------
    cy.log('Confirming and sending the PRESROC supplementary bill run')

    // Test Region supplementary bill run
    // quick test that the display is as expected and then click Send bill run
    cy.get('#main-content > p > .govuk-tag').should('contain.text', 'ready')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const billingPeriodCount = currentFinancialYearInfo.billingPeriodCounts.presroc
      if (billingPeriodCount === 1) {
        cy.get('[data-test="bills-count"]')
          .should('contain.text', '1 Supplementary bill')
      } else {
        cy.get('[data-test="bills-count"]')
          .should('contain.text', `${billingPeriodCount} Supplementary bills`)
      }
    })
    cy.get('.govuk-button').contains('Send bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Old')
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region Supplementary bill run spinner page
    //
    // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this step
    // is so fast the test will fail because it doesn't see the element

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region supplementary bill run
    // confirm we see it is now SENT
    cy.get('#main-content > p > .govuk-tag').should('contain.text', 'sent')

    // click the back link to go to bill runs
    cy.get('.govuk-back-link').click()

    // Bill runs
    // back on the bill runs page confirm our PRESROC bill run is present and listed as SENT
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate).and('contain.text', 'Old charge scheme')
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Supplementary')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const billingPeriodCount = currentFinancialYearInfo.billingPeriodCounts.presroc
      cy.get('[data-test="number-of-bills-0"]').should('contain.text', billingPeriodCount)
    })
    cy.get('[data-test="bill-run-status-0"] > .govuk-tag').should('contain.text', 'sent')

    // -------------------------------------------------------------------------
    cy.log('Confirming and sending the SROC supplementary bill run')

    // select the SROC bill run
    cy.get('[data-test="date-created-1"] > .govuk-link').click()

    // Test Region supplementary bill run
    // check the details before sending the bill run
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
    })
    cy.get('.govuk-button').contains('Send bill run').click()

    // You're about to send this bill run
    // check the details then click Send bill run
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Supplementary')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('.govuk-button').contains('Send bill run').click()

    // Test Region Supplementary bill run spinner page
    //
    // Displayed whilst the bill run is 'sending'. We don't confirm we're on it because in some environments this step
    // is so fast the test will fail because it doesn't see the element

    // Bill run sent
    // confirm the bill run is sent and then click to go to it
    cy.get('.govuk-panel__title', { timeout: 20000 }).should('contain.text', 'Bill run sent')
    cy.get('#main-content > div > div > p:nth-child(4) > a').click()

    // Test Region supplementary bill run
    // confirm we see it is now SENT
    cy.get('#main-content > p > .govuk-tag').should('contain.text', 'sent')

    // click the back link to go to bill runs
    cy.get('.govuk-back-link').click()

    // Bill runs
    // back on the bill runs page confirm our SROC bill run is present and listed as SENT
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-1"] > .govuk-link').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-1"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-1"]').should('contain.text', 'Supplementary')
    cy.get('@currentFinancialYearInfo').then((currentFinancialYearInfo) => {
      const billingPeriodCount = currentFinancialYearInfo.billingPeriodCounts.sroc
      cy.get('[data-test="number-of-bills-1"]').should('contain.text', billingPeriodCount)
    })
    cy.get('[data-test="bill-run-status-1"] > .govuk-tag').should('contain.text', 'sent')

    // Search the licence that was included in the bill run
    cy.get('#nav-search').click()
    cy.get('#query').type('AT/TEST/02')
    cy.get('.search__button').click()
    cy.get('.govuk-table__row').contains('AT/TEST/02').click()

    // Confirm there are no flags already on the licence
    cy.get('.govuk-notification-banner__content').should('not.exist')
  })
})
