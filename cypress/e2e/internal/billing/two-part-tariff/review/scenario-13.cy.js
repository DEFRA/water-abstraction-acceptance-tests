'use strict'

describe('Testing a two-part tariff bill run with a licence that is current and not in workflow, it has one applicable charge version with 1 charge reference and a charge element. It has one unmatched return', () => {
  beforeEach(() => {
    cy.tearDown()
    // Load the base licence information into the DB
    cy.fixture('review-scenario-licence.json').then((fixture) => {
      cy.load(fixture)
    })
    // Load the charge and returns information into the DB
    // NOTE: We change the returns purpose to be different to the charge elements so they don't match
    cy.fixture('review-scenario-13.json').then((fixture) => {
      cy.load(fixture)
    })
    // Grab the user email to use
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the unmatched returns, the returns issues and the allocated quantities', () => {
    cy.visit('/')

    // Enter the user name and password
    cy.get('@userEmail').then((userEmail) => {
      cy.get('input#email').type(userEmail)
    })

    cy.get('input#password').type(Cypress.env('defaultPassword'))

    // Click the Sign in Button
    cy.get('.govuk-button.govuk-button--start').click()

    // Assert the user signed in and we're on the search page
    cy.contains('Search')

    // Click the Bill runs menu link
    cy.get('#navbar-bill-runs').contains('Bill runs').click()

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
    cy.get('[data-test="unable-to-match-return"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing all 1 licences')
    cy.contains('Clear filters').click()

    // Review licences ~ Test it has the correct licence
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="licence-2"]').should('not.exist')
    cy.get('[data-test="licence-holder-1"]').should('contain.text', 'Mr J J Testerson')
    // When a return doesn't match to a charge element any abstracted volumes  on the return is considered over
    // abstraction. This means that the licence will have 'multiple issues' flagged when a return hasn't matched.
    cy.get('[data-test="licence-issue-1"]').should('contain.text', 'Multiple Issues')
    cy.get('[data-test="licence-progress-1"]').should('contain.text', '')
    // Licence should be a review status due to the "Unable to match returns" issue
    cy.get('[data-test="licence-status-1"] > .govuk-tag').should('contain.text', 'review')
    cy.get('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TEST/01 ~ Check the licence details
    cy.get('h1').should('contain.text', 'Licence AT/TEST/01')
    cy.get('[data-test="licence-holder"]').should('contain.text', 'Mr J J Testerson')
    cy.get('div > .govuk-tag').should('contain.text', 'review')
    cy.get(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l').should('contain.text', 'Test Region two-part tariff')
    cy.get('.govuk-list > li > .govuk-link').should('contain.text', '1 April 2024 to 31 March 2025')

    // Review Licence AT/TEST/01 ~ Check the unmatched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Unmatched returns')
    cy.get('[data-test="unmatched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="unmatched-return-action-0"] > div').should('contain.text', '1 April 2024 to 21 March 2025')
    cy.get('[data-test="unmatched-return-action-0"] > :nth-child(3)').should('contain.text', '1 March to 31 October')
    cy.get('[data-test="unmatched-return-summary-0"] > div').should('contain.text', 'Mineral Washing')
    cy.get('[data-test="unmatched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    cy.get('[data-test="unmatched-return-total-0"] > :nth-child(2)').should('contain.text', 'Over abstraction')
    // When a return hasn't matched to a charge element we don't expect it to allocate
    cy.get('[data-test="unmatched-return-total-0"] > :nth-child(1)').should('contain.text', '0 ML / 32 ML')

    // Review Licence AT/TEST/01 ~ Check there are no other returns
    cy.get('[data-test="unmatched-return-action-1"] > .govuk-link').should('not.exist')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check charge Information details are correct for a charge element with no matching returns
    cy.get('[data-test="charge-version-0-details"]').should('contain.text', '1 charge reference with 1 two-part tariff charge element')
    cy.get('[data-test="charge-version-0-total-billable-returns-0"]').should('contain.text', '32 ML / 32 ML')
    // Without an aggregate of charge factor we shouldn't see the link "Change details" only "View details"
    cy.get('[data-test="charge-version-0-charge-reference-link-0"]').should('contain.text', 'View details')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'SROC Charge Purpose 01')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', '1 April 2024 to 31 March 2025')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]').should('contain.text', 'Unable to match return')
    cy.get(':nth-child(2) > .float-right > .govuk-tag').should('contain.text', 'review')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]').should('contain.text', '32 ML / 32 ML')
    // No matching return means the return volume is empty
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]').should('contain.text', '')

    // View match details
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('[data-test="billable-returns"]').should('contain.text', '32 ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '32 ML')
    cy.get('[data-test="issues-0"]').should('contain.text', 'Unable to match return')
    cy.get('[data-test="no-returns-message"]').should('contain.text', 'No matching two-part tariff returns')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('not.exist')
    cy.get('.govuk-back-link').click()
  })
})
