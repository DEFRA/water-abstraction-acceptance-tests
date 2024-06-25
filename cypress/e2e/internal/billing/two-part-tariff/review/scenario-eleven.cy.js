'use strict'

describe('Testing a two-part tariff bill run with a similar licence to scenario one, licence is current and not in workflow, it has one applicable charge version with a single charge reference and two charge elements. The matching return for charge element one is over-abstracted and the matching return for charge element 2 is over-abstracted and abstracted outside the charge period', () => {
  beforeEach(() => {
    cy.tearDown()
    cy.fixture('sroc-two-part-tariff-simple-licence-data.json').then((fixture) => {
      // Update the charge reference volume to allow both elements to fully allocate
      fixture.chargeReferences[0].volume = '64'
      // Update the return submission line quantity to make it an over abstracted volume
      fixture.returnSubmissionLines[0].quantity = '10000'
      cy.load(fixture)
    })

    cy.fixture('sroc-two-part-tariff-scenario-eleven-data.json').then((fixture) => {
      cy.load(fixture)
    })

    cy.fixture('users.json').its('billingAndData1').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns and the allocated quantities', () => {
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
    cy.get('[data-test="abs-outside-period"]').click()
    cy.get('[data-test="over-abstraction"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing all 1 licences')
    cy.contains('Clear filters').click()

    // Review licences ~ Test it has the correct licence
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="licence-2"]').should('not.exist')
    cy.get('[data-test="licence-holder-1"]').should('contain.text', 'Mr J J Testerson')
    cy.get('[data-test="licence-issue-1"]').should('contain.text', 'Multiple Issues')
    cy.get('[data-test="licence-progress-1"]').should('contain.text', '')
    // Licence should be a 'ready' status since none of the issues have a 'review' status
    cy.get('[data-test="licence-status-1"] > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TEST/01 ~ Check the licence details
    cy.get('h1').should('contain.text', 'Licence AT/TEST/01')
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'ready')
    cy.get(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l').should('contain.text', 'Test Region two-part tariff bill run')
    cy.get('.govuk-list > li > .govuk-link').should('contain.text', '1 April 2022 to 31 March 2023')

    // Review Licence AT/TEST/01 ~ Check the first matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"] > div').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    // When a return is over abstracted the return should still allocate up to the charge element volume or
    // charge reference volume whichever is lower. It should not allocate the 'over-abstracted' amount
    cy.get('[data-test="matched-return-total-0"]').should('contain.text', '32 ML / 38 ML')
    cy.get('[data-test="matched-return-total-0"]').should('contain.text', 'Over abstraction')

    // Review Licence AT/TEST/01 ~ Check the second matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-1"] > .govuk-link').should('contain.text', '10021669')
    cy.get('[data-test="matched-return-action-1"] > div').should('contain.text', '1 May 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-1"] > div').should('contain.text', 'Mineral Washing')
    cy.get('[data-test="matched-return-status-1"] > .govuk-tag').should('contain.text', 'completed')
    // When a return is over abstracted the return should still allocate up to the charge element volume or
    // charge reference volume whichever is lower. It should not allocate the 'over-abstracted' amount
    cy.get('[data-test="matched-return-total-1"]').should('contain.text', '30 ML / 36 ML')
    cy.get('[data-test="matched-return-total-1"]').should('contain.text', 'Abstraction outside period')
    cy.get('[data-test="matched-return-total-1"]').should('contain.text', 'Over abstraction')

    // Review Licence AT/TEST/01 ~ Check there are no other returns
    cy.get('[data-test="matched-return-action-2"] > .govuk-link').should('not.exist')
    cy.get('[data-test="unmatched-return-action-0"] > .govuk-link').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check charge Information details are correct for a licence with returns that are over
    // abstracted
    cy.get('[data-test="charge-version-0-total-billable-returns-0"]').should('contain.text', '62 ML / 64 ML')
    // Without an aggregate of charge factor we shouldn't see the link "Change details" only "View details"
    cy.get('[data-test="charge-version-0-charge-reference-link-0"]').should('contain.text', 'View details')
    cy.get('[data-test="charge-version-0-details"]').should('contain.text', '1 charge reference  with 2 two-part tariff charge elements')
    // Charge element 1
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'SROC Charge Purpose 01')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', '1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]').should('contain.text', '')
    cy.get(':nth-child(2) > .float-right > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]').should('contain.text', '32 ML / 32 ML')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]').should('contain.text', '38 ML (10021668)')
    // Charge element 2
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-1"]').should('contain.text', 'SROC Charge Purpose 02')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-1"]').should('contain.text', '1 April 2022 to 31 March 2023')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-1"]').should('contain.text', 'Mineral Washing')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-1"]').should('contain.text', '')
    cy.get(':nth-child(3) > .float-right > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-1"]').should('contain.text', '30 ML / 30 ML')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-1"]').should('contain.text', '36 ML (10021669)')

    // View match details ~ Charge element 1
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('[data-test="billable-returns"]').should('contain.text', '32ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '32ML')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"]').contains('General Farming & Domestic A DRAIN SOMEWHERE')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '32 ML / 38 ML')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', 'Over abstraction')
    cy.get('.govuk-back-link').click()

    // View match details ~ Charge element 2
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-1"]').click()
    cy.get('[data-test="billable-returns"]').should('contain.text', '30ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '30ML')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021669')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 May 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"]').contains('Mineral Washing A DRAIN SOMEWHERE')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '30 ML / 36 ML')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', 'Abstraction outside period')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(3)').should('contain.text', 'Over abstraction')
    cy.get('.govuk-back-link').click()
  })
})