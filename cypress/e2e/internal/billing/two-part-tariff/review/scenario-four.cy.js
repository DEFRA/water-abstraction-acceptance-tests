'use strict'

describe('Testing a two-part tariff bill run with a similar licence to scenario one, licence is current and not in workflow, it has one applicable charge version with a single charge reference and one charge element. The charge reference has an aggregate value. It has one return that matches.', () => {
  beforeEach(() => {
    cy.tearDown()
    // Load the base licence information into the DB
    cy.fixture('review-scenario-licence.json').then((fixture) => {
      cy.load(fixture)
    })
    // Load the charge and returns information into the DB
    cy.fixture('review-scenario-four.json').then((fixture) => {
      cy.load(fixture)
    })
    // Grab the user email to use
    cy.fixture('users.json').its('billingAndData1').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched returns, the elements issues and the allocated quantities', () => {
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
    cy.get('[data-test="returns-late"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing 0 of 1 licences')
    cy.contains('Clear filters').click()

    cy.get('.govuk-details__summary').click()
    cy.get('[data-test="aggregate-factor"]').click()
    cy.contains('Apply filters').click()
    cy.get('.govuk-table__caption').should('contain.text', 'Showing all 1 licences')
    cy.contains('Clear filters').click()

    // Review licences ~ Test it has the correct licence
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="licence-2"]').should('not.exist')
    cy.get('[data-test="licence-holder-1"]').should('contain.text', 'Mr J J Testerson')
    cy.get('[data-test="licence-issue-1"]').should('contain.text', 'Aggregate')
    cy.get('[data-test="licence-progress-1"]').should('contain.text', '')
    // Licence should be a review status due to the aggregate issue flagged
    cy.get('[data-test="licence-status-1"] > .govuk-tag').should('contain.text', 'review')
    cy.get('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TEST/01 ~ Check the licence details
    cy.get('h1').should('contain.text', 'Licence AT/TEST/01')
    cy.get('.govuk-body > .govuk-tag').should('contain.text', 'review')
    cy.get(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l').should('contain.text', 'Test Region two-part tariff bill run')
    cy.get('.govuk-list > li > .govuk-link').should('contain.text', '1 April 2022 to 31 March 2023')

    // Review Licence AT/TEST/01 ~ Check the matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"] > div').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    cy.get('[data-test="matched-return-total-0"]').should('contain.text', '32 ML / 32 ML')
    // Should be no issues on the return
    cy.get('[data-test="matched-return-total-0"] > :nth-child(2)').should('contain.text', '')

    // Review Licence AT/TEST/01 ~ Check there are no other returns
    cy.get('[data-test="matched-return-action-1"] > .govuk-link').should('not.exist')
    cy.get('[data-test="unmatched-return-action-0"] > .govuk-link').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check charge Information details are correct for a licence with an aggregate
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]').should('contain.text', 'Aggregate')
    // Even with an  aggregate issue flagged we still expect the return to allocate fully to the charge element
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]').should('contain.text', '32 ML / 32 ML')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]').should('contain.text', '32 ML (10021668)')

    // View match details
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-summary-0"]').contains('General Farming & Domestic A DRAIN SOMEWHERE')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '32 ML / 32 ML')
    // The aggregate issue should be flagged on the element
    cy.get('[data-test="issues-0"]').should('contain.text', 'Aggregate')
    cy.get('.govuk-back-link').click()

    // When an aggregate is present on the charge reference, this changes the reference link from "View details" to
    // "Change details"
    cy.get('[data-test="charge-version-0-charge-reference-link-0"]').should('contain.text', 'Change details')
    cy.contains('Change details').click()

    // Charge reference details
    cy.get('[data-test="charge-reference"]').should('contain.text', 'Charge reference 4.6.12')
    cy.get('[data-test="charge-reference-description"]').should('contain.text', 'High loss, non-tidal, restricted water, greater than 15 up to and including 50 ML/yr, Tier 2 model')
    cy.get('[data-test="financial-year"]').should('contain.text', 'Financial Year 2022 to 2023')
    cy.get('[data-test="charge-period"]').should('contain.text', 'Charge period 1 April 2022 to 31 March 2023')
    cy.get('[data-test="total-billable-returns"]').should('contain.text', '32 ML')
    cy.get('[data-test="authorised-volume"]').should('contain.text', '32 ML')
    cy.get('[data-test="additional-charges"]').should('contain.text', 'Public Water Supply')
    cy.get('[data-test="adjustment-0"]').should('contain.text', 'Aggregate factor (0.5)')
    cy.contains('Change factors').click()

    // Change factors page ~ Amend the aggregate
    cy.get('.govuk-heading-xl').should('contain.text', 'Set the adjustment factors')
    cy.get('.govuk-inset-text > :nth-child(4)').should('contain.text', 'Public Water Supply')
    cy.get('.govuk-inset-text > :nth-child(5)').should('contain.text', 'Two part tariff agreement')
    cy.get('#amended-aggregate-factor').should('have.value', '0.5')
    cy.get('#amended-charge-adjustment').should('have.value', '1')
    // By changing the aggregate factor to 1 this removes it
    cy.get('#amended-aggregate-factor')
      .clear()
      .type('1')
    cy.contains('Confirm').click()

    // Charge reference details page ~ Checking the amended aggregate
    cy.get('.govuk-notification-banner').should('exist')
    cy.get('#govuk-notification-banner-title').should('contain.text', 'Adjustment updated')
    // Check the aggregate value has been removed
    cy.get('[data-test="adjustment-1"]').should('not.exist')
    // Check the link still exists once all charge adjustments have been removed
    cy.get('.govuk-summary-list__actions > .govuk-link').should('contain.text', 'Change factors')
    cy.contains('Change factors').click()

    // Change factors page ~ Amend the charge adjustment
    cy.get('.govuk-heading-xl').should('contain.text', 'Set the adjustment factors')
    cy.get('.govuk-inset-text > :nth-child(4)').should('contain.text', 'Public Water Supply')
    cy.get('.govuk-inset-text > :nth-child(5)').should('contain.text', 'Two part tariff agreement')
    cy.get('#amended-aggregate-factor').should('have.value', '1')
    cy.get('#amended-charge-adjustment').should('have.value', '1')
    cy.get('#amended-charge-adjustment')
      .clear()
      .type('0.5')
    cy.contains('Confirm').click()

    // Charge reference details page ~ Checking the amended charge factor
    cy.get('.govuk-notification-banner').should('exist')
    cy.get('#govuk-notification-banner-title').should('contain.text', 'Adjustment updated')
    // This is checking the charge adjustment has been added
    cy.get('[data-test="adjustment-0"]').should('contain.text', 'Charge adjustment (0.5)')
  })
})
