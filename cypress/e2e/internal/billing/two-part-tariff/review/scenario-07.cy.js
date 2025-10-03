'use strict'

describe('Testing a two-part tariff bill run with a similar licence to scenario one, licence is current and not in workflow, it has one applicable charge version with a single charge reference and one charge element. It has one return with a status of "received"', () => {
  beforeEach(() => {
    cy.tearDown()
    // Load the base licence information into the DB
    cy.fixture('review-scenario-licence.json').then((fixture) => {
      cy.load(fixture)
    })
    // Load the charge and returns information into the DB
    // NOTE: We set the status to "received" to flag the issue
    cy.fixture('review-scenario-07.json').then((fixture) => {
      cy.load(fixture)
    })

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })

    cy.fixture('users.json').its('billingAndData').as('userEmail')
  })

  it('creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns, the returns issues and the allocated quantities', () => {
    cy.get('@userEmail').then((userEmail) => {
      cy.programmaticLogin({
        email: userEmail
      })
    })
    cy.visit('/system/bill-runs')

    // Bill runs
    // Click the Create a bill run button
    cy.get('.govuk-button').contains('Create a bill run').click()

    // Which kind of bill run do you want to create?
    // Choose Two-part tariff then continue
    cy.get('label.govuk-radios__label').contains('Two-part tariff').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the region
    // Choose Test Region and continue
    cy.get('label.govuk-radios__label').contains('Test Region').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Select the financial year
    // choose top option and continue
    cy.get('#year').click()
    cy.get('form > .govuk-button').contains('Continue').click()

    // Check the bill run
    cy.get('.govuk-button').contains('Create bill run').click()

    // The bill run we created will be the top result. We expect it's status to be BUILDING. Building might take a few
    // seconds though so to avoid the test failing we use our custom Cypress command to look for the status REVIEW, and
    // if not found reload the page and try again. We then select it using the link on the date created
    cy.reloadUntilTextFound('[data-test="bill-run-status-0"] > .govuk-tag', 'review')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="date-created-0"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="region-0"]').should('contain.text', 'Test Region')
    cy.get('[data-test="bill-run-type-0"]').should('contain.text', 'Two-part tariff')
    cy.get('[data-test="date-created-0"] > .govuk-link').click()

    // Review licences ~ Test its the correct bill run
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'review')
    cy.get('h1').should('contain.text', 'Review licences')
    cy.get('@formattedCurrentDate').then((formattedCurrentDate) => {
      cy.get('[data-test="meta-data-created"]').should('contain.text', formattedCurrentDate)
    })
    cy.get('[data-test="meta-data-region"]').should('contain.text', 'Test Region')
    cy.get('[data-test="meta-data-type"]').should('contain.text', 'Two-part tariff')
    cy.get('[data-test="meta-data-scheme"]').should('contain.text', 'Current')
    cy.get('[data-test="meta-data-year"]').should('contain.text', '2024 to 2025')

    // Review licences ~ Test you can filter by licence issue
    cy.get('.govuk-details__summary').click()
    cy.get('[data-test="aggregate-factor"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing 0 of 1 licences')
    cy.contains('Clear filters').click()

    cy.get('.govuk-details__summary').click()
    cy.get('[data-test="returns-received-not-processed"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing all 1 licences')
    cy.contains('Clear filters').click()

    // Review licences ~ Test it has the correct licence
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="licence-2"]').should('not.exist')
    cy.get('[data-test="licence-holder-1"]').should('contain.text', 'Mr J J Testerson')
    cy.get('[data-test="licence-issue-1"]').should('contain.text', 'Multiple Issues')
    cy.get('[data-test="licence-progress-1"]').should('contain.text', '')
    // Licence should be a review status due to the "returns received but not processed" issue
    cy.get('[data-test="licence-status-1"] > .govuk-tag').should('contain.text', 'review')
    cy.get('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TEST/01 ~ Check the licence details
    cy.get('h1').should('contain.text', 'Licence AT/TEST/01')
    cy.get('[data-test="licence-holder"]').should('contain.text', 'Mr J J Testerson')
    cy.get('div > .govuk-tag').should('contain.text', 'review')
    cy.get(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l').should('contain.text', 'Test Region two-part tariff')
    cy.get('.govuk-list > li > .govuk-link').should('contain.text', '1 April 2024 to 31 March 2025')

    // Review Licence AT/TEST/01 ~ Check the first matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2024 to 21 March 2025')
    cy.get('[data-test="matched-return-action-0"] > :nth-child(3)').should('contain.text', '1 March to 31 October')
    cy.get('[data-test="matched-return-summary-0"] > div').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'received')
    // When a return status is received we don't expect the engine to allocate any of its quantities, this will
    // therefore also mark the return as having the issue 'Over abstracted'
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '/')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', 'Over abstraction')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(3)').should('contain.text', 'Returns received but not processed')

    // Review Licence AT/TEST/01 ~ Check there are no other returns
    cy.get('[data-test="matched-return-action-1"] > .govuk-link').should('not.exist')
    cy.get('[data-test="unmatched-return-action-0"] > .govuk-link').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check charge Information details are correct for a licence with the "Returns received
    // but not processed issue
    cy.get('[data-test="charge-version-0-total-billable-returns-0"]').should('contain.text', '0 ML / 32 ML')
    // Without an aggregate of charge factor we shouldn't see the link "Change details" only "View details"
    cy.get('[data-test="charge-version-0-charge-reference-link-0"]').should('contain.text', 'View details')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]').should('contain.text', '')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]').should('contain.text', '0 ML / 32 ML')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]').should('contain.text', '32 ML (10021668)')

    // View match details
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2024 to 21 March 2025')
    cy.get('[data-test="matched-return-summary-0"]').contains('General Farming & Domestic A DRAIN SOMEWHERE')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'received')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '/')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', 'Over abstraction')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(3)').should('contain.text', 'Returns received but not processed')
    cy.get('.govuk-back-link').click()
  })
})
