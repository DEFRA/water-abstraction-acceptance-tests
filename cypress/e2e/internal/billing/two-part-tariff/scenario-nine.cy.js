'use strict'

describe('Testing a two-part tariff bill run with a licence that is current and not in workflow, it has two applicable charge version both with a single charge reference and one charge element. Both elements have a matching return that has a status of "due"', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('sroc-two-part-tariff-simple-licence-data.json').then((fixture) => {
      // We set the status to "due" to flag the issue "No returns received"
      fixture.chargeReferences[0].volume = 52
      fixture.returnLogs[0].status = 'due'
      fixture.returnSubmissions = []
      fixture.returnSubmissionLines = []

      cy.load(fixture)
    })

    // Load in the second charge version, charge reference and charge element with its matching return
    // The reason for loading two sets of data for this license is to test how the engine allocates volumes when a
    // return has a status of "due." We expect the engine to allocate the full amount from either the charge reference
    // or the charge element, whichever is lower. The two datasets switch the lower volume between the charge reference
    // and the charge element. This ensures we can verify that the engine allocates only up to the lower of the two
    // volumes.
    cy.fixture('sroc-two-part-tariff-scenario-nine.json').then((fixture) => {
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData1').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns, the returns issues and the allocated quantities', () => {
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
    // Choose 2021 to 2022 and continue
    cy.get('label.govuk-radios__label').contains('2022 to 2023').click()
    cy.get('form > .govuk-button').contains('Continue').click()

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
    cy.get('[data-test="meta-data-year"]').should('contain.text', '2022 to 2023')

    // Review licences ~ Test you can filter by licence issue
    cy.get('.govuk-details__summary').click()
    cy.get('[data-test="aggregate-factor"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing 0 of 1 licences')
    cy.contains('Clear filters').click()

    cy.get('.govuk-details__summary').click()
    cy.get('[data-test="no-returns-received"]').click()
    cy.get('[data-test="some-returns-not-received"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing all 1 licences')
    cy.contains('Clear filters').click()

    // Review licences ~ Test it has the correct licence
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="licence-2"]').should('not.exist')
    cy.get('[data-test="licence-holder-1"]').should('contain.text', 'Mr J J Testerson')
    cy.get('[data-test="licence-issue-1"]').should('contain.text', 'Multiple Issues')
    cy.get('[data-test="licence-progress-1"]').should('contain.text', '')
    // Both the issues on the licence are a status 'ready', putting the overall licence status as ready
    cy.get('[data-test="licence-status-1"] > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TEST/01 ~ Check the licence details
    cy.get('h1').should('contain.text', 'Licence AT/TEST/01')
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l').should('contain.text', 'Test Region two-part tariff bill run')
    // On this licence there are two charge versions meaning we have two charge period links
    cy.get('[data-test="charge-period-0"]').should('contain.text', '1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-period-1"]').should('contain.text', '1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-period-2"]').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check the first matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"] > div').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'overdue')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '/')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', 'No returns received')

    // Review Licence AT/TEST/01 ~ Check the second matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-1"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-1"] > div').should('contain.text', '1 October 2022 to 31 March 2023')
    cy.get('[data-test="matched-return-summary-1"] > div').should('contain.text', 'Mineral Washing')
    cy.get('[data-test="matched-return-status-1"] > .govuk-tag').should('contain.text', 'overdue')
    cy.get('[data-test="matched-return-total-1"] > :nth-child(1)').should('contain.text', '/')
    cy.get('[data-test="matched-return-total-1"] > :nth-child(2)').should('contain.text', 'No returns received')

    // Review Licence AT/TEST/01 ~ Check there are no other returns
    cy.get('[data-test="matched-return-action-2"] > .govuk-link').should('not.exist')
    cy.get('[data-test="unmatched-return-action-0"] > .govuk-link').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check charge Information details are correct for charge version 1
    cy.get('#charge-version-0 > .govuk-heading-l').should('contain.text', 'Charge periods 1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-version-0-details"]').should('contain.text', '1 charge reference  with 1 two-part tariff charge element')
    cy.get('[data-test="charge-version-0-reference-0"]').should('contain.text', 'Charge reference 4.6.12')
    // For the first charge version the charge reference has a lower authorised volume than its charge element. This
    // means we expect the return to only allocate to the charge reference volume of 22ML
    cy.get('[data-test="charge-version-0-total-billable-returns-0"]').should('contain.text', '22 ML / 22 ML')
    // Without an aggregate of charge factor we shouldn't see the link "Change details" only "View details"
    cy.get('[data-test="charge-version-0-charge-reference-link-0"]').should('contain.text', 'View details')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'SROC Charge Purpose 02')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', '1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'Mineral Washing')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]').should('contain.text', 'Some returns not received')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]').should('contain.text', '22 ML / 42 ML')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]').should('contain.text', '0 ML (10021668)')

    // View match details ~ For charge version 1's element
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('[data-test="billable-returns"]').should('contain.text', '22ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '42ML')
    cy.get('[data-test="issues-0"]').should('contain.text', 'Some returns not received')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 October 2022 to 31 March 2023')
    cy.get('[data-test="matched-return-summary-0"]').contains('Mineral Washing A DRAIN SOMEWHERE')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'overdue')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '/')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', 'No returns received')
    cy.get('.govuk-back-link').click()

    // Review Licence AT/TEST/01 ~ Check charge Information details are correct for charge version 2
    cy.get('#charge-version-1 > .govuk-heading-l').should('contain.text', 'Charge periods 1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-version-1-details"]').should('contain.text', '1 charge reference  with 1 two-part tariff charge element')
    cy.get('[data-test="charge-version-1-reference-0"]').should('contain.text', 'Charge reference 4.6.12')
    // For the second charge version the charge element has a lower authorised volume than its charge reference. This
    // means we expect the return to only allocate to the charge element volume of 32ML
    cy.get('[data-test="charge-version-1-total-billable-returns-0"]').should('contain.text', '32 ML / 52 ML')
    // Without an aggregate of charge factor we shouldn't see the link "Change details" only "View details"
    cy.get('[data-test="charge-version-1-charge-reference-link-0"]').should('contain.text', 'View details')
    cy.get('[data-test="charge-version-1-charge-reference-0-element-description-0"]').should('contain.text', 'SROC Charge Purpose 01')
    cy.get('[data-test="charge-version-1-charge-reference-0-element-description-0"]').should('contain.text', '1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-version-1-charge-reference-0-element-description-0"]').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="charge-version-1-charge-reference-0-charge-element-issues-0"]').should('contain.text', 'Some returns not received')
    cy.get('[data-test="charge-version-1-charge-reference-0-charge-element-billable-returns-0"]').should('contain.text', '32 ML / 32 ML')
    cy.get('[data-test="charge-version-1-charge-reference-0-charge-element-return-volumes-0"]').should('contain.text', '0 ML (10021668)')

    // View match details ~ For charge version 2's element
    cy.get('[data-test="charge-version-1-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('[data-test="billable-returns"]').should('contain.text', '32ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '32ML')
    cy.get('[data-test="issues-0"]').should('contain.text', 'Some returns not received')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"]').contains('General Farming & Domestic A DRAIN SOMEWHERE')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'overdue')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '/')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', 'No returns received')
    cy.get('.govuk-back-link').click()
  })
})
