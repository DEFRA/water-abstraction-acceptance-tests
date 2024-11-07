'use strict'

describe('Testing a two-part tariff bill run with a licence that is current and not in workflow, it has one applicable charge version with 1 charge reference and 2 charge elements. It has one return that matches to both elements and has submission lines that will straddle both charge elements when allocated', () => {
  beforeEach(() => {
    cy.tearDown()
    // Load the base licence information into the DB
    cy.fixture('review-scenario-licence.json').then((fixture) => {
      cy.load(fixture)
    })
    // Load the charge and returns information into the DB
    cy.fixture('review-scenario-14.json').then((fixture) => {
      cy.load(fixture)
    })
    // Grab the user email to use
    cy.fixture('users.json').its('billingAndData').as('userEmail')

    // Get the current date as a string, for example 12 July 2023
    cy.dayMonthYearFormattedDate().then((formattedCurrentDate) => {
      cy.wrap(formattedCurrentDate).as('formattedCurrentDate')
    })
  })

  it('creates a SROC two-part tariff bill run and once built navigates through all the review pages checking the matched return and the allocated quantities', () => {
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

    // Review licences ~ Test it has the correct licence
    cy.get('[data-test="licence-1"]').should('contain.text', 'AT/TEST/01')
    cy.get('[data-test="licence-2"]').should('not.exist')
    cy.get('[data-test="licence-holder-1"]').should('contain.text', 'Mr J J Testerson')
    cy.get('[data-test="licence-issue-1"]').should('contain.text', '')
    cy.get('[data-test="licence-progress-1"]').should('contain.text', '')
    // Licence should be a ready status as the return should have full allocated to the two charge elements
    cy.get('[data-test="licence-status-1"] > .govuk-tag').should('contain.text', 'ready')
    cy.get('[data-test="licence-1"] > .govuk-link').click()

    // Review Licence AT/TEST/01 ~ Check the licence details
    cy.get('h1').should('contain.text', 'Licence AT/TEST/01')
    cy.get('[data-test="licence-holder"]').should('contain.text', 'Mr J J Testerson')
    cy.get('div > .govuk-tag').should('contain.text', 'ready')
    cy.get(':nth-child(1) > .govuk-grid-column-full > .govuk-caption-l').should('contain.text', 'Test Region two-part tariff bill run')
    cy.get('.govuk-list > li > .govuk-link').should('contain.text', '1 April 2022 to 31 March 2023')

    // Review Licence AT/TEST/01 ~ Check the matched return details
    cy.get('.govuk-table__caption').should('contain.text', 'Matched returns')
    cy.get('[data-test="matched-return-action-0"] > .govuk-link').should('contain.text', '10021668')
    cy.get('[data-test="matched-return-action-0"] > div').should('contain.text', '1 April 2022 to 21 March 2023')
    cy.get('[data-test="matched-return-action-0"] > :nth-child(3)').should('contain.text', '1 April to 31 March')
    cy.get('[data-test="matched-return-summary-0"] > div').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="matched-return-status-0"] > .govuk-tag').should('contain.text', 'completed')
    // Should be no issues on the return
    cy.get('[data-test="matched-0-issue-0"]').should('not.exist')
    // The return should be fully allocated over the two charge elements
    cy.get('[data-test="matched-return-total-0"] > :nth-child(1)').should('contain.text', '50 ML / 50 ML')

    // Review Licence AT/TEST/01 ~ Check there are no other returns
    cy.get('[data-test="unmatched-return-action-0"] > .govuk-link').should('not.exist')
    cy.get('[data-test="matched-return-action-1"] > .govuk-link').should('not.exist')

    // Review Licence AT/TEST/01 ~ Check charge Information details are correct for 2 charge elements with one matching
    // return
    cy.get('[data-test="charge-version-0-details"]').should('contain.text', '1 charge reference with 2 two-part tariff charge elements')
    cy.get('[data-test="charge-version-0-total-billable-returns-0"]').should('contain.text', '50 ML / 50 ML')
    // Without an aggregate of charge factor we shouldn't see the link "Change details" only "View details"
    cy.get('[data-test="charge-version-0-charge-reference-link-0"]').should('contain.text', 'Change details')
    //  Charge element 1
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'SROC Charge Purpose 01')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', '1 April 2022 to 31 October 2022')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-0"]').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-0"]').should('contain.text', '')
    cy.get(':nth-child(2) > .float-right > .govuk-tag').should('contain.text', 'ready')
    // This charge element has the higher authorised volume so we expect to see this one fully allocated
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-0"]').should('contain.text', '30 ML / 30 ML')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-0"]').should('contain.text', '50 ML (10021668)')
    // Charge element 2
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-1"]').should('contain.text', 'SROC Charge Purpose 02')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-1"]').should('contain.text', '1 November 2022 to 31 March 2023')
    cy.get('[data-test="charge-version-0-charge-reference-0-element-description-1"]').should('contain.text', 'General Farming & Domestic')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-issues-1"]').should('contain.text', '')
    cy.get(':nth-child(2) > .float-right > .govuk-tag').should('contain.text', 'ready')
    // This charge element has the lower authorised volume so we expect the remaining volume on the return (10ML) to
    // allocate here
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-billable-returns-1"]').should('contain.text', '20 ML / 20 ML')
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-return-volumes-1"]').should('contain.text', '50 ML (10021668)')

    // To test the warning text that appears when the sum of the allocated charge elements exceeds the charge reference,
    // we need to manipulate the data. First, we reduce the allocated quantity on one of the charge elements. Next, we
    // decrease the authorised amount on the charge reference. Finally, we return to the same charge element and
    // increase its quantity back to its authorised amount. This will cause the sum of the charge elements to exceed the
    // authorised volume of the charge reference, triggering the warning.
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('.govuk-button').contains('Edit the billable returns').click()
    cy.get('#custom-quantity-selector').click()
    cy.get('#custom-quantity').type('10')
    cy.get('.govuk-button').contains('Confirm').click()
    cy.get('.govuk-back-link').click()
    cy.get('[data-test="charge-version-0-charge-reference-link-0"]').click()
    cy.get('.govuk-button').contains('Change the authorised volume').click()
    cy.get('#amended-authorised-volume').clear().type('40')
    cy.get('.govuk-button').contains('Confirm').click()
    cy.get('.govuk-back-link').click()
    cy.get('[data-test="charge-version-0-charge-reference-0-charge-element-match-details-0"]').click()
    cy.get('.govuk-button').contains('Edit the billable returns').click()
    cy.get('#authorised-quantity').click()
    cy.get('.govuk-button').contains('Confirm').click()
    cy.get('.govuk-back-link').click()
    cy.get('.govuk-warning-text__icon').should('exist')
    cy.get('.govuk-warning-text__text').should('contain.text', 'The total billable return volume exceeds the total authorised volume')
  })
})
